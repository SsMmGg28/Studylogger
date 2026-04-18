import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, runTransaction } from "firebase/firestore";
import { auth, db } from "./firebase";

const CLIENT_SESSION_COOKIE = "client-session";

export function setClientSessionHint(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${CLIENT_SESSION_COOKIE}=true; path=/; max-age=1209600; samesite=lax`;
}

export function clearClientSessionHint(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${CLIENT_SESSION_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
}

export async function register(
  email: string,
  password: string,
  displayName: string,
  username: string
): Promise<User> {
  // Check username uniqueness
  const usernameRef = doc(db, "usernames", username.toLowerCase());
  const usernameDoc = await getDoc(usernameRef);
  if (usernameDoc.exists()) {
    throw new Error("Bu kullanıcı adı zaten alınmış.");
  }

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  setClientSessionHint();

  // Sync session cookie immediately
  try {
    const idToken = await cred.user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    console.error("Session sync failed during register:", error);
  }

  const userData = {
    displayName,
    username: username.toLowerCase(),
    email,
    privacySettings: {
      showHours: true,
      showQuestions: true,
      showSubjectBreakdown: true,
    },
    notificationSettings: {
      enabled: true,
      reminderHours: [19],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Istanbul",
    },
    createdAt: serverTimestamp(),
  };

  const userRef = doc(db, "users", cred.user.uid);

  // Write user document and username reservation atomically using a transaction
  try {
    await runTransaction(db, async (transaction) => {
      const uDoc = await transaction.get(usernameRef);
      if (uDoc.exists()) {
        throw new Error("Kullanıcı adı işlem sırasında alındı. Lütfen başka bir kullanıcı adı seçin.");
      }
      transaction.set(usernameRef, { uid: cred.user.uid });
      transaction.set(userRef, userData);
    });
  } catch (error) {
    // If transaction fails, clean up the auth user
    await cred.user.delete();
    throw error;
  }

  return cred.user;
}

export async function login(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  setClientSessionHint();
  try {
    const idToken = await cred.user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    console.error("Session sync failed during login:", error);
  }
  return cred.user;
}

export function loginDemo(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("demo-mode", "true");
    setClientSessionHint();
    document.cookie = "demo-mode=true; path=/; max-age=31536000";
    window.location.href = "/";
  }
}

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("demo-mode");
    clearClientSessionHint();
    document.cookie = "demo-mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  const a = auth as typeof auth | undefined;
  if (a) {
    try { await signOut(a); } catch { /* already logged out */ }
  }
  fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
}

export async function loginWithGoogle(): Promise<{ user: User; isNew: boolean }> {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const user = cred.user;
  setClientSessionHint();

  try {
    const idToken = await user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    console.error("Session sync failed during Google login:", error);
  }

  // Check if profile already exists — returning user, nothing to do
  const userSnap = await getDoc(doc(db, "users", user.uid));
  if (userSnap.exists()) return { user, isNew: false };

  // New Google user — profile will be created after username is chosen
  return { user, isNew: true };
}

export async function completeGoogleProfile(
  user: User,
  username: string
): Promise<void> {
  // Check username uniqueness
  const usernameRef = doc(db, "usernames", username.toLowerCase());
  const usernameDoc = await getDoc(usernameRef);
  if (usernameDoc.exists()) {
    throw new Error("Bu kullanıcı adı zaten alınmış.");
  }

  const userData = {
    displayName: user.displayName ?? username,
    username: username.toLowerCase(),
    email: user.email ?? "",
    photoURL: user.photoURL ?? null,
    privacySettings: {
      showHours: true,
      showQuestions: true,
      showSubjectBreakdown: true,
    },
    notificationSettings: {
      enabled: true,
      reminderHours: [19],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Istanbul",
    },
    createdAt: serverTimestamp(),
  };

  const userRef = doc(db, "users", user.uid);

  await runTransaction(db, async (transaction) => {
    const uDoc = await transaction.get(usernameRef);
    if (uDoc.exists()) {
      throw new Error("Kullanıcı adı işlem sırasında alındı. Lütfen başka bir kullanıcı adı seçin.");
    }
    transaction.set(usernameRef, { uid: user.uid });
    transaction.set(userRef, userData);
  });
}


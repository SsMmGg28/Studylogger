import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function register(
  email: string,
  password: string,
  displayName: string,
  username: string
): Promise<User> {
  // Check username uniqueness
  const usernameDoc = await getDoc(doc(db, "usernames", username.toLowerCase()));
  if (usernameDoc.exists()) {
    throw new Error("Bu kullanıcı adı zaten alınmış.");
  }

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });

  const userData = {
    displayName,
    username: username.toLowerCase(),
    email,
    privacySettings: {
      showHours: true,
      showQuestions: true,
      showSubjectBreakdown: true,
    },
    createdAt: serverTimestamp(),
  };

  // Write user document and username reservation atomically
  await Promise.all([
    setDoc(doc(db, "users", cred.user.uid), userData),
    setDoc(doc(db, "usernames", username.toLowerCase()), { uid: cred.user.uid }),
  ]);

  return cred.user;
}

export async function login(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export function loginDemo(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("demo-mode", "true");
  }
}

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("demo-mode");
  }
  const a = auth as typeof auth | undefined;
  if (a) {
    try { await signOut(a); } catch { /* already logged out */ }
  }
}

/** Generate a URL-safe username from a display name */
function toUsername(displayName: string): string {
  return displayName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics (ş→s, ı→i …)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 18);
}

export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const user = cred.user;

  // Check if profile already exists — returning user, nothing to do
  const userSnap = await getDoc(doc(db, "users", user.uid));
  if (userSnap.exists()) return user;

  // New Google user — create profile with auto-generated username
  let baseUsername = toUsername(user.displayName ?? user.email?.split("@")[0] ?? "user");
  if (!baseUsername) baseUsername = "user";

  // Ensure username uniqueness (append random 4-digit suffix if taken)
  let username = baseUsername;
  let attempt = 0;
  while (true) {
    const snap = await getDoc(doc(db, "usernames", username));
    if (!snap.exists()) break;
    username = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
    if (++attempt > 5) { username = `${baseUsername}_${Date.now()}`; break; }
  }

  const userData = {
    displayName: user.displayName ?? username,
    username,
    email: user.email ?? "",
    photoURL: user.photoURL ?? null,
    privacySettings: {
      showHours: true,
      showQuestions: true,
      showSubjectBreakdown: true,
    },
    createdAt: serverTimestamp(),
  };

  await Promise.all([
    setDoc(doc(db, "users", user.uid), userData),
    setDoc(doc(db, "usernames", username), { uid: user.uid }),
  ]);

  return user;
}

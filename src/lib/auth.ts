import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
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

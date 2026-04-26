import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase must only be initialized in the browser (client-side).
// During Next.js SSR/build prerendering, we skip initialization.
let app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;

if (typeof window !== "undefined") {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    _auth = getAuth(app);
    _db = initializeFirestore(app, {
      localCache: persistentLocalCache(),
    });
  } catch {
    // Firebase config missing or invalid — app runs in unauthenticated mode
  }
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const auth = _auth!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const db = _db!;
export default app;

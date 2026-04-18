import * as admin from "firebase-admin";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const isFirebaseAdminConfigured = Boolean(projectId && clientEmail && privateKey);

let adminApp: admin.app.App | null = null;

if (isFirebaseAdminConfigured) {
  try {
    adminApp = admin.apps.length
      ? admin.app()
      : admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

export const adminDb = adminApp ? admin.firestore(adminApp) : null;
export const adminAuth = adminApp ? admin.auth(adminApp) : null;
export const adminMessaging = adminApp ? admin.messaging(adminApp) : null;

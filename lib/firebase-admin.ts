import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App | undefined;
let adminAuth: Auth | undefined;
let adminDb: Firestore | undefined;

if (typeof window === "undefined") {
  if (!getApps().length) {
    const serviceAccount = process.env.FIREBASE_ADMIN_SDK_KEY
      ? JSON.parse(
          Buffer.from(process.env.FIREBASE_ADMIN_SDK_KEY, "base64").toString()
        )
      : undefined;

    if (serviceAccount) {
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  } else {
    adminApp = getApps()[0];
  }

  if (adminApp) {
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
  }
}

export { adminApp, adminAuth, adminDb };


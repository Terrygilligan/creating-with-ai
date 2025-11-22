import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const uid = process.argv[2];
const role = process.argv[3] || "admin"; // "admin" or "superAdmin"

if (!uid) {
  console.error("Usage: node scripts/set-admin.js <user-uid> [admin|superAdmin]");
  process.exit(1);
}

if (!["admin", "superAdmin"].includes(role)) {
  console.error("Role must be either 'admin' or 'superAdmin'");
  process.exit(1);
}

async function setAdmin() {
  try {
    if (getApps().length === 0) {
      const serviceAccount = process.env.FIREBASE_ADMIN_SDK_KEY
        ? JSON.parse(
            Buffer.from(process.env.FIREBASE_ADMIN_SDK_KEY, "base64").toString()
          )
        : undefined;

      if (!serviceAccount) {
        console.error("FIREBASE_ADMIN_SDK_KEY not found in environment variables");
        process.exit(1);
      }

      initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }

    const auth = getAuth();
    
    await auth.setCustomUserClaims(uid, {
      [role]: true,
    });

    console.log(`✅ Successfully set ${uid} as ${role}`);
  } catch (error) {
    console.error("Error setting admin:", error);
    process.exit(1);
  }
}

setAdmin();


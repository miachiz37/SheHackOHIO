// Backend/server/firebaseAdmin.js

import admin from "firebase-admin";
import { config } from "dotenv";

// Load environment variables from Backend/.env
config({ path: new URL("../.env", import.meta.url).pathname });

// Validate env variables
const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (!FIREBASE_PRIVATE_KEY) {
  console.error("❌ FIREBASE_PRIVATE_KEY is missing. Loaded keys:", Object.keys(process.env));
  throw new Error("FIREBASE_PRIVATE_KEY is missing");
}

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      // Convert literal '\n' to actual newlines
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
  console.log("✅ Firebase Admin initialized");
}

// Export Firestore reference
export const db = admin.firestore();

// server/firebaseAdmin.js

import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


// Resolve absolute path to Backend/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: envPath });
const rawKey = process.env.FIREBASE_PRIVATE_KEY;
if (!rawKey) {
  console.error("FIREBASE_PRIVATE_KEY is missing. Loaded env keys:", Object.keys(process.env));
  throw new Error("FIREBASE_PRIVATE_KEY is missing");
}
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export const db = admin.firestore();
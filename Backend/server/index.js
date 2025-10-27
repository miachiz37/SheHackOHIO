// Backend/server/index.js

import express from "express";
import cors from "cors";
import { db } from "./firebaseAdmin.js"; // ✅ include .js extension in ESM
import dotenv from "dotenv";

dotenv.config({ path: new URL("../.env", import.meta.url).pathname });

const app = express();
app.use(express.json());

// CORS: allow frontend dev server (use origin: true for dev)
app.use(cors({ origin: "http://localhost:5173" }));

// Example health route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server running!" });
});

// Example Firestore test route
app.post("/api/users", async (req, res) => {
  try {
    const { uid, email, preferences } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ error: "uid and email are required" });
    }

    await db.collection("users").doc(uid).set({ email, preferences });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));

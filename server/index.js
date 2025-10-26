import "dotenv/config";
import express from "express";
import cors from "cors";
import { db } from "./firebaseAdmin.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

const nutr = (arr, key) => arr?.find?.(n => n.name === key)?.amount ?? null;

app.get("/", (_req, res) => {
  res.send("PantryPal API is running. POST /api/search with { limit } to get recipes.");
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/ping", (req, res) => {
  res.json({ msg: "pong from backend" });
});

app.post("/api/echo", (req, res) => {
  res.json({ youSent: req.body });
});

app.post("/api/echo", (req, res) => {
  res.json({ youSent: req.body });
});


// Read documents from Firestore
app.get("/firebase-read", async (req, res) => {
  try {
    const snapshot = await db.collection("test").get();
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ ok: true, data: docs });
  } catch (err) {
    res.status(500).json({ error: "Failed to read documents", details: err.message });
  }
});

// Add or update a user in Firestore
app.post("/api/users", async (req, res) => {
  try {
    const { uid, email, preferences } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ error: "uid and email are required" });
    }

    await db.collection("users").doc(uid).set({
      email,
      preferences: preferences || {
        pork: 0,
        nuts: 0,
        dairy: 0,
        veggies: 0,
        fruit: 0,
      },
      updatedAt: new Date().toISOString(),
    });

    res.json({ ok: true, message: "User saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save user", details: err.message });
  }
});

// Fetch all users
app.get("/api/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ ok: true, users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users", details: err.message });
  }
});


app.listen(PORT, () => console.log(`PantryPal API listening on :${PORT}`));

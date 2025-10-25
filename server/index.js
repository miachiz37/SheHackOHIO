import "dotenv/config";
import express from "express";
import cors from "cors";
import { db } from "./firebaseAdmin.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

//Mock data
const SEED = [
    {
    id: 1111, title: "Spinach & Egg Rice Bowl", image: "", sourceUrl: "#",
    readyInMinutes: 15, servings: 2,
    nutrition: { nutrients: [
      { name: "Calories", amount: 480 },
      { name: "Protein", amount: 28 }, { name: "Carbohydrates", amount: 60 }, { name: "Fat", amount: 14 }
    ]},
    extendedIngredients: [{ name: "spinach" }, { name: "eggs" }, { name: "rice" }, { name: "soy sauce" }]
  },
  {
    id: 2222, title: "Chicken Fajita Bowl", image: "", sourceUrl: "#",
    readyInMinutes: 20, servings: 2,
    nutrition: { nutrients: [
      { name: "Calories", amount: 520 },
      { name: "Protein", amount: 34 }, { name: "Carbohydrates", amount: 55 }, { name: "Fat", amount: 14 }
    ]},
    extendedIngredients: [{ name: "chicken" }, { name: "rice" }, { name: "bell pepper" }, { name: "onion" }]
  }
];

const nutr = (arr, key) => arr?.find?.(n => n.name === key)?.amount ?? null;

app.get("/", (_req, res) => {
  res.send("PantryPal API is running. POST /api/search with { limit } to get recipes.");
});

app.post("/api/search", (req, res) => {
  const limit = Math.min(Number(req.body?.limit || 8), 12);
  const results = SEED.map(r => ({
    id: r.id,
    title: r.title,
    image: r.image,
    sourceUrl: r.sourceUrl,
    servings: r.servings,
    prepMin: r.readyInMinutes,
    macros: {
      cal: nutr(r.nutrition?.nutrients, "Calories"),
      protein: nutr(r.nutrition?.nutrients, "Protein"),
      carbs: nutr(r.nutrition?.nutrients, "Carbohydrates"),
      fat: nutr(r.nutrition?.nutrients, "Fat")
    },
    coveragePct: 80,
    usesSoon: ["eggs"],
    missingItems: ["soy sauce"],
    score: 0.8
  })).slice(0, limit);

  res.json({ recipes: results });
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

app.post("/firebase-add", async (req, res) => {
  try {
    const docRef = await db.collection("test").add({
      message: "Hello from backend!",
      timestamp: new Date().toISOString(),
    });

    res.json({ ok: true, id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to add document", details: err.message });
  }
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
      preferences: preferences || {},
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



// Temporary AI route
app.post("/api/ai", async (req, res) => {
  const { message } = req.body;
  console.log("AI request received:", message);

  // Mock AI response for now
  const mockResponse = {
    ok: true,
    reply: `AI says: you sent "${message}"`,
  };

  res.json(mockResponse);
});

app.listen(PORT, () => console.log(`PantryPal API listening on :${PORT}`));

import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
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

app.listen(PORT, () => console.log(`PantryPal API listening on :${PORT}`));

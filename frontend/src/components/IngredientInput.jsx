import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

export default function IngredientInput() {
  const { pantry, addIngredient, removeIngredient } = useAppStore();
  const [name, setName] = useState("");
  const [type, setType] = useState("produce");
  const [freshness, setFreshness] = useState("ok");

  const add = () => {
    const n = name.trim().toLowerCase();
    if (!n) return;
    addIngredient({ name: n, type, freshness });
    setName("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <input
          className="border rounded-xl p-2"
          placeholder="ingredient name (e.g., spinach)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="border rounded-xl p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="produce">produce</option>
          <option value="meat">meat</option>
          <option value="other">other</option>
        </select>
        <select
          className="border rounded-xl p-2"
          value={freshness}
          onChange={(e) => setFreshness(e.target.value)}
        >
          <option value="today">today</option>
          <option value="soon">soon</option>
          <option value="ok">ok</option>
        </select>
        <button className="rounded-2xl bg-accent text-bark font-semibold px-4 py-2 hover:brightness-110">
        Add
        </button>
      </div>

      {pantry.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {pantry.map((p) => (
            <div
              key={p.name}
              className="border rounded-xl p-2 bg-white flex items-center justify-between"
            >
              <div>
                <div className="font-medium capitalize">{p.name}</div>
                <div className="text-xs text-gray-600">{p.type}</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    p.freshness === "today"
                      ? "bg-red-100 text-red-700"
                      : p.freshness === "soon"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {p.freshness}
                </span>
                <button
                  onClick={() => removeIngredient(p.name)}
                  className="text-xs text-red-600"
                >
                  remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

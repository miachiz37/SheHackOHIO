import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

export default function IngredientInput() {
  const { pantry, addIngredient, removeIngredient } = useAppStore();
  const [name, setName] = useState("");
  const [type, setType] = useState("produce");
  // freshness scale (global)
  const [freshness, setFreshness] = useState("soon"); // soon | fresh | very-fresh
  // extra control for dairy only
  const [dairyStatus, setDairyStatus] = useState("unopened"); // unopened | opened-<3 | opened-3-7 | opened->7

  const add = () => {
    const n = name.trim().toLowerCase();
    if (!n) return;
    addIngredient({
      name: n,
      type,
      freshness,          // universal freshness scale
      dairyStatus: type === "dairy" ? dairyStatus : undefined,
    });
    setName("");
  };

  const freshnessLabel = (v) =>
    v === "soon" ? "Going bad soon" : v === "fresh" ? "Still Good" : "Very fresh";

  const freshnessBadge = (v) =>
    v === "soon"
      ? "bg-red-100 text-red-700"
      : v === "fresh"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
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
          <option value="dairy">dairy</option>
          <option value="other">other</option>
        </select>

        {/* Freshness scale for all items */}
        <select
          className="border rounded-xl p-2"
          value={freshness}
          onChange={(e) => setFreshness(e.target.value)}
          title="Freshness scale"
        >
          <option value="soon">Going bad soon</option>
          <option value="still-good">Still Good</option>
          <option value="very-fresh">Very fresh</option>
        </select>

        {/* Extra dropdown shown only for dairy */}
        {type === "dairy" && (
          <select
            className="border rounded-xl p-2"
            value={dairyStatus}
            onChange={(e) => setDairyStatus(e.target.value)}
            title="Dairy condition"
          >
            <option value="unopened">Unopened</option>
            <option value="opened-<3">Opened &lt; 3 days</option>
            <option value="opened-3-7">Opened 3–7 days</option>
            <option value="opened->7">Opened &gt; 7 days</option>
          </select>
        )}

        <button
          onClick={add}
          className="rounded-2xl bg-accent text-bark font-semibold px-4 py-2 hover:brightness-110"
        >
          Add
        </button>
      </div>

      {pantry.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {pantry.map((p) => (
            <div
              key={`${p.name}-${p.type}`}
              className="border rounded-xl p-2 bg-white flex items-center justify-between"
            >
              <div>
                <div className="font-medium capitalize">{p.name}</div>
                <div className="text-xs text-gray-600 capitalize">{p.type}</div>
                {/* Show dairy status inline if present */}
                {p.type === "dairy" && p.dairyStatus && (
                  <div className="text-[11px] text-gray-600">
                    Dairy: {p.dairyStatus.replaceAll("-", " ")}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${freshnessBadge(p.freshness)}`}>
                  {freshnessLabel(p.freshness)}
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
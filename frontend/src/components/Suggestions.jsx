import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

function Card({ item }) {
  return (
<div className="rounded-2xl border p-4 shadow-sm bg-white hover:shadow transition">
      <div className="font-semibold">{item.title}</div>
      <div className="text-xs text-gray-600 mt-1">Tags: {item.tags.join(", ")}</div>
      <div className="text-xs text-gray-500 mt-1">Match score: {item.score.toFixed(1)}</div>
      <button className="mt-3 rounded-2xl bg-accent text-bark font-semibold px-3 py-2 hover:brightness-110">
  Cook
</button>
    </div>
  );
}

export default function Suggestions() {
  const { suggestRecipes } = useAppStore();
  const [showMore, setShowMore] = useState(false);

  const all = suggestRecipes();          // sorted best → worst
  const top3 = all.slice(0, 3);
  const rest = all.slice(3);

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {top3.map((s) => <Card key={s.id} item={s} />)}
      </div>

      {rest.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setShowMore((v) => !v)}
            className="text-sm underline text-primary"
          >
            {showMore ? "Show less" : `Show more (${rest.length})`}
          </button>

          {showMore && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((s) => <Card key={s.id} item={s} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
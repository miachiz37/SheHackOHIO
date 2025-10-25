import StepCard from "../components/StepCard";
import PreferenceSlider from "../components/PreferenceSlider";
import { useAppStore } from "../store/useAppStore";
import { useNavigate, Link } from "react-router-dom";

export default function Onboarding() {
  const { profile, setProfile, setPref } = useAppStore();
  const nav = useNavigate();

  const toggleRestriction = (r) => {
    const set = new Set(profile.restrictions);
    set.has(r) ? set.delete(r) : set.add(r);
    setProfile({ restrictions: Array.from(set) });
  };

  const onNext = () => nav("/plan");

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1>PantryPal Setup</h1>
        <Link to="/login">Log in</Link>
      </div>
  
      <p>Plan meals that match your preferences, hit macros, and cut waste.</p>
  
      <StepCard title="Preference sliders (0–5)">
        <p className="text-sm text-bark/60 mb-4">
          0: Avoid · 1: Limit · 2: Occasionally · 3: Fine · 4: Prefer · 5: Prioritize
        </p>
        <div className="space-y-3">
          {Object.entries(profile.prefs).map(([k, v]) => (
            <PreferenceSlider key={k} label={k} value={v} onChange={(val) => setPref(k, val)} />
          ))}
        </div>
      </StepCard>
  
      <StepCard title="Dietary Restrictions">
        <div className="flex gap-2 flex-wrap">
          {["gluten-free","dairy-free","vegan","vegetarian","nut-free"].map((r) => (
            <button
              key={r}
              onClick={() => toggleRestriction(r)}
              className={`px-3 py-1 rounded-full border transition ${
                profile.restrictions.includes(r)
                  ? "bg-primary text-white border-primary"
                  : "bg-white hover:bg-sand border-bark/10 text-bark"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </StepCard>
  
      <StepCard title="Macro Targets (per day)">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {["protein","carb","fat"].map((k) => (
            <label key={k} className="text-sm">
              <span className="block mb-1 capitalize text-bark/80">{k} (g)</span>
              <input
                type="number"
                className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                value={profile.macros[k]}
                onChange={(e)=> setProfile({
                  macros: { ...profile.macros, [k]: Number(e.target.value) }
                })}
              />
            </label>
          ))}
        </div>
      </StepCard>
  
      <StepCard title="Other Preferences">
        <textarea
          placeholder="Example: prefers organic produce, no spicy foods, enjoys Mediterranean-style meals..."
          className="w-full border rounded-xl p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-accent/50"
          onChange={(e) => setProfile({ otherPreferences: e.target.value })}
          value={profile.otherPreferences}
        />
      </StepCard>
  
      <div className="flex justify-end">
        <button
          onClick={() => nav("/plan")}
          className="rounded-2xl bg-accent text-bark font-semibold px-5 py-2 hover:brightness-110 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
   }

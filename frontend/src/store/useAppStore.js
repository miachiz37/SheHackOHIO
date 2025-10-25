import { create } from "zustand";

const defaultPrefs = {
  pork: 3,
  nuts: 3,
  dairy: 3,
  vegetables: 3,
  fruits: 3,
};

export const useAppStore = create((set, get) => ({
  profile: {
    restrictions: [],
    macros: { protein: 120, carb: 170, fat: 55 },
    goal: "fat-loss",
    prefs: { ...defaultPrefs },            // 0–5 sliders
    otherPreferences: "",                  // free text
  },

  pantry: [], // { name, type: 'meat'|'produce'|'other', freshness: 'today'|'soon'|'ok' }
  plan: null,
  loading: false,

  setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
  setPref: (key, value) =>
    set((s) => ({ profile: { ...s.profile, prefs: { ...s.profile.prefs, [key]: value } } })),
  addIngredient: (item) => set((s) => ({ pantry: [...s.pantry, item] })),
  removeIngredient: (name) =>
    set((s) => ({ pantry: s.pantry.filter((i) => i.name !== name) })),
  setLoading: (loading) => set({ loading }),
  setPlan: (plan) => set({ plan }),

  // simple mock recommender using prefs + pantry + freshness
  suggestRecipes: () => {
    const { prefs } = get().profile;
    const pantry = get().pantry;
    const pool = [
      { id: 1, title: "Pork Stir Fry", tags: ["pork", "vegetables"], uses: ["pork", "broccoli"] },
      { id: 2, title: "Nutty Berry Yogurt", tags: ["nuts", "dairy", "fruits"], uses: ["yogurt", "berries", "almonds"] },
      { id: 3, title: "Veggie Bowl", tags: ["vegetables"], uses: ["spinach", "rice", "beans"] },
      { id: 4, title: "Fruit Oat Parfait", tags: ["fruits", "dairy"], uses: ["oats", "berries", "yogurt"] },
      { id: 5, title: "Tofu Veggie Saute", tags: ["vegetables"], uses: ["tofu", "zucchini"] },
    ];

    const have = new Set(pantry.map((p) => p.name.toLowerCase()));
    const nearExpiry = new Set(
      pantry.filter((p) => p.freshness !== "ok").map((p) => p.name.toLowerCase())
    );

    return pool
      .map((r) => {
        const prefScore = r.tags.reduce((s, t) => s + (prefs[t] ?? 0), 0); // 0–5 scale
        const pantryMatches = r.uses.reduce((s, u) => s + (have.has(u) ? 1 : 0), 0);
        const expiryBonus = r.uses.reduce((s, u) => s + (nearExpiry.has(u) ? 1 : 0), 0);
        const score = prefScore + pantryMatches * 2 + expiryBonus * 1.5;
        return { ...r, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  },
}));

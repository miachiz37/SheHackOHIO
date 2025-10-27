// Frontend/src/store/useAppStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultPrefs = {
  pork: 3,
  nuts: 3,
  dairy: 3,
  vegetables: 3,
  fruits: 3,
};

/**
 * Pantry item shape:
 * { name: string, type: 'meat'|'produce'|'other', freshness: 'today'|'soon'|'ok' }
 */

export const useAppStore = create()(
  persist(
    (set, get) => ({
      // ---------- State ----------
      profile: {
        restrictions: [], // e.g., ['nut-allergy', 'no-shellfish']
        macros: { protein: 120, carb: 170, fat: 55 },
        goal: "fat-loss", // 'fat-loss' | 'maintenance' | 'muscle-gain'
        prefs: { ...defaultPrefs }, // 0–5 sliders
        otherPreferences: "",
      },

      pantry: [],
      plan: null,
      loading: false,

      // ---------- Setters ----------
      setProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),

      setPref: (key, value) =>
        set((s) => ({
          profile: {
            ...s.profile,
            prefs: { ...s.profile.prefs, [key]: Number(value) || 0 },
          },
        })),

      addIngredient: (item) =>
        set((s) => {
          const name = (item?.name ?? "").trim();
          if (!name) return {};
          // de-dupe by name (case-insensitive)
          const lower = name.toLowerCase();
          const existing = s.pantry.some((i) => i.name.toLowerCase() === lower);
          if (existing) return {};
          return { pantry: [...s.pantry, { ...item, name }] };
        }),

      removeIngredient: (name) =>
        set((s) => ({
          pantry: s.pantry.filter(
            (i) => i.name.toLowerCase() !== String(name).toLowerCase()
          ),
        })),

      clearPantry: () => set({ pantry: [] }),

      setLoading: (loading) => set({ loading: !!loading }),

      setPlan: (plan) => set({ plan }),

      resetPrefs: () =>
        set((s) => ({ profile: { ...s.profile, prefs: { ...defaultPrefs } } })),

      // ---------- Derived helpers ----------
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

        const have = new Set(pantry.map((p) => String(p.name).toLowerCase()));
        const nearExpiry = new Set(
          pantry
            .filter((p) => p.freshness && p.freshness !== "ok")
            .map((p) => String(p.name).toLowerCase())
        );

        return pool
          .map((r) => {
            const prefScore = r.tags.reduce((s, t) => s + (Number(prefs[t]) || 0), 0);
            const pantryMatches = r.uses.reduce((s, u) => s + (have.has(u.toLowerCase()) ? 1 : 0), 0);
            const expiryBonus = r.uses.reduce((s, u) => s + (nearExpiry.has(u.toLowerCase()) ? 1 : 0), 0);
            const score = prefScore + pantryMatches * 2 + expiryBonus * 1.5;
            return { ...r, score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 8);
      },

      // ---------- Backend integration ----------
      // Use Vite proxy: '/api' → http://localhost:8080
      saveUserToBackend: async (uid, email) => {
        const { prefs, restrictions, macros, goal, otherPreferences } = get().profile;
        try {
          set({ loading: true });
          const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid,
              email,
              preferences: {
                prefs,
                restrictions,
                macros,
                goal,
                otherPreferences,
              },
            }),
          });
          if (!res.ok) {
            const msg = await res.text();
            throw new Error(`Save failed: ${res.status} ${msg}`);
          }
          return true;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "pantrypal-store", // localStorage key
      partialize: (state) => ({
        profile: state.profile,
        pantry: state.pantry,
        plan: state.plan,
      }),
      version: 1,
    }
  )
);

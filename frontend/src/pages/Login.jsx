// Frontend/src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebasebackend/firebase";
import { useAppStore } from "../store/useAppStore";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const saveUserToBackend = useAppStore((s) => s.saveUserToBackend);
  const setLoading = useAppStore((s) => s.setLoading);

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userCredential;

      if (mode === "login") {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in!");
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created!");
      }

      const user = userCredential.user;
      if (!user?.uid || !user?.email) {
        throw new Error("Missing user info from Firebase.");
      }

      // Save to backend (uses /api/users via Vite proxy)
      const ok = await saveUserToBackend(user.uid, user.email);
      if (!ok) throw new Error("Failed saving user to backend.");

      toast.success("Profile saved to database.");
      navigate("/plan"); // or wherever your next page is
    } catch (err) {
      console.error("Auth error:", err);
      toast.error(err?.message ?? "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        {mode === "login" ? "Log in" : "Create your account"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-sm mb-1">Email</span>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="block">
          <span className="block text-sm mb-1">Password</span>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full rounded px-3 py-2 font-medium border bg-black text-white"
        >
          {mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      <div className="mt-4 text-sm">
        {mode === "login" ? (
          <>
            Don’t have an account?{" "}
            <button
              className="underline"
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              className="underline"
              onClick={() => setMode("login")}
            >
              Log in
            </button>
          </>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <Link to="/">← Back</Link>
      </div>
    </div>
  );
}

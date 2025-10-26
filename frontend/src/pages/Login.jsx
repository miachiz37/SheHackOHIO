import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebasebackend/firebase"; // adjust path

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginOrRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userCredential;

      // Try to log in
      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in!");
      } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created!");
      } else {
      alert("Error: " + err.message);
    }
  }

      const user = userCredential.user;

      // Save user info (and default preferences) to backend
      const res = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          preferences: {
            pork: 0,
            nuts: 0,
            dairy: 0,
            veggies: 0,
            fruit: 0,
          },
        }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to save user");

      alert("Logged in and saved to database!");
      navigate("/preferences"); // redirect to preferences page
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login / Register</h1>

      <form onSubmit={handleLoginOrRegister} className="space-y-3">
        <input
          className="w-full border rounded-xl p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded-xl p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-primary text-white py-2 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login or Create Account"}
        </button>
      </form>

      <Link
        to="/onboarding"
        className="block text-center text-primary mt-3 underline"
      >
        Back
      </Link>
    </div>
  );
}
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <p className="text-sm text-gray-600 mb-4">
        Placeholder login — Person 1 will connect this to Firebase Auth.
      </p>
      <form className="space-y-3">
        <input className="w-full border rounded-xl p-2" placeholder="Email" />
        <input className="w-full border rounded-xl p-2" placeholder="Password" type="password" />
        <button className="w-full rounded-xl bg-primary text-white py-2">Sign in</button>
      </form>
      <Link to="/onboarding" className="block text-center text-primary mt-3 underline">Back</Link>
    </div>
  );
}

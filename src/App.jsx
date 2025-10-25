import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Onboarding from "./pages/Onboarding";
import Plan from "./pages/Plan";
import Login from "./pages/Login";
import bear from "./assets/bear.png"; // 🐻  place your image here

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-sand text-bark">
        <header className="p-4 border-b bg-white/90 backdrop-blur sticky top-0 z-10">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <img src={bear} alt="PantryPal Bear" className="w-9 h-9 rounded-2xl" />
            <Link to="/" className="font-semibold text-bark text-lg">PantryPal</Link>
            <div className="ml-auto text-sm text-bark/70">
              <span className="px-2 py-1 rounded-full border border-accent/40 bg-accent/10">beta</span>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        <Toaster position="top-center" />
      </div>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Onboarding from "./pages/Onboarding";
import Plan from "./pages/Plan";
import Login from "./pages/Login";
import bear from "./assets/bear.png"; 

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-sand text-bark">
      <header className="p-4 border-b bg-white/90 backdrop-blur sticky top-0 z-10">
  <div className="max-w-5xl mx-auto flex items-center gap-3">
    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
      {/* Force size so it can never blow up */}
      <img src={bear} alt="PantryPal" style={{ width: 150, height: 150, objectFit: "contain" }} />
    </div>
    <Link to="/" className="font-semibold text-bark text-xl tracking-tight">PantryPal</Link>
    <span className="ml-auto text-xs px-2 py-1 rounded-full border border-accent/40 bg-accent/10 text-bark">beta</span>
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
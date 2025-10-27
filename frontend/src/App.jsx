import { Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding.jsx";
import Plan from "./pages/Plan.jsx";
import Login from "./pages/Login.jsx";
import { Toaster } from "sonner";
import "./App.css";

export default function App() {
  return (
    <div>
      {/* header / nav if any */}
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster position="top-center" />
    </div>
  );
}

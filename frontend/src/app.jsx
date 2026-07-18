import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Admin from "./pages/Admin";

function Protected({ children, adminOnly = false }) {
  const { profile, loading } = useAuth();
  if (loading) return <div className="container mt-24">Loading...</div>;
  if (!profile) return <Navigate to="/login" replace />;
  if (adminOnly && !profile.is_admin) return <Navigate to="/dashboard" replace />;
  return children;
}

function Shell() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/history" element={<Protected><History /></Protected>} />
        <Route path="/admin" element={<Protected adminOnly><Admin /></Protected>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
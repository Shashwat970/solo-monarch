import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HuntBackground from "./components/HuntBackground";
import SmoothScroll from "./components/SmoothScroll";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Admin from "./pages/Admin";

function Protected({ children, adminOnly = false }) {
  const { profile, loading } = useAuth();
  if (loading) return <div className="loading-screen">Syncing with the System…</div>;
  if (!profile) return <Navigate to="/login" replace />;
  if (adminOnly && !profile.is_admin) return <Navigate to="/dashboard" replace />;
  return children;
}

function RootRoute() {
  const { profile, loading } = useAuth();
  if (loading) return <div className="loading-screen">Syncing with the System…</div>;
  return profile ? <Navigate to="/dashboard" replace /> : <Landing />;
}

function Shell() {
  useLocation();
  return (
    <>
      <HuntBackground />
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/history" element={<Protected><History /></Protected>} />
          <Route path="/admin" element={<Protected adminOnly><Admin /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SmoothScroll>
        <Shell />
      </SmoothScroll>
    </AuthProvider>
  );
}
import { useState } from "react";
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlitchButton from "./GlitchButton";

export default function Navbar() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const onLanding = location.pathname === "/";

  function handleLogout() { logout(); navigate("/login"); setOpen(false); }

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
          <span className="sigil" />
          <span>SOLO<em>FIT</em></span>
        </Link>
        <button className="nav-mobile-btn" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
          <span />
        </button>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          {profile ? (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>
              <NavLink to="/history" onClick={() => setOpen(false)}>History</NavLink>
              {profile.is_admin && <NavLink to="/admin" onClick={() => setOpen(false)}>Admin</NavLink>}
              <GlitchButton variant="primary" onClick={handleLogout}>Sign Out</GlitchButton>
            </>
          ) : (
            <>
              {!onLanding && <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>}
              <NavLink to="/login" onClick={() => setOpen(false)}>Login</NavLink>
              <GlitchButton as={Link} to="/signup" variant="primary" onClick={() => setOpen(false)} arrow>
                Awaken
              </GlitchButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
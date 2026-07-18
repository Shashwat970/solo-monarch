import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="container">
        <div className="logo">SOLO<span>FIT</span></div>
        {profile && (
          <nav>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/history">History</NavLink>
            {profile.is_admin && <NavLink to="/admin">Admin</NavLink>}
            <button className="btn" onClick={handleLogout}>Log out</button>
          </nav>
        )}
      </div>
    </header>
  );
}
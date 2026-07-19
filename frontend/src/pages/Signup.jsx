import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "", display_name: "", weight_kg: 70 });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.signup(form);
      setMessage(res.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center-screen">
      <div className="panel auth-card">
        <div className="eyebrow">System</div>
        <h1 style={{ margin: "6px 0 24px" }}>Register as Hunter</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Display name</label>
            <input required value={form.display_name} onChange={(e) => update("display_name", e.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={(e) => update("password", e.target.value)} />
          </div>
          <div className="field">
            <label>Weight (kg) — used to estimate calories</label>
            <input type="number" min="30" max="250" value={form.weight_kg} onChange={(e) => update("weight_kg", Number(e.target.value))} />
          </div>
          {error && <div className="error-text">{error}</div>}
          {message && <p style={{ color: "#58d6ff" }}>{message}</p>}
          <button className="btn primary block mt-16" disabled={loading}>
            {loading ? "Awakening..." : "Begin Awakening"}
          </button>
        </form>
        <p className="muted mt-16">
          Already a hunter? <Link to="/login" style={{ color: "#58d6ff" }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
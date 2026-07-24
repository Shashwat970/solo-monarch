import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import GlitchButton from "../components/GlitchButton";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "", display_name: "", weight_kg: 70 });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function update(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.signup(form);
      setMessage(res.message);
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="auth-wrap">
        <motion.div className="auth-copy"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}>
          <div className="kicker">◇ Register · Awakening Protocol</div>
          <h1>Register<br/>as a <em>Hunter</em>.</h1>
          <p>You start at rank E. What happens next is up to you and no one else. The System is watching.</p>
        </motion.div>

        <motion.div className="hud auth-card"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.7, 0, 0.2, 1] }}>
          <span className="corner tl" /><span className="corner tr" />
          <span className="corner bl" /><span className="corner br" />

          <div className="hud-tag"><span className="dot" />Awakening Form</div>

          <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <div className="field">
              <label>Hunter Name</label>
              <input required value={form.display_name} onChange={(e) => update("display_name", e.target.value)} placeholder="Sung Jinwoo" />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="hunter@system.io" />
            </div>
            <div className="field">
              <label>Password (min 6)</label>
              <input type="password" required minLength={6} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" />
            </div>
            <div className="field">
              <label>Weight (kg) — for calorie estimation</label>
              <input type="number" min="30" max="250" value={form.weight_kg} onChange={(e) => update("weight_kg", Number(e.target.value))} />
            </div>
            {error && <div className="error-text">▲ {error}</div>}
            {message && (
              <p style={{ color: "var(--cyan)", fontFamily: "var(--f-mono)", fontSize: 13, letterSpacing: "0.1em", marginTop: 10 }}>
                ✓ {message}
              </p>
            )}
            <GlitchButton variant="primary" className="block mt-16" disabled={loading} arrow>
              {loading ? "Awakening…" : "Begin Awakening"}
            </GlitchButton>
          </form>

          <p className="muted mt-24" style={{ fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Already a hunter? <Link to="/login" className="link">Log in →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import GlitchButton from "../components/GlitchButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
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
          <div className="kicker">◇ Access Gate · Verify Hunter</div>
          <h1>Welcome<br/><em>back, hunter.</em></h1>
          <p>The System remembers you. Log the last streak — or begin a new one. The Monarch waits for no one.</p>
        </motion.div>

        <motion.div className="hud auth-card"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.7, 0, 0.2, 1] }}>
          <span className="corner tl" /><span className="corner tr" />
          <span className="corner bl" /><span className="corner br" />

          <div className="hud-tag"><span className="dot" />Hunter Login</div>

          <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hunter@system.io" autoComplete="email" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" autoComplete="current-password" />
            </div>
            {error && <div className="error-text">▲ {error}</div>}
            <GlitchButton variant="primary" className="block mt-16" disabled={loading} arrow>
              {loading ? "Verifying…" : "Enter the Gate"}
            </GlitchButton>
          </form>

          <p className="muted mt-24" style={{ fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            New hunter? <Link to="/signup" className="link">Create an account →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
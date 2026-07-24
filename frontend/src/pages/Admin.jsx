import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../api";
import GlitchButton from "../components/GlitchButton";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.adminUsers().then(setUsers);
    api.adminStats().then(setStats);
  }, []);

  async function viewUser(user) {
    setSelected(user);
    const h = await api.adminUserHistory(user.id);
    setHistory(h);
  }

  return (
    <div className="container" style={{ padding: "56px 32px 96px" }}>
      <motion.div className="section-title-row"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}>
        <h2>Admin <em>Console</em>.</h2>
        <div className="hud-tag"><span className="dot" />Sovereign Access</div>
      </motion.div>

      {stats && (
        <motion.div className="hud"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}>
          <span className="corner tl" /><span className="corner tr" />
          <span className="corner bl" /><span className="corner br" />
          <div className="hud-tag"><span className="dot" />Overview</div>
          <div className="stat-grid mt-24" style={{ borderTop: "1px solid var(--hairline)" }}>
            <div className="stat-cell">
              <div className="stat-num">{stats.total_users}</div>
              <div className="stat-label">Total Hunters</div>
            </div>
            {Object.entries(stats.rank_distribution).slice(0, 3).map(([r, c]) => (
              <div className="stat-cell" key={r}>
                <div className="stat-num">{c}<span className="u">rank {r}</span></div>
                <div className="stat-label">Hunters</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid-2 mt-32">
        <motion.div className="hud"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}>
          <span className="corner tl" /><span className="corner tr" />
          <span className="corner bl" /><span className="corner br" />
          <div className="hud-tag"><span className="dot" />All Hunters</div>

          <div style={{ overflowX: "auto", marginTop: 20 }}>
            <table className="hud-table">
              <thead><tr><th>Name</th><th>Rank</th><th>Streak</th><th></th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      {u.display_name}<br />
                      <span className="mono" style={{ fontSize: 11, color: "var(--text-dim)" }}>{u.email}</span>
                    </td>
                    <td style={{ color: "var(--violet)" }}>{u.rank}</td>
                    <td>{u.streak_days}</td>
                    <td>
                      <GlitchButton variant="cyan" onClick={() => viewUser(u)} style={{ padding: "8px 16px", fontSize: 12 }}>
                        View
                      </GlitchButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div className="hud"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}>
          <span className="corner tl" /><span className="corner tr" />
          <span className="corner bl" /><span className="corner br" />
          <div className="hud-tag"><span className="dot" />Hunter Log</div>

          {!selected && (
            <p className="muted mt-24" style={{ fontFamily: "var(--f-editorial)", fontStyle: "italic", fontSize: 18 }}>
              Select a hunter to view their full record.
            </p>
          )}
          {selected && (
            <>
              <h3 style={{ margin: "16px 0 20px", fontSize: 24, textTransform: "uppercase" }}>
                {selected.display_name}
              </h3>
              <table className="hud-table">
                <thead><tr><th>Date</th><th>Cal</th><th>Met</th></tr></thead>
                <tbody>
                  {history.map((r) => (
                    <tr key={r.id}>
                      <td className="mono">{r.log_date}</td>
                      <td>{r.calories_burned}</td>
                      <td className={r.target_met ? "met" : "no"}>{r.target_met ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr><td colSpan={3} className="empty">No records</td></tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
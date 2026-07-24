import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../api";

export default function History() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.history().then((r) => { setRows(r); setLoading(false); });
  }, []);

  return (
    <div className="container" style={{ padding: "56px 32px 96px" }}>
      <motion.div className="section-title-row"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}>
        <h2>Training <em>History</em>.</h2>
        <div className="hud-tag"><span className="dot" />Records · {rows.length}</div>
      </motion.div>

      <motion.div className="hud"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}>
        <span className="corner tl" /><span className="corner tr" />
        <span className="corner bl" /><span className="corner br" />

        <div style={{ overflowX: "auto" }}>
          <table className="hud-table">
            <thead>
              <tr>
                <th>Date</th><th>Rank</th><th>Pushups</th><th>Squats</th>
                <th>Run (km)</th><th>Plank (s)</th><th>Calories</th><th>Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="mono">{r.log_date}</td>
                  <td>{r.rank_at_time}</td>
                  <td>{r.pushups}</td>
                  <td>{r.squats}</td>
                  <td>{r.running_km}</td>
                  <td>{r.plank_seconds}</td>
                  <td>{r.calories_burned}</td>
                  <td className={r.was_relax_day ? "relax" : r.target_met ? "met" : "no"}>
                    {r.was_relax_day ? "Relax" : r.target_met ? "Met ✓" : "Missed ✕"}
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={8} className="empty">No records yet — log your first quest on the Dashboard.</td></tr>
              )}
              {loading && (
                <tr><td colSpan={8} className="empty">Loading records…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
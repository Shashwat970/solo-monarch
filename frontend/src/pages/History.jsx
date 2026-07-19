import { useEffect, useState } from "react";
import { api } from "../api";

export default function History() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.history().then(setRows);
  }, []);

  return (
    <div className="container mt-24">
      <div className="panel">
        <div className="eyebrow">Records</div>
        <h2 style={{ margin: "6px 0 20px" }}>Training History</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th><th>Rank</th><th>Pushups</th><th>Squats</th>
              <th>Run (km)</th><th>Plank (s)</th><th>Calories</th><th>Target Met</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.log_date}</td>
                <td>{r.rank_at_time}</td>
                <td>{r.pushups}</td>
                <td>{r.squats}</td>
                <td>{r.running_km}</td>
                <td>{r.plank_seconds}</td>
                <td>{r.calories_burned}</td>
                <td style={{ color: r.target_met ? "#58d6ff" : "#ff4d6a" }}>
                  {r.was_relax_day ? "Relax day" : r.target_met ? "Yes" : "No"}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="muted">No records yet — log your first workout on the Dashboard.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
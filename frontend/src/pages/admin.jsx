import { useEffect, useState } from "react";
import { api } from "../api";

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
    <div className="container mt-24 stack">
      {stats && (
        <div className="panel">
          <div className="eyebrow">Overview</div>
          <p>Total hunters: <strong>{stats.total_users}</strong></p>
          <p className="muted">
            {Object.entries(stats.rank_distribution).map(([r, c]) => `${r}: ${c}`).join(" · ")}
          </p>
        </div>
      )}

      <div className="grid-2">
        <div className="panel">
          <div className="eyebrow">All Users</div>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Rank</th><th>Streak</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.display_name}<br /><span className="muted" style={{ fontSize: 12 }}>{u.email}</span></td>
                  <td>{u.rank}</td>
                  <td>{u.streak_days}</td>
                  <td><button className="btn" onClick={() => viewUser(u)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="eyebrow">User Log</div>
          {!selected && <p className="muted">Select a user to view their full record.</p>}
          {selected && (
            <>
              <h3 style={{ margin: "6px 0 14px" }}>{selected.display_name}</h3>
              <table className="data-table">
                <thead><tr><th>Date</th><th>Cal</th><th>Met</th></tr></thead>
                <tbody>
                  {history.map((r) => (
                    <tr key={r.id}>
                      <td>{r.log_date}</td>
                      <td>{r.calories_burned}</td>
                      <td>{r.target_met ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
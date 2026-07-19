mport { useEffect, useState } from "react";
import RankBadge from "../components/RankBadge";
import StreakRing from "../components/StreakRing";
import ExerciseTargetCard from "../components/ExerciseTargetCard";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const EMPTY = { pushups: 0, squats: 0, running_km: 0, plank_seconds: 0 };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [values, setValues] = useState(EMPTY);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { refreshProfile } = useAuth();

  async function load() {
    const today = await api.today();
    setData(today);
    if (today.today_progress) {
      setValues({
        pushups: today.today_progress.pushups,
        squats: today.today_progress.squats,
        running_km: today.today_progress.running_km,
        plank_seconds: today.today_progress.plank_seconds,
      });
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await api.logWorkout(values);
      setResult(res);
      await load();
      await refreshProfile();
    } finally {
      setSubmitting(false);
    }
  }

  if (!data) return <div className="container mt-24">Loading system data...</div>;

  const alreadyLogged = !!data.today_progress;

  return (
    <div className="container mt-24 stack">
      {data.relax_day_available && (
        <div className="relax-banner">⚡ Relax day available — today's target is optional, your streak won't break.</div>
      )}

      <div className="grid-2">
        <div className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <RankBadge rank={data.rank} />
            <StreakRing current={data.streak_days} required={data.days_required_for_next_rank} />
          </div>
          {data.next_rank && (
            <p className="muted mt-16">
              {data.days_required_for_next_rank - data.streak_days} more day(s) at target to reach rank {data.next_rank}.
            </p>
          )}
          {!data.next_rank && <p className="muted mt-16">Max rank reached. You are the Monarch.</p>}
        </div>

        <ExerciseTargetCard
          targets={data.targets}
          values={values}
          done={alreadyLogged}
          onChange={(key, val) => setValues((v) => ({ ...v, [key]: val }))}
        />
      </div>

      {!alreadyLogged ? (
        <button className="btn primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting to the System..." : "Log Today's Training"}
        </button>
      ) : (
        <p className="muted">Today's training is already logged. Come back tomorrow, hunter.</p>
      )}

      {result && (
        <div className="panel">
          <div className="eyebrow">Result</div>
          <p>Calories burned: <strong>{result.calories_burned}</strong> kcal</p>
          <p>Target met: <strong>{result.target_met ? "Yes" : "No"}</strong></p>
          {result.ranked_up && (
            <p style={{ color: "#ffc857" }}>🔺 RANK UP! You are now rank {result.new_rank}.</p>
          )}
        </div>
      )}
    </div>
  );
}
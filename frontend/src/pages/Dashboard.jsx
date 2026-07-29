import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RankBadge from "../components/RankBadge";
import StreakRing from "../components/StreakRing";
import ExerciseTargetCard from "../components/ExerciseTargetCard";
import GlitchButton from "../components/GlitchButton";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const EMPTY = { pushups: 0, squats: 0, running_km: 0, plank_seconds: 0 };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [values, setValues] = useState(EMPTY);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { refreshProfile } = useAuth();

const [loadError, setLoadError] = useState("");

async function load() {
  try {
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
  } catch (err) {
    setLoadError(err.message || "Could not reach the System.");
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

if (loadError) return <div className="loading-screen">▲ {loadError} <br/><span className="muted" style={{fontSize:14}}>Try refreshing, or log in again.</span></div>;
if (!data) return <div className="loading-screen">Loading System Data…</div>;
  const alreadyLogged = !!data.today_progress;

  return (
    <div className="container" style={{ padding: "56px 32px 96px", position: "relative", zIndex: 1 }}>
      <motion.div className="section-title-row"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}>
        <h2>Today's <em>Quest</em>.</h2>
        <div className="hud-tag"><span className="dot" />Live Session</div>
      </motion.div>

      {data.relax_day_available && (
        <div className="relax-banner">
          Relax day available — today's target is optional, your streak won't break.
        </div>
      )}

      <div className="dash-top">
        <motion.div className="hud"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}>
          <span className="corner tl" /><span className="corner tr" />
          <span className="corner bl" /><span className="corner br" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
            <RankBadge rank={data.rank} />
            <StreakRing current={data.streak_days} required={data.days_required_for_next_rank} />
          </div>
          <div className="mt-24" style={{ paddingTop: 20, borderTop: "1px solid var(--hairline)" }}>
            {data.next_rank ? (
              <p className="muted" style={{ fontFamily: "var(--f-editorial)", fontStyle: "italic", fontSize: 18 }}>
                {data.days_required_for_next_rank - data.streak_days} more day(s) at target to reach rank <span style={{ color: "var(--violet)" }}>{data.next_rank}</span>.
              </p>
            ) : (
              <p className="muted" style={{ fontFamily: "var(--f-editorial)", fontStyle: "italic", fontSize: 18, color: "var(--gold)" }}>
                Max rank reached. You are the Monarch.
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}>
          <ExerciseTargetCard
            targets={data.targets}
            values={values}
            done={alreadyLogged}
            onChange={(key, val) => setValues((v) => ({ ...v, [key]: val }))}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}>
        {!alreadyLogged ? (
          <GlitchButton variant="primary" onClick={handleSubmit} disabled={submitting} arrow>
            {submitting ? "Submitting to the System…" : "Log Today's Training"}
          </GlitchButton>
        ) : (
          <p className="muted" style={{ fontFamily: "var(--f-editorial)", fontStyle: "italic", fontSize: 20 }}>
            Today's training is already logged. Come back tomorrow, hunter.
          </p>
        )}
      </motion.div>

      {result && (
        <motion.div className="hud mt-32"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <span className="corner tl" /><span className="corner tr" />
          <span className="corner bl" /><span className="corner br" />
          <div className="hud-tag"><span className="dot" />System Response</div>

          <div className="result-grid mt-24">
            <div className="result-tile">
              <div className="k">Calories Burned</div>
              <div className="v hi">{result.calories_burned}<span style={{ fontSize: 16, color: "var(--text-dim)", marginLeft: 8 }}>kcal</span></div>
            </div>
            <div className="result-tile">
              <div className="k">Target Met</div>
              <div className={`v ${result.target_met ? "hi" : "no"}`}>{result.target_met ? "YES" : "NO"}</div>
            </div>
            <div className="result-tile">
              <div className="k">Streak</div>
              <div className="v hi">{data.streak_days}</div>
            </div>
          </div>

          {result.ranked_up && (
            <div className="rankup-flash">
              ▲ RANK UP — You are now rank {result.new_rank}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
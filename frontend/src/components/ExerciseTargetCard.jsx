export default function ExerciseTargetCard({ targets, values, onChange, done }) {
  const rows = [
    { key: "pushups", label: "Pushups", unit: "reps", step: 1 },
    { key: "squats", label: "Squats", unit: "reps", step: 1 },
    { key: "running_km", label: "Running", unit: "km", step: 0.1 },
    { key: "plank_seconds", label: "Plank", unit: "sec", step: 1 },
  ];

  return (
    <div className="hud">
      <span className="corner tl" /><span className="corner tr" />
      <span className="corner bl" /><span className="corner br" />

      <div className="hud-tag"><span className="dot" />Daily Quest</div>
      <h2 style={{ margin: "18px 0 20px", fontSize: "clamp(24px, 3vw, 36px)", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
        Today's <em style={{ fontFamily: "var(--f-editorial)", fontStyle: "italic", color: "var(--violet)", fontWeight: 400, textTransform: "none" }}>Targets</em>
      </h2>

      {rows.map((r) => {
        const target = targets[r.key];
        const value = values[r.key];
        const met = value >= target;
        return (
          <div className="target-row" key={r.key}>
            <div className="label-line">
              <span className="name">{r.label}</span>
              <span className="target">Target · {target} {r.unit}</span>
            </div>
            <input
              type="number" min="0" step={r.step} value={value} disabled={done}
              onChange={(e) => onChange(r.key, Number(e.target.value))}
              className={met ? "met" : ""}
            />
          </div>
        );
      })}
    </div>
  );
}
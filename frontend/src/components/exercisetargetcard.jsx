export default function ExerciseTargetCard({ targets, values, onChange, done }) {
  const rows = [
    { key: "pushups", label: "Pushups", unit: "reps" },
    { key: "squats", label: "Squats", unit: "reps" },
    { key: "running_km", label: "Running", unit: "km" },
    { key: "plank_seconds", label: "Plank", unit: "sec" },
  ];

  return (
    <div className="panel">
      <div className="eyebrow">Daily Quest</div>
      <h2 style={{ margin: "6px 0 16px" }}>Today's Targets</h2>
      {rows.map((r) => {
        const target = targets[r.key];
        const value = values[r.key];
        const met = value >= target;
        return (
          <div className="target-row" key={r.key}>
            <div className="label">{r.label} (target {target} {r.unit})</div>
            <div>
              <input
                type="number"
                min="0"
                step={r.key === "running_km" ? "0.1" : "1"}
                value={value}
                disabled={done}
                onChange={(e) => onChange(r.key, Number(e.target.value))}
                style={{
                  width: 90, background: "#05070d", border: "1px solid #223047",
                  color: met ? "#58d6ff" : "#e8f1ff", padding: "6px 10px", fontFamily: "Rajdhani", fontSize: 16,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default function StreakRing({ current, required }) {
  const size = 84;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = required ? Math.min(current / required, 1) : 1;
  const offset = circumference * (1 - pct);

  return (
    <div className="streak-ring">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#223047" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="#58d6ff" strokeWidth={stroke} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      <div>
        <div className="count">{current}{required ? ` / ${required}` : ""}</div>
        <div className="muted" style={{ fontSize: 13 }}>day streak</div>
      </div>
    </div>
  );
}
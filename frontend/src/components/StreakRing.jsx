export default function StreakRing({ current, required }) {
  const size = 96;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = required ? Math.min(current / required, 1) : 1;
  const offset = circumference * (1 - pct);

  return (
    <div className="streak-ring">
      <svg width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="ring-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#a37bff" />
            <stop offset="100%" stopColor="#34ffe0" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(163,123,255,0.15)" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={radius} stroke="url(#ring-grad)" strokeWidth={stroke} fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.7,0,.2,1)" }} />
      </svg>
      <div>
        <div className="count">
          {current}{required ? <span className="slash"> / {required}</span> : null}
        </div>
        <div className="r-label">Day Streak</div>
      </div>
    </div>
  );
}
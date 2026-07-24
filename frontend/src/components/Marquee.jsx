export default function Marquee({ items = [] }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((it, i) => (
          <span key={i}>{it}<span className="dot"> ✦ </span></span>
        ))}
      </div>
    </div>
  );
}
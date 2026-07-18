export default function RankBadge({ rank }) {
  return (
    <div>
      <div className="eyebrow">Hunter Rank</div>
      <div className={`rank-badge rank-${rank}`}>{rank}</div>
    </div>
  );
}
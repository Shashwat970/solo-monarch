const GOLD = new Set(["S", "SS", "SSS"]);

export default function RankBadge({ rank }) {
  const isGold = GOLD.has(rank);
  return (
    <div className="rank-hero">
      <div className={`rank-badge-big ${isGold ? "gold" : ""}`} data-rank={rank}>{rank}</div>
      <div className="rank-meta">
        <div className="r-label">Hunter Rank</div>
        <div className="r-name">{rankName(rank)}</div>
      </div>
    </div>
  );
}

function rankName(r) {
  const map = {
    E: "Awakened Novice", D: "Iron Vanguard", C: "Adept Hunter", B: "Elite Slayer",
    A: "Ascendant", S: "Sovereign Blade", SS: "Grand Marshal", SSS: "Shadow Monarch",
  };
  return map[r] || "Unranked";
}
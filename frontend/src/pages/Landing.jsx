import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import HeroReveal from "../components/HeroReveal";
import GlitchButton from "../components/GlitchButton";
import Marquee from "../components/Marquee";

const RANKS = [
  { rank: "E", name: "Awakened Novice", req: "Day 0 · Threshold", gold: false },
  { rank: "D", name: "Iron Vanguard", req: "5 days at target", gold: false },
  { rank: "C", name: "Adept Hunter", req: "12 days at target", gold: false },
  { rank: "B", name: "Elite Slayer", req: "25 days at target", gold: false },
  { rank: "A", name: "Ascendant", req: "45 days at target", gold: false },
  { rank: "S", name: "Sovereign Blade", req: "75 days at target", gold: true },
  { rank: "SS", name: "Grand Marshal", req: "120 days at target", gold: true },
  { rank: "SSS", name: "Shadow Monarch", req: "180 days at target", gold: true },
];

const CHAPTERS = [
  { n: "01", title: <>The <em>System</em> Awoke.</>, body: "Every hunter begins at rank E. What follows is not motivation — it is protocol. Log your quest. Move. Return. The System keeps the record." },
  { n: "02", title: <>Move With <em>Intent</em>.</>, body: "Four disciplines — pushups, squats, running, and plank. Simple by design, unforgiving by nature. Meet the daily target or the streak resets." },
  { n: "03", title: <>Ascend the <em>Ladder</em>.</>, body: "From E to SSS. Every rank is earned in consecutive days at target. A single relax day is granted per cycle. The Monarch is patient. The System is not." },
  { n: "04", title: <>Arise, <em>Hunter</em>.</>, body: "Awakening takes thirty seconds. Discipline takes the rest of your life. Ready?" },
];

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const sigilY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const sigilRot = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const sigilScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <main>
      <section className="hero" ref={heroRef}>
        <motion.div
          className="hero-sigil"
          style={{ y: sigilY, rotate: sigilRot, scale: sigilScale }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.4 }}
        >
          <MonarchSigil />
        </motion.div>

        <div className="container hero-inner">
          <motion.div className="hero-meta"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}>
            <div>SOLO FIT · SYSTEM v2.0</div>
            <div className="r">
              <span className="live">System Online</span>
              <span>{new Date().getFullYear()} · Ω</span>
            </div>
          </motion.div>

          <HeroReveal
            delay={0.15}
            lines={[
              <>Awaken.</>,
              <><em>Arise.</em></>,
              <><span className="stroke">Ascend</span>.</>,
            ]}
          />

          <div className="hero-lower">
            <motion.p className="hero-lead"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: [0.7, 0, 0.2, 1] }}>
              A daily discipline tracker for the ones who <span className="accent">refuse to stay weak</span>.
              Four movements. Eight ranks. One system that never lies to you.
            </motion.p>

            <motion.div className="hero-actions"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.05 }}>
              <GlitchButton as={Link} to="/signup" variant="primary" arrow>Begin Awakening</GlitchButton>
              <GlitchButton as={Link} to="/login" variant="cyan">I am already a Hunter</GlitchButton>
            </motion.div>
          </div>
        </div>
      </section>

      <Marquee items={["Arise, Hunter", "The weak have no will", "Log the quest", "Break the mirror", "Ascend or Reset"]} />

      <section className="chapter">
        <div className="container">
          <ChapterHead num="01" title={CHAPTERS[0].title} body={CHAPTERS[0].body} />
          <div className="stat-grid">
            {[
              { n: "8", u: "ranks", l: "From E to Shadow Monarch" },
              { n: "4", u: "moves", l: "Pushups · Squats · Run · Plank" },
              { n: "180", u: "days", l: "To reach the throne" },
              { n: "1", u: "relax", l: "Per rank cycle" },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="stat-cell">
                  <div className="stat-num">{s.n}<span className="u">{s.u}</span></div>
                  <div className="stat-label">{s.l}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="chapter">
        <div className="container">
          <ChapterHead num="02" title={CHAPTERS[1].title} body={CHAPTERS[1].body} />
          <div className="showcase">
            <FadeIn>
              <div className="showcase-frame">
                <div className="spot" />
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80&auto=format&fit=crop"
                  alt="Hunter in training" loading="lazy"
                />
                <span className="label">Field · 03:24</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.12}>
              <div className="showcase-copy">
                <h3>Four <em>Disciplines</em>.<br/>Zero excuses.</h3>
                <p>Each day the System issues a quest scaled to your current rank. Log the truth — the number you actually did, not the number you wished. The ring closes when the target is met.</p>
                <GlitchButton as={Link} to="/signup" variant="primary" arrow>See Today's Quest</GlitchButton>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="chapter">
        <div className="container">
          <ChapterHead num="03" title={CHAPTERS[2].title} body={CHAPTERS[2].body} />
          <div className="ladder">
            {RANKS.map((r, i) => (
              <FadeIn key={r.rank} delay={i * 0.04}>
                <div className="ladder-row">
                  <div className={`ladder-rank ${r.gold ? "gold" : ""}`}>{r.rank}</div>
                  <div className="ladder-name">{r.name}</div>
                  <div className="ladder-req">{r.req}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="chapter">
        <div className="container">
          <ChapterHead num="04" title={CHAPTERS[3].title} body={CHAPTERS[3].body} />
          <FadeIn>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 24 }}>
              <GlitchButton as={Link} to="/signup" variant="primary" arrow>Begin Awakening</GlitchButton>
              <GlitchButton as={Link} to="/login" variant="cyan">Login to your System</GlitchButton>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <h4>The <em>gate</em> is always open.<br/>Few walk through it.</h4>
            <div className="footer-links">
              <Link to="/signup">Awaken</Link>
              <Link to="/login">Login</Link>
              <a href="#">Manifesto</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div className="footer-base">
            <span>© SOLO FIT · SYSTEM</span>
            <span>Arise ✦ Hunter</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ChapterHead({ num, title, body }) {
  return (
    <div className="chapter-head">
      <div><div className="chapter-num">Ch. {num} / IV</div></div>
      <div>
        <FadeIn><h2 className="chapter-title">{title}</h2></FadeIn>
        <FadeIn delay={0.1}><p className="chapter-body" style={{ marginTop: 28 }}>{body}</p></FadeIn>
      </div>
    </div>
  );
}

function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.7, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MonarchSigil() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sig-a" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#a37bff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#34ffe0" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="sig-r" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#a37bff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a37bff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="260" fill="url(#sig-r)" />
      <circle cx="300" cy="300" r="240" stroke="url(#sig-a)" strokeWidth="1" opacity="0.7" />
      <circle cx="300" cy="300" r="200" stroke="#a37bff" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.5" />
      <circle cx="300" cy="300" r="160" stroke="url(#sig-a)" strokeWidth="1.2" opacity="0.85" />
      <g style={{ transformOrigin: "300px 300px", animation: "spin-slow 40s linear infinite" }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1="300" y1="70" x2="300" y2="90"
            stroke="#a37bff" strokeWidth="1.5"
            opacity={i % 3 === 0 ? 0.9 : 0.3}
            transform={`rotate(${(i * 360) / 24} 300 300)`} />
        ))}
      </g>
      <g style={{ transformOrigin: "300px 300px", animation: "spin-rev 60s linear infinite" }}>
        <polygon points="300,180 420,300 300,420 180,300" stroke="#a37bff" strokeWidth="1.5" fill="rgba(163,123,255,0.05)" />
        <polygon points="300,220 380,300 300,380 220,300" stroke="#34ffe0" strokeWidth="0.8" fill="none" opacity="0.6" />
        <circle cx="300" cy="300" r="6" fill="#a37bff" />
      </g>
      <line x1="300" y1="20" x2="300" y2="60" stroke="#a37bff" strokeWidth="1" opacity="0.6" />
      <line x1="300" y1="540" x2="300" y2="580" stroke="#a37bff" strokeWidth="1" opacity="0.6" />
      <line x1="20" y1="300" x2="60" y2="300" stroke="#a37bff" strokeWidth="1" opacity="0.6" />
      <line x1="540" y1="300" x2="580" y2="300" stroke="#a37bff" strokeWidth="1" opacity="0.6" />
      <style>{`
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes spin-rev  { to { transform: rotate(-360deg); } }
      `}</style>
    </svg>
  );
}
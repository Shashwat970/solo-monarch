import { motion } from "framer-motion";

export default function HeroReveal({ lines = [], className = "hero-title", delay = 0.1 }) {
  return (
    <h1 className={className}>
      {lines.map((line, i) => (
        <span className="line" key={i} aria-hidden="true">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 1.05, ease: [0.7, 0, 0.2, 1], delay: delay + i * 0.14 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
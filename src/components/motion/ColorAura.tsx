"use client";

import { motion } from "framer-motion";

// A field of large, softly-blurred color blobs that drift slowly behind the
// hero content. Uses the .aura-blob class (mix-blend-mode swaps between
// multiply/screen per theme) so the same vivid palette reads well on both a
// near-white and a near-black background instead of just looking washed out
// in light mode.
// Kept small and pinned to the far edges/corners, well clear of the text
// column and the middle of the frame, so they read as soft color accents -
// not a wash that hides the photo behind them.
const blobs = [
  { color: "#0ea5e9", top: "-6%", left: "78%", size: 15, duration: 16, delay: 0 }, // sky
  { color: "#8b5cf6", top: "70%", left: "88%", size: 13, duration: 20, delay: 1.5 }, // violet
  { color: "#f43f5e", top: "80%", left: "-6%", size: 12, duration: 18, delay: 0.8 }, // rose
  { color: "#f59e0b", top: "-8%", left: "6%", size: 11, duration: 15, delay: 2.2 }, // amber
];

export function ColorAura({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="aura-blob absolute rounded-full opacity-20 blur-3xl"
          style={{
            background: b.color,
            top: b.top,
            left: b.left,
            width: `${b.size}rem`,
            height: `${b.size}rem`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -24, 18, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

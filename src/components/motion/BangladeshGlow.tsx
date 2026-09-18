"use client";

import { motion } from "framer-motion";

// A soft, animated nod to the Bangladesh flag (deep green field, red disc) -
// used as a subtle background accent, not a literal flag graphic.
export function BangladeshGlow({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="aura-blob absolute -top-24 right-[-10%] h-[28rem] w-[28rem] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "#006A4E" }}
        animate={{ scale: [1, 1.12, 1], x: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="aura-blob absolute -top-10 right-[6%] h-40 w-40 rounded-full opacity-[0.18] blur-2xl"
        style={{ background: "#F42A41" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.14, 0.22, 0.14] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const word = {
  hidden: { opacity: 0, y: 22, rotateX: -40 },
  show: { opacity: 1, y: 0, rotateX: 0 },
};

export type HeadlineSegment = { text: string; gradient?: boolean };

/**
 * Splits each segment's text into words and reveals them one by one, in
 * order across all segments. Segments marked `gradient` render with the
 * brand gradient - use this (not string matching) to control exactly which
 * words are highlighted, even if a word repeats elsewhere in the headline.
 */
export function AnimatedHeadline({
  segments,
  className,
}: {
  segments: HeadlineSegment[];
  className?: string;
}) {
  return (
    <motion.h1
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
      style={{ perspective: 600 }}
    >
      {segments.flatMap((segment, segIndex) => {
        const words = segment.text.split(" ");
        return words.map((w, i) => (
          <motion.span
            key={`${segIndex}-${i}-${w}`}
            variants={word}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={`inline-block ${segment.gradient ? "brand-gradient-text" : ""}`}
            style={{ transformOrigin: "bottom" }}
          >
            {w}
            {!(segIndex === segments.length - 1 && i === words.length - 1) ? " " : ""}
          </motion.span>
        ));
      })}
    </motion.h1>
  );
}

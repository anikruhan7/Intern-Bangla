"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// Real, freely-licensed photos of students studying, collaborating, and
// video-calling - a mix of Bangladeshi/South Asian and international scenes,
// matching this being a virtual internship platform. All sourced from
// Unsplash under the Unsplash License (free for commercial use, no
// attribution required) - never Pinterest or other re-sharing sites where
// the original photographer and license are unclear. See /legal/credits.
const images = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
  "https://images.unsplash.com/photo-1525130413817-d45c1d127c42",
  "https://images.unsplash.com/photo-1655337690727-5224680c8c07",
  "https://images.unsplash.com/photo-1603201667141-5a2d4c673378",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
  "https://images.unsplash.com/photo-1758270705518-b61b40527e76",
  "https://images.unsplash.com/photo-1758270705317-3ef6142d306f",
  "https://images.unsplash.com/photo-1758691737124-05c5bffe46f0",
  "https://images.unsplash.com/photo-1758270705290-62b6294dd044",
  "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98",
];

const INTERVAL_MS = 6000;

export function BackgroundSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.6, ease: "easeInOut" }, scale: { duration: INTERVAL_MS / 1000 + 1.6, ease: "linear" } }}
          className="absolute inset-0"
        >
          <Image
            src={`${images[index]}?auto=format&fit=crop&w=2560&q=80`}
            alt=""
            fill
            priority={index === 0}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      {/* Directional scrim: near-opaque over the text column, fading out
          toward the image so its real color still shows through in both
          themes instead of a flat wash bleaching everything out. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, var(--background) 8%, color-mix(in srgb, var(--background) 82%, transparent) 38%, color-mix(in srgb, var(--background) 40%, transparent) 70%, color-mix(in srgb, var(--background) 18%, transparent) 100%)",
        }}
      />
      {/* Soft light sweep across the photo - a standalone absolutely-sized
          layer (not the shared .shimmer-sweep class, which sets
          position:relative and would collapse this element's height when
          combined with the `absolute inset-0` sizing above it needs). */}
      <div
        className="absolute inset-y-0 left-0 w-2/5 animate-[shimmer-sweep_5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ animationDelay: "1.2s" }}
      />
    </div>
  );
}

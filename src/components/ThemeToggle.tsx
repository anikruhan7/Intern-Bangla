"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the DOM, set by the inline theme script before hydration
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // ignore storage errors (private browsing, etc.)
    }
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9, rotate: 15 }}
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border text-foreground transition-colors hover:border-primary/50 hover:text-primary"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ y: -12, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 12, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

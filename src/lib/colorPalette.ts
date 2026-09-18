// A wide, varied accent palette (not just the brand gradient) used to give
// list items - domain cards, feature cards, etc. - distinct personality.
// Cycle through this array by index so repeated renders stay stable.
export const colorPalette = [
  { bg: "bg-sky-500/15", text: "text-sky-600 dark:text-sky-400", solid: "bg-sky-500" }, // sky blue
  { bg: "bg-orange-500/15", text: "text-orange-600 dark:text-orange-400", solid: "bg-orange-500" }, // orange
  { bg: "bg-rose-800/15", text: "text-rose-800 dark:text-rose-400", solid: "bg-rose-800" }, // maroon
  { bg: "bg-amber-800/15", text: "text-amber-800 dark:text-amber-500", solid: "bg-amber-800" }, // chocolate
  { bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-400", solid: "bg-emerald-500" }, // green
  { bg: "bg-violet-500/15", text: "text-violet-600 dark:text-violet-400", solid: "bg-violet-500" }, // violet
  { bg: "bg-cyan-500/15", text: "text-cyan-600 dark:text-cyan-400", solid: "bg-cyan-500" }, // cyan
  { bg: "bg-pink-500/15", text: "text-pink-600 dark:text-pink-400", solid: "bg-pink-500" }, // pink
];

export function paletteAt(index: number) {
  return colorPalette[index % colorPalette.length];
}

// Lightweight way for any component (e.g. the navbar) to open the Tommy
// widget, which lives independently in the root layout - avoids wiring a
// global context just for one open/close signal.
export const OPEN_TOMMY_EVENT = "open-tommy";

export function openTommy() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPEN_TOMMY_EVENT));
  }
}

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, ExternalLink, Mic, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OPEN_TOMMY_EVENT } from "@/lib/tommyEvents";

type ChatMessage = {
  role: "user" | "tommy";
  text: string;
  sources?: { label: string; url: string }[];
};

const GREETING: ChatMessage = {
  role: "tommy",
  text: "Hi, I'm Tommy! I can guide you through Intern Bangla, search our own published pages, or look things up on Wikipedia. What do you need help with?",
};

const WAKE_PATTERN = /^\s*(hey|hi|hello)[,!]?\s*tommy[.,!]?\s*/i;

// Preferred female voice names across Chrome/Edge/Safari/Firefox - browsers
// expose different voice sets, so we check a priority list rather than one name.
const FEMALE_VOICE_HINTS = [
  "samantha", "victoria", "zira", "susan", "karen", "moira", "tessa", "fiona",
  "ava", "allison", "joanna", "female", "google us english",
];

function pickFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const english = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const pool = english.length > 0 ? english : voices;
  for (const hint of FEMALE_VOICE_HINTS) {
    const match = pool.find((v) => v.name.toLowerCase().includes(hint));
    if (match) return match;
  }
  return pool[0] ?? null;
}

// Minimal shape of the (non-standard, vendor-prefixed) Web Speech Recognition
// API - not in TypeScript's default DOM lib.
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult:
    | ((e: { results: { [i: number]: { [j: number]: { transcript: string } }; length: number } }) => void)
    | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export function TommyWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceSupported, setVoiceSupported] = useState({ speak: false, listen: false });
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Lets the navbar's "Tommy" button (or anything else) open the widget from
  // anywhere on the site - there is no persistent floating bubble anymore.
  useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }
    window.addEventListener(OPEN_TOMMY_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_TOMMY_EVENT, handleOpen);
  }, []);

  // Feature-detect voice APIs and warm up the voices list (loads async in
  // most browsers, hence the voiceschanged listener).
  useEffect(() => {
    const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
    const canListen =
      typeof window !== "undefined" &&
      Boolean((window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time browser feature detection on mount
    setVoiceSupported({ speak: canSpeak, listen: canListen });

    if (canSpeak) {
      const loadVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!voiceEnabled || !voiceSupported.speak) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = pickFemaleVoice(voicesRef.current);
        if (voice) utterance.voice = voice;
        utterance.pitch = 1.05;
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
      } catch {
        // speech synthesis can throw in some locked-down browser contexts - ignore
      }
    },
    [voiceEnabled, voiceSupported.speak],
  );

  const sendQuestion = useCallback(
    async (question: string, priorMessages: ChatMessage[]) => {
      setMessages((m) => [...m, { role: "user", text: question }]);
      setLoading(true);
      try {
        const history = priorMessages
          .filter((m) => m !== GREETING)
          .map((m) => ({ role: m.role, text: m.text }));

        const res = await api.post<{ answer: string; sources: { label: string; url: string }[] }>(
          "/tommy/ask",
          { question, history },
        );
        setMessages((m) => [...m, { role: "tommy", text: res.answer, sources: res.sources }]);
        speak(res.answer);
      } catch (err) {
        const text = err instanceof ApiError ? err.message : "Sorry, I couldn't reach the server just now. Try again in a moment.";
        setMessages((m) => [...m, { role: "tommy", text }]);
        speak(text);
      } finally {
        setLoading(false);
      }
    },
    [speak],
  );

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;
    setInput("");
    await sendQuestion(question, messages);
  }

  function toggleListening() {
    if (!voiceSupported.listen) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1]?.[0]?.transcript ?? "";
      const wakeMatch = transcript.match(WAKE_PATTERN);

      if (wakeMatch) {
        const rest = transcript.slice(wakeMatch[0].length).trim();
        if (rest) {
          // "Hey Tommy, how do I register?" - wake phrase + question in one go.
          setMessages((prev) => {
            sendQuestion(rest, prev);
            return prev;
          });
        } else {
          // Just "Hey Tommy" - greet back and wait for the real question.
          speak("Yes, how can I help you?");
          setMessages((m) => [...m, { role: "tommy", text: "Yes, how can I help you?" }]);
        }
      } else if (transcript.trim()) {
        setMessages((prev) => {
          sendQuestion(transcript.trim(), prev);
          return prev;
        });
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
    <div className="pointer-events-none absolute bottom-5 right-5 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="glass-panel pointer-events-auto flex h-[32rem] w-[22rem] flex-col overflow-hidden rounded-2xl border shadow-2xl sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3 brand-gradient-bg">
              <div className="flex items-center gap-2 text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                  <Bot size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-none">Tommy</p>
                  <p className="text-[11px] leading-none text-white/80">Intern Bangla Guide</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {voiceSupported.speak && (
                  <button
                    onClick={() => setVoiceEnabled((v) => !v)}
                    aria-label={voiceEnabled ? "Mute Tommy's voice" : "Unmute Tommy's voice"}
                    className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Minimize"
                  className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-background/60 px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                      m.role === "user" ? "brand-gradient-bg text-white" : "bg-muted text-foreground",
                    )}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 flex flex-col gap-1 border-t border-border/50 pt-2">
                        {m.sources.map((s) => (
                          <a
                            key={s.url}
                            href={s.url}
                            target={s.url.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <ExternalLink size={11} /> {s.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }}>
                      Tommy is thinking&hellip;
                    </motion.span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
              {voiceSupported.listen && (
                <motion.button
                  type="button"
                  onClick={toggleListening}
                  whileTap={{ scale: 0.9 }}
                  aria-label={listening ? "Stop listening" : "Speak to Tommy"}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                    listening
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border text-muted-foreground hover:text-primary",
                  )}
                >
                  {listening ? (
                    <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.9, repeat: Infinity }}>
                      <Mic size={15} />
                    </motion.span>
                  ) : (
                    <Mic size={15} />
                  )}
                </motion.button>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? "Listening... say \"Hey Tommy\"" : "Ask Tommy anything..."}
                className="flex-1 rounded-full border border-border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="submit" size="icon" variant="gradient" disabled={loading || !input.trim()}>
                <Send size={15} />
              </Button>
            </form>
            <p className="px-3 pb-2 text-center text-[10px] text-muted-foreground">
              Grounded in Intern Bangla content + Wikipedia. See{" "}
              <Link href="/legal/credits" className="underline">Credits</Link>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}

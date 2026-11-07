"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Feather,
  Hash,
  AtSign,
  Quote as QuoteIcon,
  Sparkles,
  Sun,
  Flame,
} from "lucide-react";

// Curated Educational & Literary Quotes
const QUOTE_LIST = [
  {
    text: "There were a king with a large jaw and a queen with a plain face, on the throne of England; there were a king with a large jaw and a queen with a fair face, on the throne of France.",
    author: "Charles Dickens",
    source: "A Tale of Two Cities",
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world. The function of education is to teach one to think intensively and to think critically.",
    author: "Nelson Mandela",
    source: "Pedagogical Reflections",
  },
  {
    text: "Technology will not replace great teachers, but technology in the hands of great teachers can be transformational in elementary education.",
    author: "George Couros",
    source: "The Innovator's Mindset",
  },
  {
    text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
    source: "Pedagogy Maxim",
  },
];

// Teaching & Elementary Education vocabulary word bank
const BASE_WORDS = [
  "education", "teacher", "student", "classroom", "learning", "pedagogy",
  "elementary", "school", "inspire", "reading", "lesson", "knowledge",
  "curriculum", "scholar", "growth", "future", "develop", "creative",
  "inclusive", "digital", "practice", "method", "wisdom", "explore"
];

const NUMBER_WORDS = ["grade 2", "year 2026", "room 101", "step 1", "level 3", "unit 4", "100 percent", "top 5"];
const PUNCTUATED_WORDS = ["\"teach!\"", "learning,", "curriculum;", "student's", "grow?", "inspire—", "read..."];

// Mechanical Switch Themes (Color schemes changing when switch is clicked)
const SWITCH_THEMES = {
  "Black Ink": {
    name: "Stealth Cyber Black",
    desc: "Linear 60g • Deep Acoustic Thock",
    chassisBg: "bg-[#090d16]",
    chassisBorder: "border-[#1e293b]",
    plateBg: "bg-[#0d131f]",
    keyAlphas: "bg-[#1e2638] text-white border-b-2 sm:border-b-4 border-[#0a0f17] hover:bg-[#253046]",
    keyModifiers: "bg-[#111726] text-slate-300 border-b-2 sm:border-b-4 border-[#070b13] hover:bg-[#192236]",
    keyAccent: "bg-[#ea580c] text-white border-b-2 sm:border-b-4 border-[#9a3412] hover:bg-[#f97316]",
    rgbHalo: "from-orange-500/50 via-red-500/40 to-purple-600/50",
    activeGlow: "shadow-[0_0_24px_rgba(234,88,12,0.95)] ring-2 ring-orange-400",
  },
  "Brown": {
    name: "Vintage Sepia & Coffee",
    desc: "Tactile 55g • Gentle Bump Sound",
    chassisBg: "bg-[#27150c]",
    chassisBorder: "border-[#4a2411]",
    plateBg: "bg-[#180c06]",
    keyAlphas: "bg-[#fef3c7] text-[#451a03] font-black border-b-2 sm:border-b-4 border-[#b45309] hover:bg-[#fffbeb]",
    keyModifiers: "bg-[#451a03] text-[#fef3c7] border-b-2 sm:border-b-4 border-[#1f0b02] hover:bg-[#5c2406]",
    keyAccent: "bg-[#d97706] text-white border-b-2 sm:border-b-4 border-[#92400e] hover:bg-[#f59e0b]",
    rgbHalo: "from-amber-500/50 via-yellow-500/40 to-orange-600/50",
    activeGlow: "shadow-[0_0_24px_rgba(245,158,11,0.95)] ring-2 ring-amber-300",
  },
  "Blue": {
    name: "Arctic Neon Cyber Blue",
    desc: "Clicky 50g • Crisp Snap Sound",
    chassisBg: "bg-[#041c33]",
    chassisBorder: "border-[#0284c7]",
    plateBg: "bg-[#021324]",
    keyAlphas: "bg-[#e0f2fe] text-[#0369a1] font-black border-b-2 sm:border-b-4 border-[#38bdf8] hover:bg-white",
    keyModifiers: "bg-[#0284c7] text-white border-b-2 sm:border-b-4 border-[#0369a1] hover:bg-[#0ea5e9]",
    keyAccent: "bg-[#06b6d4] text-white border-b-2 sm:border-b-4 border-[#0891b2] hover:bg-[#22d3ee]",
    rgbHalo: "from-cyan-400/60 via-blue-500/50 to-indigo-600/60",
    activeGlow: "shadow-[0_0_24px_rgba(6,182,212,0.95)] ring-2 ring-cyan-300",
  },
};

export default function TypingTestKeyboard() {
  // Mode States
  const [activeMode, setActiveMode] = useState<"quote" | "words" | "zen">("quote");
  const [withPunctuation, setWithPunctuation] = useState(false);
  const [withNumbers, setWithNumbers] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Switch Sound Settings & Theme
  const [switchType, setSwitchType] = useState<"Black Ink" | "Brown" | "Blue">("Black Ink");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [rgbEnabled, setRgbEnabled] = useState(true);

  // Typing State
  const [customWordsText, setCustomWordsText] = useState("");
  const [zenTypedText, setZenTypedText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [totalClaks, setTotalClaks] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentTheme = SWITCH_THEMES[switchType];

  // Generate target text based on active mode & options
  const generateWordsSequence = useCallback((punct: boolean, nums: boolean) => {
    let pool = [...BASE_WORDS];
    if (nums) pool = [...pool, ...NUMBER_WORDS];
    if (punct) pool = [...pool, ...PUNCTUATED_WORDS];
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 20);
    return shuffled.join(" ");
  }, []);

  // Compute active target text
  const targetText = useMemo(() => {
    if (activeMode === "quote") {
      let q = QUOTE_LIST[quoteIndex].text;
      if (!withPunctuation) {
        q = q.replace(/[;,\.?!—"]/g, "");
      }
      if (withNumbers) {
        q = q + " In 2026, 100% of students thrive.";
      }
      return q;
    }
    if (activeMode === "words") {
      return customWordsText || generateWordsSequence(withPunctuation, withNumbers);
    }
    return "";
  }, [activeMode, quoteIndex, withPunctuation, withNumbers, customWordsText, generateWordsSequence]);

  // Audio synthesis for Black Ink, Brown, and Blue mechanical switches
  const playSwitchSound = useCallback((sw: "Black Ink" | "Brown" | "Blue") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (sw === "Black Ink") {
        // Deep linear "thock": Low resonant pulse with quick dampening
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.05);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      } else if (sw === "Brown") {
        // Tactile bump: Dual pulse middle frequency
        osc.type = "triangle";
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.038);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);
      } else {
        // Blue clicky: Crisp, high-frequency snap
        osc.type = "triangle";
        osc.frequency.setValueAtTime(2600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch {
      // AudioContext requires interaction
    }
  }, [soundEnabled]);

  // Handle Switch Selection & Play Preview Click
  const handleSelectSwitch = (sw: "Black Ink" | "Brown" | "Blue") => {
    setSwitchType(sw);
    playSwitchSound(sw);
  };

  // Reset Progress
  const resetTest = useCallback(() => {
    setTypedText("");
    setZenTypedText("");
    setStartTime(null);
    setWpm(0);
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Mode Selection Handlers
  const handleSelectQuoteMode = () => {
    setActiveMode("quote");
    resetTest();
  };

  const handleSelectWordsMode = () => {
    setActiveMode("words");
    setCustomWordsText(generateWordsSequence(withPunctuation, withNumbers));
    resetTest();
  };

  const handleSelectZenMode = () => {
    setActiveMode("zen");
    resetTest();
  };

  const handleTogglePunctuation = () => {
    const next = !withPunctuation;
    setWithPunctuation(next);
    if (activeMode === "words") {
      setCustomWordsText(generateWordsSequence(next, withNumbers));
    }
    resetTest();
  };

  const handleToggleNumbers = () => {
    const next = !withNumbers;
    setWithNumbers(next);
    if (activeMode === "words") {
      setCustomWordsText(generateWordsSequence(withPunctuation, next));
    }
    resetTest();
  };

  // Central Key Hit Handler
  const handleKeyHit = useCallback(
    (key: string) => {
      playSwitchSound(switchType);
      setActiveKey(key);
      setTotalClaks((prev) => prev + 1);

      if (!startTime) {
        setStartTime(Date.now());
      }

      if (activeMode === "zen") {
        if (key === "Backspace") {
          setZenTypedText((prev) => prev.slice(0, -1));
        } else if (key.length === 1) {
          setZenTypedText((prev) => prev + key);
        }
      } else {
        if (key === "Backspace") {
          setTypedText((prev) => prev.slice(0, -1));
        } else if (key === "Tab") {
          resetTest();
        } else if (key.length === 1) {
          setTypedText((prev) => {
            if (prev.length < targetText.length) {
              const next = prev + key;
              if (startTime) {
                const minutes = (Date.now() - startTime) / 60000;
                if (minutes > 0.03) {
                  const words = next.length / 5;
                  setWpm(Math.round(words / minutes));
                }
              }
              return next;
            }
            return prev;
          });
        }
      }

      setTimeout(() => {
        setActiveKey(null);
      }, 130);
    },
    [activeMode, playSwitchSound, resetTest, startTime, switchType, targetText]
  );

  // Global window key listener + hidden input keep-alive
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement &&
        e.target !== inputRef.current
      ) {
        return;
      }
      if (e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        handleKeyHit("Tab");
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleKeyHit("Backspace");
      } else if (e.key === "Escape") {
        e.preventDefault();
        resetTest();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handleKeyHit(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyHit, resetTest]);

  // Click on-screen keycap handler
  const handleKeycapClick = (k: string) => {
    if (activeMode === "zen") {
      handleKeyHit(k.toLowerCase());
      return;
    }
    const expected = targetText[typedText.length];
    if (expected && expected.toUpperCase() === k.toUpperCase() && expected === expected.toUpperCase()) {
      handleKeyHit(k.toUpperCase());
    } else {
      handleKeyHit(k.toLowerCase());
    }
    inputRef.current?.focus({ preventScroll: true });
  };

  // Accuracy calculation
  const correctCount = typedText
    .split("")
    .filter((char, i) => char === targetText[i]).length;
  const accuracy =
    typedText.length > 0 ? Math.round((correctCount / typedText.length) * 100) : 100;

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % QUOTE_LIST.length);
    resetTest();
  };

  return (
    <section className="py-20 relative bg-transparent border-t border-slate-200 overflow-hidden">
      {/* Hidden input to guarantee keyboard typing always registers without causing viewport jumps */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 pointer-events-none fixed top-0 left-0 w-1 h-1 -z-50"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
      >
        {/* Top Header & Statistics Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 text-xs text-slate-500 font-mono">
          {/* Stats on Left */}
          <div className="flex items-center gap-3">
            {activeMode === "zen" ? (
              <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <Feather className="w-4 h-4 text-orange-600" />
                <span>Zen Mode ({zenTypedText.length} chars)</span>
              </span>
            ) : (
              <>
                <span className="text-sm font-extrabold text-slate-800">
                  {typedText.length}/{targetText.length}
                </span>
                <span className="text-sm font-extrabold text-slate-800">
                  ACC{" "}
                  <span className={accuracy < 90 ? "text-rose-500" : "text-emerald-600"}>
                    {accuracy}%
                  </span>
                </span>
                {wpm > 0 && (
                  <span className="text-sm font-extrabold text-indigo-600">
                    {wpm} WPM
                  </span>
                )}
              </>
            )}
          </div>

          {/* Interactive Mode & Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {/* @ Punctuation Toggle */}
            <button
              onClick={handleTogglePunctuation}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                withPunctuation
                  ? "bg-orange-500 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Toggle Punctuation"
            >
              <AtSign className="w-3 h-3" />
              <span>punctuation</span>
            </button>

            {/* # Numbers Toggle */}
            <button
              onClick={handleToggleNumbers}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                withNumbers
                  ? "bg-orange-500 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Toggle Numbers"
            >
              <Hash className="w-3 h-3" />
              <span>numbers</span>
            </button>

            {/* 99 Quote Mode Button */}
            <button
              onClick={handleSelectQuoteMode}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeMode === "quote"
                  ? "bg-orange-100 text-orange-800 border border-orange-300 shadow-2xs font-extrabold"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Quote Mode"
            >
              <QuoteIcon className="w-3 h-3" />
              <span>quote</span>
            </button>

            {/* Aa Words Mode Button */}
            <button
              onClick={handleSelectWordsMode}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeMode === "words"
                  ? "bg-orange-100 text-orange-800 border border-orange-300 shadow-2xs font-extrabold"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Words Practice Mode"
            >
              <span>Aa words</span>
            </button>

            {/* Zen Free-Typing Mode Button */}
            <button
              onClick={handleSelectZenMode}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeMode === "zen"
                  ? "bg-orange-500 text-white shadow-xs font-extrabold"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Zen Free-typing Mode"
            >
              <Feather className="w-3 h-3" />
              <span>zen</span>
            </button>
          </div>

          {/* Restart Button */}
          <button
            onClick={resetTest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart test</span>
          </button>
        </div>

        {/* Text Display Card */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xs border border-slate-200/90 shadow-sm mb-6 text-center">
          {activeMode === "zen" ? (
            <div className="min-h-[100px] flex flex-col items-center justify-center">
              <p className="text-xs font-mono text-slate-400 mb-2">
                Type freely on your keyboard below to test keystrokes and switch sound:
              </p>
              <div className="text-xl sm:text-2xl text-slate-800 font-medium font-sans max-w-3xl whitespace-pre-wrap">
                {zenTypedText || (
                  <span className="text-slate-300 italic">
                    Start typing anywhere on your keyboard...
                  </span>
                )}
                <span className="inline-block w-2 h-5 bg-orange-500 ml-1 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="text-lg sm:text-2xl md:text-3xl font-medium tracking-tight leading-relaxed max-w-4xl mx-auto font-sans select-none min-h-[100px] flex flex-wrap items-center justify-center">
              {targetText.split("").map((char, index) => {
                let color = "text-slate-300"; // not typed yet
                let isCurrent = index === typedText.length;

                if (index < typedText.length) {
                  if (typedText[index] === char) {
                    color = "text-emerald-500 font-black drop-shadow-xs";
                  } else {
                    color = "text-rose-600 bg-rose-100 px-0.5 rounded-xs font-bold";
                  }
                }

                return (
                  <span
                    key={index}
                    className={`relative ${color} ${
                      isCurrent ? "border-b-2 border-orange-500 animate-pulse" : ""
                    }`}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                );
              })}
            </div>
          )}

          {activeMode === "quote" && (
            <div className="mt-4 text-xs text-slate-400 font-medium flex items-center justify-center gap-3">
              <span>
                {QUOTE_LIST[quoteIndex].author} • {QUOTE_LIST[quoteIndex].source}
              </span>
              <span>•</span>
              <button
                onClick={handleNextQuote}
                className="text-orange-600 font-bold hover:underline cursor-pointer"
              >
                Next Quote &rarr;
              </button>
            </div>
          )}

          <div className="mt-2 text-[11px] text-slate-400">
            <span>Click card to type • Tab restart • {totalClaks} claks typed</span>
          </div>
        </div>

        {/* Realistic Mechanical Keyboard Layout with Dynamic Theme Colors & RGB Underglow */}
        <div className="relative max-w-4xl mx-auto select-none isolate">
          {/* Mobile swipe helper hint */}
          <div className="sm:hidden text-center text-[11px] text-slate-400 mb-2">
            ⇄ Swipe horizontally to access the complete keyboard layout
          </div>

          <div className="overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="min-w-[560px] sm:min-w-0 relative">
              {/* RGB Underglow Halo Animation (Around the Chassis) */}
              {rgbEnabled && (
                <>
                  {/* Outer 360-degree Chroma Aura */}
                  <div className="absolute -inset-4 sm:-inset-6 rounded-[3.2rem] rgb-underglow blur-2xl opacity-90 -z-10 pointer-events-none transition-opacity duration-500 rgb-active-pulse" />
                  {/* Edge Diffused Backlight */}
                  <div className="absolute -inset-1.5 sm:-inset-2 rounded-[2.8rem] rgb-underglow blur-md opacity-80 -z-10 pointer-events-none transition-opacity duration-500" />
                </>
              )}

              {/* Keyboard Chassis with Dynamic Theme Color */}
              <div
                className={`relative p-4 sm:p-6 rounded-[2.5rem] border-4 shadow-2xl transition-all duration-500 overflow-hidden ${currentTheme.chassisBg} ${currentTheme.chassisBorder}`}
              >
            {/* Top Bezel Glowing RGB Light Strip - fixed layout height so keys never shift */}
            <div
              className={`relative z-10 w-full mb-3 px-2 sm:px-4 transition-opacity duration-300 ${
                rgbEnabled ? "opacity-95" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="h-1.5 sm:h-2 w-full rounded-full rgb-underglow shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            </div>

            {/* Inner Backplate RGB Backlight Diffuser - radiates between keycaps */}
            {rgbEnabled && (
              <div className="absolute inset-3 sm:inset-5 rounded-[2rem] rgb-underglow blur-xs sm:blur-sm opacity-65 pointer-events-none z-0" />
            )}

            <div className="relative z-10 flex flex-col gap-1.5 sm:gap-2">
              {/* Top Function / Number Row */}
              <div className="flex gap-1 sm:gap-1.5 justify-center">
                <Keycap
                  label="esc"
                  customClass={currentTheme.keyAccent}
                  active={activeKey === "Escape"}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => resetTest()}
                />
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="].map((k) => (
                  <Keycap
                    key={k}
                    label={k}
                    customClass={currentTheme.keyAlphas}
                    active={activeKey === k}
                    activeGlow={currentTheme.activeGlow}
                    onClick={() => handleKeyHit(k)}
                  />
                ))}
                <Keycap
                  label="del"
                  customClass={currentTheme.keyModifiers}
                  active={activeKey === "Backspace"}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => handleKeyHit("Backspace")}
                  width="w-12 sm:w-14"
                />
              </div>

              {/* QWERTY Row */}
              <div className="flex gap-1 sm:gap-1.5 justify-center">
                <Keycap
                  label="tab"
                  customClass={currentTheme.keyModifiers}
                  active={activeKey === "Tab"}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => handleKeyHit("Tab")}
                  width="w-10 sm:w-12"
                />
                {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]"].map((k) => (
                  <Keycap
                    key={k}
                    label={k}
                    customClass={currentTheme.keyAlphas}
                    active={activeKey?.toUpperCase() === k}
                    activeGlow={currentTheme.activeGlow}
                    onClick={() => handleKeycapClick(k)}
                  />
                ))}
                <Keycap
                  label="\"
                  customClass={currentTheme.keyModifiers}
                  active={activeKey === "\\"}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => handleKeyHit("\\")}
                  width="w-10 sm:w-12"
                />
              </div>

              {/* Home Row */}
              <div className="flex gap-1 sm:gap-1.5 justify-center">
                <Keycap
                  label="caps"
                  customClass={currentTheme.keyModifiers}
                  active={activeKey === "CapsLock"}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => handleKeyHit("CapsLock")}
                  width="w-12 sm:w-16"
                />
                {["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"].map((k) => (
                  <Keycap
                    key={k}
                    label={k}
                    customClass={currentTheme.keyAlphas}
                    active={activeKey?.toUpperCase() === k}
                    activeGlow={currentTheme.activeGlow}
                    onClick={() => handleKeycapClick(k)}
                  />
                ))}
                <Keycap
                  label="return"
                  customClass={currentTheme.keyAccent}
                  active={activeKey === "Enter"}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => handleKeyHit("Enter")}
                  width="w-14 sm:w-20"
                />
              </div>

              {/* Shift Row */}
              <div className="flex gap-1 sm:gap-1.5 justify-center">
                <Keycap
                  label="shift"
                  customClass={currentTheme.keyModifiers}
                  active={activeKey === "Shift"}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => handleKeyHit("Shift")}
                  width="w-16 sm:w-20"
                />
                {["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"].map((k) => (
                  <Keycap
                    key={k}
                    label={k}
                    customClass={currentTheme.keyAlphas}
                    active={activeKey?.toUpperCase() === k}
                    activeGlow={currentTheme.activeGlow}
                    onClick={() => handleKeycapClick(k)}
                  />
                ))}
                <Keycap
                  label="shift"
                  customClass={currentTheme.keyModifiers}
                  active={activeKey === "Shift"}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => handleKeyHit("Shift")}
                  width="w-16 sm:w-20"
                />
              </div>

              {/* Spacebar Row */}
              <div className="flex gap-1 sm:gap-1.5 justify-center">
                <Keycap
                  label="ctrl"
                  customClass={currentTheme.keyModifiers}
                  active={activeKey === "Control"}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => handleKeyHit("Control")}
                  width="w-10 sm:w-12"
                />
                <Keycap
                  label="opt"
                  customClass={currentTheme.keyModifiers}
                  active={activeKey === "Alt"}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => handleKeyHit("Alt")}
                  width="w-10 sm:w-12"
                />
                <Keycap
                  label="cmd"
                  customClass={currentTheme.keyModifiers}
                  active={activeKey === "Meta"}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => handleKeyHit("Meta")}
                  width="w-12 sm:w-14"
                />
                <Keycap
                  label=""
                  customClass={currentTheme.keyAlphas}
                  active={activeKey === " "}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => handleKeyHit(" ")}
                  width="w-48 sm:w-64 md:w-80"
                />
                <Keycap
                  label="cmd"
                  customClass={currentTheme.keyModifiers}
                  active={activeKey === "Meta"}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => handleKeyHit("Meta")}
                  width="w-12 sm:w-14"
                />
                <Keycap
                  label="opt"
                  customClass={currentTheme.keyModifiers}
                  active={activeKey === "Alt"}
                  activeGlow={currentTheme.activeGlow}
                  onClick={() => handleKeyHit("Alt")}
                  width="w-10 sm:w-12"
                />
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>

        {/* Bottom Switch Selection Bar with RGB Controls */}
        <div className="mt-6 flex flex-col items-center gap-3 text-xs">
          {/* Main Controls Row: Switch Selector + RGB Toggle + Sound (Always centered in 1 steady row) */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Interactive Mechanical Switch Selector (Changes Keyboard Color & Sound) */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="text-slate-500 font-bold mr-1">Switch:</span>
              {(["Black Ink", "Brown", "Blue"] as const).map((sw) => {
                const isSelected = switchType === sw;
                let activeBadge = "bg-[#090d16] text-orange-400 ring-2 ring-orange-500 shadow-md";
                if (sw === "Brown") {
                  activeBadge = "bg-[#3d1a09] text-amber-200 ring-2 ring-amber-600 shadow-md";
                } else if (sw === "Blue") {
                  activeBadge = "bg-[#0284c7] text-white ring-2 ring-cyan-400 shadow-md";
                }

                return (
                  <button
                    key={sw}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelectSwitch(sw);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? `${activeBadge} scale-105`
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {sw}
                  </button>
                );
              })}
            </div>

            {/* RGB Lights Toggle Button with Chroma Indicator */}
            <button
              type="button"
              onClick={() => setRgbEnabled(!rgbEnabled)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all cursor-pointer font-bold shadow-xs ${
                rgbEnabled
                  ? "bg-slate-950 text-white border-slate-800 ring-2 ring-purple-500/50 shadow-md"
                  : "bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
              title="Toggle RGB Chroma Lights"
            >
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  rgbEnabled ? "rgb-underglow animate-spin" : "bg-slate-300"
                }`}
              />
              <Sparkles className={`w-3.5 h-3.5 ${rgbEnabled ? "text-amber-300" : "text-slate-400"}`} />
              <span>{rgbEnabled ? "RGB Lights: ON" : "RGB Lights: OFF"}</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer shadow-xs"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sound Off</span>
                </>
              )}
            </button>
          </div>

          {/* Fixed-height Theme status badge: always centered below, never pushes or wraps buttons */}
          <div className="h-5 flex items-center justify-center gap-2 text-slate-500 font-medium select-none">
            <span className="font-extrabold text-slate-800">Theme: {currentTheme.name}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{currentTheme.desc}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Keycap Subcomponent with physical key press styling and RGB glow
function Keycap({
  label,
  customClass = "",
  active = false,
  activeGlow = "",
  onClick,
  width = "w-7 sm:w-9 md:w-10",
}: {
  label: string;
  customClass?: string;
  active?: boolean;
  activeGlow?: string;
  onClick?: () => void;
  width?: string;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.93, y: 2 }}
      animate={
        active
          ? { scale: 0.91, y: 3, filter: "brightness(1.4)" }
          : { scale: 1, y: 0, filter: "brightness(1)" }
      }
      transition={{ duration: 0.08 }}
      onClick={onClick}
      className={`relative h-7 sm:h-9 md:h-10 ${width} rounded-md sm:rounded-lg font-mono text-[9px] sm:text-[11px] font-bold flex items-center justify-center transition-all cursor-pointer select-none shadow-sm ${customClass} ${
        active ? `${activeGlow} z-30` : ""
      }`}
    >
      {label}
    </motion.button>
  );
}

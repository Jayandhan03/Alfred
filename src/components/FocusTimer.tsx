"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type TimerMode = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";
type TimerStatus = "IDLE" | "RUNNING" | "PAUSED" | "COMPLETE";

interface SessionRecord {
  date: string;
  completedAt: string;
  duration: number; // minutes
  mode: TimerMode;
}

interface FocusStats {
  totalSessions: number;
  todaySessions: number;
  totalMinutes: number;
  streak: number; // days in a row
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MODES: Record<TimerMode, { label: string; duration: number; color: string; bg: string; glow: string; subtitle: string }> = {
  FOCUS:       { label: "DEEP FOCUS",    duration: 25, color: "#00BFFF", bg: "rgba(0,191,255,0.07)",   glow: "0 0 40px rgba(0,191,255,0.35)",    subtitle: "COGNITIVE IMMERSION PROTOCOL" },
  SHORT_BREAK: { label: "SHORT BREAK",   duration: 5,  color: "#00FF88", bg: "rgba(0,255,136,0.07)",   glow: "0 0 40px rgba(0,255,136,0.3)",     subtitle: "RECOVERY CYCLE — STAGE I" },
  LONG_BREAK:  { label: "LONG BREAK",    duration: 15, color: "#FFB800", bg: "rgba(255,184,0,0.07)",   glow: "0 0 40px rgba(255,184,0,0.3)",     subtitle: "RECOVERY CYCLE — STAGE II" },
};

const STORAGE_KEY = "alfred_focus_sessions";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadSessions(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveSession(session: SessionRecord) {
  const sessions = loadSessions();
  sessions.unshift(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 100)));
}

function computeStats(sessions: SessionRecord[]): FocusStats {
  const today = todayKey();
  const todaySessions = sessions.filter((s) => s.date === today && s.mode === "FOCUS");
  const totalFocus = sessions.filter((s) => s.mode === "FOCUS");

  // streak: consecutive days with ≥1 focus session
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    const hasFocus = sessions.some((s) => s.date === key && s.mode === "FOCUS");
    if (!hasFocus) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }

  return {
    totalSessions: totalFocus.length,
    todaySessions: todaySessions.length,
    totalMinutes: totalFocus.reduce((a, s) => a + s.duration, 0),
    streak,
  };
}

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─── Circular Progress SVG ────────────────────────────────────────────────────

function CircularProgress({
  progress,
  color,
  timeStr,
  mode,
  status,
}: {
  progress: number; // 0–1
  color: string;
  timeStr: string;
  mode: TimerMode;
  status: TimerStatus;
}) {
  const R = 110;
  const C = 130;
  const circumference = 2 * Math.PI * R;
  const dashOffset = circumference * (1 - progress);

  return (
    <svg viewBox="0 0 260 260" style={{ width: "260px", height: "260px", overflow: "visible" }}>
      {/* Outer ring */}
      <circle cx={C} cy={C} r={R + 14} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={1} />

      {/* Tick marks */}
      {Array.from({ length: 60 }, (_, i) => {
        const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
        const inner = R + 18;
        const outer = R + 22 + (i % 5 === 0 ? 4 : 0);
        const x1 = C + inner * Math.cos(angle);
        const y1 = C + inner * Math.sin(angle);
        const x2 = C + outer * Math.cos(angle);
        const y2 = C + outer * Math.sin(angle);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color} strokeWidth={i % 5 === 0 ? 1.5 : 0.5}
            strokeOpacity={progress * 0.7 + 0.1}
          />
        );
      })}

      {/* Track */}
      <circle cx={C} cy={C} r={R} fill="none"
        stroke="rgba(255,255,255,0.05)" strokeWidth={10} />

      {/* Progress arc */}
      <motion.circle
        cx={C} cy={C} r={R}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${C} ${C})`}
        style={{ filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color}55)` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* Inner glow ring */}
      <circle cx={C} cy={C} r={R - 18} fill="none"
        stroke={color} strokeWidth={0.5} strokeOpacity={0.15} />

      {/* Timer text */}
      <text x={C} y={C - 8} textAnchor="middle"
        fill={color} fontSize="48" fontFamily="'Orbitron', monospace" fontWeight="900"
        style={{ filter: `drop-shadow(0 0 14px ${color})` }}>
        {timeStr}
      </text>

      {/* Mode label */}
      <text x={C} y={C + 18} textAnchor="middle"
        fill={color} fontSize="8" fontFamily="'Share Tech Mono', monospace"
        letterSpacing="4" fillOpacity={0.6}>
        {status === "COMPLETE" ? "SESSION COMPLETE" : MODES[mode].label}
      </text>

      {/* Status dot */}
      {status === "RUNNING" && (
        <motion.circle
          cx={C} cy={C + 36} r={4} fill={color}
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      )}
    </svg>
  );
}

// ─── Session Heatmap (last 7 days bar graph) ─────────────────────────────────

function SessionBars({ sessions }: { sessions: SessionRecord[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const label = ["SUN","MON","TUE","WED","THU","FRI","SAT"][d.getDay()];
    const count = sessions.filter((s) => s.date === key && s.mode === "FOCUS").length;
    return { label, count, key };
  });
  const max = Math.max(...days.map((d) => d.count), 1);

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: "60px" }}>
      {days.map(({ label, count }, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(count / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: "easeOut" }}
              style={{
                width: "100%",
                minHeight: count > 0 ? "4px" : "2px",
                background: count > 0
                  ? `linear-gradient(to top, #00BFFF, rgba(0,191,255,0.5))`
                  : "rgba(255,255,255,0.06)",
                boxShadow: count > 0 ? "0 0 8px rgba(0,191,255,0.5)" : "none",
                borderRadius: "2px 2px 0 0",
              }}
            />
          </div>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: "0.45rem",
            color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em",
          }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FocusTimer() {
  const [mode, setMode] = useState<TimerMode>("FOCUS");
  const [status, setStatus] = useState<TimerStatus>("IDLE");
  const [secondsLeft, setSecondsLeft] = useState(MODES["FOCUS"].duration * 60);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [stats, setStats] = useState<FocusStats>({ totalSessions: 0, todaySessions: 0, totalMinutes: 0, streak: 0 });
  const [customMinutes, setCustomMinutes] = useState<number | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = (customMinutes ?? MODES[mode].duration) * 60;
  const progress = 1 - secondsLeft / totalSeconds;
  const cfg = MODES[mode];

  // Load sessions on mount
  useEffect(() => {
    const s = loadSessions();
    setSessions(s);
    setStats(computeStats(s));
  }, []);

  // Timer tick
  useEffect(() => {
    if (status === "RUNNING") {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleComplete = useCallback(() => {
    setStatus("COMPLETE");
    setShowComplete(true);
    const record: SessionRecord = {
      date: todayKey(),
      completedAt: new Date().toLocaleTimeString("en-US", { hour12: false }),
      duration: customMinutes ?? MODES[mode].duration,
      mode,
    };
    saveSession(record);
    const s = loadSessions();
    setSessions(s);
    setStats(computeStats(s));
    setTimeout(() => setShowComplete(false), 3000);
  }, [mode, customMinutes]);

  const handleStart = () => {
    if (status === "IDLE" || status === "COMPLETE") {
      setSecondsLeft(totalSeconds);
    }
    setStatus("RUNNING");
  };

  const handlePause = () => setStatus("PAUSED");

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStatus("IDLE");
    setSecondsLeft(totalSeconds);
    setShowComplete(false);
  };

  const handleModeSwitch = (m: TimerMode) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode(m);
    setStatus("IDLE");
    setCustomMinutes(null);
    setSecondsLeft(MODES[m].duration * 60);
    setShowComplete(false);
  };

  return (
    <section id="focus-timer" className="relative py-24" style={{ zIndex: 1 }}>
      {/* bg glow */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,191,255,0.02) 0%, transparent 70%)",
      }} />

      <div className="max-w-6xl px-6 relative" style={{ margin: "0 auto" }}>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.4em] uppercase mb-3"
            style={{ fontFamily: "'Share Tech Mono', monospace", color: "rgba(0,191,255,0.6)" }}>
            ◈ DEEP WORK ENGINE
          </p>
          <h2 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(1.4rem, 4vw, 2.5rem)",
            fontWeight: 800, letterSpacing: "0.12em", color: "#ffffff",
          }}>
            FOCUS PROTOCOL
          </h2>
          <div className="mx-auto mt-4" style={{
            height: "1px", width: "120px",
            background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
          }} />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: Timer ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative p-8 flex flex-col items-center"
            style={{
              background: cfg.bg,
              border: `1px solid ${cfg.color}33`,
              backdropFilter: "blur(16px)",
              transition: "all 0.5s ease",
              boxShadow: status === "RUNNING" ? cfg.glow : "none",
            }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8" style={{ borderTop: `1px solid ${cfg.color}`, borderLeft: `1px solid ${cfg.color}` }} />
            <div className="absolute bottom-0 right-0 w-8 h-8" style={{ borderBottom: `1px solid ${cfg.color}`, borderRight: `1px solid ${cfg.color}` }} />
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{
              background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
              opacity: status === "RUNNING" ? 1 : 0.3,
              transition: "opacity 0.4s",
            }} />

            {/* Mode subtitle */}
            <p className="mb-6" style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem",
              letterSpacing: "0.3em", color: `${cfg.color}88`, textTransform: "uppercase",
            }}>
              {cfg.subtitle}
            </p>

            {/* Mode tabs */}
            <div className="flex gap-2 mb-8" style={{ flexWrap: "wrap", justifyContent: "center" }}>
              {(Object.keys(MODES) as TimerMode[]).map((m) => (
                <button key={m} onClick={() => handleModeSwitch(m)}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem",
                    letterSpacing: "0.15em", padding: "4px 12px",
                    color: mode === m ? MODES[m].color : "rgba(255,255,255,0.25)",
                    background: mode === m ? `${MODES[m].color}14` : "transparent",
                    border: `1px solid ${mode === m ? MODES[m].color + "66" : "rgba(255,255,255,0.08)"}`,
                    cursor: "pointer", transition: "all 0.25s ease",
                  }}>
                  {MODES[m].label}
                </button>
              ))}
            </div>

            {/* Circular timer with ambient glow */}
            <div style={{ position: "relative" }}>
              {/* Ambient pulsing glow when RUNNING */}
              {status === "RUNNING" && (
                <motion.div
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute", inset: "-20px",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${cfg.color}18 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />
              )}
              <CircularProgress progress={progress} color={cfg.color} timeStr={fmt(secondsLeft)} mode={mode} status={status} />

              {/* Complete flash */}
              <AnimatePresence>
                {showComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${cfg.color}15`,
                      border: `1px solid ${cfg.color}55`,
                      borderRadius: "50%",
                      pointerEvents: "none",
                    }}
                  >
                    <span style={{
                      fontFamily: "'Orbitron', monospace", fontSize: "0.7rem",
                      color: cfg.color, letterSpacing: "0.2em", fontWeight: 700,
                    }}>
                      ✓ LOGGED
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex gap-3 mt-6">
              {status !== "RUNNING" ? (
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: `0 0 25px ${cfg.color}88` }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleStart}
                  style={{
                    fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", letterSpacing: "0.2em",
                    padding: "10px 28px", fontWeight: 700,
                    color: "#000", background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}bb)`,
                    border: "none", cursor: "pointer",
                  }}
                >
                  {status === "PAUSED" ? "▶ RESUME" : status === "COMPLETE" ? "↺ RESTART" : "▶ INITIATE"}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handlePause}
                  style={{
                    fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", letterSpacing: "0.2em",
                    padding: "10px 28px", fontWeight: 700,
                    color: cfg.color, background: "transparent",
                    border: `1px solid ${cfg.color}88`, cursor: "pointer",
                  }}
                >
                  ⏸ PAUSE
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleReset}
                style={{
                  fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em",
                  padding: "10px 18px",
                  color: "rgba(255,255,255,0.3)", background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                ↺
              </motion.button>
            </div>

            {/* Custom duration */}
            <div className="flex items-center gap-3 mt-5">
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}>
                CUSTOM MIN:
              </span>
              <input
                type="number" min={1} max={120}
                value={customMinutes ?? ""}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v > 0) {
                    setCustomMinutes(v);
                    if (status === "IDLE" || status === "COMPLETE") setSecondsLeft(v * 60);
                  } else {
                    setCustomMinutes(null);
                    if (status === "IDLE" || status === "COMPLETE") setSecondsLeft(MODES[mode].duration * 60);
                  }
                }}
                placeholder={String(MODES[mode].duration)}
                style={{
                  width: "64px", padding: "4px 8px",
                  fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem",
                  color: cfg.color, background: "transparent",
                  border: `1px solid ${cfg.color}44`,
                  outline: "none", textAlign: "center",
                  appearance: "textfield",
                }}
              />
            </div>
          </motion.div>

          {/* ── Right: Stats + History ── */}
          <div className="flex flex-col gap-6">

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative p-7"
              style={{
                background: "rgba(13,17,23,0.9)",
                border: "1px solid rgba(0,191,255,0.12)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{
                background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
                opacity: 0.4,
              }} />

              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.3em", color: "rgba(0,191,255,0.5)", marginBottom: "16px" }}>
                ◈ MISSION STATISTICS
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "TODAY", value: stats.todaySessions, unit: "sessions", color: "#00BFFF", icon: "◎" },
                  { label: "STREAK", value: stats.streak, unit: "days", color: "#FFB800", icon: "★" },
                  { label: "TOTAL SESSIONS", value: stats.totalSessions, unit: "completed", color: "#00FF88", icon: "▣" },
                  { label: "FOCUS TIME", value: stats.totalMinutes, unit: "minutes", color: "#BF7FFF", icon: "⚡" },
                ].map(({ label, value, unit, color, icon }) => (
                  <motion.div key={label}
                    whileHover={{ scale: 1.03, boxShadow: `0 0 20px ${color}18` }}
                    className="p-4"
                    style={{
                      border: `1px solid ${color}22`,
                      background: `${color}06`,
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${color}88, transparent)` }} />
                    <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "2px", background: `linear-gradient(to bottom, ${color}, transparent)` }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.48rem", letterSpacing: "0.2em", color: `${color}77` }}>{label}</p>
                      <span style={{ color: `${color}66`, fontSize: "0.75rem" }}>{icon}</span>
                    </div>
                    <p style={{ fontFamily: "'Orbitron', monospace", fontSize: "1.7rem", fontWeight: 900, color, filter: `drop-shadow(0 0 10px ${color}88)`, lineHeight: 1 }}>
                      {value}
                    </p>
                    <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.48rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em", marginTop: "3px" }}>{unit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 7-day Bar Chart */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative p-7 flex-1"
              style={{
                background: "rgba(13,17,23,0.9)",
                border: "1px solid rgba(0,191,255,0.12)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="absolute bottom-0 right-0 w-8 h-8" style={{
                borderBottom: "1px solid rgba(0,191,255,0.3)",
                borderRight: "1px solid rgba(0,191,255,0.3)",
              }} />

              <div className="flex items-center justify-between mb-5">
                <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.3em", color: "rgba(0,191,255,0.5)" }}>
                  ◈ 7-DAY FOCUS ACTIVITY
                </p>
                {stats.todaySessions > 0 && (
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.1em", color: "rgba(0,191,255,0.4)" }}>
                    {stats.todaySessions} TODAY
                  </span>
                )}
              </div>

              <SessionBars sessions={sessions} />

              {/* Recent sessions list */}
              {sessions.filter((s) => s.mode === "FOCUS").slice(0, 3).length > 0 && (
                <div className="mt-5 flex flex-col gap-2">
                  <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", marginBottom: "4px" }}>
                    RECENT SESSIONS
                  </p>
                  {sessions.filter((s) => s.mode === "FOCUS").slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center justify-between" style={{
                      padding: "4px 8px",
                      border: "1px solid rgba(0,191,255,0.08)",
                    }}>
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.5rem", color: "rgba(0,191,255,0.6)", letterSpacing: "0.1em" }}>
                        {s.date} · {s.completedAt}
                      </span>
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.5rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
                        {s.duration}m
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {sessions.filter((s) => s.mode === "FOCUS").length === 0 && (
                <div className="flex flex-col items-center justify-center py-4 gap-2 mt-4">
                  <span style={{ fontSize: "1.5rem", opacity: 0.12 }}>◎</span>
                  <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.18)", textAlign: "center" }}>
                    NO SESSIONS LOGGED YET<br />INITIATE YOUR FIRST FOCUS BLOCK
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

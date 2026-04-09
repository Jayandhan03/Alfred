"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MoodEntry {
  date: string; // "YYYY-MM-DD"
  score: number; // 1–10
  state: MoodState;
  loggedAt: string;
}

type MoodState = "OPTIMAL" | "FOCUSED" | "DRAINED" | "CRITICAL";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "alfred_mood_log";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getMoodState(score: number): MoodState {
  if (score >= 8) return "OPTIMAL";
  if (score >= 6) return "FOCUSED";
  if (score >= 4) return "DRAINED";
  return "CRITICAL";
}

const moodStyles: Record<MoodState, { color: string; bg: string; glow: string; label: string }> = {
  OPTIMAL:  { color: "#00BFFF", bg: "rgba(0,191,255,0.09)",  glow: "0 0 25px rgba(0,191,255,0.45)",   label: "Peak cognitive performance. Leverage this window." },
  FOCUSED:  { color: "#00FF88", bg: "rgba(0,255,136,0.09)",  glow: "0 0 25px rgba(0,255,136,0.35)",   label: "Solid operational state. Deep work protocol recommended." },
  DRAINED:  { color: "#FFB800", bg: "rgba(255,184,0,0.09)",  glow: "0 0 25px rgba(255,184,0,0.35)",   label: "Energy reserves low. Prioritise recovery and easy wins." },
  CRITICAL: { color: "#FF4444", bg: "rgba(255,68,68,0.09)",  glow: "0 0 25px rgba(255,68,68,0.35)",   label: "System alert. Rest is non-negotiable. Disengage from strain." },
};

function alfredInsight(score: number): string {
  if (score >= 9) return "Your signal is strong. This is the moment to tackle your hardest problems.";
  if (score >= 7) return "Steady output. Execute your priority list — momentum compounds.";
  if (score >= 5) return "Moderate charge. Work strategically. Avoid multitasking.";
  if (score >= 3) return "Low reserves detected. Protect your energy — say no to distractions.";
  return "Critical threshold. Physical recovery takes precedence. Log off and rest.";
}

function loadLog(): MoodEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveEntry(entry: MoodEntry) {
  const log = loadLog().filter((e) => e.date !== entry.date);
  log.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log.slice(0, 30)));
}

// ─── Radial Gauge SVG ────────────────────────────────────────────────────────

function RadialGauge({ score, color }: { score: number; color: string }) {
  const r = 70;
  const cx = 100;
  const cy = 100;
  const strokeW = 10;
  const startAngle = -220;
  const sweepTotal = 260;
  const sweepFill = (score / 10) * sweepTotal;

  const polar = (angleDeg: number, radius: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const describeArc = (startDeg: number, endDeg: number) => {
    const s = polar(startDeg, r);
    const e = polar(endDeg, r);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const tickMarks = Array.from({ length: 11 }, (_, i) => {
    const angle = startAngle + (i / 10) * sweepTotal;
    const inner = polar(angle, r - 16);
    const outer = polar(angle, r - 7);
    return { inner, outer, i };
  });

  return (
    <svg viewBox="0 0 200 180" style={{ width: "220px", height: "198px", overflow: "visible" }}>
      {/* Track */}
      <path
        d={describeArc(startAngle, startAngle + sweepTotal)}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
      {/* Fill arc */}
      <motion.path
        d={describeArc(startAngle, startAngle + sweepFill)}
        fill="none"
        stroke={color}
        strokeWidth={strokeW}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      {/* Tick marks */}
      {tickMarks.map(({ inner, outer, i }) => (
        <line
          key={i}
          x1={inner.x} y1={inner.y}
          x2={outer.x} y2={outer.y}
          stroke={i === score ? color : "rgba(255,255,255,0.1)"}
          strokeWidth={i === score ? 2 : 1}
        />
      ))}
      {/* Score text */}
      <text
        x={cx} y={cy + 8}
        textAnchor="middle"
        fill={color}
        fontSize="36"
        fontFamily="'Orbitron', monospace"
        fontWeight="900"
        style={{ filter: `drop-shadow(0 0 12px ${color})` }}
      >
        {score}
      </text>
      <text x={cx} y={cy + 26} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="'Share Tech Mono', monospace" letterSpacing="2">
        /10
      </text>
      {/* Min / Max labels */}
      <text x={23} y={148} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="'Share Tech Mono', monospace">0</text>
      <text x={178} y={148} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="'Share Tech Mono', monospace">10</text>
    </svg>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const W = 280;
  const H = 60;
  const padX = 10;
  const padY = 8;
  const xs = data.map((_, i) => padX + (i / (data.length - 1)) * (W - padX * 2));
  const ys = data.map((v) => padY + ((10 - v) / 9) * (H - padY * 2));
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, height: H }}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((f, i) => (
        <line key={i} x1={padX} x2={W - padX} y1={padY + f * (H - padY * 2)} y2={padY + f * (H - padY * 2)}
          stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      {/* Sparkline */}
      <motion.polyline
        points={points}
        fill="none"
        stroke="#00BFFF"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ filter: "drop-shadow(0 0 4px rgba(0,191,255,0.7))" }}
      />
      {/* Dots */}
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={3} fill="#00BFFF"
          style={{ filter: "drop-shadow(0 0 4px #00BFFF)" }} />
      ))}
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MoodTracker() {
  const [score, setScore] = useState(7);
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  const [weekData, setWeekData] = useState<number[]>([]);
  const [logged, setLogged] = useState(false);
  const [showInsight, setShowInsight] = useState(false);

  // Load existing today entry + 7-day history
  useEffect(() => {
    const log = loadLog();
    const today = log.find((e) => e.date === todayKey());
    if (today) {
      setTodayEntry(today);
      setScore(today.score);
      setLogged(true);
    }

    // Build 7-day scores (fill missing with null → skip in sparkline)
    const last7: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const entry = log.find((e) => e.date === key);
      if (entry) last7.push(entry.score);
    }
    setWeekData(last7);
  }, []);

  const moodState = getMoodState(score);
  const style = moodStyles[moodState];

  const handleLog = useCallback(() => {
    const entry: MoodEntry = {
      date: todayKey(),
      score,
      state: moodState,
      loggedAt: new Date().toLocaleTimeString("en-US", { hour12: false }),
    };
    saveEntry(entry);
    setTodayEntry(entry);
    setLogged(true);
    setShowInsight(true);

    // update sparkline
    const log = loadLog();
    const last7: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const found = log.find((e) => e.date === key);
      if (found) last7.push(found.score);
    }
    setWeekData(last7);
  }, [score, moodState]);

  const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const today = new Date().getDay(); // 0=Sun
  // Map last 7 days to labels
  const last7Labels: string[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return dayLabels[(d.getDay() + 6) % 7];
  });

  return (
    <section id="mood" className="relative py-24" style={{ zIndex: 1 }}>
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
            ◈ BIOMETRIC FEEDBACK
          </p>
          <h2 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(1.4rem, 4vw, 2.5rem)",
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: "#ffffff",
          }}>
            MOOD INTELLIGENCE
          </h2>
          <div className="mx-auto mt-4" style={{
            height: "1px", width: "120px",
            background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
          }} />
        </motion.div>

        {/* Main Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: Gauge + Slider ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative p-8 flex flex-col items-center"
            style={{
              background: style.bg,
              border: `1px solid ${style.color}33`,
              backdropFilter: "blur(16px)",
              transition: "all 0.4s ease",
              boxShadow: logged ? style.glow : "none",
            }}
          >
            {/* Corner accent */}
            <div className="absolute top-0 left-0 w-8 h-8" style={{ borderTop: `1px solid ${style.color}`, borderLeft: `1px solid ${style.color}` }} />
            <div className="absolute bottom-0 right-0 w-8 h-8" style={{ borderBottom: `1px solid ${style.color}`, borderRight: `1px solid ${style.color}` }} />

            {/* Subtitle */}
            <p className="mb-2 text-center" style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem",
              letterSpacing: "0.3em", color: `${style.color}99`,
            }}>
              TODAY&apos;S ENERGY SIGNAL
            </p>

            {/* Gauge */}
            <RadialGauge score={score} color={style.color} />

            {/* State Badge */}
            <motion.div
              key={moodState}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-5 px-5 py-1.5 flex items-center gap-2"
              style={{
                border: `1px solid ${style.color}55`,
                background: `${style.color}11`,
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-2 h-2 rounded-full"
                style={{ background: style.color, boxShadow: `0 0 6px ${style.color}` }}
              />
              <span style={{
                fontFamily: "'Orbitron', monospace", fontSize: "0.7rem",
                letterSpacing: "0.2em", color: style.color, fontWeight: 700,
              }}>
                {moodState}
              </span>
            </motion.div>

            {/* Slider */}
            <div className="w-full max-w-xs mb-6">
              <input
                type="range" min={1} max={10} value={score}
                onChange={(e) => { setScore(Number(e.target.value)); setLogged(false); setShowInsight(false); }}
                className="w-full"
                style={{ accentColor: style.color, cursor: "pointer" }}
              />
              <div className="flex justify-between mt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <span key={n} style={{
                    fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem",
                    color: n === score ? style.color : "rgba(255,255,255,0.15)",
                    transition: "color 0.2s",
                  }}>{n}</span>
                ))}
              </div>
            </div>

            {/* Log Button */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: `0 0 25px ${style.color}88` }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLog}
              className="px-6 py-3 w-full max-w-xs"
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                fontWeight: 700,
                color: logged ? "#000" : style.color,
                background: logged
                  ? `linear-gradient(135deg, ${style.color}, ${style.color}aa)`
                  : "transparent",
                border: `1px solid ${style.color}`,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {logged ? "✓ SIGNAL LOGGED" : "LOG TODAY'S SIGNAL"}
            </motion.button>

            {todayEntry && (
              <p className="mt-2 text-center" style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.55rem", letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.25)",
              }}>
                LOGGED AT {todayEntry.loggedAt}
              </p>
            )}
          </motion.div>

          {/* ── Right: Insight + Sparkline ── */}
          <div className="flex flex-col gap-6">

            {/* Alfred Insight Panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative p-7 flex-1"
              style={{
                background: "rgba(13,17,23,0.9)",
                border: "1px solid rgba(0,191,255,0.12)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{
                background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
                opacity: showInsight ? 1 : 0.3,
                transition: "opacity 0.4s",
              }} />

              <p style={{
                fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem",
                letterSpacing: "0.3em", color: "rgba(0,191,255,0.5)", marginBottom: "10px",
              }}>
                ◈ ALFRED INSIGHT
              </p>

              <div className="flex items-start gap-3 mb-4">
                <span style={{
                  fontFamily: "'Orbitron', monospace", fontSize: "1.8rem",
                  color: style.color, filter: `drop-shadow(0 0 10px ${style.color})`,
                  lineHeight: 1, flexShrink: 0,
                }}>◎</span>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={score}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: "0.95rem",
                      lineHeight: 1.65,
                      color: "rgba(180,210,240,0.85)",
                    }}
                  >
                    {alfredInsight(score)}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Current score breakdown */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {(["OPTIMAL", "FOCUSED", "DRAINED", "CRITICAL"] as MoodState[]).map((s) => {
                  const ms = moodStyles[s];
                  const active = moodState === s;
                  return (
                    <div key={s} className="flex items-center gap-2 py-1.5 px-3"
                      style={{
                        border: `1px solid ${active ? ms.color + "55" : "rgba(255,255,255,0.05)"}`,
                        background: active ? ms.bg : "transparent",
                        transition: "all 0.3s",
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: ms.color, opacity: active ? 1 : 0.25 }} />
                      <span style={{
                        fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem",
                        letterSpacing: "0.12em", color: active ? ms.color : "rgba(255,255,255,0.2)",
                        transition: "color 0.3s",
                      }}>{s}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Weekly Trend Panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative p-7"
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
                <p style={{
                  fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem",
                  letterSpacing: "0.3em", color: "rgba(0,191,255,0.5)",
                }}>◈ 7-DAY TREND</p>
                {weekData.length > 0 && (
                  <span style={{
                    fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem",
                    letterSpacing: "0.1em",
                    color: "rgba(0,191,255,0.4)",
                  }}>
                    AVG {(weekData.reduce((a, b) => a + b, 0) / weekData.length).toFixed(1)}
                  </span>
                )}
              </div>

              {weekData.length >= 2 ? (
                <>
                  <Sparkline data={weekData} />
                  {/* Day labels */}
                  <div className="flex justify-between mt-1 px-2">
                    {last7Labels.slice(last7Labels.length - weekData.length).map((label, i) => (
                      <span key={i} style={{
                        fontFamily: "'Share Tech Mono', monospace", fontSize: "0.5rem",
                        color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em",
                      }}>{label}</span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                  <span style={{ fontSize: "2rem", opacity: 0.15 }}>◎</span>
                  <p style={{
                    fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem",
                    letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textAlign: "center",
                  }}>
                    LOG AT LEAST 2 DAYS<br />TO SEE TREND DATA
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

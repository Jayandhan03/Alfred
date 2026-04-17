"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getMonthLogs, hasLogForDate } from "@/lib/performanceDb";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS_OF_WEEK = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ value, color }: { value: number; color: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: "1.8rem",
        fontWeight: 900,
        color,
        filter: `drop-shadow(0 0 12px ${color}88)`,
        lineHeight: 1,
      }}
    >
      {value}
    </motion.span>
  );
}

export default function PerformanceLogPage() {
  const router = useRouter();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [loggedDates, setLoggedDates] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");

  useEffect(() => {
    const logs = getMonthLogs(currentYear, currentMonth + 1);
    setLoggedDates(new Set(logs.map((l) => l.date)));
  }, [currentYear, currentMonth]);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  const prevMonth = () => {
    setSlideDir("right");
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    setSlideDir("left");
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    router.push(`/performance-log/day/${dateStr}`);
  };

  const calendarCells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  // Month stats
  const loggedCount = loggedDates.size;
  const totalDays = daysInMonth;
  const completionRate = Math.round((loggedCount / totalDays) * 100);

  // Streak (consecutive days from today backward in this month)
  let streak = 0;
  for (let d = today.getDate(); d >= 1; d--) {
    const ds = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    if (loggedDates.has(ds)) streak++;
    else break;
  }

  const AREA_COLORS: Record<string, string> = {
    W: "#00BFFF", D: "#00FFB2", A: "#BF7FFF", C: "#FFD700",
  };
  const AREA_LABELS: Record<string, string> = {
    W: "Workout", D: "Diet", A: "AI Code", C: "Creations",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#000000", position: "relative", overflow: "hidden" }}>
      {/* Animated grid bg */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,191,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.025) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          zIndex: 0,
        }}
      />
      {/* Radial ambient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 10%, rgba(0,191,255,0.06) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "1040px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── Back + Title ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button
            onClick={() => router.push("/home")}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "none", border: "1px solid rgba(0,191,255,0.18)",
              color: "rgba(0,191,255,0.65)", fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.6rem", letterSpacing: "0.2em", padding: "7px 16px",
              cursor: "pointer", marginBottom: "36px", transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,191,255,0.55)";
              (e.currentTarget as HTMLButtonElement).style.color = "#00BFFF";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,191,255,0.07)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(0,191,255,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,191,255,0.18)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(0,191,255,0.65)";
              (e.currentTarget as HTMLButtonElement).style.background = "none";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            ← BACK TO ALFRED
          </button>

          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.4em", color: "rgba(0,191,255,0.5)", marginBottom: "10px" }}>
            ◎ DAILY METRICS TRACKING
          </p>
          <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: "0.12em", color: "#ffffff", marginBottom: "6px" }}>
            PERFORMANCE LOG
          </h1>
          <div style={{ height: "1px", width: "140px", background: "linear-gradient(90deg, #00BFFF, transparent)", marginBottom: "10px" }} />
          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.95rem", color: "rgba(150,180,200,0.65)" }}>
            Click any day to open your daily mission log — track Workout, Diet, AI Code & Creations.
          </p>
        </motion.div>

        {/* ── Month Stats Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-4 gap-3 mt-8 mb-6"
        >
          {[
            { label: "DAYS LOGGED", value: loggedCount, color: "#00BFFF" },
            { label: "COMPLETION", value: `${completionRate}%`, color: "#00FFB2" },
            { label: "CURRENT STREAK", value: streak, color: "#FFB800" },
            { label: "DAYS IN MONTH", value: totalDays, color: "#BF7FFF" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(13,17,23,0.9)", border: `1px solid ${s.color}20`,
                backdropFilter: "blur(16px)", padding: "18px 20px", position: "relative", overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`, opacity: 0.5 }} />
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.48rem", letterSpacing: "0.28em", color: `${s.color}88`, marginBottom: "8px" }}>{s.label}</p>
              <AnimatedNumber value={typeof s.value === "number" ? s.value : 0} color={s.color} />
              {typeof s.value === "string" && (
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "1.8rem", fontWeight: 900, color: s.color, filter: `drop-shadow(0 0 12px ${s.color}88)`, lineHeight: 1 }}>{s.value}</span>
              )}
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottom: `1px solid ${s.color}44`, borderRight: `1px solid ${s.color}44` }} />
            </div>
          ))}
        </motion.div>

        {/* ── Calendar Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{
            background: "rgba(10,14,20,0.92)", backdropFilter: "blur(24px)",
            border: "1px solid rgba(0,191,255,0.14)", padding: "36px", position: "relative",
            boxShadow: "0 0 60px rgba(0,191,255,0.05), inset 0 0 40px rgba(0,191,255,0.02)",
          }}
        >
          {/* Top glow line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #00BFFF, transparent)" }} />

          {/* Month Navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(0,191,255,0.3)" }}
              whileTap={{ scale: 0.94 }}
              onClick={prevMonth}
              style={{
                background: "rgba(0,191,255,0.07)", border: "1px solid rgba(0,191,255,0.25)",
                color: "#00BFFF", fontFamily: "'Orbitron', monospace", fontSize: "1.1rem",
                width: "44px", height: "44px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
              }}
            >‹</motion.button>

            <div style={{ textAlign: "center" }}>
              <motion.h2
                key={`${currentMonth}-${currentYear}`}
                initial={{ opacity: 0, y: slideDir === "left" ? -16 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                style={{ fontFamily: "'Orbitron', monospace", fontSize: "1.35rem", fontWeight: 800, letterSpacing: "0.2em", color: "#ffffff" }}
              >
                {MONTHS[currentMonth].toUpperCase()}
              </motion.h2>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", color: "rgba(0,191,255,0.45)", letterSpacing: "0.3em" }}>
                {currentYear}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(0,191,255,0.3)" }}
              whileTap={{ scale: 0.94 }}
              onClick={nextMonth}
              style={{
                background: "rgba(0,191,255,0.07)", border: "1px solid rgba(0,191,255,0.25)",
                color: "#00BFFF", fontFamily: "'Orbitron', monospace", fontSize: "1.1rem",
                width: "44px", height: "44px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
              }}
            >›</motion.button>
          </div>

          {/* Day-of-week headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} style={{ textAlign: "center", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(0,191,255,0.38)", padding: "8px 0" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>
            {calendarCells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} style={{ height: "96px" }} />;

              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const isToday = dateStr === todayStr;
              const hasLog = loggedDates.has(dateStr);
              const isHov = hovered === dateStr;

              return (
                <motion.div
                  key={dateStr}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => setHovered(dateStr)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    height: "96px", display: "flex", flexDirection: "column",
                    padding: "10px 12px", cursor: "pointer", position: "relative",
                    background: isToday
                      ? "rgba(0,191,255,0.1)"
                      : isHov
                      ? "rgba(0,191,255,0.06)"
                      : "rgba(6,10,16,0.7)",
                    border: isToday
                      ? "1px solid rgba(0,191,255,0.65)"
                      : isHov
                      ? "1px solid rgba(0,191,255,0.35)"
                      : "1px solid rgba(0,191,255,0.07)",
                    transition: "all 0.22s ease",
                    boxShadow: isToday
                      ? "0 0 24px rgba(0,191,255,0.18), inset 0 0 16px rgba(0,191,255,0.06)"
                      : isHov
                      ? "0 0 14px rgba(0,191,255,0.08)"
                      : "none",
                    overflow: "hidden",
                  }}
                >
                  {/* TODAY pulsing ring */}
                  {isToday && (
                    <motion.div
                      animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      style={{
                        position: "absolute", top: "4px", left: "10px",
                        width: "28px", height: "28px", borderRadius: "50%",
                        border: "1px solid rgba(0,191,255,0.6)", pointerEvents: "none",
                      }}
                    />
                  )}

                  {/* Day number */}
                  <span style={{
                    fontFamily: "'Orbitron', monospace", fontSize: "0.9rem",
                    fontWeight: isToday ? 800 : 500,
                    color: isToday ? "#00BFFF" : "rgba(210,225,240,0.85)",
                    textShadow: isToday ? "0 0 16px rgba(0,191,255,0.8)" : "none",
                    zIndex: 1,
                  }}>
                    {String(day).padStart(2,"0")}
                  </span>

                  {/* TODAY badge */}
                  {isToday && (
                    <span style={{
                      fontFamily: "'Share Tech Mono', monospace", fontSize: "0.4rem",
                      letterSpacing: "0.1em", color: "#00BFFF",
                      background: "rgba(0,191,255,0.15)", border: "1px solid rgba(0,191,255,0.5)",
                      padding: "1px 5px", marginTop: "3px", zIndex: 1, lineHeight: 1.4,
                    }}>TODAY</span>
                  )}

                  {/* Log indicator — colored WDAC pills */}
                  {hasLog && (
                    <div style={{ position: "absolute", bottom: "7px", left: "8px", right: "8px", display: "flex", gap: "2px", flexWrap: "wrap" }}>
                      {["W","D","A","C"].map((letter) => (
                        <div
                          key={letter}
                          title={AREA_LABELS[letter]}
                          style={{
                            width: "12px", height: "4px",
                            background: AREA_COLORS[letter],
                            boxShadow: `0 0 4px ${AREA_COLORS[letter]}88`,
                            borderRadius: "1px",
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Hover OPEN text */}
                  {isHov && !isToday && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        position: "absolute", bottom: "8px", right: "8px",
                        fontFamily: "'Share Tech Mono', monospace", fontSize: "0.45rem",
                        color: "rgba(0,191,255,0.55)", letterSpacing: "0.1em",
                      }}
                    >OPEN↗</motion.span>
                  )}

                  {/* Bottom-right accent */}
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderBottom: "1px solid rgba(0,191,255,0.22)", borderRight: "1px solid rgba(0,191,255,0.22)" }} />
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop: "24px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(0,191,255,0.35)" }}>
              LEGEND:
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "16px", height: "16px", background: "rgba(0,191,255,0.1)", border: "1px solid rgba(0,191,255,0.6)", boxShadow: "0 0 8px rgba(0,191,255,0.3)" }} />
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.48rem", letterSpacing: "0.12em", color: "rgba(150,180,200,0.55)" }}>TODAY</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {["W","D","A","C"].map((l) => (
                  <div key={l} style={{ width: "12px", height: "4px", background: AREA_COLORS[l], borderRadius: "1px" }} />
                ))}
              </div>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.48rem", letterSpacing: "0.12em", color: "rgba(150,180,200,0.55)" }}>LOGGED</span>
            </div>
            {["W","D","A","C"].map((l) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "8px", height: "8px", background: AREA_COLORS[l], borderRadius: "1px", boxShadow: `0 0 4px ${AREA_COLORS[l]}88` }} />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.45rem", color: `${AREA_COLORS[l]}99`, letterSpacing: "0.1em" }}>{AREA_LABELS[l].substring(0,1)}</span>
              </div>
            ))}
          </div>

          {/* Corner accent */}
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderBottom: "1px solid rgba(0,191,255,0.3)", borderRight: "1px solid rgba(0,191,255,0.3)" }} />
        </motion.div>
      </div>
    </main>
  );
}

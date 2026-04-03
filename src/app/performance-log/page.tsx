"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getMonthLogs, hasLogForDate } from "@/lib/performanceDb";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function PerformanceLogPage() {
  const router = useRouter();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [loggedDates, setLoggedDates] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const logs = getMonthLogs(currentYear, currentMonth + 1);
    setLoggedDates(new Set(logs.map((l) => l.date)));
  }, [currentYear, currentMonth]);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    router.push(`/performance-log/day/${dateStr}`);
  };

  const calendarCells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0, 191, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 191, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Radial ambient */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(0, 191, 255, 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div style={{ position: "relative", zIndex: 2, padding: "0 24px" }}>
        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            paddingTop: "40px",
            paddingBottom: "20px",
          }}
        >
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => router.push("/home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "1px solid rgba(0, 191, 255, 0.2)",
              color: "rgba(0, 191, 255, 0.7)",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              padding: "8px 16px",
              cursor: "pointer",
              marginBottom: "36px",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0, 191, 255, 0.6)";
              (e.currentTarget as HTMLButtonElement).style.color = "#00BFFF";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0, 191, 255, 0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0, 191, 255, 0.2)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(0, 191, 255, 0.7)";
              (e.currentTarget as HTMLButtonElement).style.background = "none";
            }}
          >
            ← BACK TO ALFRED
          </motion.button>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.4em",
                color: "rgba(0, 191, 255, 0.55)",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              ◎ DAILY METRICS TRACKING
            </p>
            <h1
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "clamp(1.4rem, 4vw, 2.4rem)",
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: "#ffffff",
                marginBottom: "10px",
              }}
            >
              PERFORMANCE LOG
            </h1>
            <div
              style={{
                height: "1px",
                width: "120px",
                background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
                marginBottom: "8px",
              }}
            />
            <p
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.92rem",
                color: "rgba(150, 180, 200, 0.7)",
              }}
            >
              Click any day to open your daily mission log — track Workout, Diet, AI Code &amp; Creations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Calendar */}
      <div style={{ position: "relative", zIndex: 2, padding: "0 24px 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            background: "rgba(13, 17, 23, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 191, 255, 0.15)",
            padding: "36px",
            position: "relative",
          }}
        >
          {/* Calendar top glow line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
            }}
          />

          {/* Month Navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "32px",
            }}
          >
            <button
              onClick={prevMonth}
              style={{
                background: "rgba(0, 191, 255, 0.07)",
                border: "1px solid rgba(0, 191, 255, 0.25)",
                color: "#00BFFF",
                fontFamily: "'Orbitron', monospace",
                fontSize: "1rem",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0, 191, 255, 0.15)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(0, 191, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0, 191, 255, 0.07)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              ‹
            </button>

            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "#ffffff",
                }}
              >
                {MONTHS[currentMonth].toUpperCase()}
              </h2>
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.65rem",
                  color: "rgba(0, 191, 255, 0.5)",
                  letterSpacing: "0.3em",
                }}
              >
                {currentYear}
              </span>
            </div>

            <button
              onClick={nextMonth}
              style={{
                background: "rgba(0, 191, 255, 0.07)",
                border: "1px solid rgba(0, 191, 255, 0.25)",
                color: "#00BFFF",
                fontFamily: "'Orbitron', monospace",
                fontSize: "1rem",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0, 191, 255, 0.15)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(0, 191, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0, 191, 255, 0.07)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              ›
            </button>
          </div>

          {/* Day-of-week headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "4px",
              marginBottom: "8px",
            }}
          >
            {DAYS_OF_WEEK.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  color: "rgba(0, 191, 255, 0.45)",
                  padding: "8px 0",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "4px",
            }}
          >
            {calendarCells.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} style={{ height: "88px" }} />;
              }

              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isToday = dateStr === todayStr;
              const hasLog = loggedDates.has(dateStr);
              const isHovered = hovered === dateStr;
              const isCurrentMonth = true;

              return (
                <motion.div
                  key={dateStr}
                  whileHover={{ scale: 1.04 }}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => setHovered(dateStr)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    height: "88px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    padding: "10px 12px",
                    cursor: "pointer",
                    position: "relative",
                    background: isToday
                      ? "rgba(0, 191, 255, 0.08)"
                      : isHovered
                      ? "rgba(0, 191, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.3)",
                    border: isToday
                      ? "1px solid rgba(0, 191, 255, 0.5)"
                      : isHovered
                      ? "1px solid rgba(0, 191, 255, 0.3)"
                      : "1px solid rgba(0, 191, 255, 0.07)",
                    transition: "all 0.2s ease",
                    boxShadow: isToday
                      ? "0 0 20px rgba(0, 191, 255, 0.1), inset 0 0 20px rgba(0, 191, 255, 0.04)"
                      : "none",
                  }}
                >
                  {/* Day number */}
                  <span
                    style={{
                      fontFamily: "'Orbitron', monospace",
                      fontSize: "0.85rem",
                      fontWeight: isToday ? 700 : 500,
                      color: isToday ? "#00BFFF" : isCurrentMonth ? "#ffffff" : "rgba(255,255,255,0.2)",
                      textShadow: isToday ? "0 0 12px rgba(0, 191, 255, 0.6)" : "none",
                    }}
                  >
                    {String(day).padStart(2, "0")}
                  </span>

                  {/* TODAY badge */}
                  {isToday && (
                    <span
                      style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: "0.45rem",
                        letterSpacing: "0.1em",
                        color: "#00BFFF",
                        background: "rgba(0, 191, 255, 0.15)",
                        border: "1px solid rgba(0, 191, 255, 0.4)",
                        padding: "1px 5px",
                        marginTop: "4px",
                      }}
                    >
                      TODAY
                    </span>
                  )}

                  {/* Log indicator */}
                  {hasLog && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        display: "flex",
                        gap: "3px",
                      }}
                    >
                      {["W", "D", "A", "C"].map((letter) => (
                        <div
                          key={letter}
                          title={
                            letter === "W"
                              ? "Workout"
                              : letter === "D"
                              ? "Diet"
                              : letter === "A"
                              ? "AI Code"
                              : "Creations"
                          }
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "rgba(0, 191, 255, 0.5)",
                            boxShadow: "0 0 4px rgba(0, 191, 255, 0.4)",
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Hover arrow */}
                  {isHovered && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "12px",
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: "0.5rem",
                        color: "rgba(0, 191, 255, 0.5)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      OPEN ↗
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              gap: "24px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                color: "rgba(0, 191, 255, 0.4)",
              }}
            >
              LEGEND:
            </span>
            {[
              { label: "TODAY", color: "rgba(0, 191, 255, 0.5)", border: "rgba(0, 191, 255, 0.5)" },
              { label: "HAS LOG", color: "rgba(0, 191, 255, 0.5)", border: "transparent", dot: true },
              { label: "CLICK TO LOG", color: "transparent", border: "rgba(0, 191, 255, 0.07)" },
            ].map(({ label, color, border, dot }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {dot ? (
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color, boxShadow: "0 0 4px rgba(0,191,255,0.4)" }} />
                ) : (
                  <div style={{ width: "14px", height: "14px", background: color, border: `1px solid ${border}` }} />
                )}
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.52rem",
                    letterSpacing: "0.15em",
                    color: "rgba(150, 180, 200, 0.6)",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Corner accent */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "32px",
              height: "32px",
              borderBottom: "1px solid rgba(0, 191, 255, 0.3)",
              borderRight: "1px solid rgba(0, 191, 255, 0.3)",
            }}
          />
        </motion.div>
      </div>
    </main>
  );
}

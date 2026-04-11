"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface JournalEntry {
  date: string; // YYYY-MM-DD
  rating: number; // 1-10
  wins: string;
  challenges: string;
  tomorrowPlan: string;
  mindset: string;
  updatedAt: string;
}

const STORAGE_KEY = "alfred_journal_entries";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getRatingColor(r: number) {
  if (r >= 8) return "#00FFB2";
  if (r >= 5) return "#FFB800";
  return "#FF4455";
}

function getRatingLabel(r: number) {
  if (r === 10) return "LEGENDARY";
  if (r >= 8) return "EXCELLENT";
  if (r >= 6) return "SOLID";
  if (r >= 4) return "AVERAGE";
  if (r >= 2) return "ROUGH";
  return "CRITICAL";
}

export default function JournalPage() {
  const router = useRouter();
  const today = getTodayKey();

  const [entries, setEntries] = useState<Record<string, JournalEntry>>({});
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);

  // Draft state
  const [draft, setDraft] = useState<JournalEntry>({
    date: today,
    rating: 7,
    wins: "",
    challenges: "",
    tomorrowPlan: "",
    mindset: "",
    updatedAt: new Date().toISOString(),
  });

  // Load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Record<string, JournalEntry>;
        setEntries(parsed);
        if (parsed[today]) {
          setDraft(parsed[today]);
        }
      } catch {}
    }
  }, [today]);

  // When selected date changes, update draft
  useEffect(() => {
    if (entries[selectedDate]) {
      setDraft(entries[selectedDate]);
    } else {
      setDraft({
        date: selectedDate,
        rating: 7,
        wins: "",
        challenges: "",
        tomorrowPlan: "",
        mindset: "",
        updatedAt: new Date().toISOString(),
      });
    }
    setIsEditing(false);
  }, [selectedDate, entries]);

  const saveEntry = useCallback(() => {
    const updated = {
      ...entries,
      [selectedDate]: { ...draft, date: selectedDate, updatedAt: new Date().toISOString() },
    };
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setIsEditing(false);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  }, [draft, entries, selectedDate]);

  const sortedDates = Object.keys(entries).sort((a, b) => b.localeCompare(a));
  const hasEntry = (d: string) => !!entries[d];

  const ratingColor = getRatingColor(draft.rating);

  return (
    <main
      className="relative min-h-screen w-full"
      style={{ background: "#000000", fontFamily: "'Rajdhani', sans-serif" }}
    >
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,191,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.025) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,191,255,0.04) 0%, transparent 60%)",
        }}
      />

      {/* NAV */}
      <nav
        className="relative flex items-center justify-between px-8 py-5"
        style={{
          borderBottom: "1px solid rgba(0,191,255,0.1)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-3 group"
        >
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "rgba(0,191,255,0.5)",
              transition: "color 0.2s",
            }}
            className="group-hover:text-[#00BFFF]"
          >
            ← BACK TO ALFRED
          </span>
        </button>

        <div className="flex items-center gap-3">
          <span
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#ffffff",
            }}
          >
            TACTICAL JOURNAL
          </span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00BFFF", boxShadow: "0 0 8px #00BFFF" }} />
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: showHistory ? "#00BFFF" : "rgba(0,191,255,0.5)",
            border: `1px solid ${showHistory ? "rgba(0,191,255,0.5)" : "rgba(0,191,255,0.15)"}`,
            padding: "6px 14px",
            background: showHistory ? "rgba(0,191,255,0.08)" : "transparent",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {showHistory ? "CLOSE ARCHIVE" : "VIEW ARCHIVE"}
        </button>
      </nav>

      <div className="relative max-w-5xl mx-auto px-6 py-10">

        {/* ARCHIVE PANEL */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div
                style={{
                  border: "1px solid rgba(0,191,255,0.15)",
                  background: "rgba(13,17,23,0.95)",
                  backdropFilter: "blur(16px)",
                  padding: "24px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.3em",
                    color: "rgba(0,191,255,0.6)",
                    marginBottom: "16px",
                  }}
                >
                  ◈ ENTRY ARCHIVE — {sortedDates.length} LOG{sortedDates.length !== 1 ? "S" : ""} ON RECORD
                </p>

                {sortedDates.length === 0 ? (
                  <p style={{ color: "rgba(150,180,200,0.5)", fontSize: "0.85rem" }}>
                    No entries recorded yet. Start writing today.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {sortedDates.map((d) => {
                      const e = entries[d];
                      const rc = getRatingColor(e.rating);
                      const isSelected = d === selectedDate;
                      return (
                        <motion.button
                          key={d}
                          whileHover={{ y: -2 }}
                          onClick={() => { setSelectedDate(d); setShowHistory(false); }}
                          style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: "0.65rem",
                            letterSpacing: "0.1em",
                            border: isSelected
                              ? `1px solid ${rc}`
                              : "1px solid rgba(0,191,255,0.2)",
                            background: isSelected
                              ? `rgba(0,191,255,0.08)`
                              : "transparent",
                            padding: "6px 14px",
                            cursor: "pointer",
                            color: isSelected ? rc : "rgba(150,180,200,0.8)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span>{formatShortDate(d)}</span>
                          <span style={{ color: rc, fontSize: "0.55rem" }}>
                            {e.rating}/10 · {getRatingLabel(e.rating)}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DATE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <p
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.35em",
                color: "rgba(0,191,255,0.5)",
                marginBottom: "6px",
              }}
            >
              {selectedDate === today ? "TODAY'S LOG" : "ARCHIVE ENTRY"}
            </p>
            <h1
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "clamp(1.1rem, 3vw, 1.8rem)",
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "#ffffff",
              }}
            >
              {formatDate(selectedDate)}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {selectedDate !== today && (
              <button
                onClick={() => setSelectedDate(today)}
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: "rgba(0,191,255,0.6)",
                  border: "1px solid rgba(0,191,255,0.2)",
                  padding: "6px 14px",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                → TODAY
              </button>
            )}
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsEditing(true)}
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: "#00BFFF",
                  border: "1px solid rgba(0,191,255,0.5)",
                  padding: "8px 20px",
                  background: "rgba(0,191,255,0.07)",
                  cursor: "pointer",
                  boxShadow: "0 0 14px rgba(0,191,255,0.15)",
                }}
              >
                {hasEntry(selectedDate) ? "✎ EDIT ENTRY" : "+ NEW ENTRY"}
              </motion.button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: "rgba(150,180,200,0.6)",
                    border: "1px solid rgba(150,180,200,0.2)",
                    padding: "8px 16px",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  CANCEL
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={saveEntry}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: saveFlash ? "#000" : "#00BFFF",
                    border: `1px solid ${saveFlash ? "#00FFB2" : "rgba(0,191,255,0.5)"}`,
                    padding: "8px 20px",
                    background: saveFlash ? "#00FFB2" : "rgba(0,191,255,0.07)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: saveFlash ? "0 0 20px rgba(0,255,178,0.5)" : "0 0 14px rgba(0,191,255,0.15)",
                  }}
                >
                  {saveFlash ? "✓ SAVED" : "⬆ SAVE LOG"}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* RATING SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
          style={{
            border: `1px solid ${isEditing ? ratingColor + "55" : "rgba(0,191,255,0.1)"}`,
            background: "rgba(13,17,23,0.9)",
            backdropFilter: "blur(16px)",
            padding: "24px 28px",
            transition: "border-color 0.3s",
          }}
        >
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.35em",
              color: "rgba(0,191,255,0.5)",
              marginBottom: "16px",
            }}
          >
            ◈ DAY RATING
          </p>

          <div className="flex items-center gap-6 flex-wrap">
            {/* Big rating display */}
            <div className="flex flex-col items-center">
              <span
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "clamp(2.5rem, 6vw, 4rem)",
                  fontWeight: 900,
                  color: ratingColor,
                  filter: `drop-shadow(0 0 20px ${ratingColor}88)`,
                  lineHeight: 1,
                  transition: "all 0.3s ease",
                }}
              >
                {draft.rating}
              </span>
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.5rem",
                  letterSpacing: "0.25em",
                  color: ratingColor,
                  marginTop: "4px",
                  transition: "color 0.3s",
                }}
              >
                {getRatingLabel(draft.rating)}
              </span>
            </div>

            {/* Rating buttons */}
            <div className="flex flex-wrap gap-2 flex-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
                const nc = getRatingColor(n);
                const active = draft.rating === n;
                return (
                  <motion.button
                    key={n}
                    whileHover={isEditing ? { scale: 1.12 } : {}}
                    whileTap={isEditing ? { scale: 0.9 } : {}}
                    onClick={() => isEditing && setDraft({ ...draft, rating: n })}
                    style={{
                      width: "42px",
                      height: "42px",
                      border: active
                        ? `1px solid ${nc}`
                        : "1px solid rgba(0,191,255,0.15)",
                      background: active ? `${nc}22` : "rgba(13,17,23,0.5)",
                      color: active ? nc : "rgba(150,180,200,0.5)",
                      fontFamily: "'Orbitron', monospace",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: isEditing ? "pointer" : "default",
                      boxShadow: active ? `0 0 12px ${nc}55` : "none",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {n}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* JOURNAL SECTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* WINS */}
          <JournalSection
            icon="▲"
            label="VICTORIES & WINS"
            iconColor="#00FFB2"
            placeholder="What did you accomplish today? No matter how small..."
            value={draft.wins}
            onChange={(v) => setDraft({ ...draft, wins: v })}
            isEditing={isEditing}
            delay={0.15}
          />

          {/* CHALLENGES */}
          <JournalSection
            icon="▼"
            label="CHALLENGES & FRICTION"
            iconColor="#FF4455"
            placeholder="What slowed you down? What felt hard?"
            value={draft.challenges}
            onChange={(v) => setDraft({ ...draft, challenges: v })}
            isEditing={isEditing}
            delay={0.2}
          />

          {/* TOMORROW PLAN */}
          <JournalSection
            icon="►"
            label="TOMORROW'S MISSION"
            iconColor="#FFB800"
            placeholder="Top 3 priorities for tomorrow..."
            value={draft.tomorrowPlan}
            onChange={(v) => setDraft({ ...draft, tomorrowPlan: v })}
            isEditing={isEditing}
            delay={0.25}
          />

          {/* MINDSET */}
          <JournalSection
            icon="◎"
            label="MINDSET & REFLECTION"
            iconColor="#00BFFF"
            placeholder="How are you feeling? What's on your mind?"
            value={draft.mindset}
            onChange={(v) => setDraft({ ...draft, mindset: v })}
            isEditing={isEditing}
            delay={0.3}
          />
        </div>

        {/* STATS STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap gap-4"
        >
          {[
            { label: "TOTAL ENTRIES", value: sortedDates.length },
            {
              label: "AVG RATING",
              value:
                sortedDates.length > 0
                  ? (
                      sortedDates.reduce((acc, d) => acc + entries[d].rating, 0) /
                      sortedDates.length
                    ).toFixed(1)
                  : "—",
            },
            {
              label: "BEST DAY",
              value:
                sortedDates.length > 0
                  ? `${Math.max(...sortedDates.map((d) => entries[d].rating))}/10`
                  : "—",
            },
            {
              label: "STREAK",
              value: (() => {
                let streak = 0;
                const cur = new Date();
                for (let i = 0; i < 365; i++) {
                  const d = new Date(cur);
                  d.setDate(cur.getDate() - i);
                  const key = d.toISOString().split("T")[0];
                  if (entries[key]) streak++;
                  else break;
                }
                return `${streak} DAY${streak !== 1 ? "S" : ""}`;
              })(),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                flex: "1 1 140px",
                border: "1px solid rgba(0,191,255,0.12)",
                background: "rgba(13,17,23,0.85)",
                padding: "16px 20px",
                backdropFilter: "blur(12px)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.5rem",
                  letterSpacing: "0.25em",
                  color: "rgba(0,191,255,0.5)",
                  marginBottom: "6px",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "#ffffff",
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

// ─── Sub-component: individual journal section ───────────────────────────────
function JournalSection({
  icon,
  label,
  iconColor,
  placeholder,
  value,
  onChange,
  isEditing,
  delay,
}: {
  icon: string;
  label: string;
  iconColor: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  isEditing: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        border: `1px solid ${isEditing ? iconColor + "33" : "rgba(0,191,255,0.1)"}`,
        background: "rgba(13,17,23,0.9)",
        backdropFilter: "blur(16px)",
        padding: "24px",
        transition: "border-color 0.3s",
        display: "flex",
        flexDirection: "column",
        minHeight: "220px",
      }}
    >
      {/* Top border glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${iconColor}, transparent)`,
          opacity: isEditing ? 0.6 : 0.2,
          transition: "opacity 0.3s",
        }}
      />

      <div className="flex items-center gap-3 mb-4">
        <span
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "1.2rem",
            color: iconColor,
            filter: `drop-shadow(0 0 8px ${iconColor}88)`,
          }}
        >
          {icon}
        </span>
        <p
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.28em",
            color: iconColor,
            opacity: 0.8,
          }}
        >
          {label}
        </p>
      </div>

      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: "rgba(0,0,0,0.3)",
            border: `1px solid ${iconColor}33`,
            color: "#e2e8f0",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            padding: "12px",
            resize: "none",
            outline: "none",
            minHeight: "140px",
          }}
          onFocus={(e) => (e.target.style.borderColor = `${iconColor}77`)}
          onBlur={(e) => (e.target.style.borderColor = `${iconColor}33`)}
        />
      ) : (
        <div
          style={{
            flex: 1,
            color: value ? "rgba(180, 200, 220, 0.85)" : "rgba(100,130,150,0.4)",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          {value || placeholder}
        </div>
      )}
    </motion.div>
  );
}

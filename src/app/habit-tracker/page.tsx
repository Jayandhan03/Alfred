"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  streak: number;
  bestStreak: number;
  completedDates: string[];
  createdAt: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Health: "#00BFFF",
  Mind: "#00FFB2",
  Discipline: "#FFB800",
  Growth: "#BF7FFF",
};

const DEFAULT_HABITS: Habit[] = [
  {
    id: "habit-1",
    name: "Morning Workout",
    icon: "⚡",
    color: "#00BFFF",
    category: "Health",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "habit-2",
    name: "Deep Work Session",
    icon: "◎",
    color: "#FFB800",
    category: "Discipline",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "habit-3",
    name: "Read 30 Minutes",
    icon: "▣",
    color: "#00FFB2",
    category: "Mind",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "habit-4",
    name: "No Junk Food",
    icon: "◈",
    color: "#BF7FFF",
    category: "Growth",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    createdAt: new Date().toISOString(),
  },
];

const PRESET_ICONS = ["⚡", "◎", "▣", "◈", "✦", "⬡", "◐", "⬢", "▲", "◉"];
const CATEGORIES = ["Health", "Mind", "Discipline", "Growth"];

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function getStreakFromDates(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort().reverse();
  const today = getTodayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i]);
    const prev = new Date(sorted[i + 1]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

export default function HabitTrackerPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [newHabit, setNewHabit] = useState({
    name: "",
    icon: "⚡",
    category: "Health",
  });
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const today = getTodayStr();
  const last30 = getLast30Days();

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("alfred-habits");
    if (stored) {
      const parsed = JSON.parse(stored) as Habit[];
      const updated = parsed.map((h) => ({
        ...h,
        streak: getStreakFromDates(h.completedDates),
      }));
      setHabits(updated);
    } else {
      setHabits(DEFAULT_HABITS);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("alfred-habits", JSON.stringify(habits));
    }
  }, [habits]);

  const toggleHabitToday = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const already = h.completedDates.includes(today);
        const newDates = already
          ? h.completedDates.filter((d) => d !== today)
          : [...h.completedDates, today];
        const streak = getStreakFromDates(newDates);
        return {
          ...h,
          completedDates: newDates,
          streak,
          bestStreak: Math.max(h.bestStreak, streak),
        };
      })
    );
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    const color = CATEGORY_COLORS[newHabit.category] || "#00BFFF";
    const habit: Habit = {
      id: `habit-${Date.now()}`,
      name: newHabit.name.trim(),
      icon: newHabit.icon,
      color,
      category: newHabit.category,
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, habit]);
    setNewHabit({ name: "", icon: "⚡", category: "Health" });
    setShowAddModal(false);
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setSelectedHabit(null);
  };

  const filtered =
    activeCategory === "All"
      ? habits
      : habits.filter((h) => h.category === activeCategory);

  const totalCompleted = habits.filter((h) =>
    h.completedDates.includes(today)
  ).length;
  const completionRate =
    habits.length > 0 ? Math.round((totalCompleted / habits.length) * 100) : 0;
  const longestActiveStreak = habits.reduce(
    (acc, h) => Math.max(acc, h.streak),
    0
  );

  return (
    <main
      className="min-h-screen w-full"
      style={{ background: "#000000", fontFamily: "'Rajdhani', sans-serif" }}
    >
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,191,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          zIndex: 0,
        }}
      />

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(0,0,0,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,191,255,0.1)",
        }}
      >
        <button
          onClick={() => router.push("/home")}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "rgba(0,191,255,0.6)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ← BACK
        </button>
        <span
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.9rem",
            fontWeight: 800,
            letterSpacing: "0.3em",
            background: "linear-gradient(135deg, #fff 0%, #BF7FFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          HABIT TRACKER
        </span>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            color: "#BF7FFF",
            background: "transparent",
            border: "1px solid rgba(191,127,255,0.4)",
            padding: "6px 16px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          + NEW HABIT
        </button>
      </nav>

      <div
        className="relative z-10 max-w-5xl mx-auto px-6"
        style={{ paddingTop: "100px", paddingBottom: "60px" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.4em",
              color: "rgba(191,127,255,0.6)",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            ◈ BEHAVIORAL FORGE
          </p>
          <h1
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "0.12em",
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            HABIT{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #BF7FFF, #00FFB2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              TRACKER
            </span>
          </h1>
          <p
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              color: "rgba(150,180,200,0.7)",
              marginTop: "10px",
              fontSize: "1rem",
            }}
          >
            Build unbreakable discipline. Track streaks. Forge your identity.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            {
              label: "TODAY'S COMPLETION",
              value: `${completionRate}%`,
              sub: `${totalCompleted}/${habits.length} habits`,
              color: "#00BFFF",
            },
            {
              label: "BEST ACTIVE STREAK",
              value: `${longestActiveStreak}d`,
              sub: "consecutive days",
              color: "#FFB800",
            },
            {
              label: "TOTAL HABITS",
              value: habits.length,
              sub: "being tracked",
              color: "#BF7FFF",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative p-5 flex flex-col"
              style={{
                background: "rgba(13,17,23,0.9)",
                border: `1px solid ${stat.color}22`,
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
                  opacity: 0.4,
                }}
              />
              <p
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.25em",
                  color: `${stat.color}99`,
                  marginBottom: "6px",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color: stat.color,
                  filter: `drop-shadow(0 0 8px ${stat.color}66)`,
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.6rem",
                  color: "rgba(150,180,200,0.5)",
                  marginTop: "4px",
                }}
              >
                {stat.sub}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex gap-3 mb-6 flex-wrap"
        >
          {["All", ...CATEGORIES].map((cat) => {
            const color =
              cat === "All" ? "#BF7FFF" : CATEGORY_COLORS[cat] || "#BF7FFF";
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  color: active ? color : "rgba(150,180,200,0.5)",
                  background: active ? `${color}15` : "transparent",
                  border: `1px solid ${active ? color + "55" : "rgba(150,180,200,0.15)"}`,
                  padding: "6px 16px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
              >
                {cat.toUpperCase()}
              </button>
            );
          })}
        </motion.div>

        {/* Habits List */}
        <div className="flex flex-col gap-3 mb-10">
          <AnimatePresence>
            {filtered.map((habit, i) => {
              const doneToday = habit.completedDates.includes(today);
              const color = habit.color;
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="relative flex items-center justify-between p-5 group"
                  style={{
                    background: doneToday ? `${color}0A` : "rgba(13,17,23,0.9)",
                    border: `1px solid ${doneToday ? color + "44" : "rgba(0,191,255,0.1)"}`,
                    backdropFilter: "blur(12px)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedHabit(habit)}
                >
                  {doneToday && (
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                      }}
                    />
                  )}

                  {/* Left: Icon + Info */}
                  <div className="flex items-center gap-4">
                    <span
                      style={{
                        fontSize: "1.8rem",
                        color: doneToday ? color : `${color}55`,
                        filter: doneToday
                          ? `drop-shadow(0 0 10px ${color}88)`
                          : "none",
                        transition: "all 0.3s ease",
                        lineHeight: 1,
                        width: "2.5rem",
                        textAlign: "center",
                      }}
                    >
                      {habit.icon}
                    </span>
                    <div>
                      <p
                        style={{
                          fontFamily: "'Orbitron', monospace",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          color: doneToday ? "#ffffff" : "rgba(200,220,240,0.7)",
                          transition: "color 0.3s",
                        }}
                      >
                        {habit.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: "0.55rem",
                            letterSpacing: "0.15em",
                            color: `${color}88`,
                            background: `${color}12`,
                            border: `1px solid ${color}22`,
                            padding: "1px 7px",
                          }}
                        >
                          {habit.category.toUpperCase()}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: "0.6rem",
                            color: "rgba(150,180,200,0.5)",
                          }}
                        >
                          BEST: {habit.bestStreak}d
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Streak + Toggle */}
                  <div
                    className="flex items-center gap-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Streak */}
                    <div className="text-right">
                      <p
                        style={{
                          fontFamily: "'Orbitron', monospace",
                          fontSize: "1.4rem",
                          fontWeight: 800,
                          color: habit.streak > 0 ? color : "rgba(150,180,200,0.25)",
                          filter:
                            habit.streak > 0
                              ? `drop-shadow(0 0 6px ${color}66)`
                              : "none",
                          lineHeight: 1,
                        }}
                      >
                        {habit.streak}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Share Tech Mono', monospace",
                          fontSize: "0.5rem",
                          letterSpacing: "0.15em",
                          color: "rgba(150,180,200,0.4)",
                        }}
                      >
                        STREAK
                      </p>
                    </div>

                    {/* Check button */}
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={() => toggleHabitToday(habit.id)}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: doneToday ? `${color}25` : "rgba(13,17,23,0.9)",
                        border: `2px solid ${doneToday ? color : "rgba(150,180,200,0.2)"}`,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        transition: "all 0.3s ease",
                        boxShadow: doneToday
                          ? `0 0 16px ${color}55`
                          : "none",
                        color: doneToday ? color : "rgba(150,180,200,0.3)",
                      }}
                    >
                      {doneToday ? "✓" : "○"}
                    </motion.button>
                  </div>

                  {/* Bottom corner accent */}
                  <div
                    className="absolute bottom-0 right-0 w-5 h-5"
                    style={{
                      borderBottom: `1px solid ${color}33`,
                      borderRight: `1px solid ${color}33`,
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div
              className="text-center py-16"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                color: "rgba(150,180,200,0.3)",
                fontSize: "0.75rem",
                letterSpacing: "0.25em",
              }}
            >
              NO HABITS IN THIS CATEGORY
              <br />
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  marginTop: "16px",
                  color: "#BF7FFF",
                  background: "transparent",
                  border: "1px solid rgba(191,127,255,0.3)",
                  padding: "8px 20px",
                  cursor: "pointer",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                }}
              >
                + ADD HABIT
              </button>
            </div>
          )}
        </div>

        {/* 30-Day Heatmap */}
        {habits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="relative p-6"
            style={{
              background: "rgba(13,17,23,0.9)",
              border: "1px solid rgba(191,127,255,0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #BF7FFF, transparent)",
                opacity: 0.4,
              }}
            />
            <p
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.3em",
                color: "rgba(191,127,255,0.6)",
                marginBottom: "16px",
              }}
            >
              ◈ 30-DAY COMPLETION HEATMAP
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {last30.map((dateStr) => {
                const completedCount = habits.filter((h) =>
                  h.completedDates.includes(dateStr)
                ).length;
                const ratio =
                  habits.length > 0 ? completedCount / habits.length : 0;
                const isToday = dateStr === today;
                const opacity =
                  ratio === 0 ? 0.06 : 0.15 + ratio * 0.85;
                const day = new Date(dateStr + "T00:00:00").getDate();

                return (
                  <div
                    key={dateStr}
                    title={`${dateStr}: ${completedCount}/${habits.length} habits`}
                    style={{
                      width: "28px",
                      height: "28px",
                      background: `rgba(191,127,255,${opacity})`,
                      border: isToday
                        ? "1.5px solid #BF7FFF"
                        : "1px solid rgba(191,127,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isToday ? "0 0 8px rgba(191,127,255,0.4)" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: "0.5rem",
                        color: ratio > 0.5 ? "rgba(255,255,255,0.8)" : "rgba(150,180,200,0.4)",
                      }}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.5rem",
                  color: "rgba(150,180,200,0.4)",
                  letterSpacing: "0.15em",
                }}
              >
                LESS
              </span>
              {[0.06, 0.3, 0.55, 0.75, 0.97].map((op, i) => (
                <div
                  key={i}
                  style={{
                    width: "14px",
                    height: "14px",
                    background: `rgba(191,127,255,${op})`,
                    border: "1px solid rgba(191,127,255,0.15)",
                  }}
                />
              ))}
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.5rem",
                  color: "rgba(150,180,200,0.4)",
                  letterSpacing: "0.15em",
                }}
              >
                MORE
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md p-8"
              style={{
                background: "rgba(10,12,18,0.98)",
                border: "1px solid rgba(191,127,255,0.3)",
                backdropFilter: "blur(20px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #BF7FFF, transparent)",
                }}
              />
              <p
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  color: "#ffffff",
                  marginBottom: "24px",
                }}
              >
                NEW HABIT PROTOCOL
              </p>

              {/* Name */}
              <div className="mb-5">
                <label
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.25em",
                    color: "rgba(191,127,255,0.6)",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  HABIT NAME
                </label>
                <input
                  value={newHabit.name}
                  onChange={(e) =>
                    setNewHabit((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Cold Shower, Meditation..."
                  style={{
                    width: "100%",
                    background: "rgba(13,17,23,0.9)",
                    border: "1px solid rgba(191,127,255,0.2)",
                    color: "#ffffff",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "1rem",
                    padding: "10px 14px",
                    outline: "none",
                  }}
                  onKeyDown={(e) => e.key === "Enter" && addHabit()}
                />
              </div>

              {/* Icon Picker */}
              <div className="mb-5">
                <label
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.25em",
                    color: "rgba(191,127,255,0.6)",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  ICON
                </label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() =>
                        setNewHabit((p) => ({ ...p, icon }))
                      }
                      style={{
                        width: "36px",
                        height: "36px",
                        fontSize: "1.2rem",
                        background:
                          newHabit.icon === icon
                            ? "rgba(191,127,255,0.2)"
                            : "rgba(13,17,23,0.9)",
                        border: `1px solid ${newHabit.icon === icon ? "rgba(191,127,255,0.6)" : "rgba(191,127,255,0.1)"}`,
                        cursor: "pointer",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-7">
                <label
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.25em",
                    color: "rgba(191,127,255,0.6)",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  CATEGORY
                </label>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map((cat) => {
                    const color = CATEGORY_COLORS[cat];
                    const active = newHabit.category === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() =>
                          setNewHabit((p) => ({ ...p, category: cat }))
                        }
                        style={{
                          fontFamily: "'Share Tech Mono', monospace",
                          fontSize: "0.55rem",
                          letterSpacing: "0.15em",
                          color: active ? color : "rgba(150,180,200,0.4)",
                          background: active ? `${color}18` : "transparent",
                          border: `1px solid ${active ? color + "55" : "rgba(150,180,200,0.15)"}`,
                          padding: "6px 14px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {cat.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={addHabit}
                  style={{
                    flex: 1,
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: "#000000",
                    background: "#BF7FFF",
                    border: "none",
                    padding: "12px",
                    cursor: "pointer",
                    boxShadow: "0 0 20px rgba(191,127,255,0.4)",
                    transition: "all 0.2s ease",
                  }}
                >
                  FORGE HABIT
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    color: "rgba(150,180,200,0.5)",
                    background: "transparent",
                    border: "1px solid rgba(150,180,200,0.15)",
                    padding: "12px 20px",
                    cursor: "pointer",
                  }}
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habit Detail Modal */}
      <AnimatePresence>
        {selectedHabit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelectedHabit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md p-8"
              style={{
                background: "rgba(10,12,18,0.98)",
                border: `1px solid ${selectedHabit.color}33`,
                backdropFilter: "blur(20px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${selectedHabit.color}, transparent)`,
                }}
              />

              <div className="flex items-center gap-4 mb-6">
                <span
                  style={{
                    fontSize: "2.5rem",
                    color: selectedHabit.color,
                    filter: `drop-shadow(0 0 12px ${selectedHabit.color}88)`,
                  }}
                >
                  {selectedHabit.icon}
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: "'Orbitron', monospace",
                      fontSize: "1rem",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      color: "#ffffff",
                    }}
                  >
                    {selectedHabit.name}
                  </p>
                  <span
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.55rem",
                      letterSpacing: "0.15em",
                      color: `${selectedHabit.color}99`,
                      background: `${selectedHabit.color}15`,
                      border: `1px solid ${selectedHabit.color}22`,
                      padding: "2px 8px",
                      display: "inline-block",
                      marginTop: "4px",
                    }}
                  >
                    {selectedHabit.category.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  {
                    label: "CURRENT STREAK",
                    val: `${selectedHabit.streak}d`,
                  },
                  {
                    label: "BEST STREAK",
                    val: `${selectedHabit.bestStreak}d`,
                  },
                  {
                    label: "TOTAL DAYS",
                    val: selectedHabit.completedDates.length,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-3 text-center"
                    style={{
                      background: "rgba(13,17,23,0.9)",
                      border: `1px solid ${selectedHabit.color}22`,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: "1.4rem",
                        fontWeight: 800,
                        color: selectedHabit.color,
                        filter: `drop-shadow(0 0 5px ${selectedHabit.color}66)`,
                      }}
                    >
                      {s.val}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: "0.45rem",
                        letterSpacing: "0.12em",
                        color: "rgba(150,180,200,0.4)",
                        marginTop: "3px",
                      }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => toggleHabitToday(selectedHabit.id)}
                  style={{
                    flex: 1,
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: selectedHabit.completedDates.includes(today)
                      ? "rgba(150,180,200,0.6)"
                      : "#000",
                    background: selectedHabit.completedDates.includes(today)
                      ? "transparent"
                      : selectedHabit.color,
                    border: `1px solid ${selectedHabit.color}66`,
                    padding: "10px",
                    cursor: "pointer",
                    boxShadow: !selectedHabit.completedDates.includes(today)
                      ? `0 0 20px ${selectedHabit.color}44`
                      : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {selectedHabit.completedDates.includes(today)
                    ? "MARK INCOMPLETE"
                    : "MARK COMPLETE"}
                </button>
                <button
                  onClick={() => deleteHabit(selectedHabit.id)}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    color: "rgba(255,68,68,0.6)",
                    background: "transparent",
                    border: "1px solid rgba(255,68,68,0.2)",
                    padding: "10px 16px",
                    cursor: "pointer",
                  }}
                >
                  DELETE
                </button>
                <button
                  onClick={() => setSelectedHabit(null)}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    color: "rgba(150,180,200,0.4)",
                    background: "transparent",
                    border: "1px solid rgba(150,180,200,0.1)",
                    padding: "10px 14px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

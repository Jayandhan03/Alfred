"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

interface Milestone {
  id: string;
  text: string;
  done: boolean;
}

interface Goal {
  id: string;
  title: string;
  category: "Fitness" | "Learning" | "Projects" | "Finance";
  description: string;
  progress: number; // 0-100
  milestones: Milestone[];
  createdAt: string;
  targetDate: string;
}

const CATEGORY_META: Record<string, { icon: string; color: string; glow: string }> = {
  Fitness:  { icon: "⚡", color: "#00FF88", glow: "rgba(0,255,136,0.4)" },
  Learning: { icon: "◈", color: "#00BFFF", glow: "rgba(0,191,255,0.4)" },
  Projects: { icon: "▣", color: "#FFB800", glow: "rgba(255,184,0,0.4)"  },
  Finance:  { icon: "⬡", color: "#FF66CC", glow: "rgba(255,102,204,0.4)" },
};

const CATEGORIES = ["Fitness", "Learning", "Projects", "Finance"] as const;

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

const STORAGE_KEY = "alfred_goals";

function loadGoals(): Goal[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveGoals(goals: Goal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export default function GoalTrackerPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newMilestoneText, setNewMilestoneText] = useState<Record<string, string>>({});

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated()) router.replace("/");
  }, [router]);

  // Load on mount
  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  // Form state
  const [form, setForm] = useState({
    title: "",
    category: "Learning" as Goal["category"],
    description: "",
    targetDate: "",
  });

  function handleAddGoal() {
    if (!form.title.trim()) return;
    const newGoal: Goal = {
      id: generateId(),
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      progress: 0,
      milestones: [],
      createdAt: new Date().toISOString(),
      targetDate: form.targetDate,
    };
    const updated = [newGoal, ...goals];
    setGoals(updated);
    saveGoals(updated);
    setForm({ title: "", category: "Learning", description: "", targetDate: "" });
    setShowForm(false);
  }

  function handleDeleteGoal(id: string) {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveGoals(updated);
    if (expandedId === id) setExpandedId(null);
  }

  function handleProgressChange(id: string, value: number) {
    const updated = goals.map((g) => g.id === id ? { ...g, progress: value } : g);
    setGoals(updated);
    saveGoals(updated);
  }

  function handleAddMilestone(goalId: string) {
    const text = (newMilestoneText[goalId] || "").trim();
    if (!text) return;
    const updated = goals.map((g) =>
      g.id === goalId
        ? { ...g, milestones: [...g.milestones, { id: generateId(), text, done: false }] }
        : g
    );
    setGoals(updated);
    saveGoals(updated);
    setNewMilestoneText((prev) => ({ ...prev, [goalId]: "" }));
  }

  function handleToggleMilestone(goalId: string, milestoneId: string) {
    const updated = goals.map((g) =>
      g.id === goalId
        ? {
            ...g,
            milestones: g.milestones.map((m) =>
              m.id === milestoneId ? { ...m, done: !m.done } : m
            ),
          }
        : g
    );
    setGoals(updated);
    saveGoals(updated);
  }

  function handleDeleteMilestone(goalId: string, milestoneId: string) {
    const updated = goals.map((g) =>
      g.id === goalId
        ? { ...g, milestones: g.milestones.filter((m) => m.id !== milestoneId) }
        : g
    );
    setGoals(updated);
    saveGoals(updated);
  }

  const totalGoals = goals.length;
  const avgProgress =
    totalGoals === 0 ? 0 : Math.round(goals.reduce((s, g) => s + g.progress, 0) / totalGoals);
  const completedGoals = goals.filter((g) => g.progress === 100).length;

  return (
    <main
      className="min-h-screen w-full"
      style={{ background: "#000000", fontFamily: "'Rajdhani', sans-serif" }}
    >
      {/* Scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,191,255,0.01) 2px, rgba(0,191,255,0.01) 4px)",
          zIndex: 0,
        }}
      />

      {/* Radial glow bg */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(0,191,255,0.04) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <div className="relative" style={{ zIndex: 1 }}>
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{
            borderBottom: "1px solid rgba(0,191,255,0.1)",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(16px)",
          }}
        >
          <button
            onClick={() => router.push("/home")}
            className="flex items-center gap-2"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: "rgba(0,191,255,0.6)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ← BACK TO BASE
          </button>

          <span
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "0.9rem",
              fontWeight: 700,
              letterSpacing: "0.25em",
              color: "#00BFFF",
              filter: "drop-shadow(0 0 8px rgba(0,191,255,0.6))",
            }}
          >
            ALFRED / GOAL TRACKER
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowForm((v) => !v)}
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: showForm ? "#000" : "#00BFFF",
              background: showForm
                ? "linear-gradient(135deg, #00BFFF, #0080FF)"
                : "transparent",
              border: "1px solid rgba(0,191,255,0.5)",
              padding: "8px 18px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {showForm ? "✕ CANCEL" : "+ NEW GOAL"}
          </motion.button>
        </div>

        {/* Stats strip */}
        <div
          className="grid grid-cols-3"
          style={{ borderBottom: "1px solid rgba(0,191,255,0.08)" }}
        >
          {[
            { label: "TOTAL GOALS", value: totalGoals },
            { label: "AVG PROGRESS", value: `${avgProgress}%` },
            { label: "COMPLETED", value: completedGoals },
          ].map((s) => (
            <div
              key={s.label}
              className="py-5 text-center"
              style={{ borderRight: "1px solid rgba(0,191,255,0.08)" }}
            >
              <p
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color: "#00BFFF",
                  filter: "drop-shadow(0 0 12px rgba(0,191,255,0.5))",
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.25em",
                  color: "rgba(0,191,255,0.45)",
                  marginTop: 4,
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-5xl px-6 py-10" style={{ margin: "0 auto" }}>

          {/* New Goal Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="mb-8 p-7"
                style={{
                  background: "rgba(13,17,23,0.95)",
                  border: "1px solid rgba(0,191,255,0.25)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 0 40px rgba(0,191,255,0.07)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.3em",
                    color: "rgba(0,191,255,0.6)",
                    marginBottom: 20,
                  }}
                >
                  ◈ DEFINE NEW OBJECTIVE
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {/* Title */}
                  <div>
                    <label style={labelStyle}>GOAL TITLE</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Build 100% habit streak"
                      style={inputStyle}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label style={labelStyle}>CATEGORY</label>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {CATEGORIES.map((cat) => {
                        const meta = CATEGORY_META[cat];
                        const active = form.category === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setForm({ ...form, category: cat })}
                            style={{
                              fontFamily: "'Share Tech Mono', monospace",
                              fontSize: "0.6rem",
                              letterSpacing: "0.1em",
                              padding: "5px 12px",
                              border: `1px solid ${active ? meta.color : "rgba(0,191,255,0.15)"}`,
                              background: active ? `${meta.color}18` : "transparent",
                              color: active ? meta.color : "rgba(150,180,200,0.5)",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              boxShadow: active ? `0 0 12px ${meta.glow}` : "none",
                            }}
                          >
                            {meta.icon} {cat.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={labelStyle}>DESCRIPTION</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="What does achieving this look like?"
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>

                  {/* Target Date */}
                  <div>
                    <label style={labelStyle}>TARGET DATE</label>
                    <input
                      type="date"
                      value={form.targetDate}
                      onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                      style={{ ...inputStyle, colorScheme: "dark" }}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(0,191,255,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddGoal}
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: "#000",
                    background: "linear-gradient(135deg, #00BFFF, #0080FF)",
                    border: "none",
                    padding: "12px 28px",
                    cursor: "pointer",
                  }}
                >
                  ⬡ LOCK IN OBJECTIVE
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Goal List */}
          {goals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "2rem",
                  color: "rgba(0,191,255,0.15)",
                  letterSpacing: "0.2em",
                }}
              >
                NO OBJECTIVES SET
              </p>
              <p
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.65rem",
                  color: "rgba(0,191,255,0.3)",
                  letterSpacing: "0.25em",
                  marginTop: 12,
                }}
              >
                DEFINE YOUR FIRST GOAL TO BEGIN
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              {goals.map((goal, i) => {
                const meta = CATEGORY_META[goal.category];
                const isExpanded = expandedId === goal.id;
                const doneMilestones = goal.milestones.filter((m) => m.done).length;

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      background: "rgba(13,17,23,0.9)",
                      border: `1px solid ${isExpanded ? meta.color + "55" : "rgba(0,191,255,0.1)"}`,
                      backdropFilter: "blur(16px)",
                      transition: "border-color 0.35s ease",
                      boxShadow: isExpanded ? `0 0 30px ${meta.glow}30` : "none",
                    }}
                  >
                    {/* Goal header */}
                    <div
                      className="flex items-center gap-5 p-6 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : goal.id)}
                    >
                      {/* Category icon */}
                      <div
                        style={{
                          fontSize: "1.8rem",
                          color: meta.color,
                          filter: `drop-shadow(0 0 10px ${meta.glow})`,
                          lineHeight: 1,
                          minWidth: 40,
                          textAlign: "center",
                        }}
                      >
                        {meta.icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3
                            style={{
                              fontFamily: "'Orbitron', monospace",
                              fontSize: "0.95rem",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              color: "#fff",
                            }}
                          >
                            {goal.title}
                          </h3>
                          <span
                            style={{
                              fontFamily: "'Share Tech Mono', monospace",
                              fontSize: "0.55rem",
                              letterSpacing: "0.1em",
                              padding: "2px 8px",
                              border: `1px solid ${meta.color}55`,
                              background: `${meta.color}12`,
                              color: meta.color,
                            }}
                          >
                            {goal.category.toUpperCase()}
                          </span>
                          {goal.progress === 100 && (
                            <span
                              style={{
                                fontFamily: "'Share Tech Mono', monospace",
                                fontSize: "0.55rem",
                                letterSpacing: "0.1em",
                                padding: "2px 8px",
                                border: "1px solid rgba(0,255,136,0.4)",
                                background: "rgba(0,255,136,0.08)",
                                color: "#00FF88",
                              }}
                            >
                              ✓ COMPLETE
                            </span>
                          )}
                        </div>

                        {/* Progress bar */}
                        <div style={{ marginBottom: 4 }}>
                          <div
                            style={{
                              height: "4px",
                              background: "rgba(255,255,255,0.05)",
                              borderRadius: 8,
                              overflow: "hidden",
                            }}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.progress}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              style={{
                                height: "100%",
                                background: `linear-gradient(90deg, ${meta.color}, ${meta.color}99)`,
                                boxShadow: `0 0 8px ${meta.glow}`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <span
                              style={{
                                fontFamily: "'Share Tech Mono', monospace",
                                fontSize: "0.55rem",
                                color: "rgba(120,150,180,0.5)",
                                letterSpacing: "0.1em",
                              }}
                            >
                              {doneMilestones}/{goal.milestones.length} MILESTONES
                            </span>
                            <span
                              style={{
                                fontFamily: "'Share Tech Mono', monospace",
                                fontSize: "0.55rem",
                                color: meta.color,
                                letterSpacing: "0.1em",
                              }}
                            >
                              {goal.progress}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expand chevron */}
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                          color: "rgba(0,191,255,0.4)",
                          fontSize: "0.8rem",
                          lineHeight: 1,
                        }}
                      >
                        ▼
                      </motion.span>
                    </div>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              borderTop: `1px solid ${meta.color}22`,
                              padding: "20px 24px 24px",
                            }}
                          >
                            {/* Description & date row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              {goal.description && (
                                <div>
                                  <p
                                    style={{
                                      fontFamily: "'Share Tech Mono', monospace",
                                      fontSize: "0.55rem",
                                      letterSpacing: "0.25em",
                                      color: "rgba(0,191,255,0.4)",
                                      marginBottom: 6,
                                    }}
                                  >
                                    OBJECTIVE BRIEF
                                  </p>
                                  <p
                                    style={{
                                      fontFamily: "'Rajdhani', sans-serif",
                                      fontSize: "0.88rem",
                                      color: "rgba(150,180,200,0.75)",
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {goal.description}
                                  </p>
                                </div>
                              )}

                              <div>
                                {goal.targetDate && (
                                  <>
                                    <p
                                      style={{
                                        fontFamily: "'Share Tech Mono', monospace",
                                        fontSize: "0.55rem",
                                        letterSpacing: "0.25em",
                                        color: "rgba(0,191,255,0.4)",
                                        marginBottom: 6,
                                      }}
                                    >
                                      TARGET DATE
                                    </p>
                                    <p
                                      style={{
                                        fontFamily: "'Orbitron', monospace",
                                        fontSize: "0.85rem",
                                        color: meta.color,
                                      }}
                                    >
                                      {new Date(goal.targetDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Progress slider */}
                            <div className="mb-6">
                              <p
                                style={{
                                  fontFamily: "'Share Tech Mono', monospace",
                                  fontSize: "0.55rem",
                                  letterSpacing: "0.25em",
                                  color: "rgba(0,191,255,0.4)",
                                  marginBottom: 8,
                                }}
                              >
                                MISSION PROGRESS — {goal.progress}%
                              </p>
                              <input
                                type="range"
                                min={0}
                                max={100}
                                value={goal.progress}
                                onChange={(e) =>
                                  handleProgressChange(goal.id, Number(e.target.value))
                                }
                                style={{
                                  width: "100%",
                                  accentColor: meta.color,
                                  cursor: "pointer",
                                }}
                              />
                            </div>

                            {/* Milestones */}
                            <div className="mb-6">
                              <p
                                style={{
                                  fontFamily: "'Share Tech Mono', monospace",
                                  fontSize: "0.55rem",
                                  letterSpacing: "0.25em",
                                  color: "rgba(0,191,255,0.4)",
                                  marginBottom: 10,
                                }}
                              >
                                MILESTONES
                              </p>

                              {goal.milestones.length === 0 && (
                                <p
                                  style={{
                                    fontFamily: "'Share Tech Mono', monospace",
                                    fontSize: "0.6rem",
                                    color: "rgba(120,150,180,0.35)",
                                    letterSpacing: "0.1em",
                                    marginBottom: 10,
                                  }}
                                >
                                  NO MILESTONES YET
                                </p>
                              )}

                              <div className="flex flex-col gap-2 mb-3">
                                {goal.milestones.map((ms) => (
                                  <div
                                    key={ms.id}
                                    className="flex items-center gap-3"
                                    style={{
                                      padding: "8px 12px",
                                      background: ms.done
                                        ? `${meta.color}0A`
                                        : "rgba(255,255,255,0.02)",
                                      border: `1px solid ${ms.done ? meta.color + "33" : "rgba(255,255,255,0.06)"}`,
                                      transition: "all 0.25s ease",
                                    }}
                                  >
                                    <button
                                      onClick={() => handleToggleMilestone(goal.id, ms.id)}
                                      style={{
                                        width: 16,
                                        height: 16,
                                        border: `1px solid ${ms.done ? meta.color : "rgba(0,191,255,0.25)"}`,
                                        background: ms.done ? meta.color : "transparent",
                                        cursor: "pointer",
                                        color: "#000",
                                        fontSize: "0.6rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        transition: "all 0.2s ease",
                                      }}
                                    >
                                      {ms.done ? "✓" : ""}
                                    </button>
                                    <span
                                      style={{
                                        fontFamily: "'Rajdhani', sans-serif",
                                        fontSize: "0.85rem",
                                        color: ms.done
                                          ? "rgba(150,180,200,0.45)"
                                          : "rgba(180,200,220,0.8)",
                                        textDecoration: ms.done ? "line-through" : "none",
                                        flex: 1,
                                        transition: "all 0.2s ease",
                                      }}
                                    >
                                      {ms.text}
                                    </span>
                                    <button
                                      onClick={() => handleDeleteMilestone(goal.id, ms.id)}
                                      style={{
                                        background: "none",
                                        border: "none",
                                        color: "rgba(255,68,68,0.4)",
                                        cursor: "pointer",
                                        fontSize: "0.7rem",
                                        transition: "color 0.2s",
                                        padding: "0 4px",
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.color = "#FF4444")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.color = "rgba(255,68,68,0.4)")
                                      }
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>

                              {/* Add milestone input */}
                              <div className="flex gap-2">
                                <input
                                  value={newMilestoneText[goal.id] || ""}
                                  onChange={(e) =>
                                    setNewMilestoneText((prev) => ({
                                      ...prev,
                                      [goal.id]: e.target.value,
                                    }))
                                  }
                                  onKeyDown={(e) =>
                                    e.key === "Enter" && handleAddMilestone(goal.id)
                                  }
                                  placeholder="Add milestone..."
                                  style={{
                                    ...inputStyle,
                                    flex: 1,
                                    padding: "7px 12px",
                                    fontSize: "0.8rem",
                                  }}
                                />
                                <button
                                  onClick={() => handleAddMilestone(goal.id)}
                                  style={{
                                    fontFamily: "'Orbitron', monospace",
                                    fontSize: "0.6rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    color: "#000",
                                    background: `linear-gradient(135deg, ${meta.color}, ${meta.color}99)`,
                                    border: "none",
                                    padding: "7px 16px",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  + ADD
                                </button>
                              </div>
                            </div>

                            {/* Delete goal */}
                            <button
                              onClick={() => handleDeleteGoal(goal.id)}
                              style={{
                                fontFamily: "'Share Tech Mono', monospace",
                                fontSize: "0.6rem",
                                letterSpacing: "0.15em",
                                color: "rgba(255,68,68,0.5)",
                                background: "none",
                                border: "1px solid rgba(255,68,68,0.2)",
                                padding: "6px 14px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#FF4444";
                                e.currentTarget.style.borderColor = "rgba(255,68,68,0.6)";
                                e.currentTarget.style.background = "rgba(255,68,68,0.06)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "rgba(255,68,68,0.5)";
                                e.currentTarget.style.borderColor = "rgba(255,68,68,0.2)";
                                e.currentTarget.style.background = "none";
                              }}
                            >
                              ✕ TERMINATE OBJECTIVE
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// Shared styles
const labelStyle: React.CSSProperties = {
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: "0.55rem",
  letterSpacing: "0.25em",
  color: "rgba(0,191,255,0.45)",
  display: "block",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(0,191,255,0.15)",
  color: "rgba(180,200,220,0.9)",
  padding: "10px 14px",
  fontFamily: "'Rajdhani', sans-serif",
  fontSize: "0.88rem",
  outline: "none",
  transition: "border-color 0.25s ease",
  boxSizing: "border-box",
};

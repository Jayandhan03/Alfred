"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  getDayLog,
  saveDayLog,
  type DayLog,
  type DailyTask,
  type AreaLog,
  type TaskCategory,
} from "@/lib/performanceDb";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActiveTab = "tasks" | "workout" | "diet" | "ai-code" | "creations";

interface AreaConfig {
  key: keyof Pick<DayLog, "workout" | "diet" | "aiCode" | "creations">;
  label: string;
  icon: string;
  color: string;
  placeholder: string;
}

const AREAS: AreaConfig[] = [
  {
    key: "workout",
    label: "WORKOUT",
    icon: "◉",
    color: "#00BFFF",
    placeholder: "Log today's workout — sets, reps, duration, energy level...",
  },
  {
    key: "diet",
    label: "DIET",
    icon: "◈",
    color: "#00FFB2",
    placeholder: "Track meals, macros, hydration, any supplements...",
  },
  {
    key: "aiCode",
    label: "AI CODE",
    icon: "▣",
    color: "#BF7FFF",
    placeholder: "Document AI projects worked on, models tested, code written, breakthroughs...",
  },
  {
    key: "creations",
    label: "CREATIONS",
    icon: "⬡",
    color: "#FFD700",
    placeholder: "Log creative work — designs, videos, music, writing, art...",
  },
];

function formatDate(dateStr: string): { day: string; month: string; year: string; weekday: string } {
  const d = new Date(dateStr + "T12:00:00");
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: months[d.getMonth()].toUpperCase(),
    year: String(d.getFullYear()),
    weekday: weekdays[d.getDay()].toUpperCase(),
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DayLogPage() {
  const params = useParams();
  const router = useRouter();
  const dateStr = params.date as string;
  const formatted = dateStr ? formatDate(dateStr) : null;

  const [log, setLog] = useState<DayLog | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("tasks");
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>("general");
  const [saving, setSaving] = useState(false);
  const [savedPulse, setSavedPulse] = useState(false);

  useEffect(() => {
    if (dateStr) {
      setLog(getDayLog(dateStr));
    }
  }, [dateStr]);

  const save = useCallback(
    (updatedLog: DayLog) => {
      setSaving(true);
      saveDayLog(updatedLog);
      setTimeout(() => {
        setSaving(false);
        setSavedPulse(true);
        setTimeout(() => setSavedPulse(false), 1200);
      }, 350);
    },
    []
  );

  // Auto-save on changes (debounced via setTimeout)
  const updateLog = (updater: (prev: DayLog) => DayLog) => {
    setLog((prev) => {
      if (!prev) return prev;
      const updated = updater(prev);
      save(updated);
      return updated;
    });
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const task: DailyTask = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
      category: newTaskCategory,
    };
    updateLog((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
    setNewTaskText("");
  };

  const toggleTask = (id: string) => {
    updateLog((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const deleteTask = (id: string) => {
    updateLog((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
  };

  const updateArea = (areaKey: keyof Pick<DayLog, "workout" | "diet" | "aiCode" | "creations">, field: keyof AreaLog, value: string | boolean) => {
    updateLog((prev) => ({
      ...prev,
      [areaKey]: { ...prev[areaKey], [field]: value },
    }));
  };

  if (!log || !formatted) {
    return (
      <main style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", color: "rgba(0,191,255,0.5)", letterSpacing: "0.3em", fontSize: "0.7rem" }}>
          LOADING MISSION DATA...
        </span>
      </main>
    );
  }

  const completedTasks = log.tasks.filter((t) => t.completed).length;
  const totalTasks = log.tasks.length;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const tabDef: { key: ActiveTab; label: string; icon: string; color?: string }[] = [
    { key: "tasks", label: "TASKS", icon: "◈" },
    ...AREAS.map((a) => ({ key: a.key as ActiveTab, label: a.label, icon: a.icon, color: a.color })),
  ];

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
            "linear-gradient(rgba(0, 191, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 191, 255, 0.025) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "900px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Close / back */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <button
              onClick={() => router.back()}
              style={{
                background: "none",
                border: "1px solid rgba(0, 191, 255, 0.2)",
                color: "rgba(0, 191, 255, 0.65)",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                padding: "7px 14px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0, 191, 255, 0.5)";
                (e.currentTarget as HTMLButtonElement).style.color = "#00BFFF";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0, 191, 255, 0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0, 191, 255, 0.2)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(0, 191, 255, 0.65)";
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
            >
              ← BACK
            </button>

            {/* Save indicator */}
            <span
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                color: saving ? "#00BFFF" : savedPulse ? "#00FFB2" : "rgba(0,191,255,0.3)",
                transition: "color 0.3s",
              }}
            >
              {saving ? "● SAVING..." : savedPulse ? "✓ SAVED" : "AUTO-SAVE ENABLED"}
            </span>
          </div>

          {/* Date display */}
          <div style={{ marginBottom: "28px" }}>
            <p
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.4em",
                color: "rgba(0, 191, 255, 0.5)",
                marginBottom: "6px",
              }}
            >
              ◎ MISSION LOG — {formatted.weekday}
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
              <h1
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "clamp(2rem, 6vw, 3.5rem)",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "0.1em",
                  lineHeight: 1,
                  textShadow: "0 0 40px rgba(0,191,255,0.15)",
                }}
              >
                {formatted.day}
              </h1>
              <div>
                <div
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#00BFFF",
                    letterSpacing: "0.15em",
                  }}
                >
                  {formatted.month}
                </div>
                <div
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.65rem",
                    color: "rgba(0, 191, 255, 0.45)",
                    letterSpacing: "0.2em",
                  }}
                >
                  {formatted.year}
                </div>
              </div>
            </div>
            <div
              style={{
                height: "1px",
                width: "80px",
                background: "linear-gradient(90deg, #00BFFF, transparent)",
                marginTop: "12px",
              }}
            />
          </div>

          {/* Progress bar */}
          <div
            style={{
              background: "rgba(13, 17, 23, 0.8)",
              border: "1px solid rgba(0, 191, 255, 0.12)",
              padding: "16px 20px",
              marginBottom: "28px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.2em",
                    color: "rgba(0,191,255,0.5)",
                  }}
                >
                  MISSION PROGRESS
                </span>
                <span
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "0.65rem",
                    color: "#00BFFF",
                    fontWeight: 700,
                  }}
                >
                  {completedTasks}/{totalTasks}
                </span>
              </div>
              <div
                style={{
                  height: "4px",
                  background: "rgba(0,191,255,0.08)",
                  border: "1px solid rgba(0,191,255,0.1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    inset: "0 auto 0 0",
                    background: "linear-gradient(90deg, #00BFFF, #00FFB2)",
                    boxShadow: "0 0 8px rgba(0,191,255,0.6)",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "1.4rem",
                fontWeight: 800,
                color: progress === 100 ? "#00FFB2" : "#00BFFF",
                textShadow: `0 0 20px ${progress === 100 ? "rgba(0,255,178,0.5)" : "rgba(0,191,255,0.4)"}`,
                minWidth: "52px",
                textAlign: "right",
              }}
            >
              {progress}%
            </div>
          </div>
        </motion.div>

        {/* ── Tab Bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            display: "flex",
            gap: "2px",
            marginBottom: "20px",
            background: "rgba(13, 17, 23, 0.6)",
            border: "1px solid rgba(0, 191, 255, 0.1)",
            padding: "4px",
            overflowX: "auto",
          }}
        >
          {tabDef.map(({ key, label, icon, color }) => (
            <button
              key={key}
              id={`tab-${key}`}
              onClick={() => setActiveTab(key)}
              style={{
                flex: "1 0 auto",
                background: activeTab === key ? "rgba(0, 191, 255, 0.12)" : "transparent",
                border: activeTab === key
                  ? `1px solid ${color ?? "rgba(0, 191, 255, 0.4)"}`
                  : "1px solid transparent",
                color: activeTab === key ? (color ?? "#00BFFF") : "rgba(150, 180, 200, 0.5)",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                padding: "10px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                boxShadow: activeTab === key ? `0 0 12px ${color ? color + "22" : "rgba(0,191,255,0.15)"}` : "none",
              }}
            >
              <span style={{ fontSize: "0.75rem" }}>{icon}</span>
              {label}
            </button>
          ))}
        </motion.div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "tasks" && (
              <TasksPanel
                log={log}
                newTaskText={newTaskText}
                setNewTaskText={setNewTaskText}
                newTaskCategory={newTaskCategory}
                setNewTaskCategory={setNewTaskCategory}
                onAdd={addTask}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            )}

            {AREAS.map((area) =>
              activeTab === area.key ? (
                <AreaPanel
                  key={area.key}
                  config={area}
                  areaLog={log[area.key]}
                  onUpdate={(field, val) => updateArea(area.key, field, val)}
                />
              ) : null
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

// ─── Tasks Panel ──────────────────────────────────────────────────────────────

function TasksPanel({
  log,
  newTaskText,
  setNewTaskText,
  newTaskCategory,
  setNewTaskCategory,
  onAdd,
  onToggle,
  onDelete,
}: {
  log: DayLog;
  newTaskText: string;
  setNewTaskText: (v: string) => void;
  newTaskCategory: TaskCategory;
  setNewTaskCategory: (v: TaskCategory) => void;
  onAdd: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const pending = log.tasks.filter((t) => !t.completed);
  const completed = log.tasks.filter((t) => t.completed);

  const CATEGORY_COLORS: Record<TaskCategory, string> = {
    general: "#00BFFF",
    workout: "#00BFFF",
    diet: "#00FFB2",
    "ai-code": "#BF7FFF",
    creations: "#FFD700",
  };

  const CATEGORY_LABELS: Record<TaskCategory, string> = {
    general: "General",
    workout: "Workout",
    diet: "Diet",
    "ai-code": "AI Code",
    creations: "Creations",
  };

  return (
    <div>
      {/* Add task input */}
      <div
        style={{
          background: "rgba(13, 17, 23, 0.85)",
          border: "1px solid rgba(0, 191, 255, 0.15)",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.25em",
            color: "rgba(0, 191, 255, 0.5)",
            marginBottom: "12px",
          }}
        >
          + ADD TASK
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <input
            id="new-task-input"
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAdd()}
            placeholder="Enter task description..."
            style={{
              flex: "1 1 240px",
              background: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(0, 191, 255, 0.2)",
              color: "#e2e8f0",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.9rem",
              padding: "10px 14px",
              outline: "none",
            }}
          />
          <select
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(0, 191, 255, 0.2)",
              color: CATEGORY_COLORS[newTaskCategory],
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              padding: "10px 12px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {(Object.entries(CATEGORY_LABELS) as [TaskCategory, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <button
            id="add-task-btn"
            onClick={onAdd}
            style={{
              background: "rgba(0, 191, 255, 0.1)",
              border: "1px solid rgba(0, 191, 255, 0.4)",
              color: "#00BFFF",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              padding: "10px 20px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0, 191, 255, 0.2)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(0,191,255,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0, 191, 255, 0.1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            ADD →
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "20px" }}>
        {[
          { label: "TOTAL TASKS", value: log.tasks.length, color: "#00BFFF" },
          { label: "COMPLETED", value: completed.length, color: "#00FFB2" },
          { label: "UNFINISHED", value: pending.length, color: "#FF6B6B" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: "rgba(13, 17, 23, 0.8)",
              border: `1px solid ${color}22`,
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "1.6rem",
                fontWeight: 800,
                color,
                textShadow: `0 0 16px ${color}66`,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.2em",
                color: `${color}88`,
                marginTop: "4px",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Pending tasks */}
      {pending.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              color: "rgba(255, 107, 107, 0.6)",
              marginBottom: "8px",
            }}
          >
            ◉ UNFINISHED ({pending.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {pending.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                categoryColor={CATEGORY_COLORS[task.category]}
                categoryLabel={CATEGORY_LABELS[task.category]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed tasks */}
      {completed.length > 0 && (
        <div>
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              color: "rgba(0, 255, 178, 0.5)",
              marginBottom: "8px",
            }}
          >
            ✓ COMPLETED ({completed.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {completed.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                categoryColor={CATEGORY_COLORS[task.category]}
                categoryLabel={CATEGORY_LABELS[task.category]}
              />
            ))}
          </div>
        </div>
      )}

      {log.tasks.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            border: "1px dashed rgba(0, 191, 255, 0.1)",
          }}
        >
          <span style={{ fontSize: "2rem", display: "block", marginBottom: "12px", opacity: 0.3 }}>◈</span>
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "rgba(0, 191, 255, 0.3)",
            }}
          >
            NO TASKS YET. ADD YOUR FIRST MISSION OBJECTIVE.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Task Item ────────────────────────────────────────────────────────────────

function TaskItem({
  task,
  onToggle,
  onDelete,
  categoryColor,
  categoryLabel,
}: {
  task: DailyTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  categoryColor: string;
  categoryLabel: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        background: task.completed ? "rgba(0, 255, 178, 0.03)" : "rgba(13, 17, 23, 0.7)",
        border: task.completed
          ? "1px solid rgba(0, 255, 178, 0.12)"
          : hovered
          ? "1px solid rgba(0, 191, 255, 0.2)"
          : "1px solid rgba(0, 191, 255, 0.07)",
        transition: "all 0.2s",
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        style={{
          width: "18px",
          height: "18px",
          border: task.completed
            ? "1px solid rgba(0, 255, 178, 0.5)"
            : "1px solid rgba(0, 191, 255, 0.35)",
          background: task.completed ? "rgba(0, 255, 178, 0.15)" : "transparent",
          color: task.completed ? "#00FFB2" : "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.65rem",
          flexShrink: 0,
          transition: "all 0.2s",
        }}
      >
        {task.completed ? "✓" : ""}
      </button>

      {/* Category badge */}
      <span
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.45rem",
          letterSpacing: "0.1em",
          color: categoryColor,
          background: `${categoryColor}12`,
          border: `1px solid ${categoryColor}33`,
          padding: "2px 6px",
          flexShrink: 0,
        }}
      >
        {categoryLabel.toUpperCase()}
      </span>

      {/* Text */}
      <span
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "0.9rem",
          color: task.completed ? "rgba(0, 255, 178, 0.5)" : "rgba(225, 232, 240, 0.85)",
          textDecoration: task.completed ? "line-through" : "none",
          flex: 1,
          transition: "all 0.2s",
        }}
      >
        {task.text}
      </span>

      {/* Delete */}
      {hovered && (
        <button
          onClick={() => onDelete(task.id)}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255, 107, 107, 0.5)",
            cursor: "pointer",
            fontSize: "0.7rem",
            padding: "2px 6px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#FF6B6B")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255, 107, 107, 0.5)")}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ─── Area Panel (Workout / Diet / AI Code / Creations) ────────────────────────

function AreaPanel({
  config,
  areaLog,
  onUpdate,
}: {
  config: AreaConfig;
  areaLog: AreaLog;
  onUpdate: (field: keyof AreaLog, value: string | boolean) => void;
}) {
  return (
    <div
      style={{
        background: "rgba(13, 17, 23, 0.85)",
        border: `1px solid ${config.color}22`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Color accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
          opacity: 0.7,
        }}
      />

      <div style={{ padding: "28px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "1.8rem",
                color: config.color,
                filter: `drop-shadow(0 0 10px ${config.color}88)`,
              }}
            >
              {config.icon}
            </span>
            <div>
              <p
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.5rem",
                  letterSpacing: "0.3em",
                  color: `${config.color}88`,
                  marginBottom: "2px",
                }}
              >
                DAILY LOG
              </p>
              <h2
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "#ffffff",
                }}
              >
                {config.label}
              </h2>
            </div>
          </div>

          {/* Completed toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                color: areaLog.completed ? config.color : "rgba(150, 180, 200, 0.4)",
              }}
            >
              {areaLog.completed ? "COMPLETED" : "IN PROGRESS"}
            </span>
            <div
              onClick={() => onUpdate("completed", !areaLog.completed)}
              style={{
                width: "44px",
                height: "22px",
                borderRadius: "11px",
                background: areaLog.completed ? `${config.color}33` : "rgba(255,255,255,0.06)",
                border: areaLog.completed ? `1px solid ${config.color}88` : "1px solid rgba(255,255,255,0.1)",
                position: "relative",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: areaLog.completed ? `0 0 12px ${config.color}44` : "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "3px",
                  left: areaLog.completed ? "24px" : "3px",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: areaLog.completed ? config.color : "rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                  boxShadow: areaLog.completed ? `0 0 8px ${config.color}` : "none",
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick notes */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.52rem",
              letterSpacing: "0.2em",
              color: `${config.color}77`,
              marginBottom: "8px",
            }}
          >
            QUICK SUMMARY
          </label>
          <input
            type="text"
            value={areaLog.notes}
            onChange={(e) => onUpdate("notes", e.target.value)}
            placeholder={`Brief summary for ${config.label.toLowerCase()}...`}
            style={{
              width: "100%",
              background: "rgba(0, 0, 0, 0.5)",
              border: `1px solid ${config.color}22`,
              borderBottom: `1px solid ${config.color}44`,
              color: "#e2e8f0",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.9rem",
              padding: "10px 14px",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = `${config.color}66`)}
            onBlur={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = `${config.color}22`)}
          />
        </div>

        {/* Detailed log */}
        <div>
          <label
            style={{
              display: "block",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.52rem",
              letterSpacing: "0.2em",
              color: `${config.color}77`,
              marginBottom: "8px",
            }}
          >
            DETAILED LOG
          </label>
          <textarea
            value={areaLog.details}
            onChange={(e) => onUpdate("details", e.target.value)}
            placeholder={config.placeholder}
            rows={8}
            style={{
              width: "100%",
              background: "rgba(0, 0, 0, 0.4)",
              border: `1px solid ${config.color}22`,
              color: "#e2e8f0",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              padding: "14px",
              outline: "none",
              resize: "vertical",
              minHeight: "160px",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => ((e.currentTarget as HTMLTextAreaElement).style.borderColor = `${config.color}44`)}
            onBlur={(e) => ((e.currentTarget as HTMLTextAreaElement).style.borderColor = `${config.color}22`)}
          />
        </div>

        {/* Status chips row */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {["LOGGED", "TRACKED", "INDEXED"].map((chip) => (
            <span
              key={chip}
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.48rem",
                letterSpacing: "0.12em",
                color: `${config.color}66`,
                background: `${config.color}0A`,
                border: `1px solid ${config.color}22`,
                padding: "3px 10px",
              }}
            >
              {chip}
            </span>
          ))}
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.48rem",
              letterSpacing: "0.12em",
              color: "rgba(0, 191, 255, 0.4)",
              background: "rgba(0, 191, 255, 0.04)",
              border: "1px solid rgba(0, 191, 255, 0.1)",
              padding: "3px 10px",
            }}
          >
            DB:PLACEHOLDER
          </span>
        </div>
      </div>

      {/* Corner accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "24px",
          height: "24px",
          borderBottom: `1px solid ${config.color}44`,
          borderRight: `1px solid ${config.color}44`,
        }}
      />
    </div>
  );
}

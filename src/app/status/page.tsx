"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// ─── Local schema mirrors (read-only) ───────────────────────────────────────
// These mirror the shapes each feature page already persists to localStorage.
// Swap safeParse's localStorage read for an API call once the backend lands.

interface MoodEntry { date: string; score: number; state: string; loggedAt: string }
interface FocusSession { date: string; completedAt: string; duration: number; mode: string }
interface Habit { id: string; name: string; streak: number; bestStreak: number; completedDates: string[] }
interface JournalEntry { date: string; rating: number; updatedAt: string }
interface Goal { id: string; title: string; progress: number; createdAt: string }
interface KnowledgeItem { id: string; title: string; status: string; addedAt: string; completedAt?: string }
interface DayLog { date: string; tasks: { completed: boolean }[]; updatedAt: string }

function safeParse<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function fmtMinutes(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function fmtRelative(ms: number) {
  const diff = Date.now() - ms;
  if (diff < 0 || Number.isNaN(diff)) return "—";
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

interface ActivityEvent {
  time: number;
  label: string;
  detail: string;
  color: string;
  icon: string;
}

interface Snapshot {
  moods: MoodEntry[];
  focusSessions: FocusSession[];
  habits: Habit[];
  journal: Record<string, JournalEntry>;
  goals: Goal[];
  vault: KnowledgeItem[];
  perfLogs: Record<string, DayLog>;
}

function loadSnapshot(): Snapshot {
  return {
    moods: safeParse<MoodEntry[]>("alfred_mood_log", []),
    focusSessions: safeParse<FocusSession[]>("alfred_focus_sessions", []),
    habits: safeParse<Habit[]>("alfred-habits", []),
    journal: safeParse<Record<string, JournalEntry>>("alfred_journal_entries", {}),
    goals: safeParse<Goal[]>("alfred_goals", []),
    vault: safeParse<KnowledgeItem[]>("alfred_knowledge_vault", []),
    perfLogs: safeParse<Record<string, DayLog>>("alfred_performance_logs", {}),
  };
}

export default function StatusPage() {
  const router = useRouter();
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setSnap(loadSnapshot());
    setNow(new Date());
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const s = snap ?? {
    moods: [], focusSessions: [], habits: [], journal: {}, goals: [], vault: [], perfLogs: {},
  };

  const journalEntries = Object.values(s.journal);
  const perfEntries = Object.values(s.perfLogs);
  const focusMinutes = s.focusSessions
    .filter((f) => f.mode === "FOCUS")
    .reduce((sum, f) => sum + (f.duration || 0), 0);
  const focusCount = s.focusSessions.filter((f) => f.mode === "FOCUS").length;
  const longestStreak = s.habits.reduce((max, h) => Math.max(max, h.bestStreak || 0), 0);
  const completedGoals = s.goals.filter((g) => g.progress === 100).length;
  const completedReads = s.vault.filter((i) => i.status === "completed").length;

  const totalEntries =
    s.moods.length + s.focusSessions.length + journalEntries.length + s.goals.length + s.vault.length + perfEntries.length;

  const modules = [
    {
      name: "Conversational Memory", icon: "◈", color: "#00BFFF", href: "/terminal",
      active: true, detail: "Live session · always on",
    },
    {
      name: "Mood Intelligence", icon: "⚡", color: "#00FF88", href: "/mood-tracker",
      active: s.moods.length > 0,
      detail: s.moods.length ? `${s.moods.length} signals logged` : "No signals logged yet",
    },
    {
      name: "Focus Protocol", icon: "◎", color: "#00BFFF", href: "/focus-timer",
      active: focusCount > 0,
      detail: focusCount ? `${focusCount} sessions · ${fmtMinutes(focusMinutes)} banked` : "No sessions recorded",
    },
    {
      name: "Habit Tracker", icon: "⬡", color: "#BF7FFF", href: "/habit-tracker",
      active: s.habits.length > 0,
      detail: s.habits.length ? `${s.habits.length} habits · best streak ${longestStreak}d` : "No habits configured",
    },
    {
      name: "Tactical Journal", icon: "✦", color: "#00FFB2", href: "/journal",
      active: journalEntries.length > 0,
      detail: journalEntries.length ? `${journalEntries.length} entries logged` : "No entries yet",
    },
    {
      name: "Goal Tracker", icon: "▣", color: "#FFB800", href: "/goal-tracker",
      active: s.goals.length > 0,
      detail: s.goals.length ? `${s.goals.length} goals · ${completedGoals} completed` : "No goals defined",
    },
    {
      name: "Knowledge Vault", icon: "◆", color: "#FF6B35", href: "/knowledge-vault",
      active: s.vault.length > 0,
      detail: s.vault.length ? `${s.vault.length} items · ${completedReads} completed` : "Vault empty",
    },
    {
      name: "Performance Log", icon: "▤", color: "#00BFFF", href: "/performance-log",
      active: perfEntries.length > 0,
      detail: perfEntries.length ? `${perfEntries.length} days logged` : "No logs yet",
    },
  ];

  const activeModules = modules.filter((m) => m.active).length;

  // ── Unified activity feed, most-recent first ──
  const events: ActivityEvent[] = [];
  for (const m of s.moods) {
    const t = new Date(`${m.date}T${m.loggedAt || "00:00:00"}`).getTime();
    events.push({ time: t, label: "Mood signal logged", detail: `${m.state} · ${m.score}/10`, color: "#00FF88", icon: "⚡" });
  }
  for (const f of s.focusSessions) {
    const t = new Date(f.completedAt || f.date).getTime();
    events.push({ time: t, label: "Focus session complete", detail: `${f.duration}min · ${f.mode.replace("_", " ")}`, color: "#00BFFF", icon: "◎" });
  }
  for (const j of journalEntries) {
    const t = new Date(j.updatedAt || j.date).getTime();
    events.push({ time: t, label: "Journal entry logged", detail: `Rating ${j.rating}/10`, color: "#00FFB2", icon: "✦" });
  }
  for (const g of s.goals) {
    const t = new Date(g.createdAt).getTime();
    events.push({ time: t, label: "Goal registered", detail: g.title, color: "#FFB800", icon: "▣" });
  }
  for (const k of s.vault) {
    const t = new Date(k.completedAt || k.addedAt).getTime();
    events.push({
      time: t,
      label: k.completedAt ? "Completed reading" : "Added to vault",
      detail: k.title,
      color: "#FF6B35",
      icon: "◆",
    });
  }
  for (const p of perfEntries) {
    const t = new Date(p.updatedAt || p.date).getTime();
    const done = p.tasks.filter((tk) => tk.completed).length;
    events.push({ time: t, label: "Performance log updated", detail: `${done}/${p.tasks.length} tasks done`, color: "#00BFFF", icon: "▤" });
  }
  const feed = events
    .filter((e) => Number.isFinite(e.time))
    .sort((a, b) => b.time - a.time)
    .slice(0, 8);

  // ── Weekly momentum: event count per day for the last 7 days ──
  const dayBuckets: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = events.filter((e) => new Date(e.time).toISOString().slice(0, 10) === key).length;
    dayBuckets.push({ label: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3).toUpperCase(), count });
  }
  const maxBucket = Math.max(1, ...dayBuckets.map((b) => b.count));

  const stats = [
    { label: "MODULES ONLINE", value: `${activeModules}/${modules.length}`, icon: "◈" },
    { label: "TOTAL LOG ENTRIES", value: String(totalEntries), icon: "▤" },
    { label: "FOCUS TIME BANKED", value: fmtMinutes(focusMinutes), icon: "◎" },
    { label: "LONGEST STREAK", value: `${longestStreak}d`, icon: "⬡" },
  ];

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
            background: "linear-gradient(135deg, #fff 0%, #00BFFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          SYSTEM STATUS
        </span>
        <div style={{ width: "64px" }} />
      </nav>

      <div
        className="relative z-10 max-w-5xl mx-auto px-6"
        style={{ paddingTop: "100px", paddingBottom: "80px" }}
      >
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.4em", color: "rgba(0,191,255,0.6)", marginBottom: "8px" }}>
            ◈ SYSTEM DIAGNOSTICS
          </p>
          <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, letterSpacing: "0.1em", color: "#fff" }}>
            ALFRED INTELLIGENCE BRIEFING
          </h1>
        </motion.div>

        {/* HUD ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10 px-5 py-3"
          style={{ border: "1px solid rgba(0,191,255,0.15)", background: "rgba(0,191,255,0.03)" }}
        >
          <span className="flex items-center gap-2" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#00BFFF" }}>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: "#00BFFF", boxShadow: "0 0 6px #00BFFF" }}
            />
            SYSTEM ONLINE
          </span>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(150,180,200,0.6)" }}>
            LOCAL INTELLIGENCE STORE
          </span>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(150,180,200,0.6)" }}>
            {activeModules}/{modules.length} MODULES SYNCED
          </span>
          <span className="ml-auto" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(0,191,255,0.5)" }}>
            {now ? now.toLocaleTimeString("en-US", { hour12: false }) : "--:--:--"}
          </span>
        </motion.div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((st, i) => (
            <motion.div
              key={st.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-5"
              style={{ background: "rgba(13,17,23,0.9)", border: "1px solid rgba(0,191,255,0.12)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: "1.2rem", color: "#00BFFF" }}>{st.icon}</span>
              </div>
              <p style={{ fontFamily: "'Orbitron', monospace", fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: "4px" }}>
                {st.value}
              </p>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.15em", color: "rgba(0,191,255,0.5)" }}>
                {st.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Weekly momentum */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 p-6"
          style={{ background: "rgba(13,17,23,0.9)", border: "1px solid rgba(0,191,255,0.12)" }}
        >
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: "rgba(0,191,255,0.55)", marginBottom: "20px" }}>
            ◈ WEEKLY MOMENTUM
          </p>
          <div className="flex items-end justify-between gap-3" style={{ height: "100px" }}>
            {dayBuckets.map((b, i) => (
              <div key={i} className="flex flex-col items-center flex-1 h-full justify-end gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${Math.max(6, (b.count / maxBucket) * 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="w-full"
                  style={{
                    background: b.count > 0 ? "linear-gradient(180deg, #00BFFF, rgba(0,191,255,0.15))" : "rgba(255,255,255,0.05)",
                    boxShadow: b.count > 0 ? "0 0 12px rgba(0,191,255,0.25)" : "none",
                    minHeight: "4px",
                  }}
                />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem", color: "rgba(255,255,255,0.3)" }}>
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Module health grid */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: "rgba(0,191,255,0.55)", marginBottom: "16px" }}
        >
          ◈ MODULE HEALTH
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {modules.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ borderColor: `${m.color}80`, boxShadow: `0 0 25px ${m.color}18` }}
              onClick={() => router.push(m.href)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") router.push(m.href); }}
              className="relative p-5 cursor-pointer"
              style={{ background: "rgba(13,17,23,0.9)", border: "1px solid rgba(0,191,255,0.12)", transition: "all 0.25s ease" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: "1.3rem", color: m.color, filter: `drop-shadow(0 0 8px ${m.color}80)` }}>{m.icon}</span>
                <span className="flex items-center gap-1.5">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: m.active ? 2 : 3 }}
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ background: m.active ? "#00FF88" : "#666" }}
                  />
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.1em", color: m.active ? "#00FF88" : "rgba(255,255,255,0.35)" }}>
                    {m.active ? "ACTIVE" : "STANDBY"}
                  </span>
                </span>
              </div>
              <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>
                {m.name}
              </p>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", color: "rgba(150,180,200,0.65)", lineHeight: 1.4 }}>
                {m.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Recent activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: "rgba(0,191,255,0.55)", marginBottom: "16px" }}>
            ◈ RECENT ACTIVITY
          </p>
          <div style={{ background: "rgba(5,8,15,0.95)", border: "1px solid rgba(0,191,255,0.2)" }}>
            <div
              className="flex items-center gap-2.5 px-5 py-3"
              style={{ borderBottom: "1px solid rgba(0,191,255,0.15)", background: "rgba(0,0,0,0.5)" }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF4444" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFB800" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#00BFFF" }} />
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(0,191,255,0.5)", marginLeft: "8px" }}>
                ALFRED.AI — ACTIVITY STREAM
              </span>
            </div>
            <div className="px-5 py-4">
              {feed.length === 0 ? (
                <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "rgba(0,191,255,0.3)", letterSpacing: "0.05em" }}>
                  {"> "}No activity recorded yet. Start logging in any module to populate this stream.
                </p>
              ) : (
                feed.map((e, i) => (
                  <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < feed.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div className="flex items-center gap-3">
                      <span style={{ color: e.color, fontSize: "0.85rem" }}>{e.icon}</span>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", color: "rgba(220,230,240,0.85)" }}>{e.label}</span>
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", color: "rgba(150,180,200,0.5)" }}>{e.detail}</span>
                    </div>
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", color: "rgba(0,191,255,0.4)", whiteSpace: "nowrap" }}>
                      {fmtRelative(e.time)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

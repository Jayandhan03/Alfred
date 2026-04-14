"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────────
type ReadStatus = "to-read" | "reading" | "completed" | "abandoned";
type Category = "Book" | "Article" | "Paper" | "Course" | "Video" | "Podcast" | "Other";

interface KnowledgeItem {
  id: string;
  title: string;
  author: string;
  category: Category;
  status: ReadStatus;
  progress: number; // 0–100
  notes: string;
  addedAt: string;
  completedAt?: string;
  tags: string[];
}

const STORAGE_KEY = "alfred_knowledge_vault";

const STATUS_META: Record<ReadStatus, { label: string; color: string; icon: string }> = {
  "to-read":  { label: "TO READ",   color: "#00BFFF", icon: "◌" },
  "reading":  { label: "READING",   color: "#FF6B35", icon: "▶" },
  "completed":{ label: "COMPLETED", color: "#00FFB2", icon: "✓" },
  "abandoned":{ label: "ABANDONED", color: "#FF4455", icon: "✕" },
};

const CATEGORIES: Category[] = ["Book", "Article", "Paper", "Course", "Video", "Podcast", "Other"];

const CAT_ICONS: Record<Category, string> = {
  Book: "◈", Article: "▣", Paper: "⬡", Course: "◎",
  Video: "▷", Podcast: "◉", Other: "◆",
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function KnowledgeVaultPage() {
  const router = useRouter();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<ReadStatus | "all">("all");
  const [filterCat, setFilterCat] = useState<Category | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<KnowledgeItem | null>(null);
  const [sortBy, setSortBy] = useState<"added" | "title" | "progress">("added");

  // Load
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setItems(JSON.parse(raw)); } catch {}
    }
  }, []);

  const persist = (next: KnowledgeItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const saveItem = (item: KnowledgeItem) => {
    const exists = items.find((i) => i.id === item.id);
    if (exists) {
      persist(items.map((i) => (i.id === item.id ? item : i)));
    } else {
      persist([item, ...items]);
    }
    setShowModal(false);
    setEditItem(null);
  };

  const deleteItem = (id: string) => {
    persist(items.filter((i) => i.id !== id));
  };

  const openAdd = () => {
    setEditItem(null);
    setShowModal(true);
  };

  const openEdit = (item: KnowledgeItem) => {
    setEditItem(item);
    setShowModal(true);
  };

  // Filter + sort
  const filtered = items
    .filter((i) => filterStatus === "all" || i.status === filterStatus)
    .filter((i) => filterCat === "all" || i.category === filterCat)
    .filter((i) =>
      searchQuery === "" ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "progress") return b.progress - a.progress;
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });

  // Stats
  const total = items.length;
  const completed = items.filter((i) => i.status === "completed").length;
  const reading = items.filter((i) => i.status === "reading").length;
  const toRead = items.filter((i) => i.status === "to-read").length;
  const avgProgress =
    items.length > 0
      ? Math.round(items.reduce((s, i) => s + i.progress, 0) / items.length)
      : 0;

  const ACCENT = "#FF6B35";

  return (
    <main className="relative min-h-screen w-full" style={{ background: "#000000", fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Grid bg */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,107,53,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.02) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      {/* Ambient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,107,53,0.05) 0%, transparent 65%)",
        }}
      />

      {/* ── NAV ── */}
      <nav
        className="relative flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid rgba(255,107,53,0.12)", backdropFilter: "blur(12px)" }}
      >
        <button onClick={() => router.push("/home")} className="flex items-center gap-3 group">
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: `rgba(255,107,53,0.55)`,
              transition: "color 0.2s",
            }}
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
            KNOWLEDGE VAULT
          </span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={openAdd}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            color: ACCENT,
            border: `1px solid rgba(255,107,53,0.5)`,
            padding: "8px 18px",
            background: "rgba(255,107,53,0.07)",
            cursor: "pointer",
            boxShadow: `0 0 14px rgba(255,107,53,0.15)`,
          }}
        >
          + ADD ITEM
        </motion.button>
      </nav>

      <div className="relative max-w-6xl mx-auto px-6 py-10">

        {/* ── STATS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10"
        >
          {[
            { label: "TOTAL ITEMS", value: total, color: ACCENT },
            { label: "COMPLETED",   value: completed, color: "#00FFB2" },
            { label: "READING NOW", value: reading, color: ACCENT },
            { label: "TO READ",     value: toRead, color: "#00BFFF" },
            { label: "AVG PROGRESS",value: `${avgProgress}%`, color: "#FFB800" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                border: "1px solid rgba(255,107,53,0.12)",
                background: "rgba(13,17,23,0.9)",
                backdropFilter: "blur(12px)",
                padding: "18px 20px",
              }}
            >
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.48rem", letterSpacing: "0.28em", color: "rgba(255,107,53,0.55)", marginBottom: "8px" }}>
                {s.label}
              </p>
              <p style={{ fontFamily: "'Orbitron', monospace", fontSize: "1.5rem", fontWeight: 800, color: s.color, filter: `drop-shadow(0 0 10px ${s.color}66)` }}>
                {s.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── FILTERS & SEARCH ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH TITLE, AUTHOR OR TAG..."
            style={{
              flex: 1,
              background: "rgba(13,17,23,0.9)",
              border: "1px solid rgba(255,107,53,0.2)",
              color: "#e2e8f0",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              padding: "10px 16px",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.6)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.2)")}
          />

          {/* Status filter */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "to-read", "reading", "completed", "abandoned"] as const).map((s) => {
              const active = filterStatus === s;
              const meta = s === "all" ? null : STATUS_META[s];
              const color = meta?.color ?? ACCENT;
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.15em",
                    color: active ? color : "rgba(150,180,200,0.5)",
                    border: active ? `1px solid ${color}` : "1px solid rgba(150,180,200,0.15)",
                    background: active ? `${color}18` : "transparent",
                    padding: "7px 14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: active ? `0 0 10px ${color}33` : "none",
                  }}
                >
                  {s === "all" ? "ALL" : STATUS_META[s].label}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            style={{
              background: "rgba(13,17,23,0.9)",
              border: "1px solid rgba(255,107,53,0.2)",
              color: "rgba(150,180,200,0.8)",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              padding: "9px 14px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="added">SORT: RECENT</option>
            <option value="title">SORT: TITLE</option>
            <option value="progress">SORT: PROGRESS</option>
          </select>
        </motion.div>

        {/* ── CATEGORY CHIPS ── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["all", ...CATEGORIES] as const).map((c) => {
            const active = filterCat === c;
            return (
              <button
                key={c}
                onClick={() => setFilterCat(c as Category | "all")}
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.12em",
                  color: active ? ACCENT : "rgba(150,180,200,0.4)",
                  border: active ? `1px solid rgba(255,107,53,0.55)` : "1px solid rgba(150,180,200,0.1)",
                  background: active ? "rgba(255,107,53,0.08)" : "transparent",
                  padding: "5px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {c === "all" ? "◆ ALL CATEGORIES" : `${CAT_ICONS[c]} ${c.toUpperCase()}`}
              </button>
            );
          })}
        </div>

        {/* ── ITEMS GRID ── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p style={{ fontFamily: "'Orbitron', monospace", fontSize: "2rem", color: "rgba(255,107,53,0.2)", marginBottom: "12px" }}>◆</p>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.25em", color: "rgba(150,180,200,0.4)" }}>
              {items.length === 0 ? "VAULT IS EMPTY — ADD YOUR FIRST ITEM" : "NO ITEMS MATCH YOUR FILTERS"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <KnowledgeCard
                  key={item.id}
                  item={item}
                  index={i}
                  onEdit={() => openEdit(item)}
                  onDelete={() => deleteItem(item.id)}
                  onStatusChange={(s) => saveItem({ ...item, status: s, progress: s === "completed" ? 100 : item.progress })}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <ItemModal
            initial={editItem}
            onSave={saveItem}
            onClose={() => { setShowModal(false); setEditItem(null); }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// ─── Card ───────────────────────────────────────────────────────────────────────
function KnowledgeCard({
  item,
  index,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  item: KnowledgeItem;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (s: ReadStatus) => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const ACCENT = "#FF6B35";
  const statusMeta = STATUS_META[item.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: `0 16px 50px rgba(255,107,53,0.12)` }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      className="relative flex flex-col"
      style={{
        background: "rgba(13,17,23,0.92)",
        backdropFilter: "blur(16px)",
        border: `1px solid rgba(255,107,53,0.14)`,
        transition: "all 0.3s ease",
        padding: "24px",
        minHeight: "240px",
      }}
    >
      {/* Top border glow */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: `linear-gradient(90deg, transparent, ${statusMeta.color}, transparent)`,
          opacity: 0.5,
        }}
      />

      {/* Category + status row */}
      <div className="flex items-center justify-between mb-3">
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            color: "rgba(255,107,53,0.55)",
          }}
        >
          {CAT_ICONS[item.category]} {item.category.toUpperCase()}
        </span>
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.5rem",
            letterSpacing: "0.15em",
            color: statusMeta.color,
            background: `${statusMeta.color}18`,
            border: `1px solid ${statusMeta.color}44`,
            padding: "2px 8px",
          }}
        >
          {statusMeta.icon} {statusMeta.label}
        </span>
      </div>

      {/* Title */}
      <h3
        className="mb-1"
        style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "0.9rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: "#ffffff",
          lineHeight: 1.35,
        }}
      >
        {item.title}
      </h3>

      {/* Author */}
      {item.author && (
        <p
          className="mb-3"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: "rgba(150,180,200,0.5)",
          }}
        >
          by {item.author}
        </p>
      )}

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.48rem", letterSpacing: "0.2em", color: "rgba(255,107,53,0.5)" }}>
            PROGRESS
          </span>
          <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", fontWeight: 700, color: ACCENT }}>
            {item.progress}%
          </span>
        </div>
        <div style={{ height: "3px", background: "rgba(255,107,53,0.1)", position: "relative" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${item.progress}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              height: "100%",
              background: item.progress === 100
                ? "linear-gradient(90deg, #00FFB2, #00BFFF)"
                : `linear-gradient(90deg, ${ACCENT}, #FFB800)`,
              boxShadow: `0 0 8px ${ACCENT}66`,
            }}
          />
        </div>
      </div>

      {/* Notes preview */}
      {item.notes && (
        <p
          className="flex-1 mb-3"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.82rem",
            lineHeight: 1.6,
            color: "rgba(150,180,200,0.65)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          } as React.CSSProperties}
        >
          {item.notes}
        </p>
      )}

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.48rem",
                letterSpacing: "0.08em",
                color: "rgba(255,107,53,0.7)",
                background: "rgba(255,107,53,0.07)",
                border: "1px solid rgba(255,107,53,0.18)",
                padding: "2px 7px",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Action row */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="flex gap-2 mt-auto"
          >
            <button
              onClick={onEdit}
              style={{
                flex: 1,
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.12em",
                color: ACCENT,
                border: `1px solid rgba(255,107,53,0.4)`,
                background: "rgba(255,107,53,0.06)",
                padding: "7px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              ✎ EDIT
            </button>
            {item.status !== "completed" && (
              <button
                onClick={() => onStatusChange("completed")}
                style={{
                  flex: 1,
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.12em",
                  color: "#00FFB2",
                  border: "1px solid rgba(0,255,178,0.3)",
                  background: "rgba(0,255,178,0.05)",
                  padding: "7px",
                  cursor: "pointer",
                }}
              >
                ✓ DONE
              </button>
            )}
            <button
              onClick={onDelete}
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.12em",
                color: "#FF4455",
                border: "1px solid rgba(255,68,85,0.3)",
                background: "rgba(255,68,85,0.05)",
                padding: "7px 10px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner accent */}
      <div
        style={{
          position: "absolute", bottom: 0, right: 0, width: 20, height: 20,
          borderBottom: `1px solid rgba(255,107,53,0.3)`,
          borderRight: `1px solid rgba(255,107,53,0.3)`,
        }}
      />
    </motion.div>
  );
}

// ─── Modal ──────────────────────────────────────────────────────────────────────
function ItemModal({
  initial,
  onSave,
  onClose,
}: {
  initial: KnowledgeItem | null;
  onSave: (item: KnowledgeItem) => void;
  onClose: () => void;
}) {
  const ACCENT = "#FF6B35";
  const isEdit = !!initial;

  const [form, setForm] = useState<KnowledgeItem>(
    initial ?? {
      id: generateId(),
      title: "",
      author: "",
      category: "Book",
      status: "to-read",
      progress: 0,
      notes: "",
      addedAt: new Date().toISOString(),
      tags: [],
    }
  );
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
    }
    setTagInput("");
  };

  const removeTag = (t: string) => setForm({ ...form, tags: form.tags.filter((x) => x !== t) });

  const validate = () => {
    const e: string[] = [];
    if (!form.title.trim()) e.push("Title is required.");
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (e.length) { setErrors(e); return; }
    onSave({
      ...form,
      progress: form.status === "completed" ? 100 : Math.min(100, Math.max(0, form.progress)),
      completedAt: form.status === "completed" ? new Date().toISOString() : form.completedAt,
    });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,107,53,0.2)",
    color: "#e2e8f0",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "0.95rem",
    padding: "10px 14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.52rem",
    letterSpacing: "0.28em",
    color: "rgba(255,107,53,0.6)",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(6px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(8,12,18,0.98)",
          border: `1px solid rgba(255,107,53,0.3)`,
          boxShadow: `0 0 60px rgba(255,107,53,0.12)`,
          width: "100%",
          maxWidth: "580px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "32px",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.35em", color: "rgba(255,107,53,0.5)", marginBottom: "4px" }}>
              {isEdit ? "EDITING ENTRY" : "NEW ENTRY"}
            </p>
            <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.1em", color: "#fff" }}>
              KNOWLEDGE VAULT
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ fontFamily: "'Orbitron', monospace", fontSize: "1rem", color: "rgba(255,107,53,0.5)", background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div style={{ border: "1px solid rgba(255,68,85,0.4)", background: "rgba(255,68,85,0.06)", padding: "12px 16px", marginBottom: "20px" }}>
            {errors.map((e) => (
              <p key={e} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#FF4455" }}>
                ✕ {e}
              </p>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label style={labelStyle}>TITLE *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter title..."
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.2)")}
            />
          </div>

          {/* Author */}
          <div>
            <label style={labelStyle}>AUTHOR / SOURCE</label>
            <input
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Author name or source..."
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.2)")}
            />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>CATEGORY</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.2)")}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>STATUS</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ReadStatus })}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.2)")}
              >
                {(Object.keys(STATUS_META) as ReadStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_META[s].icon} {STATUS_META[s].label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label style={labelStyle}>PROGRESS</label>
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.8rem", fontWeight: 700, color: ACCENT }}>{form.progress}%</span>
            </div>
            <input
              type="range"
              min={0} max={100}
              value={form.progress}
              onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
              style={{ width: "100%", accentColor: ACCENT, cursor: "pointer" }}
            />
            <div style={{ height: "3px", background: "rgba(255,107,53,0.1)", marginTop: "6px" }}>
              <div
                style={{
                  height: "100%",
                  width: `${form.progress}%`,
                  background: `linear-gradient(90deg, ${ACCENT}, #FFB800)`,
                  transition: "width 0.2s",
                }}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>NOTES & HIGHLIGHTS</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Key insights, quotes, thoughts..."
              rows={4}
              style={{ ...inputStyle, resize: "none" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.2)")}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>TAGS</label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag and press Enter..."
                style={{ ...inputStyle, flex: 1 }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.2)")}
              />
              <button
                onClick={addTag}
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  color: ACCENT,
                  border: `1px solid rgba(255,107,53,0.4)`,
                  background: "rgba(255,107,53,0.08)",
                  padding: "10px 14px",
                  cursor: "pointer",
                }}
              >
                + ADD
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.55rem",
                      letterSpacing: "0.08em",
                      color: ACCENT,
                      background: "rgba(255,107,53,0.1)",
                      border: "1px solid rgba(255,107,53,0.25)",
                      padding: "3px 10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onClick={() => removeTag(t)}
                  >
                    {t} <span style={{ color: "#FF4455" }}>✕</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={onClose}
              style={{
                flex: 1,
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                color: "rgba(150,180,200,0.6)",
                border: "1px solid rgba(150,180,200,0.2)",
                background: "transparent",
                padding: "12px",
                cursor: "pointer",
              }}
            >
              CANCEL
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              style={{
                flex: 2,
                fontFamily: "'Orbitron', monospace",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: ACCENT,
                border: `1px solid rgba(255,107,53,0.55)`,
                background: "rgba(255,107,53,0.1)",
                padding: "12px",
                cursor: "pointer",
                boxShadow: `0 0 20px rgba(255,107,53,0.15)`,
              }}
            >
              {isEdit ? "⬆ UPDATE ENTRY" : "⬆ SAVE TO VAULT"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Feature {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
}

const features: Feature[] = [
  {
    icon: "◈",
    title: "Conversational Intelligence",
    subtitle: "NEURAL DIALOGUE ENGINE",
    description:
      "An AI mentor that listens, interprets context, and responds with strategic precision. Every response is calibrated to your unique situation — not generic advice.",
    tags: ["NLP", "Context-Aware", "Adaptive"],
  },
  {
    icon: "▣",
    title: "Memory Logging",
    subtitle: "PERSISTENT CONTEXT LAYER",
    description:
      "Every conversation is recorded and analyzed. Past exchanges inform future guidance, creating a continuously improving personal intelligence profile.",
    tags: ["Encrypted", "Persistent", "Indexed"],
  },
  {
    icon: "⬡",
    title: "Strategic Reflection",
    subtitle: "BEHAVIORAL PATTERN ANALYSIS",
    description:
      "The AI analyzes recurring patterns in your life decisions, identifies blind spots, and reveals the hidden architecture of your thinking.",
    tags: ["Pattern Analysis", "Insight Engine", "Deep Learning"],
  },
  {
    icon: "◎",
    title: "Focus Protocol",
    subtitle: "DEEP WORK ENGINE",
    description:
      "A tactical Pomodoro-style timer with circular progress visualization. Track focus sessions, streaks, and cumulative deep work time. Built for cognitive performance.",
    tags: ["Pomodoro", "Session Log", "Streak"],
  },
];

export default function FeaturesSection() {
  const router = useRouter();
  const [perfLoggingEnabled, setPerfLoggingEnabled] = useState(true);
  const [goalTrackerEnabled, setGoalTrackerEnabled] = useState(true);
  const [focusProtocolEnabled, setFocusProtocolEnabled] = useState(true);
  const [journalEnabled, setJournalEnabled] = useState(true);
  const [habitTrackerEnabled, setHabitTrackerEnabled] = useState(true);
  const [knowledgeVaultEnabled, setKnowledgeVaultEnabled] = useState(true);

  return (
    <section id="features" className="relative py-24" style={{ zIndex: 1 }}>
      {/* Background separator */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0, 191, 255, 0.03) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl px-6 relative" style={{ margin: '0 auto' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs tracking-[0.4em] uppercase mb-3"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: "rgba(0, 191, 255, 0.6)",
            }}
          >
            ◈ CORE CAPABILITIES
          </p>
          <h2
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(1.4rem, 4vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "#ffffff",
            }}
          >
            TACTICAL FEATURES
          </h2>
          <div
            className="mx-auto mt-4"
            style={{
              height: "1px",
              width: "120px",
              background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
            }}
          />
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{
                y: -8,
                boxShadow:
                  "0 20px 60px rgba(0, 191, 255, 0.15), 0 0 30px rgba(0, 191, 255, 0.1), inset 0 0 30px rgba(0, 191, 255, 0.03)",
                borderColor: "rgba(0, 191, 255, 0.5)",
              }}
              className="relative p-8 flex flex-col group"
              style={{
                background: "rgba(13, 17, 23, 0.9)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(0, 191, 255, 0.12)",
                transition: "all 0.35s ease",
              }}
            >
              {/* Top border glow on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #00BFFF, transparent)",
                }}
              />

              {/* Icon */}
              <div className="mb-6 flex items-center justify-between">
                <span
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "2.5rem",
                    color: "#00BFFF",
                    filter: "drop-shadow(0 0 10px rgba(0, 191, 255, 0.6))",
                    lineHeight: 1,
                  }}
                >
                  {feature.icon}
                </span>
                <span
                  className="text-xs tracking-widest"
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    color: "rgba(0, 191, 255, 0.4)",
                    fontSize: "0.6rem",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Subtitle */}
              <p
                className="mb-2"
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.25em",
                  color: "rgba(0, 191, 255, 0.55)",
                  textTransform: "uppercase",
                }}
              >
                {feature.subtitle}
              </p>

              {/* Title */}
              <h3
                className="mb-4"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#ffffff",
                  lineHeight: 1.3,
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className="flex-1 mb-6"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: "rgba(150, 180, 200, 0.8)",
                }}
              >
                {feature.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      color: "rgba(0, 191, 255, 0.7)",
                      background: "rgba(0, 191, 255, 0.08)",
                      border: "1px solid rgba(0, 191, 255, 0.2)",
                      padding: "2px 8px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom corner accent */}
              <div
                className="absolute bottom-0 right-0 w-8 h-8"
                style={{
                  borderBottom: "1px solid rgba(0, 191, 255, 0.3)",
                  borderRight: "1px solid rgba(0, 191, 255, 0.3)",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Daily Performance Logging — Full-width toggle card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-6"
        >
          <div
            onClick={() => router.push("/performance-log")}
            className="relative flex items-center justify-between p-8 group cursor-pointer"
            style={{
              background: perfLoggingEnabled
                ? "rgba(0, 191, 255, 0.05)"
                : "rgba(13, 17, 23, 0.9)",
              backdropFilter: "blur(16px)",
              border: perfLoggingEnabled
                ? "1px solid rgba(0, 191, 255, 0.4)"
                : "1px solid rgba(0, 191, 255, 0.12)",
              transition: "all 0.35s ease",
              boxShadow: perfLoggingEnabled
                ? "0 0 40px rgba(0, 191, 255, 0.08), inset 0 0 40px rgba(0, 191, 255, 0.03)"
                : "none",
            }}
          >
            {/* Top border glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
              style={{
                background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
                opacity: perfLoggingEnabled ? 1 : 0,
              }}
            />

            {/* Left section */}
            <div className="flex items-center gap-6">
              <span
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "2.5rem",
                  color: perfLoggingEnabled ? "#00BFFF" : "rgba(0,191,255,0.35)",
                  filter: perfLoggingEnabled
                    ? "drop-shadow(0 0 14px rgba(0, 191, 255, 0.7))"
                    : "none",
                  transition: "all 0.35s ease",
                  lineHeight: 1,
                }}
              >
                ◎
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.25em",
                    color: "rgba(0, 191, 255, 0.55)",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  DAILY METRICS TRACKING
                </p>
                <h3
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#ffffff",
                  }}
                >
                  Daily Performance Logging
                </h3>
                <p
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.88rem",
                    color: "rgba(150, 180, 200, 0.75)",
                    marginTop: "6px",
                  }}
                >
                  Track and log your daily performance across Workout, Diet, AI Code &amp; Creations. A structured calendar to monitor your growth every day.
                </p>
              </div>
            </div>

            {/* Right section — tags + toggle */}
            <div className="flex flex-col items-end gap-4 ml-6 shrink-0">
              <div className="flex gap-2 flex-wrap justify-end">
                {["Workout", "Diet", "AI Code", "Creations"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      color: perfLoggingEnabled ? "rgba(0, 191, 255, 0.85)" : "rgba(0, 191, 255, 0.4)",
                      background: perfLoggingEnabled ? "rgba(0, 191, 255, 0.1)" : "rgba(0, 191, 255, 0.04)",
                      border: "1px solid rgba(0, 191, 255, 0.2)",
                      padding: "2px 8px",
                      transition: "all 0.35s ease",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Toggle switch */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setPerfLoggingEnabled(!perfLoggingEnabled);
                }}
                className="relative flex items-center cursor-pointer"
                style={{ gap: "10px" }}
              >
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: perfLoggingEnabled ? "#00BFFF" : "rgba(0,191,255,0.35)",
                    transition: "color 0.3s",
                  }}
                >
                  {perfLoggingEnabled ? "ACTIVE" : "INACTIVE"}
                </span>
                <div
                  style={{
                    width: "44px",
                    height: "22px",
                    borderRadius: "11px",
                    background: perfLoggingEnabled
                      ? "rgba(0, 191, 255, 0.25)"
                      : "rgba(255,255,255,0.06)",
                    border: perfLoggingEnabled
                      ? "1px solid rgba(0, 191, 255, 0.6)"
                      : "1px solid rgba(255,255,255,0.1)",
                    position: "relative",
                    transition: "all 0.3s ease",
                    boxShadow: perfLoggingEnabled
                      ? "0 0 12px rgba(0, 191, 255, 0.3)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: perfLoggingEnabled ? "24px" : "3px",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: perfLoggingEnabled ? "#00BFFF" : "rgba(255,255,255,0.3)",
                      transition: "all 0.3s ease",
                      boxShadow: perfLoggingEnabled
                        ? "0 0 8px rgba(0, 191, 255, 0.8)"
                        : "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom corner accent */}
            <div
              className="absolute bottom-0 right-0 w-8 h-8"
              style={{
                borderBottom: "1px solid rgba(0, 191, 255, 0.3)",
                borderRight: "1px solid rgba(0, 191, 255, 0.3)",
              }}
            />
          </div>
        </motion.div>

        {/* Goal Tracker — Full-width toggle card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-6"
        >
          <div
            onClick={() => router.push("/goal-tracker")}
            className="relative flex items-center justify-between p-8 group cursor-pointer"
            style={{
              background: goalTrackerEnabled
                ? "rgba(255, 184, 0, 0.04)"
                : "rgba(13, 17, 23, 0.9)",
              backdropFilter: "blur(16px)",
              border: goalTrackerEnabled
                ? "1px solid rgba(255, 184, 0, 0.35)"
                : "1px solid rgba(0, 191, 255, 0.12)",
              transition: "all 0.35s ease",
              boxShadow: goalTrackerEnabled
                ? "0 0 40px rgba(255, 184, 0, 0.06), inset 0 0 40px rgba(255, 184, 0, 0.02)"
                : "none",
            }}
          >
            {/* Top border glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
              style={{
                background: "linear-gradient(90deg, transparent, #FFB800, transparent)",
                opacity: goalTrackerEnabled ? 1 : 0,
              }}
            />

            {/* Left section */}
            <div className="flex items-center gap-6">
              <span
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "2.5rem",
                  color: goalTrackerEnabled ? "#FFB800" : "rgba(255,184,0,0.3)",
                  filter: goalTrackerEnabled
                    ? "drop-shadow(0 0 14px rgba(255, 184, 0, 0.7))"
                    : "none",
                  transition: "all 0.35s ease",
                  lineHeight: 1,
                }}
              >
                ▣
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.25em",
                    color: "rgba(255, 184, 0, 0.55)",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  OBJECTIVE MANAGEMENT
                </p>
                <h3
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#ffffff",
                  }}
                >
                  Goal Tracker
                </h3>
                <p
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.88rem",
                    color: "rgba(150, 180, 200, 0.75)",
                    marginTop: "6px",
                  }}
                >
                  Define, track and conquer your personal goals — Fitness, Learning, Projects & Finance. With milestones and progress bars.
                </p>
              </div>
            </div>

            {/* Right section — tags + toggle */}
            <div className="flex flex-col items-end gap-4 ml-6 shrink-0">
              <div className="flex gap-2 flex-wrap justify-end">
                {["Fitness", "Learning", "Projects", "Finance"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      color: goalTrackerEnabled ? "rgba(255, 184, 0, 0.85)" : "rgba(255, 184, 0, 0.35)",
                      background: goalTrackerEnabled ? "rgba(255, 184, 0, 0.1)" : "rgba(255, 184, 0, 0.03)",
                      border: "1px solid rgba(255, 184, 0, 0.2)",
                      padding: "2px 8px",
                      transition: "all 0.35s ease",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Toggle switch */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setGoalTrackerEnabled(!goalTrackerEnabled);
                }}
                className="relative flex items-center cursor-pointer"
                style={{ gap: "10px" }}
              >
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: goalTrackerEnabled ? "#FFB800" : "rgba(255,184,0,0.3)",
                    transition: "color 0.3s",
                  }}
                >
                  {goalTrackerEnabled ? "ACTIVE" : "INACTIVE"}
                </span>
                <div
                  style={{
                    width: "44px",
                    height: "22px",
                    borderRadius: "11px",
                    background: goalTrackerEnabled
                      ? "rgba(255, 184, 0, 0.22)"
                      : "rgba(255,255,255,0.06)",
                    border: goalTrackerEnabled
                      ? "1px solid rgba(255, 184, 0, 0.6)"
                      : "1px solid rgba(255,255,255,0.1)",
                    position: "relative",
                    transition: "all 0.3s ease",
                    boxShadow: goalTrackerEnabled
                      ? "0 0 12px rgba(255, 184, 0, 0.3)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: goalTrackerEnabled ? "24px" : "3px",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: goalTrackerEnabled ? "#FFB800" : "rgba(255,255,255,0.3)",
                      transition: "all 0.3s ease",
                      boxShadow: goalTrackerEnabled
                        ? "0 0 8px rgba(255, 184, 0, 0.8)"
                        : "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom corner accent */}
            <div
              className="absolute bottom-0 right-0 w-8 h-8"
              style={{
                borderBottom: "1px solid rgba(255, 184, 0, 0.3)",
                borderRight: "1px solid rgba(255, 184, 0, 0.3)",
              }}
            />
          </div>
        </motion.div>

        {/* Focus Protocol — Full-width toggle card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-6"
        >
          <div
            onClick={() => {
              document.getElementById("focus-timer")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative flex items-center justify-between p-8 group cursor-pointer"
            style={{
              background: focusProtocolEnabled
                ? "rgba(0, 191, 255, 0.05)"
                : "rgba(13, 17, 23, 0.9)",
              backdropFilter: "blur(16px)",
              border: focusProtocolEnabled
                ? "1px solid rgba(0, 191, 255, 0.4)"
                : "1px solid rgba(0, 191, 255, 0.12)",
              transition: "all 0.35s ease",
              boxShadow: focusProtocolEnabled
                ? "0 0 40px rgba(0, 191, 255, 0.08), inset 0 0 40px rgba(0, 191, 255, 0.03)"
                : "none",
            }}
          >
            {/* Top border glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
              style={{
                background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
                opacity: focusProtocolEnabled ? 1 : 0,
              }}
            />

            {/* Left section */}
            <div className="flex items-center gap-6">
              <span
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "2.5rem",
                  color: focusProtocolEnabled ? "#00BFFF" : "rgba(0,191,255,0.35)",
                  filter: focusProtocolEnabled
                    ? "drop-shadow(0 0 14px rgba(0, 191, 255, 0.7))"
                    : "none",
                  transition: "all 0.35s ease",
                  lineHeight: 1,
                }}
              >
                ◎
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.25em",
                    color: "rgba(0, 191, 255, 0.55)",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  DEEP WORK ENGINE
                </p>
                <h3
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#ffffff",
                  }}
                >
                  Focus Protocol
                </h3>
                <p
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.88rem",
                    color: "rgba(150, 180, 200, 0.75)",
                    marginTop: "6px",
                  }}
                >
                  Tactical Pomodoro timer with circular progress ring. Track sessions, streaks & total deep work time.
                </p>
              </div>
            </div>

            {/* Right section — tags + toggle */}
            <div className="flex flex-col items-end gap-4 ml-6 shrink-0">
              <div className="flex gap-2 flex-wrap justify-end">
                {["25 min", "Streak", "Session Log"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      color: focusProtocolEnabled ? "rgba(0, 191, 255, 0.85)" : "rgba(0, 191, 255, 0.4)",
                      background: focusProtocolEnabled ? "rgba(0, 191, 255, 0.1)" : "rgba(0, 191, 255, 0.04)",
                      border: "1px solid rgba(0, 191, 255, 0.2)",
                      padding: "2px 8px",
                      transition: "all 0.35s ease",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Toggle switch */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFocusProtocolEnabled(!focusProtocolEnabled);
                }}
                className="relative flex items-center cursor-pointer"
                style={{ gap: "10px" }}
              >
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: focusProtocolEnabled ? "#00BFFF" : "rgba(0,191,255,0.35)",
                    transition: "color 0.3s",
                  }}
                >
                  {focusProtocolEnabled ? "ACTIVE" : "INACTIVE"}
                </span>
                <div
                  style={{
                    width: "44px",
                    height: "22px",
                    borderRadius: "11px",
                    background: focusProtocolEnabled
                      ? "rgba(0, 191, 255, 0.25)"
                      : "rgba(255,255,255,0.06)",
                    border: focusProtocolEnabled
                      ? "1px solid rgba(0, 191, 255, 0.6)"
                      : "1px solid rgba(255,255,255,0.1)",
                    position: "relative",
                    transition: "all 0.3s ease",
                    boxShadow: focusProtocolEnabled
                      ? "0 0 12px rgba(0, 191, 255, 0.3)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: focusProtocolEnabled ? "24px" : "3px",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: focusProtocolEnabled ? "#00BFFF" : "rgba(255,255,255,0.3)",
                      transition: "all 0.3s ease",
                      boxShadow: focusProtocolEnabled
                        ? "0 0 8px rgba(0, 191, 255, 0.8)"
                        : "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom corner accent */}
            <div
              className="absolute bottom-0 right-0 w-8 h-8"
              style={{
                borderBottom: "1px solid rgba(0, 191, 255, 0.3)",
                borderRight: "1px solid rgba(0, 191, 255, 0.3)",
              }}
            />
          </div>
        </motion.div>

        {/* Tactical Journal — Full-width toggle card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-6"
        >
          <div
            onClick={() => router.push("/journal")}
            className="relative flex items-center justify-between p-8 group cursor-pointer"
            style={{
              background: journalEnabled
                ? "rgba(0, 255, 178, 0.04)"
                : "rgba(13, 17, 23, 0.9)",
              backdropFilter: "blur(16px)",
              border: journalEnabled
                ? "1px solid rgba(0, 255, 178, 0.35)"
                : "1px solid rgba(0, 191, 255, 0.12)",
              transition: "all 0.35s ease",
              boxShadow: journalEnabled
                ? "0 0 40px rgba(0, 255, 178, 0.06), inset 0 0 40px rgba(0, 255, 178, 0.02)"
                : "none",
            }}
          >
            {/* Top border glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
              style={{
                background: "linear-gradient(90deg, transparent, #00FFB2, transparent)",
                opacity: journalEnabled ? 1 : 0,
              }}
            />

            {/* Left section */}
            <div className="flex items-center gap-6">
              <span
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "2.5rem",
                  color: journalEnabled ? "#00FFB2" : "rgba(0,255,178,0.3)",
                  filter: journalEnabled
                    ? "drop-shadow(0 0 14px rgba(0, 255, 178, 0.7))"
                    : "none",
                  transition: "all 0.35s ease",
                  lineHeight: 1,
                }}
              >
                ✦
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.25em",
                    color: "rgba(0, 255, 178, 0.55)",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  DAILY REFLECTION SYSTEM
                </p>
                <h3
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#ffffff",
                  }}
                >
                  Tactical Journal
                </h3>
                <p
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.88rem",
                    color: "rgba(150, 180, 200, 0.75)",
                    marginTop: "6px",
                  }}
                >
                  Log your daily wins, challenges &amp; tomorrow&apos;s mission. Rate your day and track your mindset over time.
                </p>
              </div>
            </div>

            {/* Right section — tags + toggle */}
            <div className="flex flex-col items-end gap-4 ml-6 shrink-0">
              <div className="flex gap-2 flex-wrap justify-end">
                {["Wins", "Challenges", "Reflection", "Streak"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      color: journalEnabled ? "rgba(0, 255, 178, 0.85)" : "rgba(0, 255, 178, 0.35)",
                      background: journalEnabled ? "rgba(0, 255, 178, 0.1)" : "rgba(0, 255, 178, 0.03)",
                      border: "1px solid rgba(0, 255, 178, 0.2)",
                      padding: "2px 8px",
                      transition: "all 0.35s ease",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Toggle switch */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setJournalEnabled(!journalEnabled);
                }}
                className="relative flex items-center cursor-pointer"
                style={{ gap: "10px" }}
              >
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: journalEnabled ? "#00FFB2" : "rgba(0,255,178,0.3)",
                    transition: "color 0.3s",
                  }}
                >
                  {journalEnabled ? "ACTIVE" : "INACTIVE"}
                </span>
                <div
                  style={{
                    width: "44px",
                    height: "22px",
                    borderRadius: "11px",
                    background: journalEnabled
                      ? "rgba(0, 255, 178, 0.22)"
                      : "rgba(255,255,255,0.06)",
                    border: journalEnabled
                      ? "1px solid rgba(0, 255, 178, 0.6)"
                      : "1px solid rgba(255,255,255,0.1)",
                    position: "relative",
                    transition: "all 0.3s ease",
                    boxShadow: journalEnabled
                      ? "0 0 12px rgba(0, 255, 178, 0.3)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: journalEnabled ? "24px" : "3px",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: journalEnabled ? "#00FFB2" : "rgba(255,255,255,0.3)",
                      transition: "all 0.3s ease",
                      boxShadow: journalEnabled
                        ? "0 0 8px rgba(0, 255, 178, 0.8)"
                        : "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom corner accent */}
            <div
              className="absolute bottom-0 right-0 w-8 h-8"
              style={{
                borderBottom: "1px solid rgba(0, 255, 178, 0.3)",
                borderRight: "1px solid rgba(0, 255, 178, 0.3)",
              }}
            />
          </div>
        </motion.div>

        {/* Habit Tracker — Full-width toggle card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-6"
        >
          <div
            onClick={() => router.push("/habit-tracker")}
            className="relative flex items-center justify-between p-8 group cursor-pointer"
            style={{
              background: habitTrackerEnabled
                ? "rgba(191, 127, 255, 0.04)"
                : "rgba(13, 17, 23, 0.9)",
              backdropFilter: "blur(16px)",
              border: habitTrackerEnabled
                ? "1px solid rgba(191, 127, 255, 0.35)"
                : "1px solid rgba(0, 191, 255, 0.12)",
              transition: "all 0.35s ease",
              boxShadow: habitTrackerEnabled
                ? "0 0 40px rgba(191, 127, 255, 0.06), inset 0 0 40px rgba(191, 127, 255, 0.02)"
                : "none",
            }}
          >
            {/* Top border glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
              style={{
                background: "linear-gradient(90deg, transparent, #BF7FFF, transparent)",
                opacity: habitTrackerEnabled ? 1 : 0,
              }}
            />

            {/* Left section */}
            <div className="flex items-center gap-6">
              <span
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "2.5rem",
                  color: habitTrackerEnabled ? "#BF7FFF" : "rgba(191,127,255,0.3)",
                  filter: habitTrackerEnabled
                    ? "drop-shadow(0 0 14px rgba(191, 127, 255, 0.7))"
                    : "none",
                  transition: "all 0.35s ease",
                  lineHeight: 1,
                }}
              >
                ⬡
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.25em",
                    color: "rgba(191, 127, 255, 0.55)",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  BEHAVIORAL FORGE
                </p>
                <h3
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#ffffff",
                  }}
                >
                  Habit Tracker
                </h3>
                <p
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.88rem",
                    color: "rgba(150, 180, 200, 0.75)",
                    marginTop: "6px",
                  }}
                >
                  Build unbreakable discipline with daily habit streaks, a 30-day heatmap &amp; category-based tracking.
                </p>
              </div>
            </div>

            {/* Right section — tags + toggle */}
            <div className="flex flex-col items-end gap-4 ml-6 shrink-0">
              <div className="flex gap-2 flex-wrap justify-end">
                {["Streak", "Heatmap", "Categories", "Goals"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      color: habitTrackerEnabled ? "rgba(191, 127, 255, 0.85)" : "rgba(191, 127, 255, 0.35)",
                      background: habitTrackerEnabled ? "rgba(191, 127, 255, 0.1)" : "rgba(191, 127, 255, 0.03)",
                      border: "1px solid rgba(191, 127, 255, 0.2)",
                      padding: "2px 8px",
                      transition: "all 0.35s ease",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Toggle switch */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setHabitTrackerEnabled(!habitTrackerEnabled);
                }}
                className="relative flex items-center cursor-pointer"
                style={{ gap: "10px" }}
              >
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: habitTrackerEnabled ? "#BF7FFF" : "rgba(191,127,255,0.3)",
                    transition: "color 0.3s",
                  }}
                >
                  {habitTrackerEnabled ? "ACTIVE" : "INACTIVE"}
                </span>
                <div
                  style={{
                    width: "44px",
                    height: "22px",
                    borderRadius: "11px",
                    background: habitTrackerEnabled
                      ? "rgba(191, 127, 255, 0.22)"
                      : "rgba(255,255,255,0.06)",
                    border: habitTrackerEnabled
                      ? "1px solid rgba(191, 127, 255, 0.6)"
                      : "1px solid rgba(255,255,255,0.1)",
                    position: "relative",
                    transition: "all 0.3s ease",
                    boxShadow: habitTrackerEnabled
                      ? "0 0 12px rgba(191, 127, 255, 0.3)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: habitTrackerEnabled ? "24px" : "3px",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: habitTrackerEnabled ? "#BF7FFF" : "rgba(255,255,255,0.3)",
                      transition: "all 0.3s ease",
                      boxShadow: habitTrackerEnabled
                        ? "0 0 8px rgba(191, 127, 255, 0.8)"
                        : "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom corner accent */}
            <div
              className="absolute bottom-0 right-0 w-8 h-8"
              style={{
                borderBottom: "1px solid rgba(191, 127, 255, 0.3)",
                borderRight: "1px solid rgba(191, 127, 255, 0.3)",
              }}
            />
          </div>
        </motion.div>

        {/* Knowledge Vault — Full-width toggle card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="mt-6"
        >
          <div
            onClick={() => router.push("/knowledge-vault")}
            className="relative flex items-center justify-between p-8 group cursor-pointer"
            style={{
              background: knowledgeVaultEnabled
                ? "rgba(255, 107, 53, 0.04)"
                : "rgba(13, 17, 23, 0.9)",
              backdropFilter: "blur(16px)",
              border: knowledgeVaultEnabled
                ? "1px solid rgba(255, 107, 53, 0.35)"
                : "1px solid rgba(0, 191, 255, 0.12)",
              transition: "all 0.35s ease",
              boxShadow: knowledgeVaultEnabled
                ? "0 0 40px rgba(255, 107, 53, 0.06), inset 0 0 40px rgba(255, 107, 53, 0.02)"
                : "none",
            }}
          >
            {/* Top border glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
              style={{
                background: "linear-gradient(90deg, transparent, #FF6B35, transparent)",
                opacity: knowledgeVaultEnabled ? 1 : 0,
              }}
            />

            {/* Left section */}
            <div className="flex items-center gap-6">
              <span
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "2.5rem",
                  color: knowledgeVaultEnabled ? "#FF6B35" : "rgba(255,107,53,0.3)",
                  filter: knowledgeVaultEnabled
                    ? "drop-shadow(0 0 14px rgba(255, 107, 53, 0.7))"
                    : "none",
                  transition: "all 0.35s ease",
                  lineHeight: 1,
                }}
              >
                ◆
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.25em",
                    color: "rgba(255, 107, 53, 0.55)",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  LEARNING INTELLIGENCE
                </p>
                <h3
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#ffffff",
                  }}
                >
                  Knowledge Vault
                </h3>
                <p
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.88rem",
                    color: "rgba(150, 180, 200, 0.75)",
                    marginTop: "6px",
                  }}
                >
                  Track books, articles, courses & research. Add notes, monitor progress & build your personal knowledge library.
                </p>
              </div>
            </div>

            {/* Right section — tags + toggle */}
            <div className="flex flex-col items-end gap-4 ml-6 shrink-0">
              <div className="flex gap-2 flex-wrap justify-end">
                {["Books", "Articles", "Courses", "Research"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      color: knowledgeVaultEnabled ? "rgba(255, 107, 53, 0.85)" : "rgba(255, 107, 53, 0.35)",
                      background: knowledgeVaultEnabled ? "rgba(255, 107, 53, 0.1)" : "rgba(255, 107, 53, 0.03)",
                      border: "1px solid rgba(255, 107, 53, 0.2)",
                      padding: "2px 8px",
                      transition: "all 0.35s ease",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Toggle switch */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setKnowledgeVaultEnabled(!knowledgeVaultEnabled);
                }}
                className="relative flex items-center cursor-pointer"
                style={{ gap: "10px" }}
              >
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: knowledgeVaultEnabled ? "#FF6B35" : "rgba(255,107,53,0.3)",
                    transition: "color 0.3s",
                  }}
                >
                  {knowledgeVaultEnabled ? "ACTIVE" : "INACTIVE"}
                </span>
                <div
                  style={{
                    width: "44px",
                    height: "22px",
                    borderRadius: "11px",
                    background: knowledgeVaultEnabled
                      ? "rgba(255, 107, 53, 0.22)"
                      : "rgba(255,255,255,0.06)",
                    border: knowledgeVaultEnabled
                      ? "1px solid rgba(255, 107, 53, 0.6)"
                      : "1px solid rgba(255,255,255,0.1)",
                    position: "relative",
                    transition: "all 0.3s ease",
                    boxShadow: knowledgeVaultEnabled
                      ? "0 0 12px rgba(255, 107, 53, 0.3)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: knowledgeVaultEnabled ? "24px" : "3px",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: knowledgeVaultEnabled ? "#FF6B35" : "rgba(255,255,255,0.3)",
                      transition: "all 0.3s ease",
                      boxShadow: knowledgeVaultEnabled
                        ? "0 0 8px rgba(255, 107, 53, 0.8)"
                        : "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom corner accent */}
            <div
              className="absolute bottom-0 right-0 w-8 h-8"
              style={{
                borderBottom: "1px solid rgba(255, 107, 53, 0.3)",
                borderRight: "1px solid rgba(255, 107, 53, 0.3)",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

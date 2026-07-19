"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Feature {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  href: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: "◈",
    title: "Alfred Terminal",
    subtitle: "NEURAL DIALOGUE ENGINE",
    description:
      "An AI mentor that listens, interprets context, and responds with strategic precision — calibrated to your unique situation.",
    tags: ["NLP", "Context-Aware", "Live"],
    href: "/terminal",
    color: "#00BFFF",
  },
  {
    icon: "⚡",
    title: "Mood Intelligence",
    subtitle: "BIOMETRIC FEEDBACK",
    description:
      "Log your daily energy signal, track your 7-day trend, and receive tactical insight calibrated to your state.",
    tags: ["Energy", "Trend", "Insight"],
    href: "/mood-tracker",
    color: "#00FF88",
  },
  {
    icon: "◎",
    title: "Focus Protocol",
    subtitle: "DEEP WORK ENGINE",
    description:
      "A tactical Pomodoro timer with circular progress visualization. Track sessions, streaks, and cumulative deep work time.",
    tags: ["Pomodoro", "Session Log", "Streak"],
    href: "/focus-timer",
    color: "#00BFFF",
  },
  {
    icon: "▤",
    title: "Performance Logging",
    subtitle: "DAILY METRICS TRACKING",
    description:
      "Track and log daily performance across Workout, Diet, AI Code & Creations on a structured calendar.",
    tags: ["Workout", "Diet", "Creations"],
    href: "/performance-log",
    color: "#00BFFF",
  },
  {
    icon: "▣",
    title: "Goal Tracker",
    subtitle: "OBJECTIVE MANAGEMENT",
    description:
      "Define, track and conquer personal goals across Fitness, Learning, Projects & Finance with milestones and progress bars.",
    tags: ["Fitness", "Learning", "Finance"],
    href: "/goal-tracker",
    color: "#FFB800",
  },
  {
    icon: "✦",
    title: "Tactical Journal",
    subtitle: "DAILY REFLECTION SYSTEM",
    description:
      "Log daily wins, challenges & tomorrow's mission. Rate your day and track your mindset over time.",
    tags: ["Wins", "Challenges", "Streak"],
    href: "/journal",
    color: "#00FFB2",
  },
  {
    icon: "⬡",
    title: "Habit Tracker",
    subtitle: "BEHAVIORAL FORGE",
    description:
      "Build unbreakable discipline with daily habit streaks, a 30-day heatmap & category-based tracking.",
    tags: ["Streak", "Heatmap", "Categories"],
    href: "/habit-tracker",
    color: "#BF7FFF",
  },
  {
    icon: "◆",
    title: "Knowledge Vault",
    subtitle: "LEARNING INTELLIGENCE",
    description:
      "Track books, articles, courses & research. Add notes, monitor progress & build your personal knowledge library.",
    tags: ["Books", "Courses", "Research"],
    href: "/knowledge-vault",
    color: "#FF6B35",
  },
];

export default function FeaturesSection() {
  const router = useRouter();

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

      <div className="max-w-6xl px-6 relative" style={{ margin: "0 auto" }}>
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
          <p
            className="mt-4"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(150, 180, 200, 0.6)",
            }}
          >
            Each module opens in its own dedicated workspace.
          </p>
          <div
            className="mx-auto mt-4 mb-8"
            style={{
              height: "1px",
              width: "120px",
              background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
            }}
          />

          {/* HUD ticker */}
          <div
            className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-2.5"
            style={{ border: "1px solid rgba(0,191,255,0.15)", background: "rgba(0,191,255,0.03)" }}
          >
            <span className="flex items-center gap-2" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#00BFFF" }}>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "#00BFFF", boxShadow: "0 0 6px #00BFFF" }}
              />
              {features.length} MODULES REGISTERED
            </span>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "rgba(150,180,200,0.6)" }}>
              ALL OPERATIONAL
            </span>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{
                y: -6,
                boxShadow: `0 20px 50px ${feature.color}22, 0 0 30px ${feature.color}18, inset 0 0 30px ${feature.color}0a`,
                borderColor: `${feature.color}80`,
              }}
              onClick={() => router.push(feature.href)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") router.push(feature.href);
              }}
              className="relative p-6 flex flex-col group cursor-pointer"
              style={{
                background: "rgba(13, 17, 23, 0.9)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(0, 191, 255, 0.12)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Top border glow on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
                }}
              />

              {/* Icon + index */}
              <div className="mb-5 flex items-center justify-between">
                <span
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "2rem",
                    color: feature.color,
                    filter: `drop-shadow(0 0 10px ${feature.color}99)`,
                    lineHeight: 1,
                  }}
                >
                  {feature.icon}
                </span>
                <span
                  className="text-xs tracking-widest"
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    color: "rgba(0, 191, 255, 0.35)",
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
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  color: `${feature.color}99`,
                  textTransform: "uppercase",
                }}
              >
                {feature.subtitle}
              </p>

              {/* Title */}
              <h3
                className="mb-3"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "#ffffff",
                  lineHeight: 1.3,
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className="flex-1 mb-5"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  color: "rgba(150, 180, 200, 0.75)",
                }}
              >
                {feature.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {feature.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.55rem",
                      letterSpacing: "0.08em",
                      color: `${feature.color}cc`,
                      background: `${feature.color}14`,
                      border: `1px solid ${feature.color}33`,
                      padding: "2px 7px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Open affordance */}
              <div
                className="flex items-center gap-2 pt-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: feature.color,
                    fontWeight: 700,
                  }}
                >
                  OPEN MODULE
                </span>
                <motion.span
                  className="inline-block"
                  style={{ color: feature.color }}
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                >
                  →
                </motion.span>
              </div>

              {/* Bottom corner accent */}
              <div
                className="absolute bottom-0 right-0 w-6 h-6"
                style={{
                  borderBottom: `1px solid ${feature.color}4d`,
                  borderRight: `1px solid ${feature.color}4d`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

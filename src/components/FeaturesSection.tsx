"use client";

import { motion } from "framer-motion";

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
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 px-6" style={{ zIndex: 1 }}>
      {/* Background separator */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0, 191, 255, 0.03) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
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
              <div
                className="mb-6 flex items-center justify-between"
              >
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
      </div>
    </section>
  );
}

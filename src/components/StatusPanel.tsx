"use client";

import { motion } from "framer-motion";

interface StatusItem {
  label: string;
  status: "ACTIVE" | "ONLINE" | "OFFLINE" | "PROCESSING";
  icon: string;
  description: string;
}

const statusItems: StatusItem[] = [
  {
    label: "Conversation Memory",
    status: "ACTIVE",
    icon: "🧠",
    description: "All sessions encrypted and indexed",
  },
  {
    label: "Mentor Intelligence",
    status: "ONLINE",
    icon: "⚡",
    description: "Core reasoning engine operational",
  },
  {
    label: "Voice Listener",
    status: "OFFLINE",
    icon: "🎤",
    description: "Audio input module standby",
  },
  {
    label: "Reflection Engine",
    status: "PROCESSING",
    icon: "🔄",
    description: "Pattern analysis in progress",
  },
];

const statusStyles: Record<string, { color: string; bg: string; glow: string; dot: string }> = {
  ACTIVE: {
    color: "#00BFFF",
    bg: "rgba(0, 191, 255, 0.08)",
    glow: "0 0 15px rgba(0, 191, 255, 0.3)",
    dot: "#00BFFF",
  },
  ONLINE: {
    color: "#00FF88",
    bg: "rgba(0, 255, 136, 0.08)",
    glow: "0 0 15px rgba(0, 255, 136, 0.25)",
    dot: "#00FF88",
  },
  OFFLINE: {
    color: "#FF4444",
    bg: "rgba(255, 68, 68, 0.08)",
    glow: "0 0 15px rgba(255, 68, 68, 0.25)",
    dot: "#FF4444",
  },
  PROCESSING: {
    color: "#FFB800",
    bg: "rgba(255, 184, 0, 0.08)",
    glow: "0 0 15px rgba(255, 184, 0, 0.25)",
    dot: "#FFB800",
  },
};

export default function StatusPanel() {
  return (
    <section
      id="status"
      className="relative py-24"
      style={{ zIndex: 1 }}
    >
      <div className="max-w-6xl px-6 overflow-hidden" style={{ margin: '0 auto' }}>
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
            ◈ SYSTEM DIAGNOSTICS
          </p>
          <h2
            className="mb-3"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(1.4rem, 4vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "#ffffff",
            }}
          >
            SYSTEM STATUS
          </h2>
          <div
            style={{
              height: "1px",
              width: "120px",
              margin: "0 auto",
              background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
            }}
          />
        </motion.div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statusItems.map((item, i) => {
            const style = statusStyles[item.status];
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: style.glow + ", 0 0 40px rgba(0, 191, 255, 0.1)",
                  borderColor: style.color,
                }}
                className="relative p-6 cursor-default"
                style={{
                  background: "rgba(13, 17, 23, 0.85)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid rgba(0, 191, 255, 0.15)`,
                  transition: "all 0.3s ease",
                }}
              >
                {/* Corner accent */}
                <div
                  className="absolute top-0 right-0 w-6 h-6"
                  style={{
                    borderTop: `1px solid ${style.color}`,
                    borderRight: `1px solid ${style.color}`,
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 w-6 h-6"
                  style={{
                    borderBottom: `1px solid ${style.color}`,
                    borderLeft: `1px solid ${style.color}`,
                  }}
                />

                {/* Icon */}
                <div className="text-3xl mb-4">{item.icon}</div>

                {/* Label */}
                <p
                  className="mb-2"
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: "rgba(180, 200, 220, 0.8)",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </p>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: item.status === "PROCESSING" ? 1 : item.status === "OFFLINE" ? 3 : 2,
                    }}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: style.dot,
                      boxShadow: `0 0 6px ${style.dot}`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.75rem",
                      color: style.color,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.78rem",
                    color: "rgba(120, 150, 180, 0.7)",
                    lineHeight: 1.4,
                  }}
                >
                  {item.description}
                </p>

                {/* Bottom pulse bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${style.color}, transparent)`,
                    opacity: 0.4,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

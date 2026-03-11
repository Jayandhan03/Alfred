"use client";

import { motion } from "framer-motion";
import { Github, BookOpen, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative py-16 px-6" style={{ zIndex: 1 }}>
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(0, 191, 255, 0.3), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3
              className="mb-3"
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "1.4rem",
                fontWeight: 900,
                letterSpacing: "0.2em",
                background: "linear-gradient(135deg, #fff, #00BFFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 10px rgba(0, 191, 255, 0.4))",
              }}
            >
              ALFRED
            </h3>
            <p
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(100, 140, 180, 0.8)",
                lineHeight: 1.7,
                maxWidth: "240px",
              }}
            >
              Tactical AI Life Guidance System. Built for those who operate with
              precision and purpose.
            </p>
          </motion.div>

          {/* System Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4
              className="mb-4"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "rgba(0, 191, 255, 0.5)",
                textTransform: "uppercase",
              }}
            >
              SYSTEM INFO
            </h4>
            <ul className="space-y-2">
              {[
                ["Version", "2.1.0 — BETA"],
                ["Backend", "FastAPI · Python"],
                ["Frontend", "Next.js · React"],
                ["Status", "OPERATIONAL"],
              ].map(([key, val]) => (
                <li key={key} className="flex items-center gap-3">
                  <span
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(0, 191, 255, 0.4)",
                      letterSpacing: "0.1em",
                      minWidth: "70px",
                    }}
                  >
                    {key}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: "0.8rem",
                      color: "rgba(160, 190, 220, 0.7)",
                    }}
                  >
                    {val}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4
              className="mb-4"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "rgba(0, 191, 255, 0.5)",
                textTransform: "uppercase",
              }}
            >
              RESOURCES
            </h4>
            <div className="flex flex-col gap-3">
              <motion.a
                whileHover={{ x: 4, color: "#00BFFF" }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.9rem",
                  color: "rgba(130, 160, 200, 0.7)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                <Github size={16} style={{ color: "rgba(0, 191, 255, 0.6)" }} />
                GitHub Repository
                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#00BFFF" }} />
              </motion.a>
              <motion.a
                whileHover={{ x: 4, color: "#00BFFF" }}
                href="#"
                className="flex items-center gap-3 group"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.9rem",
                  color: "rgba(130, 160, 200, 0.7)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                <BookOpen size={16} style={{ color: "rgba(0, 191, 255, 0.6)" }} />
                Documentation
                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#00BFFF" }} />
              </motion.a>
              <motion.a
                whileHover={{ x: 4, color: "#00BFFF" }}
                href="#terminal"
                className="flex items-center gap-3 group"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.9rem",
                  color: "rgba(130, 160, 200, 0.7)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                <span style={{ color: "rgba(0, 191, 255, 0.6)", fontSize: "0.9rem" }}>▶</span>
                API Endpoint: /mentor/chat
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(0, 191, 255, 0.08)" }}
        >
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: "rgba(0, 191, 255, 0.35)",
            }}
          >
            ALFRED AI — TACTICAL LIFE GUIDANCE SYSTEM
          </p>
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: "rgba(80, 110, 140, 0.5)",
            }}
          >
            © {new Date().getFullYear()} · ALL SYSTEMS NOMINAL
          </p>
        </div>
      </div>
    </footer>
  );
}

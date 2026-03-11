"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,191,255,0.015) 2px, rgba(0,191,255,0.015) 4px)",
          zIndex: 2,
        }}
      />

      {/* Center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,191,255,0.06) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      <div className="relative text-center px-6 max-w-5xl mx-auto" style={{ zIndex: 3 }}>
        {/* System label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-3"
        >
          <span
            className="text-xs tracking-[0.4em] uppercase"
            style={{
              color: "#00BFFF",
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            SYSTEM ONLINE
          </span>
          <span
            className="inline-block w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#00BFFF", boxShadow: "0 0 8px #00BFFF" }}
          />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.4 }}
          className="mb-2"
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(3rem, 10vw, 8rem)",
            fontWeight: 900,
            letterSpacing: "0.15em",
            background: "linear-gradient(135deg, #ffffff 0%, #00BFFF 50%, #ffffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            filter: "drop-shadow(0 0 30px rgba(0, 191, 255, 0.5))",
            lineHeight: 1.1,
          }}
        >
          ALFRED
        </motion.h1>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mx-auto mb-4"
          style={{
            height: "1px",
            width: "60%",
            background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
            boxShadow: "0 0 10px rgba(0, 191, 255, 0.5)",
          }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-3"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "clamp(0.9rem, 2.5vw, 1.4rem)",
            fontWeight: 400,
            color: "rgba(0, 191, 255, 0.8)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Your AI Life Mentor
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-12"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "clamp(1rem, 2vw, 1.5rem)",
            color: "rgba(200, 220, 255, 0.7)",
            letterSpacing: "0.3em",
          }}
        >
          Observe.&nbsp;&nbsp;Analyze.&nbsp;&nbsp;Guide.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary Button */}
          <motion.a
            whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(0, 191, 255, 0.6), 0 0 60px rgba(0, 191, 255, 0.3)" }}
            whileTap={{ scale: 0.97 }}
            href="#terminal"
            className="relative px-8 py-4 cursor-pointer group overflow-hidden"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#000",
              background: "linear-gradient(135deg, #00BFFF, #0080FF)",
              border: "1px solid rgba(0, 191, 255, 0.8)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span className="relative z-10">⬡ ENTER THE BATCAVE</span>
            <motion.div
              className="absolute inset-0"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
              style={{ background: "rgba(255,255,255,0.15)" }}
            />
          </motion.a>

          {/* Secondary Button */}
          <motion.a
            whileHover={{
              scale: 1.04,
              borderColor: "rgba(0, 191, 255, 0.8)",
              boxShadow: "0 0 20px rgba(0, 191, 255, 0.3), inset 0 0 20px rgba(0, 191, 255, 0.05)",
            }}
            whileTap={{ scale: 0.97 }}
            href="#terminal"
            className="px-8 py-4 cursor-pointer"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              color: "#00BFFF",
              background: "transparent",
              border: "1px solid rgba(0, 191, 255, 0.35)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backdropFilter: "blur(8px)",
            }}
          >
            ▶ START CONVERSATION
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              color: "rgba(0, 191, 255, 0.5)",
            }}
          >
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(to bottom, rgba(0, 191, 255, 0.6), transparent)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

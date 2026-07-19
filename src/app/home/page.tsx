"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { isAuthenticated } from "@/lib/auth";

const STORAGE_KEYS = [
  "alfred_mood_log",
  "alfred_focus_sessions",
  "alfred-habits",
  "alfred_journal_entries",
  "alfred_goals",
  "alfred_knowledge_vault",
  "alfred_performance_logs",
];

function countActiveModules(): number {
  if (typeof window === "undefined") return 0;
  return STORAGE_KEYS.filter((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.length > 0 : Object.keys(parsed).length > 0;
    } catch {
      return false;
    }
  }).length;
}

export default function HomePage() {
  const router = useRouter();
  const [now, setNow] = useState<Date | null>(null);
  const [activeModules, setActiveModules] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    setNow(new Date());
    setActiveModules(countActiveModules());
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  if (typeof window !== "undefined" && !isAuthenticated()) {
    return null;
  }

  const quickAccess = [
    {
      icon: "◈",
      title: "System Status",
      subtitle: "SYSTEM DIAGNOSTICS",
      description: "Live diagnostics for memory, mentor intelligence, voice & reflection modules.",
      meta: activeModules === null ? "Checking modules…" : `${activeModules}/7 tracked modules active`,
      href: "/status",
      color: "#00BFFF",
    },
    {
      icon: "▣",
      title: "Features",
      subtitle: "TACTICAL MODULES",
      description: "Browse and open every Alfred module — terminal, trackers, journal & vault.",
      meta: "8 tactical modules ready",
      href: "/features",
      color: "#BF7FFF",
    },
  ];

  return (
    <main className="relative min-h-screen w-full" style={{ background: "#000000" }}>
      {/* Animated particle + grid background */}
      <ParticleBackground />

      {/* Navigation */}
      <Navbar />

      {/* Page Sections */}
      <HeroSection />

      {/* Live HUD pulse strip */}
      <div className="relative px-6" style={{ zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mx-auto px-6 py-3"
          style={{ border: "1px solid rgba(0,191,255,0.15)", background: "rgba(0,191,255,0.03)" }}
        >
          <span className="flex items-center gap-2" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#00BFFF" }}>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: "#00BFFF", boxShadow: "0 0 6px #00BFFF" }}
            />
            ALFRED SYSTEM ONLINE
          </span>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(150,180,200,0.6)" }}>
            {activeModules === null ? "SYNCING MODULES…" : `${activeModules}/7 MODULES ACTIVE`}
          </span>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(0,191,255,0.5)" }}>
            {now ? now.toLocaleTimeString("en-US", { hour12: false }) : "--:--:--"}
          </span>
        </motion.div>
      </div>

      {/* Quick Access */}
      <section id="quick-access" className="relative py-24" style={{ zIndex: 1 }}>
        <div className="max-w-4xl px-6" style={{ margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <p
              className="text-xs tracking-[0.4em] uppercase mb-3"
              style={{ fontFamily: "'Share Tech Mono', monospace", color: "rgba(0, 191, 255, 0.6)" }}
            >
              ◈ COMMAND CENTER
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
              QUICK ACCESS
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
            {quickAccess.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{
                  y: -6,
                  boxShadow: `0 20px 50px ${item.color}22, 0 0 30px ${item.color}18`,
                  borderColor: `${item.color}80`,
                }}
                onClick={() => router.push(item.href)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") router.push(item.href);
                }}
                className="relative h-full p-8 flex flex-col cursor-pointer group"
                style={{
                  background: "rgba(13, 17, 23, 0.9)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(0, 191, 255, 0.12)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
                />
                <span
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "2.4rem",
                    color: item.color,
                    filter: `drop-shadow(0 0 10px ${item.color}99)`,
                    lineHeight: 1,
                    marginBottom: "1.25rem",
                  }}
                >
                  {item.icon}
                </span>
                <p
                  className="mb-2"
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.25em",
                    color: `${item.color}99`,
                    textTransform: "uppercase",
                  }}
                >
                  {item.subtitle}
                </p>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#ffffff",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="mb-5"
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    color: "rgba(150, 180, 200, 0.75)",
                  }}
                >
                  {item.description}
                </p>
                <p
                  className="flex-1 mb-5"
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.05em",
                    color: `${item.color}cc`,
                  }}
                >
                  {"> "}{item.meta}
                </p>
                <div
                  className="flex items-center gap-2 pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span
                    style={{
                      fontFamily: "'Orbitron', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      color: item.color,
                      fontWeight: 700,
                    }}
                  >
                    OPEN
                  </span>
                  <motion.span
                    className="inline-block"
                    style={{ color: item.color }}
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                  >
                    →
                  </motion.span>
                </div>
                <div
                  className="absolute bottom-0 right-0 w-6 h-6"
                  style={{
                    borderBottom: `1px solid ${item.color}4d`,
                    borderRight: `1px solid ${item.color}4d`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

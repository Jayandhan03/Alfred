"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#hero", label: "HOME" },
  { href: "#status", label: "STATUS" },
  { href: "#features", label: "FEATURES" },
  { href: "#terminal", label: "TERMINAL" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(0, 0, 0, 0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(0, 191, 255, 0.12)"
          : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl px-6 py-4 flex items-center justify-between" style={{ margin: '0 auto' }}>
        {/* Logo */}
        <a
          href="#hero"
          style={{ textDecoration: "none" }}
        >
          <span
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "1.1rem",
              fontWeight: 900,
              letterSpacing: "0.2em",
              background: "linear-gradient(135deg, #fff 0%, #00BFFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 8px rgba(0, 191, 255, 0.5))",
            }}
          >
            ALFRED
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={{ color: "#00BFFF" }}
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                color: "rgba(150, 180, 210, 0.7)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              {link.label}
            </motion.a>
          ))}
          <motion.a
            href="#terminal"
            whileHover={{
              boxShadow: "0 0 20px rgba(0, 191, 255, 0.5)",
              scale: 1.03,
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: "#000",
              background: "#00BFFF",
              padding: "6px 16px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            LAUNCH
          </motion.a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-px w-6"
              style={{ background: "#00BFFF" }}
              animate={
                mobileOpen
                  ? i === 1
                    ? { opacity: 0 }
                    : i === 0
                      ? { rotate: 45, y: 6 }
                      : { rotate: -45, y: -6 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.2 }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{
              background: "rgba(0, 0, 0, 0.97)",
              borderTop: "1px solid rgba(0, 191, 255, 0.1)",
            }}
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.25em",
                    color: "rgba(150, 180, 210, 0.8)",
                    textDecoration: "none",
                    padding: "8px 0",
                    borderBottom: "1px solid rgba(0, 191, 255, 0.06)",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

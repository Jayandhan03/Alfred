"use client";

import { useRouter } from "next/navigation";
import TerminalPreview from "@/components/TerminalPreview";

export default function TerminalPage() {
  const router = useRouter();

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
          ALFRED TERMINAL
        </span>
        <div style={{ width: "64px" }} />
      </nav>

      <div className="relative z-10" style={{ paddingTop: "70px" }}>
        <TerminalPreview />
      </div>
    </main>
  );
}

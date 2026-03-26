"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ParticleBackground from "@/components/ParticleBackground";
import { login } from "@/lib/auth";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    login();
    router.push("/home");
  };

  return (
    <main
      className="relative min-h-screen w-full flex items-center justify-center"
      style={{ background: "#000000" }}
    >
      <ParticleBackground />

      {/* Center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,191,255,0.07) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      <div className="relative w-full max-w-md px-6" style={{ zIndex: 2, margin: "0 auto" }}>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h1
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(2.5rem, 8vw, 4rem)",
              fontWeight: 900,
              letterSpacing: "0.2em",
              background: "linear-gradient(135deg, #ffffff 0%, #00BFFF 50%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(0, 191, 255, 0.5))",
              lineHeight: 1.1,
            }}
          >
            ALFRED
          </h1>
          <p
            className="mt-2"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.35em",
              color: "rgba(0, 191, 255, 0.6)",
              textTransform: "uppercase",
            }}
          >
            Tactical AI Life Guidance System
          </p>
          <div
            className="mt-4"
            style={{
              height: "1px",
              width: "80px",
              background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
              margin: "0 auto",
            }}
          />
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
          style={{
            background: "rgba(7, 11, 20, 0.92)",
            border: "1px solid rgba(0, 191, 255, 0.2)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 0 60px rgba(0, 191, 255, 0.08), inset 0 0 40px rgba(0, 10, 20, 0.5)",
          }}
        >
          {/* Corner accents */}
          <div
            className="absolute top-0 left-0 w-6 h-6"
            style={{
              borderTop: "1px solid rgba(0, 191, 255, 0.6)",
              borderLeft: "1px solid rgba(0, 191, 255, 0.6)",
            }}
          />
          <div
            className="absolute top-0 right-0 w-6 h-6"
            style={{
              borderTop: "1px solid rgba(0, 191, 255, 0.6)",
              borderRight: "1px solid rgba(0, 191, 255, 0.6)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-6 h-6"
            style={{
              borderBottom: "1px solid rgba(0, 191, 255, 0.6)",
              borderLeft: "1px solid rgba(0, 191, 255, 0.6)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-6 h-6"
            style={{
              borderBottom: "1px solid rgba(0, 191, 255, 0.6)",
              borderRight: "1px solid rgba(0, 191, 255, 0.6)",
            }}
          />

          {/* Tabs */}
          <div
            className="flex"
            style={{ borderBottom: "1px solid rgba(0, 191, 255, 0.12)" }}
          >
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-4 relative"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.25em",
                  color: tab === t ? "#00BFFF" : "rgba(100, 140, 180, 0.5)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                  textTransform: "uppercase",
                }}
              >
                {t === "login" ? "LOGIN" : "SIGN UP"}
                {tab === t && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                      height: "2px",
                      background: "linear-gradient(90deg, transparent, #00BFFF, transparent)",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === "login" ? -15 : 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === "login" ? 15 : -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col gap-5">
                  {/* Label + status */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.3em",
                        color: "rgba(0, 191, 255, 0.45)",
                      }}
                    >
                      ◈ {tab === "login" ? "SECURE LOGIN" : "CREATE ACCOUNT"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ background: "#00BFFF", boxShadow: "0 0 6px #00BFFF" }}
                      />
                      <span
                        style={{
                          fontFamily: "'Share Tech Mono', monospace",
                          fontSize: "0.55rem",
                          color: "#00BFFF",
                          letterSpacing: "0.15em",
                        }}
                      >
                        ENCRYPTED
                      </span>
                    </span>
                  </div>

                  {/* Name field (signup only) */}
                  {tab === "signup" && (
                    <InputField
                      label="OPERATIVE NAME"
                      type="text"
                      placeholder="Enter your name..."
                      value={name}
                      onChange={setName}
                    />
                  )}

                  {/* Email */}
                  <InputField
                    label="IDENTITY CREDENTIAL"
                    type="email"
                    placeholder="Enter your email..."
                    value={email}
                    onChange={setEmail}
                  />

                  {/* Password */}
                  <InputField
                    label="ACCESS KEY"
                    type="password"
                    placeholder="Enter your password..."
                    value={password}
                    onChange={setPassword}
                  />

                  {/* Submit */}
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 0 30px rgba(0, 191, 255, 0.5), 0 0 60px rgba(0, 191, 255, 0.2)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAuth}
                    disabled={loading}
                    className="w-full py-3.5 mt-2 relative overflow-hidden"
                    style={{
                      fontFamily: "'Orbitron', monospace",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.25em",
                      color: loading ? "rgba(0,0,0,0.6)" : "#000",
                      background: "linear-gradient(135deg, #00BFFF, #0080FF)",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <LoadingDots />
                        <span>AUTHENTICATING...</span>
                      </span>
                    ) : tab === "login" ? (
                      "⬡ AUTHENTICATE"
                    ) : (
                      "⬡ CREATE ACCESS"
                    )}
                  </motion.button>

                  {/* Toggle tab hint */}
                  <p
                    className="text-center"
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: "0.82rem",
                      color: "rgba(100, 140, 180, 0.6)",
                    }}
                  >
                    {tab === "login" ? (
                      <>
                        No account?{" "}
                        <button
                          onClick={() => setTab("signup")}
                          style={{
                            color: "#00BFFF",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "'Rajdhani', sans-serif",
                            fontSize: "0.82rem",
                            textDecoration: "underline",
                          }}
                        >
                          Create one
                        </button>
                      </>
                    ) : (
                      <>
                        Already have access?{" "}
                        <button
                          onClick={() => setTab("login")}
                          style={{
                            color: "#00BFFF",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "'Rajdhani', sans-serif",
                            fontSize: "0.82rem",
                            textDecoration: "underline",
                          }}
                        >
                          Login
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-6"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            color: "rgba(0, 191, 255, 0.25)",
          }}
        >
          ALFRED AI · SECURE TERMINAL · ALL SESSIONS ENCRYPTED
        </motion.p>
      </div>
    </main>
  );
}

function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.3em",
          color: "rgba(0, 191, 255, 0.5)",
          marginBottom: "6px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <div
        className="relative"
        style={{
          borderBottom: "1px solid rgba(0, 191, 255, 0.25)",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.75rem",
            color: "#00BFFF",
            userSelect: "none",
          }}
        >
          &gt;_
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.85rem",
            color: "rgba(200, 220, 255, 0.85)",
            caretColor: "#00BFFF",
            padding: "10px 0 10px 32px",
            letterSpacing: "0.04em",
          }}
        />
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.5)" }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}

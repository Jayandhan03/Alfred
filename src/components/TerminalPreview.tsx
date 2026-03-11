"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { mockMentorMessage } from "@/lib/api";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    role: "user",
    content: "Alfred, what should I focus on today?",
    timestamp: "21:04:11",
  },
  {
    role: "ai",
    content: "Discipline. Execution. Consistency.",
    timestamp: "21:04:13",
  },
  {
    role: "user",
    content: "How do I eliminate self-doubt?",
    timestamp: "21:05:03",
  },
  {
    role: "ai",
    content:
      "Self-doubt is noise. Identify one concrete action. Execute it. Evidence displaces doubt — not reassurance.",
    timestamp: "21:05:05",
  },
];

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 items-center py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block w-1.5 h-1.5 rounded-full"
          style={{ background: "#00BFFF" }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function TypedText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        onDone?.();
      }
    }, 22);
    return () => clearInterval(interval);
  }, [text, onDone]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span
          style={{
            display: "inline-block",
            width: "2px",
            height: "1em",
            background: "#00BFFF",
            marginLeft: "2px",
            verticalAlign: "middle",
            animation: "typing-cursor 0.8s infinite",
          }}
        />
      )}
    </span>
  );
}

export default function TerminalPreview() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await mockMentorMessage(trimmed);
      const aiMsg: Message = {
        role: "ai",
        content: res.response,
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      };
      setMessages((prev) => {
        setTypingIndex(prev.length);
        return [...prev, aiMsg];
      });
    } catch {
      const errMsg: Message = {
        role: "ai",
        content: "Connection to Alfred Intelligence failed. Retry.",
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section id="terminal" className="relative py-24 px-6" style={{ zIndex: 1 }}>
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p
            className="text-xs tracking-[0.4em] uppercase mb-3"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: "rgba(0, 191, 255, 0.6)",
            }}
          >
            ◈ LIVE INTERFACE
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
            ALFRED TERMINAL
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

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            background: "rgba(5, 8, 15, 0.95)",
            border: "1px solid rgba(0, 191, 255, 0.25)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 0 40px rgba(0, 191, 255, 0.1), inset 0 0 40px rgba(0, 10, 20, 0.5)",
          }}
        >
          {/* Terminal title bar */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{
              borderBottom: "1px solid rgba(0, 191, 255, 0.15)",
              background: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#FF4444" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#FFB800" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#00BFFF" }} />
            </div>
            <span
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "rgba(0, 191, 255, 0.5)",
              }}
            >
              ALFRED.AI — TACTICAL INTELLIGENCE INTERFACE v2.1
            </span>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-2 h-2 rounded-full"
                style={{ background: "#00BFFF", boxShadow: "0 0 6px #00BFFF" }}
              />
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.6rem",
                  color: "#00BFFF",
                  letterSpacing: "0.15em",
                }}
              >
                LIVE
              </span>
            </div>
          </div>

          {/* Messages */}
          <div
            className="px-6 py-5 overflow-y-auto"
            style={{ height: "380px", scrollbarWidth: "thin" }}
          >
            {/* Boot text */}
            <div className="mb-5">
              <p
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.65rem",
                  color: "rgba(0, 191, 255, 0.35)",
                  letterSpacing: "0.1em",
                }}
              >
                {">"} ALFRED Intelligence System — initialized
              </p>
              <p
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.65rem",
                  color: "rgba(0, 191, 255, 0.35)",
                  letterSpacing: "0.1em",
                }}
              >
                {">"} Tactical Life Guidance Module — READY
              </p>
              <p
                className="mt-1"
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.65rem",
                  color: "rgba(0, 191, 255, 0.2)",
                  letterSpacing: "0.1em",
                }}
              >
                ──────────────────────────────────────
              </p>
            </div>

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-5 ${msg.role === "user" ? "text-right" : "text-left"}`}
              >
                {/* Sender label */}
                <div
                  className={`flex items-center gap-2 mb-1.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <span
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.2em",
                      color: msg.role === "user" ? "rgba(180, 200, 255, 0.5)" : "rgba(0, 191, 255, 0.6)",
                    }}
                  >
                    {msg.role === "user" ? "USER" : "ALFRED"} · {msg.timestamp}
                  </span>
                </div>

                {/* Bubble */}
                <div
                  className="inline-block px-4 py-2.5 max-w-[85%]"
                  style={
                    msg.role === "user"
                      ? {
                          background: "rgba(20, 30, 50, 0.8)",
                          border: "1px solid rgba(100, 150, 200, 0.2)",
                          fontFamily: "'Rajdhani', sans-serif",
                          fontSize: "0.95rem",
                          color: "rgba(180, 200, 230, 0.9)",
                          lineHeight: 1.5,
                        }
                      : {
                          background: "rgba(0, 191, 255, 0.06)",
                          border: "1px solid rgba(0, 191, 255, 0.2)",
                          fontFamily: "'Share Tech Mono', monospace",
                          fontSize: "0.85rem",
                          color: "#00BFFF",
                          lineHeight: 1.6,
                          letterSpacing: "0.04em",
                          boxShadow: "0 0 15px rgba(0, 191, 255, 0.08)",
                        }
                  }
                >
                  {msg.role === "ai" && i === typingIndex ? (
                    <TypedText
                      text={msg.content}
                      onDone={() => setTypingIndex(null)}
                    />
                  ) : (
                    msg.content
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4"
              >
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    color: "rgba(0, 191, 255, 0.5)",
                    letterSpacing: "0.2em",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  ALFRED · analyzing...
                </span>
                <div
                  className="inline-block px-4 py-2"
                  style={{
                    background: "rgba(0, 191, 255, 0.06)",
                    border: "1px solid rgba(0, 191, 255, 0.2)",
                  }}
                >
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderTop: "1px solid rgba(0, 191, 255, 0.15)" }}
          >
            <span
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.8rem",
                color: "#00BFFF",
                userSelect: "none",
              }}
            >
              &gt;_
            </span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Speak to Alfred..."
              disabled={isTyping}
              className="flex-1 bg-transparent outline-none"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.85rem",
                color: "rgba(200, 220, 255, 0.85)",
                caretColor: "#00BFFF",
                letterSpacing: "0.04em",
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 191, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="px-4 py-2 disabled:opacity-40"
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "#000",
                background: "linear-gradient(135deg, #00BFFF, #0080FF)",
                border: "none",
                cursor: isTyping || !input.trim() ? "not-allowed" : "pointer",
              }}
            >
              SEND
            </motion.button>
          </div>
        </motion.div>

        {/* Terminal info */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-4"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "rgba(0, 191, 255, 0.3)",
          }}
        >
          CONNECTED TO ALFRED API · ENDPOINT: /mentor/chat · ENCRYPTED
        </motion.p>
      </div>
    </section>
  );
}

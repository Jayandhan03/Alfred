"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.1,
      life: 0,
      maxLife: Math.random() * 400 + 200,
    });

    // Initialize particles
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push(createParticle());
    }

    const drawGrid = () => {
      const gridSize = 60;
      ctx.strokeStyle = "rgba(0, 191, 255, 0.04)";
      ctx.lineWidth = 0.5;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawParticles = () => {
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Fade in/out based on life
        const lifeRatio = p.life / p.maxLife;
        const fadeOpacity =
          lifeRatio < 0.1
            ? (lifeRatio / 0.1) * p.opacity
            : lifeRatio > 0.9
              ? ((1 - lifeRatio) / 0.1) * p.opacity
              : p.opacity;

        if (p.life > p.maxLife) {
          particlesRef.current[i] = createParticle();
          return;
        }

        // Draw particle glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `rgba(0, 191, 255, ${fadeOpacity})`);
        gradient.addColorStop(1, "rgba(0, 191, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw particle core
        ctx.fillStyle = `rgba(0, 255, 255, ${fadeOpacity * 1.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections between nearby particles
      for (let a = 0; a < particlesRef.current.length; a++) {
        for (let b = a + 1; b < particlesRef.current.length; b++) {
          const pa = particlesRef.current[a];
          const pb = particlesRef.current[b];
          const dist = Math.hypot(pa.x - pb.x, pa.y - pb.y);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08;
            ctx.strokeStyle = `rgba(0, 191, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark radial gradient background
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      bgGradient.addColorStop(0, "rgba(0, 10, 20, 0.95)");
      bgGradient.addColorStop(0.5, "rgba(0, 5, 10, 0.98)");
      bgGradient.addColorStop(1, "rgba(0, 0, 0, 1)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();
      drawParticles();

      // Corner glow accents
      const cornerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 300);
      cornerGlow.addColorStop(0, "rgba(0, 191, 255, 0.04)");
      cornerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = cornerGlow;
      ctx.fillRect(0, 0, 300, 300);

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

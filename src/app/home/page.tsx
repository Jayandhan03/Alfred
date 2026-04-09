"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatusPanel from "@/components/StatusPanel";
import MoodTracker from "@/components/MoodTracker";
import FeaturesSection from "@/components/FeaturesSection";
import TerminalPreview from "@/components/TerminalPreview";
import Footer from "@/components/Footer";
import { isAuthenticated } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  if (typeof window !== "undefined" && !isAuthenticated()) {
    return null;
  }

  return (
    <main className="relative min-h-screen w-full" style={{ background: "#000000" }}>
      {/* Animated particle + grid background */}
      <ParticleBackground />

      {/* Navigation */}
      <Navbar />

      {/* Page Sections */}
      <HeroSection />
      <StatusPanel />
      <MoodTracker />
      <FeaturesSection />
      <TerminalPreview />
      <Footer />
    </main>
  );
}

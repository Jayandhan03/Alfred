import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatusPanel from "@/components/StatusPanel";
import FeaturesSection from "@/components/FeaturesSection";
import TerminalPreview from "@/components/TerminalPreview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full" style={{ background: "#000000" }}>
      {/* Animated particle + grid background */}
      <ParticleBackground />

      {/* Navigation */}
      <Navbar />

      {/* Page Sections */}
      <HeroSection />
      <StatusPanel />
      <FeaturesSection />
      <TerminalPreview />
      <Footer />
    </main>
  );
}

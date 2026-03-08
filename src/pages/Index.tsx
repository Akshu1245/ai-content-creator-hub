import VideoPlayerGate from "@/components/shared/VideoPlayerGate";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <VideoPlayerGate>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="bg-noise" />

        {/* Ambient glow orbs */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[150px]"
            style={{ background: "radial-gradient(circle, hsl(200 80% 62% / 0.06), transparent 70%)" }}
          />
          <div
            className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[150px]"
            style={{ background: "radial-gradient(circle, hsl(270 70% 60% / 0.06), transparent 70%)" }}
          />
          <div
            className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full blur-[130px]"
            style={{ background: "radial-gradient(circle, hsl(42 78% 58% / 0.03), transparent 70%)" }}
          />
        </div>

        <Navbar />
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </div>
    </VideoPlayerGate>
  );
};

export default Index;

import VideoPlayerGate from "@/components/shared/VideoPlayerGate";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <VideoPlayerGate>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="bg-noise" />

        {/* Ambient warm glow orbs */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full blur-[180px]"
            style={{ background: "radial-gradient(circle, hsl(12 76% 56% / 0.05), transparent 70%)" }}
          />
          <div
            className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[160px]"
            style={{ background: "radial-gradient(circle, hsl(158 32% 45% / 0.04), transparent 70%)" }}
          />
          <div
            className="absolute top-[50%] left-[50%] w-[500px] h-[500px] rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"
            style={{ background: "radial-gradient(circle, hsl(42 72% 52% / 0.025), transparent 70%)" }}
          />
        </div>

        <Navbar />
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </div>
    </VideoPlayerGate>
  );
};

export default Index;

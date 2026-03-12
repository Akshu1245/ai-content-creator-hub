import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import LiveTickerSection from "@/components/landing/LiveTickerSection";
import StatsSection from "@/components/landing/StatsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import BeforeAfterSection from "@/components/landing/BeforeAfterSection";
import IndiaFirstSection from "@/components/landing/IndiaFirstSection";
import RevenueCalculatorSection from "@/components/landing/RevenueCalculatorSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import usePageTitle from "@/hooks/usePageTitle";

const Index = () => {
  usePageTitle("");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden scroll-smooth">
      <div className="bg-noise" />

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-15%] left-[-5%] w-[740px] h-[740px] rounded-full blur-[190px]"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.09), transparent 72%)" }}
        />
        <div
          className="absolute bottom-[-15%] right-[-5%] w-[620px] h-[620px] rounded-full blur-[170px]"
          style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.08), transparent 72%)" }}
        />
        <div
          className="absolute top-[50%] left-[50%] w-[540px] h-[540px] rounded-full blur-[160px] -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(circle, hsl(192 80% 70% / 0.05), transparent 72%)" }}
        />
      </div>

      <Navbar />
      <HeroSection />
      <LiveTickerSection />
      <StatsSection />
      <HowItWorksSection />
      <BeforeAfterSection />
      <FeaturesSection />
      <IndiaFirstSection />
      <RevenueCalculatorSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;

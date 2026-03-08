import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does FacelessForge generate videos?",
    a: "We combine Gemini AI for scripts, Sarvam AI for natural voiceovers, Kling AI for video generation, and Pexels for stock footage — all orchestrated through our 8-step wizard pipeline.",
  },
  {
    q: "What is the Compliance Scorer?",
    a: "Our AI analyzes your script and video against YouTube's monetization guidelines (originality, reuse, value-add) and gives you a score with actionable fixes — before you publish.",
  },
  {
    q: "Can I monetize videos made with FacelessForge?",
    a: "Yes. Our compliance engine is specifically designed to help you meet YouTube Partner Program requirements. Videos are scored for originality, educational value, and policy adherence.",
  },
  {
    q: "What platforms are supported?",
    a: "YouTube (long-form + Shorts), TikTok, and Instagram Reels. Each export is automatically optimized for the platform's aspect ratio and requirements.",
  },
  {
    q: "How many voices are available?",
    a: "We offer 6 premium AI voices powered by Sarvam AI, with natural inflection and emotional range — including male, female, and neutral options.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes! The Starter plan includes 2 free videos per month with basic compliance scoring and YouTube export. No credit card required.",
  },
  {
    q: "Can I edit videos after generation?",
    a: "Absolutely. Our built-in editor lets you trim, add text overlays, merge audio/video, arrange multi-clip timelines, and export — all without leaving the platform.",
  },
  {
    q: "What makes FacelessForge different from other AI video tools?",
    a: "We're the only platform with built-in YouTube monetization compliance scoring. Others generate videos — we generate monetizable content with trend intelligence and growth analytics.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <span className="font-label text-accent tracking-widest">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mt-4 mb-3">
            Common questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Everything you need to know before getting started.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="surface-raised px-6 border-none"
            >
              <AccordionTrigger className="text-sm font-display text-foreground hover:text-primary transition-colors py-5 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;

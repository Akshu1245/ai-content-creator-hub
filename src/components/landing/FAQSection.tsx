import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does VORAX generate videos?",
    a: "We combine Gemini AI for scripts, Sarvam AI for natural voiceovers, JSON2Video for video rendering, and Pexels for stock footage — all orchestrated through our 8-step wizard pipeline.",
  },
  {
    q: "What is the Compliance Scorer?",
    a: "Our AI analyzes your script and video against YouTube's monetization guidelines (originality, reuse, value-add) and gives you a score with actionable fixes — before you publish.",
  },
  {
    q: "Can I monetize videos made with VORAX?",
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
    q: "What makes VORAX different from other AI video tools?",
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
              className="surface-raised px-6 border border-border/45 overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

              <AccordionTrigger className="text-sm font-display text-foreground hover:text-primary transition-colors py-5 hover:no-underline text-left">
                <span className="inline-flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-label text-primary">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  {faq.q}
                </span>
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

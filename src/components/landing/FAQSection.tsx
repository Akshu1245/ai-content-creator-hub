import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is the Monetization Shield?",
    a: "Every video gets a full compliance scan against YouTube's monetization policy before you can export. It scores originality, reuse risk, and policy red flags — then auto-rewrites risky sections. No other AI video platform has this gate. They generate and leave you guessing.",
  },
  {
    q: "Why is VORAX cheaper for Indian creators?",
    a: "We bill in Indian Rupees. ₹999/month is ₹999 — no GST surprise, no forex markup. Dollar-priced tools appear cheaper until your bank statement shows the actual amount after 18% GST on foreign services and 2–3% bank FX markup. The difference often exceeds ₹1,800/month.",
  },
  {
    q: "How does Paycheck Preview work?",
    a: "Before creating, VORAX shows projected monthly AdSense earnings based on your niche's live RPM data — e.g. ₹4,200–₹8,800/month for a finance video at 50K views. Pick topics by expected income, not by gut feel.",
  },
  {
    q: "What Indian languages are supported?",
    a: "VORAX uses Sarvam AI — purpose-trained on Indian speech patterns — for Hindi, Tamil, Telugu, Kannada, Bengali, and Marathi. These aren't translation voices. They capture native intonation and regional phonetics that other platforms' generic TTS cannot replicate.",
  },
  {
    q: "What is the Monetization Countdown?",
    a: "It tracks your exact progress toward YouTube Partner Program thresholds — 1,000 subscribers and 4,000 watch hours. Shows your current gap and an estimated time-to-YPP based on your recent growth rate.",
  },
  {
    q: "Can I monetize VORAX videos on YouTube?",
    a: "Yes — and you'll know before you publish whether a video is likely to be monetized or demonetized. Videos scoring 85+ pass the Monetization Shield. Below 85, you get specific issues and auto-fix rewrites before the export button activates.",
  },
  {
    q: "What does Style Memory do?",
    a: "It analyzes your previous videos for pacing, tone, vocabulary, and format — then applies that consistent signature to every new video automatically. Your 50th video sounds as coherent as your 1st.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Starter is free — 2 videos/month, basic compliance scoring, YouTube export, 2 voice options. No credit card required. Pro (₹999/mo) unlocks 20 videos, all 4 platforms, full Monetization Shield with auto-fix, Paycheck Preview, Monetization Countdown, Style Memory, and all 9 Indian voices.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <span className="font-label text-accent tracking-widest">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mt-4 mb-3">
            The questions that matter
          </h2>
          <p className="text-sm text-muted-foreground">Real answers. No fluff.</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="surface-raised px-6 border border-border/45 overflow-hidden relative"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
              <AccordionTrigger className="text-sm font-display text-foreground hover:text-primary transition-colors py-5 hover:no-underline text-left">
                <span className="inline-flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-label text-primary shrink-0">
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

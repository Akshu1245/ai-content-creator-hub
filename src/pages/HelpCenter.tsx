import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";
import { ArrowLeft, CreditCard, Wrench, Shield, MessageSquare, ChevronDown } from "lucide-react";
import { useState } from "react";

const helpSections = [
  {
    icon: CreditCard,
    title: "Account and Billing",
    faqs: [
      {
        q: "How do I upgrade my plan?",
        a: "Go to Settings → Plan & Billing and click the upgrade button for the plan you want. You'll be taken to Stripe's secure checkout. Once payment is confirmed, your plan is upgraded immediately.",
      },
      {
        q: "How do I cancel my subscription?",
        a: "Go to Settings → Plan & Billing and click 'Manage Subscription'. This opens Stripe's billing portal where you can cancel, pause, or change your plan. Your access continues until the end of the current billing period.",
      },
      {
        q: "My subscription shows as 'Free' after I paid. What do I do?",
        a: "Subscription status is checked via Stripe using your account email. Visit Settings and click 'Refresh Subscription'. If the issue persists within 10 minutes of payment, contact support@vorax.com with your payment confirmation.",
      },
      {
        q: "Can I get a refund?",
        a: "We offer refunds within 48 hours of your first charge if you haven't used any paid features. Contact support@vorax.com with your account email and payment reference.",
      },
      {
        q: "What happens to my projects if I downgrade?",
        a: "All your projects and data are retained. You simply lose access to paid-tier features (additional videos, compliance auto-fix, etc.) until you resubscribe.",
      },
    ],
  },
  {
    icon: Wrench,
    title: "Project and Production Issues",
    faqs: [
      {
        q: "My video render is stuck on 'Generating'. What should I do?",
        a: "Open the project timeline, scroll to the video rendering step, and click 'Retry'. Most renders complete in 60–120 seconds. If it stalls beyond 5 minutes, retry creates a new job without losing your script or audio.",
      },
      {
        q: "Voice generation failed. How do I fix it?",
        a: "Voice generation requires SARVAM_API_KEY to be active. Text inputs over 5,000 characters are truncated — split very long scripts into two separate voice steps. If the key is valid and the issue persists, try switching to a different speaker.",
      },
      {
        q: "No stock media results are showing up.",
        a: "The Pexels search requires PEXELS_API_KEY on the server. Try simpler, broader search terms (e.g., 'city' instead of 'busy urban intersection at night'). Pexels works best with 1–3 word queries.",
      },
      {
        q: "My project shows an error after compliance check.",
        a: "Compliance tools require LOVABLE_API_KEY. If you see '402 Credits exhausted', the API key needs a credit top-up. Contact the API provider. Rate limit errors (429) are temporary — wait 60 seconds and retry.",
      },
      {
        q: "Can I re-run a single pipeline step without starting over?",
        a: "Yes. Open the project detail page and use the timeline to retry any specific step. Completed steps retain their outputs — only the step you retry is re-run.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Compliance and Copyright",
    faqs: [
      {
        q: "What does the compliance score actually measure?",
        a: "The score reflects four dimensions: originality (is the content uniquely valuable?), value delivery (does it teach or inform?), misinformation risk (could claims be disputed?), and monetization safety (does it violate advertiser-friendly guidelines?). Each dimension is scored 0–100. Higher is safer.",
      },
      {
        q: "My script scored below 75. Should I still publish?",
        a: "Publishing is always your decision. The score is a risk signal, not a guaranteed outcome. A low originality score often just means the topic is over-covered — try adding a unique angle, specific data, or a case study.",
      },
      {
        q: "Is VORAX-generated content safe from copyright claims?",
        a: "AI-generated voiceovers and scripts carry no inherent copyright risk. However, stock footage from Pexels has its own licensing — always verify the license for each clip. Never use copyrighted music without a license; use YouTube Audio Library or Pixabay instead.",
      },
      {
        q: "The copyright scanner flagged my script. What do I do?",
        a: "Review the specific issue flagged. 'Script risk' flags usually mean high similarity to existing content — paraphrase or add original analysis. 'Audio risk' on AI voiceover is typically false positive. 'Visual risk' means a stock clip may have restrictions — swap it.",
      },
    ],
  },
  {
    icon: MessageSquare,
    title: "Contact Support",
    faqs: [
      {
        q: "How do I contact support?",
        a: "Email support@vorax.com. Include your account email, a brief description of the issue, and your project ID (visible in the project detail URL). Response time is typically under 24 hours on business days.",
      },
      {
        q: "Is there a community or Discord?",
        a: "We're building a creator community. Follow @VoraxAI on X (Twitter) for updates and join our Discord server via the footer link. Feature requests and feedback are welcome in both channels.",
      },
      {
        q: "Where can I report a bug?",
        a: "Email support@vorax.com with 'Bug Report' in the subject line. Include your browser, OS, steps to reproduce, and any error messages or screenshots. We prioritize reproducible bugs.",
      },
    ],
  },
];

const ExpandableFAQ = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/30 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left group"
      >
        <span className="text-sm text-foreground group-hover:text-primary transition-colors">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="text-sm text-muted-foreground leading-relaxed pb-4 pr-8">{a}</p>
      )}
    </div>
  );
};

const HelpCenter = () => {
  usePageTitle("Help Center");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] rounded-full blur-[160px] opacity-20"
          style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.12), transparent 70%)" }} />
      </div>

      <main className="container mx-auto max-w-4xl px-6 py-16 relative z-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>

        <div className="mb-14">
          <span className="font-label text-accent tracking-widest text-[10px]">SUPPORT</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-3">Help Center</h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Practical answers for creators and teams. For anything not covered here, email{" "}
            <a href="mailto:support@vorax.com" className="text-primary hover:underline">support@vorax.com</a>.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap mb-12">
          {helpSections.map((s) => (
            <a key={s.title} href={`#${s.title.toLowerCase().replace(/\s/g, "-")}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-border/60 hover:border-primary/40">
              {s.title}
            </a>
          ))}
        </div>

        <div className="space-y-10">
          {helpSections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.title} id={section.title.toLowerCase().replace(/\s/g, "-")}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-base font-display text-foreground">{section.title}</h2>
                </div>

                <div className="surface-raised border border-border/50 px-6 py-2">
                  {section.faqs.map((faq, i) => (
                    <ExpandableFAQ key={i} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-16 surface-raised border border-primary/20 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.06), transparent 60%)" }} />
          <h3 className="text-base font-display text-foreground mb-2 relative z-10">Still stuck?</h3>
          <p className="text-sm text-muted-foreground mb-5 relative z-10">
            Our support team responds within 24 hours on business days.
          </p>
          <a href="mailto:support@vorax.com" className="btn-primary text-xs px-8 py-3 inline-flex items-center gap-2 relative z-10">
            <MessageSquare className="w-3.5 h-3.5" />
            Email Support
          </a>
        </div>
      </main>
    </div>
  );
};

export default HelpCenter;

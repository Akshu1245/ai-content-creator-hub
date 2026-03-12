import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";
import { ArrowLeft, BookOpen, Zap, Shield, Mic, Film, BarChart2, ChevronRight } from "lucide-react";

const sections = [
  {
    id: "getting-started",
    icon: Zap,
    title: "Getting Started",
    color: "primary",
    steps: [
      {
        step: "1",
        title: "Create your account",
        desc: "Sign up with your email. Email confirmation is required before you can access the dashboard. Check your spam folder if the email doesn't arrive within 2 minutes.",
      },
      {
        step: "2",
        title: "Start a new project",
        desc: "From the dashboard, click 'New Project'. You'll enter an 8-step wizard that guides you from niche selection through to video export.",
      },
      {
        step: "3",
        title: "Choose your niche and topic",
        desc: "Enter your content niche (e.g. 'Personal Finance', 'True Crime') and a specific topic. VORAX runs trend analysis using Gemini AI with Google Search grounding to score opportunity before you invest in production.",
      },
      {
        step: "4",
        title: "Generate and review your script",
        desc: "VORAX generates a research-backed script using Gemini 2.5 Flash. Review and edit before proceeding. The script quality at this stage directly determines compliance and retention performance.",
      },
    ],
  },
  {
    id: "core-workflow",
    icon: Film,
    title: "Core Pipeline",
    color: "accent",
    steps: [
      {
        step: "Script → Voice",
        title: "Voiceover generation",
        desc: "Select from 9 AI voices powered by Sarvam AI Bulbul v3. Adjust speech speed between 0.5x and 2x. Your audio is encoded as base64 and attached to the project for downstream rendering.",
      },
      {
        step: "Voice → Visuals",
        title: "Stock media selection",
        desc: "Search Pexels for relevant photos and video clips. Selected media URLs are passed to the JSON2Video renderer to build scenes. Video clips are preferred over stills for engagement.",
      },
      {
        step: "Visuals → Video",
        title: "Video rendering",
        desc: "JSON2Video renders your scenes at 1080p full-HD. Rendering is asynchronous — VORAX polls the job status every 8 seconds. Most renders complete in 60–120 seconds depending on scene count.",
      },
      {
        step: "Video → Compliance",
        title: "Compliance scoring",
        desc: "Run your script through the compliance scorer before publishing. Scores cover: originality (0–100), value delivery (0–100), misinformation risk (0–100), and monetization safety (0–100). A score above 75 across all dimensions is a reliable publishing signal.",
      },
    ],
  },
  {
    id: "compliance",
    icon: Shield,
    title: "Compliance Guidance",
    color: "gold",
    steps: [
      {
        step: "Understand",
        title: "What the compliance score measures",
        desc: "The score reflects how well your content meets YouTube's advertiser-friendly and monetization guidelines. It is not a guarantee of monetization — it is a risk-reduction tool. Always review AI outputs before publishing.",
      },
      {
        step: "Fix",
        title: "Auto-fix mode",
        desc: "If your score falls below acceptable thresholds, use Auto-Fix to revise the script. The fixer is instructed to preserve depth, specific data, and nuance — it does not simply replace content with generic filler.",
      },
      {
        step: "Scan",
        title: "Copyright risk scanner",
        desc: "After compliance scoring, run the copyright scanner to identify audio, visual, and script-level copyright exposure. Use royalty-free music from YouTube Audio Library, Pixabay, or Incompetech (Kevin MacLeod, CC BY).",
      },
      {
        step: "Publish",
        title: "Captions and multi-platform export",
        desc: "Generate platform-optimized captions for YouTube, Instagram, TikTok, and Shorts. Each export includes SEO-optimized titles, descriptions, and hashtag sets specific to the platform.",
      },
    ],
  },
  {
    id: "troubleshooting",
    icon: BarChart2,
    title: "Troubleshooting",
    color: "arctic",
    steps: [
      {
        step: "!",
        title: "Video render stalls or fails",
        desc: "JSON2Video renders can occasionally time out. If a project shows 'generating' for more than 5 minutes, open the project timeline, scroll to the video step, and use 'Retry'. This creates a new render job without losing your script or voiceover.",
      },
      {
        step: "!",
        title: "Compliance API returns an error",
        desc: "Compliance and copyright tools require LOVABLE_API_KEY to be set in your server environment. If you see '402 Credits exhausted', the API key has run out of credits. Contact the key provider to top up.",
      },
      {
        step: "!",
        title: "Voice generation fails",
        desc: "Sarvam AI requires SARVAM_API_KEY. Ensure the key is active and has sufficient quota. Text inputs over 5,000 characters are automatically truncated — split very long scripts into two voice segments for full coverage.",
      },
      {
        step: "!",
        title: "Subscription not recognized",
        desc: "Subscription status is checked via Stripe using your account email. If your plan shows as 'Free' after payment, visit Settings and click 'Refresh Subscription'. If the issue persists, contact support@vorax.com.",
      },
    ],
  },
];

const Documentation = () => {
  usePageTitle("Documentation");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[350px] rounded-full blur-[160px] opacity-20"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.14), transparent 70%)" }} />
      </div>

      <main className="container mx-auto max-w-4xl px-6 py-16 relative z-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>

        <div className="mb-14">
          <span className="font-label text-accent tracking-widest text-[10px]">PLATFORM REFERENCE</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-3">Documentation</h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Everything you need to use VORAX efficiently, safely, and at scale.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap mb-12">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-border/60 hover:border-primary/40">
              <BookOpen className="w-3 h-3" />
              {s.title}
            </a>
          ))}
        </div>

        <div className="space-y-14">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.id} id={section.id}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <h2 className="text-xl font-display text-foreground">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  {section.steps.map((item, i) => (
                    <div key={i} className="surface-raised border border-border/50 p-6 group hover:border-primary/25 transition-colors duration-200 relative overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                      <div className="flex gap-4">
                        <div className="shrink-0 w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-mono font-bold text-primary">
                          {item.step}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-16 surface-raised border border-border/50 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Mic className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Need more help?</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Visit the{" "}
            <Link to="/help-center" className="text-primary hover:underline">Help Center</Link>{" "}
            for common questions, or email{" "}
            <a href="mailto:support@vorax.com" className="text-primary hover:underline">support@vorax.com</a>
            {" "}with your project ID for account-specific issues.
          </p>
          <div className="flex gap-4">
            <Link to="/help-center" className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
              Help Center <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/api-reference" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              API Reference <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/changelog" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              Changelog <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documentation;

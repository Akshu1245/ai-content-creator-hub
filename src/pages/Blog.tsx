import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";

const posts = [
  {
    date: "March 10, 2026",
    readTime: "7 min read",
    tag: "STRATEGY",
    title: "How to Build a Repeatable Faceless Video Pipeline",
    excerpt: "Top channels don't produce great videos by accident — they engineer systems. Here's how to structure ideation, script quality checks, voice consistency, and multi-channel distribution so you can produce at scale without burnout.",
    body: [
      "The most successful faceless channels treat video production like a factory floor, not a creative session. Every stage is defined, documented, and repeatable. The creator's job becomes quality control, not creation.",
      "Start with a topic bank. Every week, spend 30 minutes scanning Reddit, YouTube's trending page, and Google Trends for your niche. Don't evaluate ideas yet — just collect. A list of 20 weak ideas is more valuable than zero ideas. Once you have a topic list, run each one through a basic filter: search volume, competition density, and your own compliance risk tolerance. VORAX's trend intelligence does this automatically, giving each topic an opportunity score before you commit a script.",
      "For scripts, use a template. The [HOOK → EVIDENCE → FRAMEWORK → CTA] structure works for almost every educational niche. Train your AI to follow your tone — VORAX's consistency engine keeps your channel voice coherent across videos even when using AI generation. Voiceover consistency is equally important. Picking a voice and sticking with it builds brand recognition even in faceless content. Audiences learn to associate 'that voice' with your channel.",
    ],
  },
  {
    date: "February 24, 2026",
    readTime: "5 min read",
    tag: "COMPLIANCE",
    title: "Compliance Signals That Actually Matter Before You Publish",
    excerpt: "Most creators learn about YouTube's monetization policies after they've been demonetized. A practical checklist for reducing policy risk and improving long-term monetization stability — before the video ever goes live.",
    body: [
      "YouTube's monetization algorithm doesn't just look at your video — it reads your script, your title, your description, and your chapter markers. Every element contributes to how the system classifies your content.",
      "The three biggest risk signals are: reused content without added value, harmful or misleading claims, and excessive repetition. Scripts that repeat the same few sentences to inflate length are flagged more reliably than most creators realize. Added value is qualitative, but you can approximate it — if your script could be replaced by a single Wikipedia paragraph, it doesn't meet the threshold.",
      "Run your script through VORAX's compliance scorer before you render the video. It's far cheaper to revise a script than to appeal a demonetization decision. The scorer flags originality concerns, value-density issues, and policy-adjacent language before a single frame is rendered.",
    ],
  },
  {
    date: "February 10, 2026",
    readTime: "9 min read",
    tag: "OPERATIONS",
    title: "Scaling from One Creator to a Team Workflow",
    excerpt: "Operational advice for shared templates, review checkpoints, and maintaining quality at volume — whether you're onboarding your first editor or running a studio of ten.",
    body: [
      "The transition from solo creator to team operation is where most channels stall. Not because the team lacks talent, but because the systems that worked for one person collapse when shared.",
      "The first thing to centralize is your script template. A shared document with your niche-specific hook patterns, evidence framing, and CTA structure means any team member can generate a first draft that's 80% correct. You review the remaining 20%. Build a compliance review checkpoint into every workflow — before production, not after. A script that fails your compliance check at the editing stage costs three times as much to fix as one caught before voiceover is recorded.",
      "For voice work, consider voice cloning if you want to maintain a consistent on-brand sound across multiple producers. VORAX supports custom voice clone IDs — set one and any team member can generate audio that sounds like your established channel voice. Your editor is your most valuable hire. Give them a clear brief template: platform target, ideal length, B-roll tone, overlay style.",
    ],
  },
  {
    date: "January 28, 2026",
    readTime: "6 min read",
    tag: "GROWTH",
    title: "Why 72% Average Retention Is the Number That Actually Matters",
    excerpt: "Views and subscriber counts are vanity metrics. Here's why average view duration is the real signal of channel health — and how to systematically improve it.",
    body: [
      "YouTube tells creators that watch time matters. What it doesn't explain is that average view duration percentage is the underlying signal — and 50% average retention on a 10-minute video is meaningfully different from 50% on a 3-minute video. Channels that maintain 65–75% average retention across their catalog consistently outperform channels with higher view counts but lower retention in long-term algorithmic reach.",
      "Improving retention starts at the script level. A weak hook loses 30% of your audience in the first 30 seconds. A strong hook — a specific, counterintuitive claim backed by concrete data — keeps people watching to see how you'll support it. The second retention cliff happens at the midpoint. Structure your video so the most actionable insight is delivered in the second half, giving people a reason to stay.",
      "VORAX's analytics dashboard shows you retention curves per project. Look for the drop-off points, identify the script sections that correspond to them, and revise your templates accordingly. Every drop-off point is a specific improvement opportunity — not a reason for frustration.",
    ],
  },
];

const Blog = () => {
  usePageTitle("Blog");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px] opacity-25"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.12), transparent 70%)" }} />
      </div>

      <main className="container mx-auto max-w-4xl px-6 py-16 relative z-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>

        <div className="mb-14">
          <span className="font-label text-accent tracking-widest text-[10px]">CREATOR INTELLIGENCE</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-3">Blog</h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Practical playbooks, growth systems, and compliance intelligence for serious faceless creators.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post, i) => (
            <article key={i} className="surface-raised border border-border/50 p-8 group hover:border-primary/30 transition-colors duration-300 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-[9px] font-label bg-primary/10 text-primary border border-primary/20">
                  {post.tag}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar className="w-3 h-3" /> {post.date}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
              </div>

              <h2 className="text-lg md:text-xl font-display text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic border-l-2 border-primary/30 pl-4">{post.excerpt}</p>

              <div className="space-y-3">
                {post.body.map((para, j) => (
                  <p key={j} className="text-sm text-muted-foreground/85 leading-7">{para}</p>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-border/30 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground/50">VORAX Editorial</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary transition-colors cursor-pointer group/link">
                  Share <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 surface-raised border border-border/50 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.07), transparent 60%)" }} />
          <h3 className="text-base font-display text-foreground mb-2 relative z-10">Get new articles in your inbox</h3>
          <p className="text-xs text-muted-foreground mb-5 relative z-10">Strategy, compliance updates, and creator intelligence — delivered weekly.</p>
          <div className="flex gap-3 max-w-sm mx-auto relative z-10">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-background border border-border/60 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button className="btn-primary text-xs px-5 py-2.5">Subscribe</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;

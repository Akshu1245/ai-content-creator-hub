import { Link } from "react-router-dom";
import { Shield, TrendingUp, Globe, Check, X, ArrowRight } from "lucide-react";

const competitors = [
  { name: "VORAX", key: "vorax" },
  { name: "InVideo", key: "invideo" },
  { name: "AutoShorts", key: "autoshorts" },
  { name: "BigMotion", key: "bigmotion" },
  { name: "Pictory", key: "pictory" },
];

const features = [
  {
    name: "Pre-publish compliance scoring",
    vorax: true,
    invideo: false,
    autoshorts: false,
    bigmotion: false,
    pictory: false,
  },
  {
    name: "Indian language voiceover (8 languages)",
    vorax: true,
    invideo: false,
    autoshorts: false,
    bigmotion: false,
    pictory: false,
  },
  {
    name: "Revenue estimator before publishing",
    vorax: true,
    invideo: false,
    autoshorts: false,
    bigmotion: false,
    pictory: false,
  },
  {
    name: "YPP progress tracker",
    vorax: true,
    invideo: false,
    autoshorts: false,
    bigmotion: false,
    pictory: false,
  },
  {
    name: "Voice cloning",
    vorax: true,
    invideo: false,
    autoshorts: false,
    bigmotion: false,
    pictory: false,
  },
  {
    name: "Bring your own GPU (Replicate/RunPod)",
    vorax: true,
    invideo: false,
    autoshorts: false,
    bigmotion: false,
    pictory: false,
  },
  {
    name: "Channel DNA (learns your style)",
    vorax: true,
    invideo: false,
    autoshorts: false,
    bigmotion: false,
    pictory: false,
  },
  {
    name: "Affiliate auto-suggester",
    vorax: true,
    invideo: false,
    autoshorts: false,
    bigmotion: false,
    pictory: false,
  },
  {
    name: "Whisper captions auto-burned",
    vorax: true,
    invideo: false,
    autoshorts: true,
    bigmotion: false,
    pictory: true,
  },
  {
    name: "Credit-based pay per video pricing",
    vorax: true,
    invideo: false,
    autoshorts: false,
    bigmotion: false,
    pictory: false,
  },
];

const painPoints = [
  {
    icon: Shield,
    title: "Your Channel Is Safe",
    body: "Other tools get channels banned. VORAX's DistilBERT compliance model — trained on 50,000 real examples — scores every script before you upload. Know your risk before YouTube does.",
  },
  {
    icon: TrendingUp,
    title: "Know Your Revenue Before You Publish",
    body: "Every video shows projected monthly earnings based on your niche RPM data. Stop guessing. Start knowing.",
  },
  {
    icon: Globe,
    title: "Built For Bharat",
    body: "The only AI video platform with native support for Hindi, Kannada, Tamil, Telugu, Bengali, and Marathi. 50 million Indian creators finally have a tool built for them.",
  },
];

const WhyVORAX = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="font-label text-primary tracking-widest">WHY VORAX</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 mt-4">
            Every Other Tool Creates Videos.{""}
            <span className="text-primary"> VORAX</span> Creates Safe, Profitable Videos.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The only platform that tells you if your content will get monetized before you publish.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-card/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            How VORAX Stacks Up
          </h2>
          
          <div className="overflow-x-auto surface-raised border border-border/45 rounded-2xl p-2">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground">
                    Feature
                  </th>
                  {competitors.map((comp) => (
                    <th
                      key={comp.key}
                      className={`text-center py-4 px-4 font-bold ${
                        comp.key === "vorax"
                          ? "text-primary bg-primary/10 rounded-t-lg"
                          : "text-muted-foreground"
                      }`}
                    >
                      {comp.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/50 hover:bg-primary/5"
                  >
                    <td className="py-4 px-4 text-sm">{feature.name}</td>
                    {competitors.map((comp) => {
                      const value = feature[comp.key as keyof typeof feature] as boolean;
                      return (
                        <td key={comp.key} className="text-center py-4 px-4">
                          {value ? (
                            <Check className="w-6 h-6 mx-auto text-emerald-500" />
                          ) : (
                            <X className="w-6 h-6 mx-auto text-muted-foreground/30" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {painPoints.map((point, index) => (
              <div
                key={index}
                className="surface-raised border border-border/45 rounded-xl p-8 surface-hover"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <point.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold mb-4">{point.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {point.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to create videos that actually grow your channel?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of creators who trust VORAX to keep their channels safe and profitable.
          </p>
          <Link
            to="/new-project"
            className="inline-flex items-center gap-2 btn-primary text-sm px-8 py-4"
          >
            Start Creating Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default WhyVORAX;

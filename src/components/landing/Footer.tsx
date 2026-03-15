import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-border/20 bg-card/30">
      <div className="container mx-auto max-w-5xl px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center mb-4">
              <img src="/vorax-icon.png" alt="VORAX" className="h-8 w-auto object-contain" loading="lazy" />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI-powered faceless video creation with compliance scoring built in.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] border border-primary/20 bg-primary/10 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              SYSTEM READY
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-label text-muted-foreground mb-4 tracking-widest">PRODUCT</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "How it Works", href: "#howitworks" },
                { label: "Changelog", href: "/changelog" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-label text-muted-foreground mb-4 tracking-widest">RESOURCES</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Documentation", to: "/documentation" },
                { label: "API Reference", to: "/api-reference" },
                { label: "Help Center", to: "/help-center" },
                { label: "Blog", to: "/blog" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-xs text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-label text-muted-foreground mb-4 tracking-widest">LEGAL</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Terms of Service", to: "/terms" },
                { label: "Cookie Policy", to: "/privacy#cookies" },
                { label: "GDPR", to: "/privacy#gdpr" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-xs text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gradient-strip mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/50">
          <p>© {new Date().getFullYear()} VORAX. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Discord</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

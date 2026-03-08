import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-border/20">
      <div className="container mx-auto max-w-5xl px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-clay flex items-center justify-center neon-glow">
                <span className="text-primary-foreground font-display text-[10px] font-bold">FF</span>
              </div>
              <span className="font-display text-foreground text-sm">FacelessForge</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI-powered faceless video creation with compliance scoring built in.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[10px] font-label text-muted-foreground mb-4 tracking-widest">PRODUCT</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "How it Works", href: "#howitworks" },
                { label: "Changelog", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-label text-muted-foreground mb-4 tracking-widest">RESOURCES</h4>
            <ul className="space-y-2.5">
              {["Documentation", "API Reference", "Help Center", "Blog"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[10px] font-label text-muted-foreground mb-4 tracking-widest">LEGAL</h4>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gradient-strip mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/50">
          <p>© {new Date().getFullYear()} FacelessForge. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors">Discord</a>
            <a href="#" className="hover:text-foreground transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

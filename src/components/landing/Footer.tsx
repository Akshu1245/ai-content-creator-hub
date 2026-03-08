import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative z-10 py-14 px-6 border-t border-border/20">
      <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-clay flex items-center justify-center neon-glow">
            <span className="text-primary-foreground font-display text-[10px] font-bold">FF</span>
          </div>
          <span className="font-display text-foreground text-sm">FacelessForge</span>
        </Link>
        <div className="flex items-center gap-8">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
        <p className="text-muted-foreground/50">© 2026 FacelessForge</p>
      </div>
    </footer>
  );
};

export default Footer;

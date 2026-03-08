import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/30 bg-background/60 backdrop-blur-2xl">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-display text-sm font-bold">F</span>
          </div>
          <span className="text-base font-display text-foreground tracking-tight">FacelessForge</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-accent transition-colors duration-300 relative group">
            How it works
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
          </a>
          <a href="#features" className="hover:text-accent transition-colors duration-300 relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
          </a>
          <a href="#pricing" className="hover:text-accent transition-colors duration-300 relative group">
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Log in</Button>
          </Link>
          <Link to="/new-project">
            <button className="btn-primary text-xs px-5 py-2.5">Get Started</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

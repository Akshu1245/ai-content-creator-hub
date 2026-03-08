import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/20 bg-background/50 backdrop-blur-2xl">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-clay flex items-center justify-center shadow-lg neon-glow">
            <span className="text-primary-foreground font-display text-xs font-bold">FF</span>
          </div>
          <span className="text-sm font-display text-foreground tracking-tight">FacelessForge</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {["How it works", "Features", "Pricing", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "")}`}
              className="hover:text-primary transition-colors duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link to="/dashboard">
              <button className="btn-primary text-xs px-6 py-2.5">Dashboard</button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Log in</Button>
              </Link>
              <Link to="/auth">
                <button className="btn-primary text-xs px-6 py-2.5">Get Started</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-muted-foreground hover:text-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/20 px-6 py-4 space-y-3">
          {["How it works", "Features", "Pricing", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "")}`}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
          <div className="pt-3 border-t border-border/30 space-y-2">
            {user ? (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <button className="btn-primary w-full text-xs">Dashboard</button>
              </Link>
            ) : (
              <>
                <Link to="/auth" onClick={() => setMobileOpen(false)}>
                  <button className="btn-primary w-full text-xs">Get Started</button>
                </Link>
                <Link to="/auth" onClick={() => setMobileOpen(false)}>
                  <button className="btn-ghost w-full text-xs">Log in</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

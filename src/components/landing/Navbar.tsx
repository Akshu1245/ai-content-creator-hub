import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = ["How it works", "Features", "Pricing", "FAQ", "Why VORAX"];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/78 backdrop-blur-2xl">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

      <div className="container mx-auto flex items-center justify-between h-[74px] px-6">
        <Link to="/" aria-label="Go to home" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="VORAX logo"
            className="h-11 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className="font-display text-primary text-4xl leading-none tracking-wide transition-opacity duration-300 group-hover:opacity-90">
            VORAX
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground rounded-full border border-border/70 bg-card/70 px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.28)]">
          {links.map((item) => (
            <a
              key={item}
              href={item === "Why VORAX" ? "/why-vorax" : `#${item.toLowerCase().replace(/\s/g, "")}`}
              className="hover:text-foreground transition-all duration-300 relative group px-4 py-1.5 rounded-full hover:bg-primary/12"
            >
              {item}
              <span className="absolute -bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-primary/0 via-primary to-primary/0 group-hover:w-[70%] transition-all duration-300" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Link to="/dashboard">
              <button className="btn-primary text-xs px-6 py-2.5">Dashboard</button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground rounded-full px-5 hover:bg-primary/10"
                >
                  Log in
                </Button>
              </Link>
              <Link to="/auth">
                <button className="btn-primary text-xs px-6 py-2.5">Get Started</button>
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-xl border border-border/60 bg-card/70"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/40 px-6 py-5 space-y-2">
          {links.map((item) => (
            <a
              key={item}
              href={item === "Why VORAX" ? "/why-vorax" : `#${item.toLowerCase().replace(/\s/g, "")}`}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 px-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
            >
              {item}
            </a>
          ))}

          <div className="pt-4 mt-3 border-t border-border/30 space-y-2">
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

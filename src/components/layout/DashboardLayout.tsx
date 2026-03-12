import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart3, Settings, Plus, LogOut, Menu, X, HelpCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: HelpCircle, label: "Why VORAX", path: "/why-vorax" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-background flex relative">
      <div className="bg-noise" />

      {/* Ambient orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-primary/[0.02] blur-[100px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full bg-accent/[0.02] blur-[100px]" />
      </div>

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col relative z-20 shrink-0 border-r border-border/50 bg-sidebar/95 backdrop-blur-xl">
        <div className="p-5">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="VORAX" className="h-8 w-auto object-contain" />
              <span className="text-primary font-bold text-lg tracking-wider">VORAX</span>
            </div>
          </Link>

          <Link to="/new-project">
            <button className="btn-primary w-full flex items-center justify-center gap-2 mb-8 text-xs">
              <Plus className="w-3.5 h-3.5" /> New Video
            </button>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-5 space-y-4">
          {/* User info */}
          <div className="surface p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-foreground font-medium truncate">{displayName}</p>
                <p className="text-[9px] text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full rounded-xl hover:bg-secondary/50"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 w-full z-50 h-14 flex items-center justify-between px-4 bg-background/92 backdrop-blur-xl border-b border-border/50">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="VORAX" className="h-8 w-auto object-contain" />
          <span className="text-primary font-bold text-lg tracking-wider">VORAX</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/new-project">
            <button className="btn-primary text-xs px-3 py-2">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-muted-foreground hover:text-foreground">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-16">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-border/50 pt-4 mt-4">
              <div className="px-4 py-2 mb-2">
                <p className="text-xs text-foreground font-medium">{displayName}</p>
                <p className="text-[10px] text-muted-foreground">{user?.email}</p>
              </div>
              <button
                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="p-4 pt-20 pb-20 md:p-8 md:pt-8 md:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 w-full z-50 h-14 flex items-center justify-around bg-background/90 backdrop-blur-xl border-t border-border/50">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-[9px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardLayout;

import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart3, Settings, Plus, LogOut, ChevronRight } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex relative">
      <div className="bg-noise" />

      {/* Ambient orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-primary/[0.02] blur-[100px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full bg-accent/[0.02] blur-[100px]" />
      </div>

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col relative z-20 shrink-0 border-r border-border/50 bg-sidebar">
        <div className="p-5">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/15">
              <span className="text-primary-foreground font-display text-sm font-bold">F</span>
            </div>
            <div>
              <span className="text-sm font-display text-foreground tracking-tight block">FacelessForge</span>
              <span className="text-[10px] font-label text-muted-foreground">PRO PLAN</span>
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
          <div className="surface p-4">
            <div className="flex items-center justify-between text-[10px] font-label mb-2.5">
              <span className="text-muted-foreground">CREDITS REMAINING</span>
              <span className="font-mono font-semibold text-primary">18/20</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-secondary">
              <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all" />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full rounded-xl hover:bg-secondary/50">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 w-full z-50 h-14 flex items-center justify-between px-4 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <span className="text-primary-foreground font-display text-xs font-bold">F</span>
          </div>
          <span className="font-display text-sm text-foreground">FacelessForge</span>
        </Link>
        <Link to="/new-project">
          <button className="btn-primary text-xs px-3 py-2">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      {/* Main */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="md:p-8 p-4 pt-18 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

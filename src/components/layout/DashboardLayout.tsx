import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart3, Settings, Zap, Plus, LogOut, FolderOpen } from "lucide-react";

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
    <div className="min-h-screen bg-background flex">
      {/* Aurora BG */}
      <div className="bg-aurora" />

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col p-4 relative z-20 shrink-0" style={{ background: "rgba(2,4,9,0.85)", backdropFilter: "blur(20px)", borderRight: "1px solid rgba(42,72,112,0.2)" }}>
        <Link to="/" className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.25), rgba(6,214,160,0.15))", border: "1px solid rgba(14,165,233,0.3)" }}>
            <Zap className="w-4 h-4 text-cyan" />
          </div>
          <span className="text-lg font-display font-bold tracking-tight">
            Faceless<span className="gradient-text-cyan">Forge</span>
          </span>
        </Link>

        <Link to="/new-project">
          <button className="btn-primary w-full flex items-center justify-center gap-2 mb-6">
            <Plus className="w-4 h-4" /> New Video
          </button>
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? "rgba(14,165,233,0.1)" : "transparent",
                  color: active ? "#0EA5E9" : "hsl(205 40% 55%)",
                  border: active ? "1px solid rgba(14,165,233,0.15)" : "1px solid transparent",
                }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="glass p-4 mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-label" style={{ color: "hsl(210 25% 40%)" }}>Credits</span>
              <span className="font-mono font-bold text-cyan">18/20</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(42,72,112,0.3)" }}>
              <div className="h-full w-[90%] rounded-full" style={{ background: "linear-gradient(90deg, #0EA5E9, #06D6A0)" }} />
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm transition-colors w-full rounded-lg hover:bg-muted" style={{ color: "hsl(210 25% 40%)" }}>
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 w-full z-50 h-14 flex items-center justify-between px-4" style={{ background: "rgba(2,4,9,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(42,72,112,0.2)" }}>
        <Link to="/" className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan" />
          <span className="font-display font-bold">FacelessForge</span>
        </Link>
        <Link to="/new-project">
          <button className="btn-primary text-xs px-3 py-2">
            <Plus className="w-4 h-4" />
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

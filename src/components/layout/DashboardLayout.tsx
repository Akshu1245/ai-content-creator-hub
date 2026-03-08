import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart3, Settings, Plus, LogOut, FolderOpen } from "lucide-react";

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
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col p-4 relative z-20 shrink-0 border-r border-border bg-sidebar">
        <Link to="/" className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">F</span>
          </div>
          <span className="text-base font-display font-bold tracking-tight text-foreground">
            FacelessForge
          </span>
        </Link>

        <Link to="/new-project">
          <button className="btn-primary w-full flex items-center justify-center gap-2 mb-6 text-sm">
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="surface p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-label text-muted-foreground">Credits</span>
              <span className="font-mono font-semibold text-primary">18/20</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-secondary">
              <div className="h-full w-[90%] rounded-full bg-primary" />
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full rounded-lg hover:bg-secondary/50">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 w-full z-50 h-14 flex items-center justify-between px-4 bg-background border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-xs">F</span>
          </div>
          <span className="font-display font-bold text-sm">FacelessForge</span>
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

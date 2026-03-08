import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Key, CreditCard, Bell, Shield, ExternalLink } from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-display text-foreground font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences.</p>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <section className="surface-raised p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-display text-foreground font-bold">Profile</h2>
                <p className="text-[10px] text-muted-foreground">Your account details</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-label text-muted-foreground block mb-2">EMAIL ADDRESS</label>
                <input type="email" defaultValue="user@example.com" className="w-full px-4 py-3 rounded-xl text-xs text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-label text-muted-foreground block mb-2">DISPLAY NAME</label>
                <input type="text" defaultValue="Creator" className="w-full px-4 py-3 rounded-xl text-xs text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all" />
              </div>
              <button className="btn-primary text-xs mt-2">Save Changes</button>
            </div>
          </section>

          {/* API Connections */}
          <section className="surface-raised p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <Key className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-display text-foreground font-bold">API Connections</h2>
                <p className="text-[10px] text-muted-foreground">External service integrations</p>
              </div>
            </div>
            {[
              { name: "YouTube OAuth", connected: false, desc: "Upload and manage videos" },
              { name: "ElevenLabs", connected: false, desc: "AI voice synthesis" },
              { name: "Pexels API", connected: false, desc: "Stock footage library" },
            ].map((key) => (
              <div key={key.name} className="flex items-center justify-between py-4 border-b border-border/50 last:border-b-0">
                <div>
                  <span className="text-xs font-medium text-foreground">{key.name}</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">{key.desc}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-label ${key.connected ? "text-emerald" : "text-muted-foreground"}`}>
                    {key.connected ? "CONNECTED" : "NOT SET"}
                  </span>
                  <button className="btn-ghost text-[10px] px-4 py-2">
                    {key.connected ? "Manage" : "Connect"}
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Billing */}
          <section className="surface-raised p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-display text-foreground font-bold">Billing</h2>
                <p className="text-[10px] text-muted-foreground">Subscription and usage</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div>
                <span className="text-[10px] font-label text-muted-foreground block">CURRENT PLAN</span>
                <span className="text-xl font-display text-primary font-bold mt-1 block">Free</span>
                <span className="text-[10px] text-muted-foreground">2 videos/month · YouTube only</span>
              </div>
              <button className="btn-primary text-xs">Upgrade to Pro</button>
            </div>
          </section>

          {/* Notifications */}
          <section className="surface-raised p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-display text-foreground font-bold">Notifications</h2>
                <p className="text-[10px] text-muted-foreground">Alert preferences</p>
              </div>
            </div>
            {[
              { label: "Video generation complete", checked: true },
              { label: "Compliance warnings", checked: true },
              { label: "Weekly analytics summary", checked: false },
            ].map((n) => (
              <label key={n.label} className="flex items-center justify-between py-3.5 cursor-pointer border-b border-border/50 last:border-b-0">
                <span className="text-xs text-foreground">{n.label}</span>
                <div className="relative">
                  <input type="checkbox" defaultChecked={n.checked} className="w-4 h-4 rounded accent-primary" />
                </div>
              </label>
            ))}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

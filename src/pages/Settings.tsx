import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Key, CreditCard, Bell } from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-display font-bold">Settings</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(205 40% 55%)" }}>Manage your account and integrations</p>
        </div>

        {/* Profile */}
        <section className="glass-elevated p-6 mb-6">
          <h2 className="text-lg font-display font-bold mb-5 flex items-center gap-2">
            <User className="w-5 h-5" style={{ color: "hsl(205 40% 55%)" }} /> Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-label block mb-1.5" style={{ color: "hsl(210 25% 40%)" }}>Email</label>
              <input type="email" defaultValue="user@example.com" className="w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none" style={{ background: "rgba(8,13,20,0.65)", border: "1px solid rgba(42,72,112,0.35)" }} />
            </div>
            <div>
              <label className="text-xs font-label block mb-1.5" style={{ color: "hsl(210 25% 40%)" }}>Display Name</label>
              <input type="text" defaultValue="Creator" className="w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none" style={{ background: "rgba(8,13,20,0.65)", border: "1px solid rgba(42,72,112,0.35)" }} />
            </div>
            <button className="btn-primary">Save Changes</button>
          </div>
        </section>

        {/* API Keys */}
        <section className="glass-elevated p-6 mb-6">
          <h2 className="text-lg font-display font-bold mb-5 flex items-center gap-2">
            <Key className="w-5 h-5" style={{ color: "hsl(205 40% 55%)" }} /> API Connections
          </h2>
          <div className="space-y-0">
            {[
              { name: "YouTube OAuth", status: "Not connected", color: "#FF4365" },
              { name: "ElevenLabs API", status: "Not connected", color: "#FF4365" },
              { name: "Pexels API", status: "Not connected", color: "#FF4365" },
            ].map((key) => (
              <div key={key.name} className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid rgba(42,72,112,0.15)" }}>
                <div>
                  <span className="text-sm font-medium text-foreground">{key.name}</span>
                  <span className="text-xs font-label block mt-0.5" style={{ color: key.color }}>{key.status}</span>
                </div>
                <button className="px-4 py-2 rounded-lg text-xs font-display font-bold transition-all" style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.25)", color: "#0EA5E9" }}>
                  Connect
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Billing */}
        <section className="glass-elevated p-6 mb-6">
          <h2 className="text-lg font-display font-bold mb-5 flex items-center gap-2">
            <CreditCard className="w-5 h-5" style={{ color: "hsl(205 40% 55%)" }} /> Billing
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-label" style={{ color: "hsl(210 25% 40%)" }}>Current Plan</span>
              <span className="text-2xl font-display font-bold block gradient-text-cyan">Free</span>
            </div>
            <button className="btn-primary">Upgrade to Pro</button>
          </div>
        </section>

        {/* Notifications */}
        <section className="glass-elevated p-6">
          <h2 className="text-lg font-display font-bold mb-5 flex items-center gap-2">
            <Bell className="w-5 h-5" style={{ color: "hsl(205 40% 55%)" }} /> Notifications
          </h2>
          <div className="space-y-0">
            {[
              { label: "Video generation complete", checked: true },
              { label: "Compliance warnings", checked: true },
              { label: "Weekly analytics summary", checked: false },
            ].map((n) => (
              <label key={n.label} className="flex items-center justify-between py-3 cursor-pointer" style={{ borderBottom: "1px solid rgba(42,72,112,0.15)" }}>
                <span className="text-sm text-foreground">{n.label}</span>
                <input type="checkbox" defaultChecked={n.checked} className="w-4 h-4 rounded" style={{ accentColor: "#0EA5E9" }} />
              </label>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

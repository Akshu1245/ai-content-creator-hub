import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Key, CreditCard, Bell } from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your account and integrations</p>
        </div>

        <section className="surface-raised p-5 mb-4">
          <h2 className="text-sm font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" /> Profile
          </h2>
          <div className="space-y-3">
            <div>
              <label className="font-label text-muted-foreground block mb-1.5">EMAIL</label>
              <input type="email" defaultValue="user@example.com" className="w-full px-3 py-2.5 rounded-lg text-sm text-foreground bg-card border border-border focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="font-label text-muted-foreground block mb-1.5">DISPLAY NAME</label>
              <input type="text" defaultValue="Creator" className="w-full px-3 py-2.5 rounded-lg text-sm text-foreground bg-card border border-border focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <button className="btn-primary text-sm">Save Changes</button>
          </div>
        </section>

        <section className="surface-raised p-5 mb-4">
          <h2 className="text-sm font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-muted-foreground" /> API Connections
          </h2>
          {[
            { name: "YouTube OAuth", connected: false },
            { name: "ElevenLabs API", connected: false },
            { name: "Pexels API", connected: false },
          ].map((key) => (
            <div key={key.name} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div>
                <span className="text-sm font-medium text-foreground">{key.name}</span>
                <span className={`text-xs block mt-0.5 ${key.connected ? "text-accent" : "text-destructive"}`}>
                  {key.connected ? "Connected" : "Not connected"}
                </span>
              </div>
              <button className="btn-ghost text-xs px-3 py-1.5">Connect</button>
            </div>
          ))}
        </section>

        <section className="surface-raised p-5 mb-4">
          <h2 className="text-sm font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" /> Billing
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label text-muted-foreground">CURRENT PLAN</span>
              <span className="text-xl font-display font-bold block text-primary mt-0.5">Free</span>
            </div>
            <button className="btn-primary text-sm">Upgrade to Pro</button>
          </div>
        </section>

        <section className="surface-raised p-5">
          <h2 className="text-sm font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" /> Notifications
          </h2>
          {[
            { label: "Video generation complete", checked: true },
            { label: "Compliance warnings", checked: true },
            { label: "Weekly analytics summary", checked: false },
          ].map((n) => (
            <label key={n.label} className="flex items-center justify-between py-2.5 cursor-pointer border-b border-border last:border-b-0">
              <span className="text-sm text-foreground">{n.label}</span>
              <input type="checkbox" defaultChecked={n.checked} className="w-4 h-4 rounded accent-primary" />
            </label>
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

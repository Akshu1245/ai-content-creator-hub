import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { User, Key, CreditCard, Bell, Shield } from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        {/* Profile */}
        <section className="glass rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-muted-foreground" /> Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Email</label>
              <input type="email" defaultValue="user@example.com" className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Display Name</label>
              <input type="text" defaultValue="Creator" className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
          </div>
        </section>

        {/* API Keys */}
        <section className="glass rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-muted-foreground" /> API Connections
          </h2>
          <div className="space-y-3">
            {["YouTube OAuth", "ElevenLabs API", "Pexels API"].map((key) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                <div>
                  <span className="text-sm font-medium">{key}</span>
                  <span className="text-xs text-muted-foreground block">Not connected</span>
                </div>
                <Button variant="outline" size="sm" className="border-border text-foreground">Connect</Button>
              </div>
            ))}
          </div>
        </section>

        {/* Billing */}
        <section className="glass rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" /> Billing
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Current Plan</span>
              <span className="text-primary font-bold block text-lg">Free</span>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Upgrade to Pro</Button>
          </div>
        </section>

        {/* Notifications */}
        <section className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" /> Notifications
          </h2>
          <div className="space-y-3">
            {[
              { label: "Video generation complete", checked: true },
              { label: "Compliance warnings", checked: true },
              { label: "Weekly analytics summary", checked: false },
            ].map((n) => (
              <label key={n.label} className="flex items-center justify-between py-2 cursor-pointer">
                <span className="text-sm">{n.label}</span>
                <input type="checkbox" defaultChecked={n.checked} className="accent-primary w-4 h-4" />
              </label>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

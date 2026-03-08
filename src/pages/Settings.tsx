import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Key, CreditCard, Bell, Loader2, Shield, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import usePageTitle from "@/hooks/usePageTitle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NotificationPrefs {
  videoComplete: boolean;
  complianceWarnings: boolean;
  weeklySummary: boolean;
}

const Settings = () => {
  const { user } = useAuth();
  usePageTitle("Settings");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
    videoComplete: true,
    complianceWarnings: true,
    weeklySummary: false,
  });
  const [savingNotifs, setSavingNotifs] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || "");
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
        if (data) {
          setDisplayName((data as any).display_name || "");
          setBio((data as any).bio || "");
          // Load notification preferences
          const prefs = (data as any).preferences;
          if (prefs?.notifications) {
            setNotifPrefs({
              videoComplete: prefs.notifications.videoComplete ?? true,
              complianceWarnings: prefs.notifications.complianceWarnings ?? true,
              weeklySummary: prefs.notifications.weeklySummary ?? false,
            });
          }
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName, bio } as any)
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Profile updated!");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleNotifToggle = async (key: keyof NotificationPrefs) => {
    if (!user) return;
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updated);
    setSavingNotifs(true);
    try {
      // Get current preferences
      const { data: profile } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("id", user.id)
        .maybeSingle();
      
      const currentPrefs = (profile as any)?.preferences || {};
      const newPrefs = { ...currentPrefs, notifications: updated };
      
      const { error } = await supabase
        .from("profiles")
        .update({ preferences: newPrefs } as any)
        .eq("id", user.id);
      if (error) throw error;
    } catch (e: any) {
      // Revert on error
      setNotifPrefs(notifPrefs);
      toast.error("Failed to save preference");
    } finally {
      setSavingNotifs(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Password reset email sent!");
    } catch (e: any) {
      toast.error(e.message || "Failed to send reset email");
    }
  };

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
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl text-xs text-muted-foreground bg-secondary/30 border border-border cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[10px] font-label text-muted-foreground block mb-2">DISPLAY NAME</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-xs text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-label text-muted-foreground block mb-2">BIO</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-xs text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleSave} disabled={saving} className="btn-primary text-xs flex items-center gap-2">
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                  Save Changes
                </button>
                <button onClick={handlePasswordReset} className="btn-ghost text-xs flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Reset Password
                </button>
              </div>
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
              { name: "Gemini AI", connected: true, desc: "Script, captions, research", status: "Active" },
              { name: "Sarvam AI", connected: true, desc: "Voice synthesis (6 voices)", status: "Active" },
              { name: "JSON2Video", connected: true, desc: "Video rendering engine", status: "Active" },
              { name: "Pexels", connected: true, desc: "Stock photos & videos", status: "Active" },
              { name: "YouTube Data API", connected: false, desc: "Analytics & direct upload", status: "Setup Required" },
            ].map((key) => (
              <div key={key.name} className="flex items-center justify-between py-4 border-b border-border/50 last:border-b-0">
                <div>
                  <span className="text-xs font-medium text-foreground">{key.name}</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">{key.desc}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-label ${key.connected ? "text-emerald" : "text-muted-foreground"}`}>
                    {key.connected ? "✓ CONNECTED" : key.status}
                  </span>
                  {!key.connected && (
                    <button className="text-[10px] text-primary hover:underline">Configure</button>
                  )}
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
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50 mb-4">
              <div>
                <span className="text-[10px] font-label text-muted-foreground block">CURRENT PLAN</span>
                <span className="text-xl font-display text-primary font-bold mt-1 block">Free</span>
                <span className="text-[10px] text-muted-foreground">2 videos/month · YouTube only</span>
              </div>
              <button className="btn-primary text-xs">Upgrade to Pro</button>
            </div>
            
            {/* Plan comparison */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Starter", price: "Free", features: ["2 videos/mo", "Basic compliance"], current: true },
                { name: "Pro", price: "₹999/mo", features: ["20 videos/mo", "All platforms", "Auto-fix"], current: false },
                { name: "Agency", price: "₹2,999/mo", features: ["Unlimited", "API access", "Priority"], current: false },
              ].map((plan) => (
                <div key={plan.name} className={`p-3 rounded-xl border text-center ${plan.current ? "border-primary/30 bg-primary/5" : "border-border/50 bg-secondary/20"}`}>
                  <span className="text-[10px] font-label text-muted-foreground">{plan.name.toUpperCase()}</span>
                  <p className="text-sm font-display font-bold text-foreground mt-1">{plan.price}</p>
                  <div className="mt-2 space-y-1">
                    {plan.features.map((f) => (
                      <p key={f} className="text-[9px] text-muted-foreground">{f}</p>
                    ))}
                  </div>
                  {plan.current && <span className="text-[8px] font-label text-primary mt-2 block">CURRENT</span>}
                </div>
              ))}
            </div>
            <p className="text-[9px] text-muted-foreground mt-3 text-center">Payment integration coming soon. All plans include full AI generation pipeline.</p>
          </section>

          {/* Notifications */}
          <section className="surface-raised p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-display text-foreground font-bold">Notifications</h2>
                <p className="text-[10px] text-muted-foreground">Alert preferences {savingNotifs && <span className="text-primary">· Saving...</span>}</p>
              </div>
            </div>
            {[
              { key: "videoComplete" as const, label: "Video generation complete", desc: "Get notified when your video finishes rendering" },
              { key: "complianceWarnings" as const, label: "Compliance warnings", desc: "Alert when content may affect monetization" },
              { key: "weeklySummary" as const, label: "Weekly analytics summary", desc: "Receive a weekly performance digest" },
            ].map((n) => (
              <label key={n.key} className="flex items-center justify-between py-3.5 cursor-pointer border-b border-border/50 last:border-b-0">
                <div>
                  <span className="text-xs text-foreground block">{n.label}</span>
                  <span className="text-[9px] text-muted-foreground">{n.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPrefs[n.key]}
                  onChange={() => handleNotifToggle(n.key)}
                  className="w-4 h-4 rounded accent-primary"
                />
              </label>
            ))}
          </section>

          {/* Danger Zone */}
          <section className="surface-raised p-6 border border-destructive/20">
            <h2 className="text-sm font-display text-destructive font-bold mb-3">Danger Zone</h2>
            <p className="text-[10px] text-muted-foreground mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
            <button className="btn-ghost text-xs text-destructive border border-destructive/20 hover:bg-destructive/10">
              Delete Account
            </button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
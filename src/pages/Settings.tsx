import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Key, CreditCard, Bell, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import usePageTitle from "@/hooks/usePageTitle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  usePageTitle("Settings");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || "");
      // Load profile
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
        if (data) {
          setDisplayName((data as any).display_name || "");
          setBio((data as any).bio || "");
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
              <button onClick={handleSave} disabled={saving} className="btn-primary text-xs mt-2 flex items-center gap-2">
                {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                Save Changes
              </button>
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
              { name: "Gemini AI", connected: true, desc: "Script, captions, research" },
              { name: "Sarvam AI", connected: true, desc: "Voice synthesis (6 voices)" },
              { name: "Kling AI", connected: true, desc: "Video generation" },
              { name: "Pexels", connected: true, desc: "Stock photos & videos" },
              { name: "YouTube OAuth", connected: false, desc: "Direct upload (coming soon)" },
            ].map((key) => (
              <div key={key.name} className="flex items-center justify-between py-4 border-b border-border/50 last:border-b-0">
                <div>
                  <span className="text-xs font-medium text-foreground">{key.name}</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">{key.desc}</span>
                </div>
                <span className={`text-[10px] font-label ${key.connected ? "text-emerald" : "text-muted-foreground"}`}>
                  {key.connected ? "✓ CONNECTED" : "PENDING"}
                </span>
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
                <input type="checkbox" defaultChecked={n.checked} className="w-4 h-4 rounded accent-primary" />
              </label>
            ))}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

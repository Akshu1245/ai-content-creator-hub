import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Key, CreditCard, Bell, Loader2, Shield, ExternalLink, Check, Crown, Film, Sparkles, Server, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useAuth, SUBSCRIPTION_TIERS } from "@/contexts/AuthContext";
import usePageTitle from "@/hooks/usePageTitle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NotificationPrefs {
  videoComplete: boolean;
  complianceWarnings: boolean;
  weeklySummary: boolean;
}

type EngineId = "pexels" | "replicate" | "runpod";

interface EngineConfig {
  engine: EngineId;
  api_token: string;
  api_key: string;
  endpoint_url: string;
}

const API_URL = "";

const DEFAULT_ENGINE_CONFIG: EngineConfig = { engine: "pexels", api_token: "", api_key: "", endpoint_url: "" };

const Settings = () => {
  const { user, subscription, checkSubscription } = useAuth();
  usePageTitle("Settings");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
    videoComplete: true,
    complianceWarnings: true,
    weeklySummary: false,
  });
  const [savingNotifs, setSavingNotifs] = useState(false);

  // Video engine state
  const [engineConfig, setEngineConfig] = useState<EngineConfig>(() => {
    try {
      return JSON.parse(localStorage.getItem("vorax_engine_config") || "") as EngineConfig;
    } catch {
      return DEFAULT_ENGINE_CONFIG;
    }
  });
  const [engineValidating, setEngineValidating] = useState(false);
  const [engineValidation, setEngineValidation] = useState<{ valid: boolean; message: string } | null>(null);
  const [showReplicateToken, setShowReplicateToken] = useState(false);
  const [showRunpodKey, setShowRunpodKey] = useState(false);

  // Check for checkout result in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      toast.success("Subscription activated! 🎉");
      checkSubscription();
      window.history.replaceState({}, "", "/settings");
    } else if (params.get("checkout") === "cancelled") {
      toast.info("Checkout cancelled");
      window.history.replaceState({}, "", "/settings");
    }
  }, [checkSubscription]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || "");
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
        if (data) {
          setDisplayName((data as any).display_name || "");
          setBio((data as any).bio || "");
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
    } catch {
      setNotifPrefs(notifPrefs);
      toast.error("Failed to save preference");
    } finally {
      setSavingNotifs(false);
    }
  };

  const handleSaveEngine = () => {
    localStorage.setItem("vorax_engine_config", JSON.stringify(engineConfig));
    toast.success("Engine settings saved");
  };

  const handleValidateEngine = async () => {
    setEngineValidating(true);
    setEngineValidation(null);
    try {
      const res = await fetch(`${API_URL}/api/engine/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(engineConfig),
      });
      const json = await res.json();
      setEngineValidation({ valid: json.valid, message: json.message });
    } catch (e: any) {
      setEngineValidation({ valid: false, message: e.message || "Connection failed" });
    } finally {
      setEngineValidating(false);
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

  const handleCheckout = async (priceId: string) => {
    setCheckoutLoading(priceId);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to create checkout");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (e: any) {
      toast.error(e.message || "No active subscription to manage");
    } finally {
      setPortalLoading(false);
    }
  };

  const plans = [
    {
      key: "free",
      name: "Starter",
      price: "Free",
      features: ["2 videos/mo", "Basic compliance", "YouTube only", "2 voices"],
      priceId: null,
    },
    {
      key: "pro",
      name: "Pro",
      price: "₹999/mo",
      features: ["20 videos/mo", "All platforms", "Auto-fix", "All 9 voices", "AI insights"],
      priceId: SUBSCRIPTION_TIERS.pro.price_id,
      popular: true,
    },
    {
      key: "agency",
      name: "Agency",
      price: "₹2,999/mo",
      features: ["Unlimited videos", "Everything in Pro", "API access", "Priority queue"],
      priceId: SUBSCRIPTION_TIERS.agency.price_id,
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <span className="font-label text-primary tracking-widest text-[10px]">SYSTEM CONFIG</span>
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
                <input type="email" value={user?.email || ""} disabled
                  className="w-full px-4 py-3 rounded-xl text-xs text-muted-foreground bg-secondary/30 border border-border cursor-not-allowed" />
              </div>
              <div>
                <label className="text-[10px] font-label text-muted-foreground block mb-2">DISPLAY NAME</label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-xs text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-label text-muted-foreground block mb-2">BIO</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                  className="w-full px-4 py-3 rounded-xl text-xs text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                  placeholder="Tell us about yourself..." />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleSave} disabled={saving} className="btn-primary text-xs flex items-center gap-2">
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />} Save Changes
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
              { name: "Gemini AI", connected: true, desc: "Script, captions, research" },
              { name: "Sarvam AI", connected: true, desc: "Voice synthesis (9 voices)" },
              { name: "JSON2Video", connected: true, desc: "Video rendering engine" },
              { name: "Pexels", connected: true, desc: "Stock photos & videos" },
              { name: "Stripe", connected: true, desc: "Payment processing" },
              { name: "YouTube Data API", connected: false, desc: "Analytics & direct upload" },
            ].map((key) => (
              <div key={key.name} className="flex items-center justify-between py-4 border-b border-border/50 last:border-b-0">
                <div>
                  <span className="text-xs font-medium text-foreground">{key.name}</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">{key.desc}</span>
                </div>
                <span className={`text-[10px] font-label ${key.connected ? "text-emerald" : "text-muted-foreground"}`}>
                  {key.connected ? "✓ CONNECTED" : "COMING SOON"}
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
                <h2 className="text-sm font-display text-foreground font-bold">Billing & Subscription</h2>
                <p className="text-[10px] text-muted-foreground">
                  {subscription.loading ? "Checking subscription..." : 
                   subscription.subscribed ? `${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} plan active` : "Free plan"}
                </p>
              </div>
            </div>

            {subscription.subscribed && subscription.subscriptionEnd && (
              <div className="mb-4 p-3 rounded-xl bg-emerald/5 border border-emerald/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-emerald" />
                  <div>
                    <span className="text-xs text-foreground font-medium">{subscription.tier === "agency" ? "Agency" : "Pro"} Plan Active</span>
                    <span className="text-[9px] text-muted-foreground block">
                      Renews {new Date(subscription.subscriptionEnd).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button onClick={handleManageSubscription} disabled={portalLoading} className="btn-ghost text-[10px] flex items-center gap-1">
                  {portalLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
                  Manage
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {plans.map((plan) => {
                const isCurrent = subscription.tier === plan.key;
                const isUpgrade = !isCurrent && plan.priceId;
                return (
                  <div key={plan.key} className={`p-4 rounded-xl border text-center relative ${
                    isCurrent ? "border-primary/30 bg-primary/5" : "border-border/50 bg-secondary/20"
                  } ${plan.popular ? "ring-1 ring-primary/20" : ""}`}>
                    {plan.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-label bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        POPULAR
                      </span>
                    )}
                    <span className="text-[10px] font-label text-muted-foreground">{plan.name.toUpperCase()}</span>
                    <p className="text-sm font-display font-bold text-foreground mt-1">{plan.price}</p>
                    <div className="mt-3 space-y-1.5">
                      {plan.features.map((f) => (
                        <p key={f} className="text-[9px] text-muted-foreground flex items-center gap-1 justify-center">
                          <Check className="w-2.5 h-2.5 text-emerald" /> {f}
                        </p>
                      ))}
                    </div>
                    {isCurrent ? (
                      <span className="text-[8px] font-label text-primary mt-3 block">YOUR PLAN</span>
                    ) : isUpgrade ? (
                      <button
                        onClick={() => handleCheckout(plan.priceId!)}
                        disabled={!!checkoutLoading}
                        className="btn-primary text-[10px] mt-3 w-full flex items-center justify-center gap-1"
                      >
                        {checkoutLoading === plan.priceId ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Upgrade"
                        )}
                      </button>
                    ) : (
                      <span className="text-[8px] font-label text-muted-foreground mt-3 block">FREE FOREVER</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-2 mt-4">
              <button onClick={() => checkSubscription()} className="text-[10px] text-muted-foreground hover:text-primary transition-colors">
                Refresh subscription status
              </button>
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
                <input type="checkbox" checked={notifPrefs[n.key]} onChange={() => handleNotifToggle(n.key)}
                  className="w-4 h-4 rounded accent-primary" />
              </label>
            ))}
          </section>

          {/* Video Generation Engine */}
          <section className="surface-raised p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <Film className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-display text-foreground font-bold">Video Generation Engine</h2>
                <p className="text-[10px] text-muted-foreground">Choose how VORAX generates your video visuals</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Card 1 — Pexels */}
              <div
                onClick={() => { setEngineConfig((c) => ({ ...c, engine: "pexels" })); setEngineValidation(null); }}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  engineConfig.engine === "pexels"
                    ? "border-sky-500/60 bg-sky-500/5 shadow-[0_0_12px_rgba(14,165,233,0.08)]"
                    : "border-border/50 bg-secondary/20 hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Film className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-display font-bold text-foreground">Pexels Stock Footage</span>
                        <span className="text-[8px] font-label bg-emerald/15 text-emerald px-1.5 py-0.5 rounded-full">FREE</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Uses Pexels stock footage library. No API key needed. 10M+ clips available.</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 transition-all ${
                    engineConfig.engine === "pexels" ? "border-sky-500 bg-sky-500" : "border-border"
                  }`} />
                </div>
              </div>

              {/* Card 2 — Replicate */}
              <div
                onClick={() => { setEngineConfig((c) => ({ ...c, engine: "replicate" })); setEngineValidation(null); }}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  engineConfig.engine === "replicate"
                    ? "border-sky-500/60 bg-sky-500/5 shadow-[0_0_12px_rgba(14,165,233,0.08)]"
                    : "border-border/50 bg-secondary/20 hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-display font-bold text-foreground">Replicate AI</span>
                        <span className="text-[8px] font-label bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">AI POWERED</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Generate unique AI visuals using LTX-Video. Bring your own Replicate API token.</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 transition-all ${
                    engineConfig.engine === "replicate" ? "border-sky-500 bg-sky-500" : "border-border"
                  }`} />
                </div>
                {engineConfig.engine === "replicate" && (
                  <div className="space-y-2 pt-2 border-t border-border/30" onClick={(e) => e.stopPropagation()}>
                    <label className="text-[10px] font-label text-muted-foreground block">REPLICATE API TOKEN</label>
                    <div className="relative">
                      <input
                        type={showReplicateToken ? "text" : "password"}
                        value={engineConfig.api_token}
                        onChange={(e) => setEngineConfig((c) => ({ ...c, api_token: e.target.value }))}
                        placeholder="r8_xxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2.5 pr-10 rounded-lg text-xs text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                      <button onClick={() => setShowReplicateToken((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showReplicateToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[9px] text-muted-foreground">
                      Get your free token at replicate.com — includes $5 free credits ·{" "}
                      <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Get Replicate Token →
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {/* Card 3 — RunPod */}
              <div
                onClick={() => { setEngineConfig((c) => ({ ...c, engine: "runpod" })); setEngineValidation(null); }}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  engineConfig.engine === "runpod"
                    ? "border-sky-500/60 bg-sky-500/5 shadow-[0_0_12px_rgba(14,165,233,0.08)]"
                    : "border-border/50 bg-secondary/20 hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Server className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-display font-bold text-foreground">RunPod</span>
                        <span className="text-[8px] font-label bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full">ADVANCED</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Use your own RunPod GPU endpoint for maximum control and lowest cost.</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 transition-all ${
                    engineConfig.engine === "runpod" ? "border-sky-500 bg-sky-500" : "border-border"
                  }`} />
                </div>
                {engineConfig.engine === "runpod" && (
                  <div className="space-y-2 pt-2 border-t border-border/30" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label className="text-[10px] font-label text-muted-foreground block mb-1.5">RUNPOD ENDPOINT URL</label>
                      <input
                        type="text"
                        value={engineConfig.endpoint_url}
                        onChange={(e) => setEngineConfig((c) => ({ ...c, endpoint_url: e.target.value }))}
                        placeholder="https://api.runpod.ai/v2/xxxxxxxx"
                        className="w-full px-4 py-2.5 rounded-lg text-xs text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-label text-muted-foreground block mb-1.5">RUNPOD API KEY</label>
                      <div className="relative">
                        <input
                          type={showRunpodKey ? "text" : "password"}
                          value={engineConfig.api_key}
                          onChange={(e) => setEngineConfig((c) => ({ ...c, api_key: e.target.value }))}
                          placeholder="rpa_xxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-4 py-2.5 pr-10 rounded-lg text-xs text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        />
                        <button onClick={() => setShowRunpodKey((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showRunpodKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-[9px] text-muted-foreground">
                      Deploy the VORAX worker on RunPod for ~₹3 per video ·{" "}
                      <a href="/docs/runpod-setup.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        RunPod Setup Guide →
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Validate + Save */}
            <div className="flex items-center gap-3 mt-4">
              {engineConfig.engine !== "pexels" && (
                <button
                  onClick={handleValidateEngine}
                  disabled={engineValidating}
                  className="btn-ghost text-xs flex items-center gap-2"
                >
                  {engineValidating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Test Connection
                </button>
              )}
              <button onClick={handleSaveEngine} className="btn-primary text-xs">
                Save Engine Settings
              </button>
            </div>

            {engineValidation && (
              <div className={`mt-3 flex items-center gap-2 text-[10px] ${engineValidation.valid ? "text-emerald" : "text-destructive"}`}>
                {engineValidation.valid
                  ? <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  : <XCircle className="w-3.5 h-3.5 shrink-0" />}
                {engineValidation.message}
              </div>
            )}
          </section>

          {/* Danger Zone */}
          <section className="surface-raised p-6 border border-destructive/20">
            <h2 className="text-sm font-display text-destructive font-bold mb-3">Danger Zone</h2>
            <p className="text-[10px] text-muted-foreground mb-4">Permanently delete your account and all associated data.</p>
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
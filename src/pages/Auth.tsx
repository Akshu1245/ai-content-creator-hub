import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";

type AuthMode = "login" | "signup" | "forgot";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Check your email for a password reset link.");
        setMode("login");
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        if (displayName.trim().length < 2) {
          toast.error("Display name must be at least 2 characters.");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: displayName.trim() }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created! You're signed in.");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const title = mode === "forgot" ? "Reset password" : mode === "login" ? "Welcome back" : "Create your account";
  const subtitle = mode === "forgot"
    ? "Enter your email and we'll send a reset link"
    : mode === "login"
    ? "Sign in to continue creating"
    : "Start making faceless videos in minutes";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary/30 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(hsl(12 76% 56% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(12 76% 56% / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        <div className="relative z-10 max-w-md px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-clay flex items-center justify-center shadow-lg neon-glow">
              <span className="text-primary-foreground font-display text-sm font-bold">FF</span>
            </div>
            <span className="font-display text-foreground text-lg">FacelessForge</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight mb-4">
            Create. Comply.<br />Dominate.
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            AI-powered faceless video creation with built-in YouTube monetization compliance.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Gemini AI", "Kling Video", "Sarvam TTS", "Pexels Stock"].map((t) => (
              <span key={t} className="text-[10px] font-label px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-12 space-y-3">
            {[
              "Generate videos in under 5 minutes",
              "Built-in compliance scoring",
              "6 premium AI voices",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auth form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-clay flex items-center justify-center neon-glow">
              <span className="text-primary-foreground font-display text-xs font-bold">FF</span>
            </div>
            <span className="font-display text-foreground text-sm">FacelessForge</span>
          </div>

          <div className="mb-8">
            {mode === "forgot" && (
              <button onClick={() => setMode("login")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to login
              </button>
            )}
            <h2 className="text-xl font-display font-bold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-[10px] font-label text-muted-foreground block mb-1.5">DISPLAY NAME</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="Your name"
                  required
                  maxLength={50}
                />
              </div>
            )}
            <div>
              <label className="text-[10px] font-label text-muted-foreground block mb-1.5">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="you@example.com"
                required
                maxLength={255}
              />
            </div>
            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-label text-muted-foreground">PASSWORD</label>
                  {mode === "login" && (
                    <button type="button" onClick={() => setMode("forgot")} className="text-[10px] text-primary hover:text-primary/80 transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all pr-10"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {mode === "forgot" ? "Send Reset Link" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            {mode === "forgot" ? null : (
              <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            )}
          </div>

          {/* Terms */}
          <p className="mt-8 text-[10px] text-muted-foreground/50 text-center leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

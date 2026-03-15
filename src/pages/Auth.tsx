import { useState } from "react";
import usePageTitle from "@/hooks/usePageTitle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, ArrowRight, Eye, EyeOff, ArrowLeft, Mail, RefreshCw } from "lucide-react";

type AuthMode = "login" | "signup" | "forgot" | "check-email";

const Auth = () => {
  usePageTitle("Sign In");
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const rawPassword = password;

    // Client-side validation before hitting Supabase
    if (mode !== "forgot" && !trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    setLoginFailed(false);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Check your email for a password reset link.");
        setMode("login");
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password: rawPassword });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        if (displayName.trim().length < 2) {
          toast.error("Display name must be at least 2 characters.");
          return;
        }
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: rawPassword,
          options: { data: { full_name: displayName.trim() }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        // If session is null, email confirmation is required
        if (!signUpData.session) {
          setMode("check-email");
        } else {
          toast.success("Account created! You're signed in.");
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      const msg: string = err.message || "";
      if (msg.toLowerCase().includes("invalid login credentials") || msg.toLowerCase().includes("invalid credentials")) {
        setLoginFailed(true);
        toast.error("Incorrect email or password.");
      } else if (msg.toLowerCase().includes("email not confirmed")) {
        setLoginFailed(true);
        toast.error("Email not confirmed — check your inbox or resend below.");
      } else if (msg.toLowerCase().includes("user already registered")) {
        toast.error("An account with this email already exists. Try signing in instead.");
        setMode("login");
      } else if (msg.toLowerCase().includes("invalid input") || msg.toLowerCase().includes("invalid_request")) {
        toast.error("Please check your email and password and try again.");
      } else {
        toast.error(msg || "Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) { toast.error("Enter your email above first."); return; }
    setResendLoading(true);
    const { error } = await supabase.auth.resend({ type: "signup", email: trimmedEmail });
    setResendLoading(false);
    if (error) { toast.error(error.message); } else { toast.success("Confirmation email resent — check your inbox."); }
  };

  const title = mode === "forgot" ? "Reset password" : mode === "login" ? "Welcome back" : mode === "check-email" ? "Check your email" : "Create your account";
  const subtitle = mode === "forgot"
    ? "Enter your email and we'll send a reset link"
    : mode === "login"
    ? "Sign in to continue creating"
    : mode === "check-email"
    ? `We sent a confirmation link to ${email.trim() || "your email"}. Click it to activate your account.`
    : "Start making faceless videos in minutes";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary/30 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.12) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.12) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/5 blur-[50px] pointer-events-none" style={{ animation: "orbFloat 8s ease-in-out infinite" }} />
        <div className="absolute top-3/4 left-2/3 w-48 h-48 rounded-full bg-primary/4 blur-[80px] pointer-events-none" style={{ animation: "orbFloat 12s ease-in-out infinite 2s" }} />
        <div className="absolute top-1/2 left-[8%] w-24 h-24 rounded-full bg-accent/5 blur-[40px] pointer-events-none" style={{ animation: "orbFloat 10s ease-in-out infinite 4s" }} />
        <div className="relative z-10 max-w-md px-12">
          <div className="mb-8">
            <img src="/vorax-logo.png" alt="VORAX" className="h-10 w-auto object-contain" loading="lazy" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight mb-4">
            Create. Comply.<br />Dominate.
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            AI-powered faceless video creation with built-in YouTube monetization compliance.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Gemini AI", "JSON2Video", "Sarvam TTS", "Pexels Stock"].map((t) => (
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
          {/* Social proof */}
          <div className="mt-8">
            <p className="text-xs text-muted-foreground mb-3">Join 3,200+ creators already using VORAX</p>
            <div className="flex items-center gap-1">
              {["AK", "PR", "SK", "DS"].map((init) => (
                <div key={init} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[9px] font-bold text-primary -ml-2 first:ml-0">
                  {init}
                </div>
              ))}
              <span className="text-xs text-muted-foreground ml-2">+3,196 more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <img src="/vorax-logo.png" alt="VORAX" className="h-12 w-auto object-contain mb-4" loading="lazy" />
            <h1 className="text-4xl font-black text-primary tracking-widest">VORAX</h1>
            <p className="text-muted-foreground text-sm mt-1 tracking-widest uppercase">AI Video Generation</p>
          </div>

          <div className="mb-8">
            {(mode === "forgot" || mode === "check-email") && (
              <button onClick={() => { setMode("login"); setLoginFailed(false); }} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to login
              </button>
            )}
            <h2 className="text-xl font-display font-bold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>

          {mode === "check-email" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mx-auto">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Didn't get it? Check your spam folder, or resend below.
              </p>
              <button
                onClick={handleResendConfirmation}
                disabled={resendLoading}
                className="w-full btn-ghost flex items-center justify-center gap-2 py-3 text-sm"
              >
                {resendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Resend confirmation email
              </button>
              <button
                onClick={() => { setMode("login"); setLoginFailed(false); }}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-sm"
              >
                <ArrowRight className="w-4 h-4" /> Back to Sign In
              </button>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-[10px] font-label text-muted-foreground block mb-1.5">DISPLAY NAME</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
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
                className="w-full px-4 py-3 rounded-xl text-sm text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
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
                    className="w-full px-4 py-3 rounded-xl text-sm text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 pr-10"
                    placeholder="••••••••"
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

            {/* Resend confirmation hint shown after a failed login */}
            {loginFailed && mode === "login" && (
              <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 space-y-2">
                <p className="text-[10px] text-muted-foreground font-medium">Trouble signing in?</p>
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resendLoading}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-medium bg-secondary text-foreground hover:bg-secondary/70 transition-all"
                >
                  {resendLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                  Resend confirmation email
                </button>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="w-full flex items-center justify-center gap-1 text-[10px] text-primary hover:underline"
                >
                  Reset your password instead →
                </button>
              </div>
            )}

            {/* Continue with Google (UI only) */}
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>
              <button disabled className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground opacity-50 cursor-not-allowed">
                <svg className="w-4 h-4" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Continue with Google
                <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground ml-auto">Coming soon</span>
              </button>
            </div>
          </form>
          )}

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
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

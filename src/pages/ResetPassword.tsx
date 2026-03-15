import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're in a recovery flow
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      // Not a valid recovery link — still allow the page to render
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="bg-noise" />
      <div className="w-full max-w-sm relative z-10">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <img src="/vorax-logo.png" alt="VORAX" className="h-8 w-auto object-contain" loading="lazy" />
          <span className="font-display text-foreground text-sm tracking-wide">VORAX</span>
        </div>

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">Password Updated</h2>
            <p className="text-xs text-muted-foreground">Redirecting to dashboard...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground">Set new password</h2>
              <p className="text-xs text-muted-foreground mt-1">Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-label text-muted-foreground block mb-1.5">NEW PASSWORD</label>
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
              <div>
                <label className="text-[10px] font-label text-muted-foreground block mb-1.5">CONFIRM PASSWORD</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-foreground bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {/* Password strength indicator */}
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => {
                  const strength = password.length >= 12 ? 4 : password.length >= 8 ? 3 : password.length >= 6 ? 2 : password.length > 0 ? 1 : 0;
                  const colors = ["bg-destructive", "bg-gold", "bg-gold", "bg-accent"];
                  return (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= strength ? colors[strength - 1] : "bg-secondary"
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Update Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";

const CONSENT_KEY = "ff_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[200] animate-slide-up"
    >
      <div className="surface-raised p-5 relative">
        <button
          onClick={handleDecline}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <Cookie className="w-4 h-4 text-gold" />
          </div>
          <div>
            <h3 className="text-xs font-display font-bold text-foreground mb-1">We use cookies</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              We use cookies to improve your experience and analyze usage. By clicking Accept, you consent to our use of cookies.
            </p>
            <div className="flex items-center gap-2">
              <button onClick={handleAccept} className="btn-primary text-[10px] px-4 py-2">
                Accept
              </button>
              <button onClick={handleDecline} className="btn-ghost text-[10px] px-4 py-2">
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

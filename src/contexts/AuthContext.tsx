import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// Stripe product/price mapping
export const SUBSCRIPTION_TIERS = {
  pro: {
    product_id: "prod_U6yBkwG9ZXJEeL",
    price_id: "price_1T8kFWIsj65LGZSUV48LD65g",
    name: "Pro",
    price: "₹999/mo",
    videosPerMonth: 20,
  },
  agency: {
    product_id: "prod_U6yCvdsoEtkd1u",
    price_id: "price_1T8kFwIsj65LGZSUKvy9MGoC",
    name: "Agency",
    price: "₹2,999/mo",
    videosPerMonth: Infinity,
  },
} as const;

export type SubscriptionTier = "free" | "pro" | "agency";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  subscription: {
    subscribed: boolean;
    tier: SubscriptionTier;
    subscriptionEnd: string | null;
    loading: boolean;
  };
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, session: null, loading: true, signOut: async () => {},
  subscription: { subscribed: false, tier: "free", subscriptionEnd: null, loading: true },
  checkSubscription: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState({
    subscribed: false,
    tier: "free" as SubscriptionTier,
    subscriptionEnd: null as string | null,
    loading: true,
  });

  const checkSubscription = useCallback(async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const email = sessionData?.session?.user?.email;
      if (!email) {
        setSubscription({ subscribed: false, tier: "free", subscriptionEnd: null, loading: false });
        return;
      }
      const res = await fetch("/api/check-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      let tier: SubscriptionTier = "free";
      if (data?.subscribed && data?.product_id) {
        if (data.product_id === SUBSCRIPTION_TIERS.agency.product_id) {
          tier = "agency";
        } else if (data.product_id === SUBSCRIPTION_TIERS.pro.product_id) {
          tier = "pro";
        }
      }

      setSubscription({
        subscribed: data?.subscribed || false,
        tier,
        subscriptionEnd: data?.subscription_end || null,
        loading: false,
      });
    } catch (e) {
      console.error("Subscription check failed:", e);
      setSubscription(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        // Defer to avoid Supabase client deadlock
        setTimeout(() => checkSubscription(), 0);
      } else {
        setSubscription({ subscribed: false, tier: "free", subscriptionEnd: null, loading: false });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        checkSubscription();
      } else {
        setSubscription(prev => ({ ...prev, loading: false }));
      }
    });

    return () => authSub.unsubscribe();
  }, [checkSubscription]);

  // Periodic refresh every 60s
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, subscription, checkSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};
import { Router } from "express";

const router = Router();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

router.post("/check-subscription", async (req, res) => {
  try {
    if (!STRIPE_SECRET_KEY) return res.json({ subscribed: false });
    const { email } = req.body;
    if (!email) return res.json({ subscribed: false });

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" as any });
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) return res.json({ subscribed: false });

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 });
    const hasActiveSub = subscriptions.data.length > 0;
    let productId = null;
    let subscriptionEnd = null;
    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date((subscription as any).current_period_end * 1000).toISOString();
      productId = subscription.items.data[0].price.product;
    }
    res.json({ subscribed: hasActiveSub, product_id: productId, subscription_end: subscriptionEnd });
  } catch (e: any) {
    console.error("check-subscription error:", e);
    res.json({ subscribed: false });
  }
});

router.post("/create-checkout", async (req, res) => {
  try {
    if (!STRIPE_SECRET_KEY) return res.status(500).json({ error: "STRIPE_SECRET_KEY not configured" });
    const { email, priceId, origin } = req.body;
    if (!email || !priceId) return res.status(400).json({ error: "Missing email or priceId" });

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" as any });
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customerId = customers.data.length > 0 ? customers.data[0].id : undefined;
    const safeOrigin = origin || (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5173");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${safeOrigin}/dashboard?checkout=success`,
      cancel_url: `${safeOrigin}/settings?checkout=cancelled`,
    });
    res.json({ url: session.url });
  } catch (e: any) {
    console.error("create-checkout error:", e);
    res.status(500).json({ error: e.message });
  }
});

router.post("/customer-portal", async (req, res) => {
  try {
    if (!STRIPE_SECRET_KEY) return res.status(500).json({ error: "STRIPE_SECRET_KEY not configured" });
    const { email, origin } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" as any });
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) return res.status(404).json({ error: "No Stripe customer found" });
    const safeOrigin = origin || (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5173");
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${safeOrigin}/settings`,
    });
    res.json({ url: portalSession.url });
  } catch (e: any) {
    console.error("customer-portal error:", e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
import { supabase } from "@/integrations/supabase/client";

// In dev mode (Vite dev server), call Express server via proxy (/api → localhost:3001)
// In production (Vercel), call Supabase Edge Functions
const isDev = import.meta.env.DEV;

async function apiFetch(endpoint: string, body: Record<string, unknown>) {
  if (isDev) {
    const response = await fetch(`/api${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || "Request failed");
    }
    return response.json();
  } else {
    // Production: Supabase Edge Functions
    const fnName = endpoint.slice(1); // "/generate-script" → "generate-script"
    const { data, error } = await supabase.functions.invoke(fnName, { body });
    if (error) throw new Error(error.message || "Function error");
    if (data?.error) throw new Error(data.error);
    return data;
  }
}

export async function generateScript(niche: string, topic: string) {
  return apiFetch("/generate-script", { niche, topic });
}

export async function marketResearch(niche: string, topic: string) {
  return apiFetch("/market-research", { niche, topic });
}

export async function generateVoice(text: string, speaker: string, speed?: number) {
  return apiFetch("/generate-voice", { text, speaker, ...(speed !== undefined && { speed }) });
}

export async function generateVideo(body: Record<string, unknown>) {
  return apiFetch("/generate-video", body);
}

export async function stockMedia(query: string, type: string, per_page?: number, orientation?: string) {
  return apiFetch("/stock-media", { query, type, per_page, orientation });
}

export async function generateCaptions(script: string, topic: string, niche: string, platforms?: string[]) {
  return apiFetch("/generate-captions", { script, topic, niche, platforms });
}

export async function complianceCheck(script: string, topic: string, niche: string) {
  return apiFetch("/compliance-check", { script, topic, niche });
}

// New model-based compliance scoring using DistilBERT
export async function scoreCompliance(text: string, context: string = "") {
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const response = await fetch(`${API_URL}/api/compliance/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, context }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return response.json();
}

// Get model info
export async function getComplianceModelInfo() {
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const response = await fetch(`${API_URL}/api/compliance/model-info`);
  if (!response.ok) {
    throw new Error("Failed to get model info");
  }
  return response.json();
}

export async function complianceFix(script: string, warnings: string[], recommendations: string[]) {
  return apiFetch("/compliance-fix", { script, warnings, recommendations });
}

export async function copyrightScan(script: string, topic: string, niche: string) {
  return apiFetch("/copyright-scan", { script, topic, niche });
}

export async function autoEdit(script: string, duration: number, captions?: unknown) {
  return apiFetch("/auto-edit", { script, duration, captions });
}

export async function checkSubscription(email: string) {
  return apiFetch("/check-subscription", { email });
}

export async function createCheckout(email: string, priceId: string, origin?: string) {
  return apiFetch("/create-checkout", { email, priceId, origin });
}

export async function customerPortal(email: string, origin?: string) {
  return apiFetch("/customer-portal", { email, origin });
}

import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";

const ApiReference = () => {
  usePageTitle("API Reference");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Back to home</Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold mt-6 mb-3">API Reference</h1>
        <p className="text-sm text-muted-foreground mb-10">Programmatic access for projects, assets, generation jobs, and analytics.</p>

        <section className="space-y-8 text-sm leading-7 text-muted-foreground">
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">Authentication</h2>
            <p>Use bearer tokens generated from your account settings and include them in request headers.</p>
          </div>
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">Core Endpoints</h2>
            <p>Projects, scripts, voice generation, media assembly, compliance checks, and export jobs are available as REST endpoints.</p>
          </div>
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">Rate Limits</h2>
            <p>Requests are rate limited per account and per workspace to protect reliability and fair use.</p>
          </div>
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">Support</h2>
            <p>For enterprise API onboarding and integration help, contact support at support@vorax.com.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ApiReference;

import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";

const Changelog = () => {
  usePageTitle("Changelog");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Back to home</Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold mt-6 mb-3">Changelog</h1>
        <p className="text-sm text-muted-foreground mb-10">Product and platform updates.</p>

        <section className="space-y-10 text-sm leading-7 text-muted-foreground">
          <div>
            <p className="text-xs text-primary font-semibold mb-1">March 2026</p>
            <h2 className="text-lg font-display text-foreground mb-2">Brand and legal release</h2>
            <p>Updated logo and icon system, refreshed luxury visual style, and launched full Terms of Service and Privacy Policy pages.</p>
          </div>
          <div>
            <p className="text-xs text-primary font-semibold mb-1">February 2026</p>
            <h2 className="text-lg font-display text-foreground mb-2">Workflow reliability improvements</h2>
            <p>Improved project timeline handling and stabilized processing flows for larger media workloads.</p>
          </div>
          <div>
            <p className="text-xs text-primary font-semibold mb-1">January 2026</p>
            <h2 className="text-lg font-display text-foreground mb-2">Analytics enhancements</h2>
            <p>Added richer retention views and updated performance dashboards to support better creative decisions.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Changelog;

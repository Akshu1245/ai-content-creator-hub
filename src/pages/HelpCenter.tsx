import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";

const HelpCenter = () => {
  usePageTitle("Help Center");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Back to home</Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold mt-6 mb-3">Help Center</h1>
        <p className="text-sm text-muted-foreground mb-10">Answers to common questions and practical help for creators and teams.</p>

        <section className="space-y-8 text-sm leading-7 text-muted-foreground">
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">Account and Billing</h2>
            <p>Manage plan changes, invoices, payment methods, and cancellation directly from account settings.</p>
          </div>
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">Project Issues</h2>
            <p>If a project stalls, refresh the timeline, retry failed steps, and verify media or voice provider availability.</p>
          </div>
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">Compliance Questions</h2>
            <p>Review every output before publishing and use compliance guidance as input to your editorial decision process.</p>
          </div>
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">Contact Support</h2>
            <p>For account specific support requests, contact support@vorax.com with your workspace and project identifier.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HelpCenter;

import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";

const Documentation = () => {
  usePageTitle("Documentation");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Back to home</Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold mt-6 mb-3">Documentation</h1>
        <p className="text-sm text-muted-foreground mb-10">Everything you need to use VORAX efficiently and safely.</p>

        <section className="space-y-8 text-sm leading-7 text-muted-foreground">
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">Getting Started</h2>
            <p>Create an account, start a project, choose your workflow, and export your first video from the editor.</p>
          </div>
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">Core Workflow</h2>
            <p>Discover trends, generate scripts, create voice, assemble visuals, run compliance checks, and publish to channels.</p>
          </div>
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">Compliance Guidance</h2>
            <p>Use the compliance score as guidance and review outputs before publishing to meet your platform and legal requirements.</p>
          </div>
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">Troubleshooting</h2>
            <p>If a workflow fails, retry from the project timeline, verify source assets, and review service status in your dashboard.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Documentation;

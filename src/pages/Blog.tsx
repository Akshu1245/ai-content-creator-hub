import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";

const Blog = () => {
  usePageTitle("Blog");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Back to home</Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold mt-6 mb-3">Blog</h1>
        <p className="text-sm text-muted-foreground mb-10">Product updates, creator playbooks, and practical guidance for video growth.</p>

        <section className="space-y-8 text-sm leading-7 text-muted-foreground">
          <article>
            <h2 className="text-lg font-display text-foreground mb-2">How to Build a Repeatable Faceless Video Pipeline</h2>
            <p>Learn how top channels structure ideation, script quality checks, voice consistency, and multi channel distribution.</p>
          </article>
          <article>
            <h2 className="text-lg font-display text-foreground mb-2">Compliance Signals That Matter Before You Publish</h2>
            <p>A practical checklist for reducing policy risk and improving long term monetization stability.</p>
          </article>
          <article>
            <h2 className="text-lg font-display text-foreground mb-2">Scaling from One Creator to a Team Workflow</h2>
            <p>Operational advice for shared templates, review checkpoints, and high quality output at volume.</p>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Blog;

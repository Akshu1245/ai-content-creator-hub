import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";

const PrivacyPolicy = () => {
  usePageTitle("Privacy Policy");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Back to home
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Effective date March 12 2026</p>

        <section className="space-y-8 text-sm leading-7 text-muted-foreground">
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">1. Scope</h2>
            <p>
              This Privacy Policy explains how VORAX collects, uses, discloses, and protects personal information.
              It applies to website visitors, account holders, and users of our platform services.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">2. Information We Collect</h2>
            <p>We may collect the following categories of information.</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Identity and account details such as name, email, and profile information.</li>
              <li>Usage data such as feature interactions, session events, and device information.</li>
              <li>Content data that you upload, generate, or edit in the platform.</li>
              <li>Transaction data related to subscriptions and billing events.</li>
              <li>Support data when you contact our support or legal teams.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">3. How We Use Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, maintain, and improve platform services.</li>
              <li>Authenticate users and secure accounts.</li>
              <li>Process payments and manage subscriptions.</li>
              <li>Deliver customer support and service notifications.</li>
              <li>Detect abuse, fraud, and security incidents.</li>
              <li>Comply with legal obligations and enforce policies.</li>
            </ul>
          </div>

          <div>
            <h2 id="cookies" className="text-lg font-display text-foreground mb-2">4. Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar technologies for authentication, session continuity, security, analytics, and performance.
              You can control cookies through browser settings, but disabling some cookies may impact service functionality.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">5. Legal Bases for Processing</h2>
            <p>
              Depending on location, we rely on one or more legal bases such as contract performance, legitimate interests, consent, and legal obligations.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">6. Data Sharing</h2>
            <p>We may share information with the following categories of recipients.</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Service providers that support hosting, storage, payments, analytics, and communications.</li>
              <li>Integration partners that process user requested workflows.</li>
              <li>Regulators, courts, or authorities when required by law.</li>
              <li>Successors in the event of a merger, acquisition, or asset transfer.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">7. Data Retention</h2>
            <p>
              We retain personal information for as long as needed to provide services, meet legal obligations, resolve disputes, and enforce agreements.
              Retention periods vary based on data type and legal requirements.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">8. Security</h2>
            <p>
              We implement technical and organizational safeguards designed to protect personal information.
              No method of transmission or storage is fully secure, so we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 id="gdpr" className="text-lg font-display text-foreground mb-2">9. Privacy Rights and GDPR</h2>
            <p>
              Depending on location, you may have rights to access, correct, delete, restrict, object, or request portability of your personal information.
              You may also withdraw consent where processing is based on consent.
              To exercise rights, contact privacy@vorax.com.
              We may verify identity before processing requests.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">10. International Data Transfers</h2>
            <p>
              Your information may be processed in countries outside your place of residence.
              Where required, we apply appropriate safeguards for cross border transfers.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">11. Children</h2>
            <p>
              Our services are not directed to children.
              We do not knowingly collect personal information from children in violation of applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">12. Policy Updates</h2>
            <p>
              We may update this policy from time to time.
              Material updates will be posted in the service or communicated by email.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">13. Contact</h2>
            <p>
              For privacy questions or requests, contact privacy@vorax.com.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;

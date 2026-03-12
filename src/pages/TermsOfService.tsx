import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";

const TermsOfService = () => {
  usePageTitle("Terms of Service");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Back to home
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Effective date March 12 2026</p>

        <section className="space-y-8 text-sm leading-7 text-muted-foreground">
          <div>
            <h2 className="text-lg font-display text-foreground mb-2">1. Agreement and Acceptance</h2>
            <p>
              These Terms of Service govern your access to and use of the VORAX platform and related services.
              By creating an account or using the service, you confirm that you have read, understood, and accepted these terms.
              If you do not agree, do not use the service.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">2. Eligibility</h2>
            <p>
              You must have legal capacity to enter into a binding agreement.
              If you use the service for a business, you represent that you have authority to bind that business.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">3. Account Responsibilities</h2>
            <p>
              You are responsible for account credentials, account activity, and all actions taken under your account.
              You agree to provide accurate information and keep it current.
              You must notify us promptly of unauthorized access.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">4. Service Scope</h2>
            <p>
              VORAX provides tools for content planning, generation, editing, and compliance support.
              Compliance indicators are informational guidance and do not guarantee eligibility for monetization, platform approval, or legal compliance.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">5. User Content and Rights</h2>
            <p>
              You retain ownership of content you upload or create.
              You grant VORAX a limited license to host, process, transmit, and display your content only as needed to provide and improve the service.
              You represent that you have all rights necessary for submitted content and that your content does not violate law or third party rights.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">6. Acceptable Use</h2>
            <p>
              You agree not to use the service for unlawful activity, fraud, abuse, harassment, infringement, security violations, or attempts to disrupt service operations.
              We may suspend or terminate accounts that violate these terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">7. Subscription, Billing, and Refunds</h2>
            <p>
              Paid features may require subscription.
              Fees, billing cycles, and plan limits are disclosed at purchase.
              Unless required by law, payments are non refundable once a billing cycle begins.
              You may cancel future renewals at any time from account settings.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">8. Intellectual Property</h2>
            <p>
              The service, software, design, trademarks, and related materials are owned by VORAX or licensors.
              No ownership transfers to users except rights expressly granted in these terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">9. Third Party Services</h2>
            <p>
              The platform may integrate with external providers for media, voice, analytics, or infrastructure.
              Your use of third party services is also subject to their terms and policies.
              VORAX is not responsible for third party service availability or actions.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">10. Warranty Disclaimer</h2>
            <p>
              The service is provided as is and as available.
              To the maximum extent permitted by law, VORAX disclaims warranties including merchantability, fitness for a particular purpose, and non infringement.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, VORAX and its affiliates are not liable for indirect, incidental, special, consequential, or punitive damages, or loss of profits, data, goodwill, or business opportunities.
              Aggregate liability for claims related to the service is limited to amounts paid by you to VORAX in the twelve months before the event giving rise to the claim.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">12. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless VORAX and its affiliates from claims, liabilities, damages, and costs arising from your content, your use of the service, or your violation of these terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">13. Termination</h2>
            <p>
              You may stop using the service at any time.
              We may suspend or terminate access for violations, security concerns, legal requirements, or operational reasons.
              Sections that by nature should survive termination will remain in effect.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">14. Updates to These Terms</h2>
            <p>
              We may update these terms to reflect legal, technical, or business changes.
              Material updates will be communicated through the platform or by email.
              Continued use after updates means acceptance of the revised terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-display text-foreground mb-2">15. Contact</h2>
            <p>
              For questions about these terms, contact legal@vorax.com.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TermsOfService;

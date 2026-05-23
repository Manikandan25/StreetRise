import React from 'react';
import { Scale, Mail } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="flex flex-col gap-16 pb-24 animate-fade-in bg-background text-foreground">
      
      <section className="pt-24 pb-12 sm:pt-32 border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-6">
          <Scale className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-display">
            Terms & Conditions
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Effective Date: May 23, 2026<br/>
            Please read these terms carefully before using the StreetRise platform.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 w-full prose prose-invert max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary">
        <div className="space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display border-b border-border pb-2">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the StreetRise platform (the &quot;Website&quot;), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display border-b border-border pb-2">2. Donation Terms & Escrow Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              StreetRise operates a 100% direct-disbursement model. When you donate:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Funds are held in a ring-fenced escrow account and are strictly allocated toward vendor compliance milestones (e.g., FSSAI licenses, structural assets).</li>
              <li>Donations are non-refundable once the target milestone has been initiated or executed by our ground team.</li>
              <li>We do not guarantee the long-term commercial success of the vendors. We only guarantee the verifiable execution of compliance and capital upgrades.</li>
              <li><strong>No 80G Tax Exemption:</strong> During our current pilot phase, we are unable to issue Section 80G tax exemption certificates. Donations are considered direct, non-tax-deductible community gifts.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display border-b border-border pb-2">3. Transparency & Reporting Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              While we commit to radical transparency, delays in uploading receipts to the public ledger may occur due to municipal processing times, field logistics, or technical downtime. We operate with a 48-hour SLA for digital documentation updates after a transaction clears.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display border-b border-border pb-2">4. Volunteer Conduct</h2>
            <p className="text-muted-foreground leading-relaxed">
              Individuals utilizing the platform to apply for volunteer positions agree to act as ethical representatives of the initiative. Any attempt to solicit cash directly from candidates, misrepresent the initiative, or violate candidate privacy will result in immediate termination of the volunteer relationship and potential legal action.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display border-b border-border pb-2">5. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on this website, including but not limited to the transparency dashboard UI, organizational structure, logos, text, and graphics, is the property of the StreetRise Initiative. Unauthorized use, replication, or distribution of this material is prohibited.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display border-b border-border pb-2">6. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              The StreetRise Initiative, its founders, and its volunteers shall not be held liable for any indirect, incidental, or consequential damages arising from the use of the platform. We act solely as a transparent conduit between community capital and marginalized street vendors.
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mt-12 flex items-start gap-4">
            <Mail className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h3 className="font-bold text-foreground mb-1">Contact Us</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you have any questions or concerns regarding these Terms & Conditions, please reach out to us at <a href="mailto:manikandankolangi4@gmail.com" className="text-primary hover:underline font-medium">manikandankolangi4@gmail.com</a>.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

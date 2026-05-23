import React from 'react';
import { ShieldCheck, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col gap-16 pb-24 animate-fade-in bg-background text-foreground">
      
      <section className="pt-24 pb-12 sm:pt-32 border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-6">
          <ShieldCheck className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-display">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Effective Date: May 23, 2026<br/>
            Your privacy is as important to us as our public transparency.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 w-full prose prose-invert max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary">
        <div className="space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display border-b border-border pb-2">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you use the StreetRise platform to make a donation or apply as a volunteer, we may collect the following information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Personal Identification Information:</strong> Name, email address, and phone number.</li>
              <li><strong>Donation Information:</strong> Amount donated, payment method, and transaction IDs. We use secure third-party payment gateways (e.g., Razorpay) and <strong>do not store your credit card or UPI PIN data on our servers.</strong></li>
              <li><strong>Usage Data:</strong> Anonymous analytics including IP addresses, browser types, and interaction metrics to help us improve the platform.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display border-b border-border pb-2">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the collected data strictly for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Processing and publicly verifying your donation on our Transparency Dashboard.</li>
              <li>Sending automated receipts and monthly impact reports.</li>
              <li>Coordinating with volunteers for ground operations in Bengaluru and Mumbai.</li>
              <li>Complying with Indian financial and legal regulations.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display border-b border-border pb-2">3. Public Ledger & Anonymity</h2>
            <p className="text-muted-foreground leading-relaxed">
              StreetRise is built on absolute transparency. While donation amounts and utilization metrics are published to our public ledger, <strong>your personal identity (Name/Email) is kept strictly confidential</strong> and is not displayed publicly unless you explicitly opt-in to be recognized as a sponsor.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display border-b border-border pb-2">4. Third-Party Services & Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We employ cookies to ensure secure sessions and smooth navigation. We also partner with third-party services for specific operational needs:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Payment Processors:</strong> Razorpay or standard UPI gateways to handle secure financial transactions.</li>
              <li><strong>Analytics:</strong> Standard web analytics to understand user traffic.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              We will never sell, rent, or lease your data to third-party marketing agencies.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display border-b border-border pb-2">5. User Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to request a copy of the data we hold about you, request corrections to any inaccuracies, or request the deletion of your personal data from our mailing lists. However, financial transaction data must be retained as required by Indian financial auditing laws.
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mt-12 flex items-start gap-4">
            <Mail className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h3 className="font-bold text-foreground mb-1">Contacting Us Regarding Privacy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:manikandankolangi4@gmail.com" className="text-primary hover:underline font-medium">manikandankolangi4@gmail.com</a>.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

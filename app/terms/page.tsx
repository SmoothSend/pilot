import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="page-bg min-h-screen overflow-hidden">
      {/* Ambient blobs */}
      <div className="blob-primary" style={{ opacity: 0.5 }} />
      <div className="blob-secondary" style={{ opacity: 0.3 }} />

      <div className="relative z-10">
        {/* Nav */}
        <nav className="container-main flex items-center justify-between py-5 mt-8">
          <Link href="/" className="flex items-center gap-2.5">
            <img 
              src="/logo.svg" 
              alt="SmoothSend" 
              className="w-7 h-7"
            />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              SmoothSend
            </span>
          </Link>

          <Link href="/" className="btn-ghost text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </nav>

        {/* Content */}
        <div className="container-main py-16 max-w-3xl">
          <div className="card-elevated p-10 rounded-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
              Terms & Conditions
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Last updated: March 23, 2026
            </p>

            <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  1. Pilot Program Overview
                </h2>
                <p>
                  The SmoothSend Pilot Program ("Program") provides selected projects with gas sponsorship 
                  services for Aptos blockchain transactions. By applying to and participating in the Program, 
                  you agree to these Terms & Conditions.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  2. Program Benefits & Limits
                </h2>
                <p className="mb-3">
                  Selected participants receive gas sponsorship for user transactions subject to the following limits:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Duration: 30 calendar days from activation date, OR</li>
                  <li>Gas spend cap: $10 USD equivalent in APT gas fees</li>
                  <li>Whichever limit is reached first will conclude your pilot period</li>
                  <li>SmoothSend reserves the right to modify or terminate the Program at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  3. Data Collection & Usage
                </h2>
                <p className="mb-3">
                  By participating in the Program, you agree to share the following data with SmoothSend:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Transaction volume data (before and after pilot implementation)</li>
                  <li>User retention and conversion metrics</li>
                  <li>Technical integration details</li>
                  <li>Project contact information</li>
                </ul>
                <p className="mt-3">
                  This data will be used solely to measure pilot effectiveness and improve our services. 
                  We will not share your data with third parties without your explicit consent.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  4. Eligibility & Selection
                </h2>
                <p>
                  SmoothSend reserves the right to accept or reject any application at our sole discretion. 
                  Selection criteria include but are not limited to: project maturity, transaction volume, 
                  technical readiness, and alignment with Program goals.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  5. Acceptable Use
                </h2>
                <p className="mb-3">
                  Participants agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the service only for legitimate dApp transactions</li>
                  <li>Not attempt to abuse, exploit, or circumvent usage limits</li>
                  <li>Not use the service for illegal activities or malicious purposes</li>
                  <li>Comply with all applicable laws and Aptos network policies</li>
                </ul>
                <p className="mt-3">
                  Violation of these terms may result in immediate termination from the Program.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  6. Service Availability
                </h2>
                <p>
                  SmoothSend provides the Program on an "as-is" basis. We do not guarantee uninterrupted 
                  service and are not liable for any downtime, transaction failures, or losses incurred 
                  during the pilot period.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  7. Intellectual Property
                </h2>
                <p>
                  All SmoothSend technology, documentation, and branding remain the property of SmoothSend. 
                  Participants receive a limited, non-exclusive license to use our SDK and services during 
                  the pilot period.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  8. Limitation of Liability
                </h2>
                <p>
                  SmoothSend shall not be liable for any indirect, incidental, special, or consequential 
                  damages arising from your participation in the Program. Our total liability shall not 
                  exceed the value of gas fees sponsored during your pilot period.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  9. Termination
                </h2>
                <p>
                  Either party may terminate participation in the Program at any time. SmoothSend reserves 
                  the right to terminate access immediately for violations of these terms or suspicious activity.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  10. Changes to Terms
                </h2>
                <p>
                  We may update these Terms & Conditions at any time. Continued participation in the Program 
                  after changes constitutes acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  11. Contact
                </h2>
                <p>
                  For questions about these terms, contact us at:{" "}
                  <a 
                    href="mailto:contact@smoothsend.xyz" 
                    className="text-primary hover:underline"
                  >
                    contact@smoothsend.xyz
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="border-t py-8"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="label-mono text-foreground-hint">
              © 2025 SmoothSend
            </p>
            <div className="flex items-center gap-5">
              {[
                { label: "Docs", href: "https://docs.smoothsend.xyz" },
                { label: "Twitter/X", href: "https://x.com/SmoothSend" },
                { label: "Status", href: "https://status.smoothsend.xyz" },
                { label: "Terms", href: "/terms" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="label-mono transition-colors duration-150 hover:text-white text-foreground-dim"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

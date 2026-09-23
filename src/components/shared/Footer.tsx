import React, { useState } from "react";
import {
  ShieldCheck,
  FileText,
  RotateCcw,
  Gauge,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";

/* 
  Inline SVG Icons for custom brand channels and developer badges.
  These ensure seamless rendering without external asset dependencies.
*/
const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.326V1.326C24 .597 23.405 0 22.675 0z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

type PolicyKey = "terms" | "privacy" | "refunds" | "handover";

interface LegalDoc {
  title: string;
  badge: string;
  body: React.ReactNode;
}

const LEGAL_DOCS: Record<PolicyKey, LegalDoc> = {
  terms: {
    title: "Rental Terms & Conditions",
    badge: "Motor Vehicles Act, 1988",
    body: (
      <div className="space-y-4 text-neutral-300 text-xs sm:text-sm leading-relaxed">
        <p>
          By booking with <span className="text-yellow-400 font-semibold">NH37 Car Rental</span>, you agree to these legal conditions governing self-drive operations in Assam and Northeast India:
        </p>
        <div className="space-y-3">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <span className="font-semibold text-white block mb-1">1. Driver Eligibility</span>
            <p className="text-neutral-400 text-xs">
              The primary driver must be 21+ years old, holding an original, valid Light Motor Vehicle (LMV) Driving License for at least 1 year. Verification via DigiLocker / mParivahan is mandatory before keys handover.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <span className="font-semibold text-white block mb-1">2. Security Deposit & Deductions</span>
            <p className="text-neutral-400 text-xs">
              A refundable security hold is blocked prior to trip dispatch. NH37 Car Rental reserves the right to deduct amounts for municipal e-challans, unpaid FASTag toll balances, fuel deficit, or interior soiling. Net balance is credited within 5–7 banking days.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <span className="font-semibold text-white block mb-1">3. Prohibited Usage</span>
            <p className="text-neutral-400 text-xs">
              Commercial hire, ferry services, speed testing, and off-road driving on dry riverbeds are strictly forbidden. Drunk driving carries zero tolerance and voids all insurance coverage.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    badge: "DPDP Act, 2023 Compliant",
    body: (
      <div className="space-y-4 text-neutral-300 text-xs sm:text-sm leading-relaxed">
        <p>
          NH37 Car Rental processes personal data in strict compliance with the Digital Personal Data Protection (DPDP) Act of India.
        </p>
        <div className="space-y-3">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <span className="font-semibold text-white block mb-1">Data Collected</span>
            <p className="text-neutral-400 text-xs">
              We collect identity proofs (Driving License, Masked Aadhaar) and vehicle telemetry (continuous GPS location, speed, odometer) for legal authentication and fleet protection.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <span className="font-semibold text-white block mb-1">Data Storage & Protection</span>
            <p className="text-neutral-400 text-xs">
              All documents are stored on Indian cloud servers encrypted via TLS 1.3 and AES-256. Telemetry logs are retained up to 180 days to settle delayed state highway challans, after which personal linkages are purged.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  refunds: {
    title: "Cancellation & Refund Policy",
    badge: "Direct Fleet Terms",
    body: (
      <div className="space-y-4 text-neutral-300 text-xs sm:text-sm leading-relaxed">
        <p>Fair and automated booking cancellations:</p>
        <div className="overflow-hidden rounded-xl border border-neutral-800 text-xs">
          <table className="w-full text-left">
            <thead className="bg-neutral-900 text-yellow-400">
              <tr>
                <th className="p-2.5">Timeline</th>
                <th className="p-2.5">Refund Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              <tr>
                <td className="p-2.5">&gt; 48 hours before start</td>
                <td className="p-2.5 font-bold text-emerald-400">100% Refund</td>
              </tr>
              <tr>
                <td className="p-2.5">24 to 48 hours before start</td>
                <td className="p-2.5 font-bold text-yellow-400">80% Refund (20% fee)</td>
              </tr>
              <tr>
                <td className="p-2.5">&lt; 24 hours or No-Show</td>
                <td className="p-2.5 font-bold text-rose-400">0% Refund</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-neutral-400">
          Refunds are automatically issued back to your original payment method (UPI / Cards) within 4 to 6 working days.
        </p>
      </div>
    ),
  },
  handover: {
    title: "Handover & FASTag Guidelines",
    badge: "Operational Policy",
    body: (
      <div className="space-y-4 text-neutral-300 text-xs sm:text-sm leading-relaxed">
        <p>
          Seamless pickup and drop-off guidelines across all NH37 hubs in Dibrugarh, Tinsukia, and Guwahati.
        </p>
        <div className="space-y-3">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <span className="font-semibold text-white block mb-1">Check-in Photo Inspection</span>
            <p className="text-neutral-400 text-xs">
              A 360-degree photo walkaround must be completed on your phone before driving off to document any pre-existing scratches or fuel levels.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <span className="font-semibold text-white block mb-1">FASTag Automated Tolls</span>
            <p className="text-neutral-400 text-xs">
              All vehicles are enabled with active FASTag stickers. Toll charges incurred during your journey will be computed directly against your rental statement upon return.
            </p>
          </div>
        </div>
      </div>
    ),
  },
};

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<PolicyKey | null>(null);

  return (
    <>
      <footer className="relative w-full border-t overflow-hidden border-neutral-800/80 bg-neutral-950 text-neutral-300">
        {/* Subtle Ambient Yellow Accents */}
        <div className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-96 -translate-x-1/2 rounded-full bg-yellow-400/5 blur-[120px]" />
        
        {/* Main Footer Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* COLUMN 1: Brand & Operational Badge */}
            <div className="flex flex-col space-y-3.5">
              <div className="flex items-center gap-2.5">
                
                <span className="text-lg font-extrabold tracking-tight text-white">
                  NH37 <span className="text-yellow-400">CAR RENTALS</span>
                </span>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Northeast India's premier self-drive fleet. Explore Assam and beyond with sanitized cars, 24/7 highway support, and transparent pricing.
              </p>

              <div className="pt-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-[11px] font-semibold text-yellow-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  Fleet Active &bull; Assam Corridors
                </span>
              </div>
            </div>

            {/* COLUMN 2: Legal & Governance */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-yellow-400" />
                Legal & Policies
              </h3>
              <p className="text-[11px] text-neutral-500">
                Governed under Motor Vehicles Act & DPDP Act
              </p>

              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("terms")}
                    className="group inline-flex items-center gap-1.5 text-neutral-400 transition-colors hover:text-yellow-400"
                  >
                    <FileText className="w-3.5 h-3.5 text-neutral-500 group-hover:text-yellow-400" />
                    <span>Terms & Conditions</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("privacy")}
                    className="group inline-flex items-center gap-1.5 text-neutral-400 transition-colors hover:text-yellow-400"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-500 group-hover:text-yellow-400" />
                    <span>Privacy Policy (DPDP)</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("refunds")}
                    className="group inline-flex items-center gap-1.5 text-neutral-400 transition-colors hover:text-yellow-400"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-500 group-hover:text-yellow-400" />
                    <span>Cancellation & Refund</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("handover")}
                    className="group inline-flex items-center gap-1.5 text-neutral-400 transition-colors hover:text-yellow-400"
                  >
                    <Gauge className="w-3.5 h-3.5 text-neutral-500 group-hover:text-yellow-400" />
                    <span>Handover & FASTag Rules</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: Social Follow */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Follow Us
              </h3>
              <p className="text-[11px] text-neutral-500">
                Road trip routes, travel guides, and offers
              </p>

              <div className="flex flex-col gap-2 pt-1">
                <a
                  href="https://www.facebook.com/share/1G2DCUkLbt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-lg border border-neutral-800/80 bg-neutral-900/50 px-3 py-2 text-xs text-neutral-300 transition-all hover:border-yellow-400 hover:text-white"
                >
                  <span className="text-yellow-400"><FacebookIcon /></span>
                  <span>Facebook</span>
                  <ExternalLink className="ml-auto w-3 h-3 text-neutral-500" />
                </a>

                <a
                  href="https://www.instagram.com/nh37carrental/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-lg border border-neutral-800/80 bg-neutral-900/50 px-3 py-2 text-xs text-neutral-300 transition-all hover:border-yellow-400 hover:text-white"
                >
                  <span className="text-yellow-400"><InstagramIcon /></span>
                  <span>Instagram</span>
                  <ExternalLink className="ml-auto w-3 h-3 text-neutral-500" />
                </a>
              </div>
            </div>

            {/* COLUMN 4: Developed By Angshuman Pathak */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Engineering</span>
              </div>
              <p className="text-xs text-neutral-300 font-medium">
                Developed by <span className="text-yellow-400">Angshuman Pathak</span>
              </p>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://www.linkedin.com/in/angshuman-pathak/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 transition hover:border-yellow-400 hover:text-yellow-400"
                  aria-label="LinkedIn"
                  title="LinkedIn Profile"
                >
                  <LinkedInIcon />
                </a>

                <a
                  href="https://github.com/AngshumanPathak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 transition hover:border-yellow-400 hover:text-yellow-400"
                  aria-label="GitHub"
                  title="GitHub Profile"
                >
                  <GithubIcon />
                </a>

                <a
                  href="https://portfolio-gj3nutg6t-angshumanpathaks-projects.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 transition hover:border-yellow-400 hover:text-yellow-400"
                  aria-label="Website Portfolio"
                  title="Personal Portfolio"
                >
                  <GlobeIcon />
                </a>
              </div>
            </div>

          </div>

          {/* BOTTOM BAR: Copyright & Disclaimer */}
          <div className="mt-10 flex flex-col items-center justify-between border-t border-neutral-900 pt-6 text-[11px] text-neutral-500 sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} <span className="text-neutral-300 font-medium">NH37 Car Rental</span>. All rights reserved.
            </p>
            <p className="mt-2 text-center sm:mt-0 sm:text-right">
              Self-Drive Rental compliant under Rent a Cab Scheme & DPDP Act, India.
            </p>
          </div>
        </div>
      </footer>

      {/* Quick Policy Modal Viewer */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-neutral-800/80 pb-3">
              <div>
                <span className="rounded border border-yellow-400/40 bg-yellow-400/10 px-2 py-0.5 text-[10px] font-semibold text-yellow-400">
                  {LEGAL_DOCS[activeModal].badge}
                </span>
                <h3 className="mt-1 text-lg font-bold text-white">
                  {LEGAL_DOCS[activeModal].title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg border border-neutral-800 p-1.5 text-neutral-400 transition hover:border-yellow-400 hover:text-yellow-400"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="mt-4 overflow-y-auto pr-1">
              {LEGAL_DOCS[activeModal].body}
            </div>

            {/* Footer */}
            <div className="mt-5 flex justify-end border-t border-neutral-800/80 pt-3">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg bg-yellow-400 px-4 py-1.5 text-xs font-bold text-black transition hover:bg-yellow-300"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
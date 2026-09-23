import { useState } from "react";

type LegalTab = "terms" | "privacy";

const LegalPolicy = () => {
  const [activeTab, setActiveTab] = useState<LegalTab>("terms");

  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-yellow-400 selection:text-black">
      {/* Background Decorative Accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[130px]" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-yellow-500/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-24 pt-28 sm:pt-36">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-yellow-400 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Compliance & Governance
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Legal & <span className="text-yellow-400">Policies</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-neutral-400 sm:text-base">
            Review the terms governing self-drive vehicle hire, liability, and
            our commitment to protecting your digital personal data.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-8 flex w-full max-w-md items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950/80 p-1.5 shadow-xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActiveTab("terms")}
            className={`flex-1 rounded-xl py-2.5 text-xs font-bold tracking-wide transition-all duration-200 sm:text-sm ${
              activeTab === "terms"
                ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Terms & Conditions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("privacy")}
            className={`flex-1 rounded-xl py-2.5 text-xs font-bold tracking-wide transition-all duration-200 sm:text-sm ${
              activeTab === "privacy"
                ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Privacy Policy
          </button>
        </div>

        {/* Content Card */}
        <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          {activeTab === "terms" ? (
            <div className="space-y-8 text-neutral-300">
              <div className="border-b border-neutral-800 pb-4">
                <span className="text-xs font-medium text-yellow-400 uppercase tracking-wider">
                  Motor Vehicles Act, 1988 Compliance
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  Rental Terms of Service
                </h2>
                <p className="text-xs text-neutral-500">
                  Last updated: October 2026 • Applicable to all direct-fleet bookings
                </p>
              </div>

              {/* Section 1 */}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  1. Eligibility & Driver Verification
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                  <li>
                    <strong className="text-white">Minimum Age:</strong> Renters
                    must be at least 21 years of age at the time of reservation.
                  </li>
                  <li>
                    <strong className="text-white">Driving License:</strong> A
                    valid original Light Motor Vehicle (LMV) license held for at
                    least one full year is required. Learner licenses are strictly
                    rejected.
                  </li>
                  <li>
                    <strong className="text-white">Identity Verification:</strong>{" "}
                    Aadhaar (via DigiLocker or masked offline KYC) or Passport
                    verification is mandatory prior to keys handover.
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  2. Security Deposit & Deductions
                </h3>
                <p className="mt-2 text-sm leading-relaxed">
                  A refundable security hold is blocked prior to vehicle
                  dispatch. The company reserves right of deduction for:
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3.5 text-xs">
                    <span className="font-semibold text-yellow-400">
                      Traffic Violations
                    </span>
                    <p className="mt-1 text-neutral-400">
                      Unsettled municipal e-challans, speeding tickets, or towing
                      charges during your trip window.
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3.5 text-xs">
                    <span className="font-semibold text-yellow-400">
                      FASTag & State Taxes
                    </span>
                    <p className="mt-1 text-neutral-400">
                      Tolls, border permits, or parking charges unpaid upon final
                      vehicle return.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  3. Prohibited Uses & Penalties
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                  <li>Commercial passenger transport, taxi work, or cargo transit.</li>
                  <li>Driving under the influence of narcotics or alcohol (0% tolerance).</li>
                  <li>Off-roading, river crossings, beach runs, or circuit racing.</li>
                  <li>Sub-leasing or permitting unverified secondary drivers.</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 text-xs text-neutral-300">
                <span className="font-bold text-yellow-400">
                  Accident Liability Notice:
                </span>{" "}
                In the event of insured accidental damage, the renter is liable
                for the non-claimable insurance deductible and depreciation.
                Negligent driving voids insurance protections completely.
              </div>
            </div>
          ) : (
            <div className="space-y-8 text-neutral-300">
              <div className="border-b border-neutral-800 pb-4">
                <span className="text-xs font-medium text-yellow-400 uppercase tracking-wider">
                  Digital Personal Data Protection (DPDP) Act
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  Data Privacy Policy
                </h2>
                <p className="text-xs text-neutral-500">
                  Transparency on how vehicle telemetry and identification data are handled
                </p>
              </div>

              {/* Section 1 */}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  1. Categories of Data Collected
                </h3>
                <div className="mt-3 space-y-3 text-sm">
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                    <span className="font-semibold text-white">
                      Identity & KYC Information
                    </span>
                    <p className="mt-1 text-xs text-neutral-400">
                      Name, residential address, contact number, driving license
                      credentials, and masked government identity records.
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                    <span className="font-semibold text-white">
                      Vehicle Telematics & Location
                    </span>
                    <p className="mt-1 text-xs text-neutral-400">
                      Continuous GPS coordinates, vehicle speed, collision impact
                      telemetry, and ignition metrics recorded during rental
                      duration.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  2. Purpose & Processing Grounds
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                  <li>Validating legal driver eligibility and preventing fleet theft.</li>
                  <li>Facilitating roadside recovery and immediate emergency response.</li>
                  <li>Reconciling toll deductions, state permits, and e-challans.</li>
                  <li>Complying with law enforcement orders under applicable Indian statutes.</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  3. Your Rights as a Data Principal
                </h3>
                <p className="mt-2 text-sm leading-relaxed">
                  Under the DPDP Act, you retain the right to review, update, and
                  seek erasure of personal identifiers once statutory retention
                  windows (up to 180 days for delayed municipal traffic challans)
                  have lapsed.
                </p>
              </div>

              {/* DPO Contact Box */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 text-xs text-neutral-400">
                <span className="font-semibold text-yellow-400">
                  Data Protection Officer (DPO) Contact:
                </span>
                <p className="mt-1">
                  For privacy grievances or data deletion requests, contact:{" "}
                  <span className="text-white">dpo@yourcarrental.in</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalPolicy;
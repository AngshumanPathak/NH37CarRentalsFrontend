
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { cn } from "../../lib/utils";

import {
  confirmAdminBooking,
  rejectAdminBooking,
  getAdminBookingById,
  type Booking,
} from "../../lib/apis/booking.api";

// ============================================================
// HELPERS
// ============================================================

const formatPrice = (
  value: string | number | null | undefined
) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return `₹${Number(value).toLocaleString("en-IN")}`;
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value: string | null | undefined) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDateTime = (
  value: string | null | undefined
) => {
  if (!value) return "—";

  return `${formatDate(value)} • ${formatTime(value)}`;
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Waiting for Approval";

    case "PAYMENT_PENDING":
      return "Payment Pending";

    case "CONFIRMED":
      return "Confirmed";

    case "CAR_ASSIGNED":
      return "Car Assigned";

    case "PICKUP_SCHEDULED":
      return "Pickup Scheduled";

    case "ON_THE_WAY":
      return "On the Way";

    case "ACTIVE":
      return "Rental Active";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    case "REJECTED":
      return "Rejected";

    default:
      return status;
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        badge:
          "border-yellow-300/20 bg-yellow-300/10 text-yellow-300",
        dot: "bg-yellow-300",
      };

    case "PAYMENT_PENDING":
      return {
        badge:
          "border-orange-400/20 bg-orange-400/10 text-orange-300",
        dot: "bg-orange-400",
      };

    case "CONFIRMED":
    case "CAR_ASSIGNED":
    case "PICKUP_SCHEDULED":
      return {
        badge:
          "border-green-400/20 bg-green-400/10 text-green-300",
        dot: "bg-green-400",
      };

    case "ON_THE_WAY":
    case "ACTIVE":
      return {
        badge:
          "border-blue-400/20 bg-blue-400/10 text-blue-300",
        dot: "bg-blue-400",
      };

    case "COMPLETED":
      return {
        badge:
          "border-white/10 bg-white/5 text-gray-400",
        dot: "bg-gray-500",
      };

    case "CANCELLED":
    case "REJECTED":
      return {
        badge:
          "border-red-400/20 bg-red-400/10 text-red-300",
        dot: "bg-red-400",
      };

    default:
      return {
        badge:
          "border-white/10 bg-white/5 text-gray-400",
        dot: "bg-gray-500",
      };
  }
};

const getDocumentLabel = (type: string) => {
  switch (type) {
    case "DRIVING_LICENSE":
      return "Driving License";

    case "AADHAAR":
      return "Aadhaar Card";

    case "VOTER_ID":
      return "Voter ID";

    default:
      return type;
  }
};

const getDocumentStatusStyles = (
  status: string
) => {
  switch (status) {
    case "VERIFIED":
      return "border-green-400/20 bg-green-400/10 text-green-300";

    case "REJECTED":
      return "border-red-400/20 bg-red-400/10 text-red-300";

    default:
      return "border-yellow-300/20 bg-yellow-300/10 text-yellow-300";
  }
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AdminBookingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [isConfirming, setIsConfirming] =
    useState(false);

  const [confirmError, setConfirmError] =
    useState("");
  const [isRejecting, setIsRejecting] =
  useState(false);

const [rejectError, setRejectError] =
  useState("");

  // ==========================================================
  // LOAD BOOKING
  // ==========================================================

  useEffect(() => {
    const loadBooking = async () => {
      if (!id) {
        setError("Booking ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data =
          await getAdminBookingById(id);

        console.log(
          "Admin booking details:",
          data
        );

        setBooking(data);
      } catch (error: any) {
        console.error(
          "Failed to load admin booking:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Unable to load this booking. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  // ==========================================================
  // CONFIRM BOOKING
  // ==========================================================

  const handleConfirmBooking = async () => {
    if (!booking) return;

    const confirmed = window.confirm(
      `Confirm booking ${booking.bookingNumber}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsConfirming(true);
      setConfirmError("");

      const updatedBooking =
        await confirmAdminBooking(
          booking.id
        );

      console.log(
        "Booking confirmed:",
        updatedBooking
      );

      setBooking(updatedBooking);
    } catch (error: any) {
      console.error(
        "Failed to confirm booking:",
        error
      );

      setConfirmError(
        error?.response?.data?.message ||
          "Unable to confirm this booking. Please try again."
      );
    } finally {
      setIsConfirming(false);
    }
  };


  const handleRejectBooking = async () => {
  if (!booking) return;

  const reason = window.prompt(
    "Enter the reason for rejecting this booking:"
  );

  // Cancelled prompt
  if (reason === null) {
    return;
  }

  const trimmedReason = reason.trim();

  if (!trimmedReason) {
    setRejectError(
      "A rejection reason is required."
    );
    console.log(rejectError)
    return;
  }

  const confirmed = window.confirm(
    `Reject booking ${booking.bookingNumber}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    setIsRejecting(true);
    setRejectError("");
    setConfirmError("");

    const updatedBooking =
      await rejectAdminBooking(
        booking.id,
        trimmedReason
      );

    console.log(
      "Booking rejected:",
      updatedBooking
    );

    setBooking(updatedBooking);
  } catch (error: any) {
    console.error(
      "Failed to reject booking:",
      error
    );

    setRejectError(
      error?.response?.data?.message ||
        "Unable to reject this booking. Please try again."
    );
  } finally {
    setIsRejecting(false);
  }
};
  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <section className="min-h-screen bg-black px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto mt-30 max-w-7xl">

          <div className="mb-8 flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-white/10" />

            <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
          </div>

          <div className="h-10 w-80 animate-pulse rounded bg-white/10" />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/[0.025] lg:col-span-2" />

            <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/[0.025]" />
          </div>

          <div className="mt-6 h-96 animate-pulse rounded-3xl border border-white/10 bg-white/[0.025]" />
        </div>
      </section>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !booking) {
    return (
      <section className="min-h-screen bg-black px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/bookings")
            }
            className="mb-8 text-sm font-semibold text-gray-500 transition hover:text-white"
          >
            ← Back to bookings
          </button>

          <div className="rounded-3xl border border-red-400/20 bg-red-400/[0.04] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-2xl">
              !
            </div>

            <h1 className="mt-5 text-xl font-bold">
              Unable to load booking
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
              {error ||
                "The requested booking could not be found."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/bookings")
              }
              className="mt-6 rounded-xl bg-yellow-300 px-6 py-3 text-sm font-black text-black transition hover:bg-yellow-200"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </section>
    );
  }

  const statusStyles =
    getStatusStyles(booking.status);

  const mainImage =
    booking.car?.images?.[0]?.url ||
    "https://placehold.co/1000x650/111111/FDE047?text=NH37+Car";

  const isPending =
    booking.status === "PENDING";

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto mt-30 max-w-7xl">

        {/* ====================================================
            TOP BAR
        ==================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <button
              type="button"
              onClick={() =>
                navigate("/admin/bookings")
              }
              className="mb-5 text-sm font-semibold text-gray-500 transition hover:text-white"
            >
              ← Back to bookings
            </button>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-300" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
                Booking Review
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                {booking.bookingNumber}
              </h1>

              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold",
                  statusStyles.badge
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    statusStyles.dot
                  )}
                />

                {getStatusLabel(
                  booking.status
                )}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Created{" "}
              {formatDateTime(
                booking.createdAt
              )}
            </p>
          </div>

          {isPending && (
  <div className="flex flex-col gap-3 sm:flex-row">
    <button
      type="button"
      onClick={handleRejectBooking}
      disabled={isRejecting || isConfirming}
      className="rounded-xl border border-red-400/30 bg-red-400/10 px-6 py-3.5 text-sm font-black text-red-300 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isRejecting
        ? "Rejecting..."
        : "✕ Reject Booking"}
    </button>

    <button
      type="button"
      onClick={handleConfirmBooking}
      disabled={isConfirming || isRejecting}
      className="rounded-xl bg-yellow-300 px-6 py-3.5 text-sm font-black text-black transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isConfirming
        ? "Confirming..."
        : "✓ Verify & Approve"}
    </button>
  </div>
)}
        </div>

        {/* ====================================================
            CONFIRM ERROR
        ==================================================== */}

        {confirmError && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/[0.04] px-5 py-4 text-sm text-red-300">
            {confirmError}
          </div>
        )}

        {/* ====================================================
            MAIN GRID
        ==================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">

          {/* ==================================================
              LEFT COLUMN
          ================================================== */}

          <div className="space-y-6">

            {/* ================================================
                CUSTOMER
            ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">

              <SectionHeading
                eyebrow="Customer"
                title="Customer details."
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <InfoItem
                  label="Full Name"
                  value={booking.customerName}
                />

                <InfoItem
                  label="Phone"
                  value={booking.customerPhone}
                />

                <InfoItem
                  label="Email"
                  value={booking.customerEmail}
                />

                <InfoItem
                  label="Customer ID"
                  value={booking.userId}
                  mono
                />

              </div>
            </div>

            {/* ================================================
                VEHICLE
            ================================================= */}

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">

              <div className="p-6 sm:p-7">
                <SectionHeading
                  eyebrow="Vehicle"
                  title="Reserved car."
                />
              </div>

              <div className="grid md:grid-cols-[280px_1fr]">

                <div className="aspect-[4/3] overflow-hidden bg-white/[0.03] md:aspect-auto">
                  <img
                    src={mainImage}
                    alt={`${booking.car.brand} ${booking.car.model}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-6 sm:p-7">

                  <div className="flex flex-wrap items-start justify-between gap-4">

                    <div>
                      <p className="text-2xl font-black">
                        {booking.car.name ||
                          `${booking.car.brand} ${booking.car.model}`}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {booking.car.brand}{" "}
                        {booking.car.model}
                        {booking.car.year
                          ? ` • ${booking.car.year}`
                          : ""}
                      </p>
                    </div>

                    {booking.car.registrationNumber && (
                      <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold tracking-wider text-gray-300">
                        {booking.car.registrationNumber}
                      </span>
                    )}

                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">

                    <InfoItem
                      label="Rental Type"
                      value={
                        booking.rentalType ===
                        "SELF_DRIVE"
                          ? "Self Drive"
                          : "With Driver"
                      }
                    />

                    <InfoItem
                      label="Seats"
                      value={
                        booking.car.seats
                          ? `${booking.car.seats} seats`
                          : "—"
                      }
                    />

                    <InfoItem
                      label="Transmission"
                      value={
                        booking.car.transmission ||
                        "—"
                      }
                    />

                    <InfoItem
                      label="Fuel"
                      value={
                        booking.car.fuelType ||
                        "—"
                      }
                    />

                  </div>
                </div>
              </div>
            </div>

            {/* ================================================
                RENTAL PERIOD
            ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">

              <SectionHeading
                eyebrow="Rental"
                title="Pickup & return."
              />

              <div className="mt-6 grid gap-4 md:grid-cols-2">

                <LocationCard
                  label="Pickup"
                  location={
                    booking.pickupLocation
                  }
                  dateTime={formatDateTime(
                    booking.pickupAt
                  )}
                />

                <LocationCard
                  label="Return"
                  location={
                    booking.dropLocation ||
                    booking.pickupLocation
                  }
                  dateTime={formatDateTime(
                    booking.returnAt
                  )}
                />

              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">

                <InfoItem
                  label="Rental Days"
                  value={`${booking.rentalDays} ${
                    booking.rentalDays === 1
                      ? "day"
                      : "days"
                  }`}
                />

                <InfoItem
                  label="Rental Hours"
                  value={`${booking.rentalHours} ${
                    booking.rentalHours === 1
                      ? "hour"
                      : "hours"
                  }`}
                />

                <InfoItem
                  label="Price / Day"
                  value={formatPrice(
                    booking.pricePerDay
                  )}
                />

                <InfoItem
                  label="Price / Hour"
                  value={formatPrice(
                    booking.pricePerHour
                  )}
                />

              </div>
            </div>

            {/* ================================================
                DOCUMENTS
            ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">

              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                <SectionHeading
                  eyebrow="Verification"
                  title="Customer documents."
                />

                <span className="text-xs text-gray-600">
                  {booking.documents?.length || 0}{" "}
                  document
                  {(booking.documents?.length || 0) === 1
                    ? ""
                    : "s"} uploaded
                </span>

              </div>

              {booking.documents &&
              booking.documents.length > 0 ? (
                <div className="mt-6 space-y-3">

                  {booking.documents.map(
                    (document) => (
                      <div
                        key={document.id}
                        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-yellow-300/20 bg-yellow-300/[0.06] text-lg">
                            📄
                          </div>

                          <div>
                            <p className="text-sm font-bold text-white">
                              {getDocumentLabel(
                                document.type
                              )}
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                              Uploaded{" "}
                              {formatDate(
                                document.createdAt
                              )}
                            </p>
                          </div>

                        </div>

                        <div className="flex items-center gap-3">

                          <span
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-xs font-bold",
                              getDocumentStatusStyles(
                                document.verificationStatus
                              )
                            )}
                          >
                            {document.verificationStatus}
                          </span>

                          {document.url && (
                            <button
                              type="button"
                              onClick={() =>
                                window.open(
                                  document.url,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-gray-300 transition hover:border-yellow-300/30 hover:text-white"
                            >
                              View
                            </button>
                          )}

                        </div>
                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/[0.04] p-5 text-sm text-red-300">
                  No documents were uploaded with this booking.
                </div>
              )}

              <div className="mt-4 rounded-xl border border-yellow-300/10 bg-yellow-300/[0.03] px-4 py-3 text-xs leading-5 text-gray-500">
                Document verification actions can be added here once the
                document verification API is enabled.
              </div>

            </div>

            {/* ================================================
                STATUS HISTORY
            ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">

              <SectionHeading
                eyebrow="Activity"
                title="Booking history."
              />

              {booking.statusHistory &&
              booking.statusHistory.length > 0 ? (
                <div className="mt-6">

                  {booking.statusHistory.map(
                    (history, index) => (
                      <div
                        key={history.id}
                        className="relative flex gap-4 pb-6 last:pb-0"
                      >

                        {index <
                          booking.statusHistory
                            .length -
                            1 && (
                          <div className="absolute left-[7px] top-5 h-full w-px bg-white/10" />
                        )}

                        <div className="relative mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-yellow-300 bg-black" />

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-sm font-bold">
                              {getStatusLabel(
                                history.status
                              )}
                            </p>

                            <span className="text-xs text-gray-600">
                              {formatDateTime(
                                history.createdAt
                              )}
                            </span>

                          </div>

                          {history.note && (
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              {history.note}
                            </p>
                          )}

                        </div>
                      </div>
                    )
                  )}

                </div>
              ) : (
                <p className="mt-6 text-sm text-gray-600">
                  No status history available.
                </p>
              )}

            </div>
          </div>

          {/* ==================================================
              RIGHT COLUMN
          ================================================== */}

          <div className="space-y-6">

            {/* ================================================
                ACTION CARD
            ================================================= */}

            <div
              className={cn(
                "rounded-3xl border p-6",
                isPending
                  ? "border-yellow-300/20 bg-yellow-300/[0.04]"
                  : "border-white/10 bg-white/[0.025]"
              )}
            >

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
                Admin Action
              </p>

              <h2 className="mt-3 text-xl font-black">
                {isPending
                  ? "Review this booking"
                  : "Booking processed"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {isPending
                  ? "Review the customer details and uploaded documents before approving this reservation."
                  : `This booking is currently marked as ${getStatusLabel(
                      booking.status
                    )}.`}
              </p>

              {isPending && (
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={isConfirming}
                  className="mt-6 w-full rounded-xl bg-yellow-300 px-5 py-3.5 text-sm font-black text-black transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isConfirming
                    ? "Confirming..."
                    : "✓ Approve Booking"}
                </button>
              )}

              {booking.status ===
                "CONFIRMED" && (
                <div className="mt-5 rounded-xl border border-green-400/20 bg-green-400/[0.05] px-4 py-3 text-sm text-green-300">
                  ✓ Booking has been approved.
                </div>
              )}

            </div>

            {/* ================================================
                PRICING
            ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">

              <SectionHeading
                eyebrow="Payment"
                title="Booking summary."
              />

              <div className="mt-6 space-y-4">

                <PriceRow
                  label="Rental Amount"
                  value={formatPrice(
                    booking.rentalAmount
                  )}
                />

                <PriceRow
                  label="Security Deposit"
                  value={formatPrice(
                    booking.securityDeposit
                  )}
                />

                <div className="h-px bg-white/10" />

                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm font-semibold text-gray-400">
                    Total Amount
                  </span>

                  <span className="text-2xl font-black text-yellow-300">
                    {formatPrice(
                      booking.totalAmount
                    )}
                  </span>
                </div>

              </div>
            </div>

            {/* ================================================
                PAYMENT
            ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">

              <SectionHeading
                eyebrow="Transaction"
                title="Payment status."
              />

              {booking.payment ? (
                <div className="mt-6 space-y-4">

                  <InfoItem
                    label="Status"
                    value={booking.payment.status}
                  />

                  <InfoItem
                    label="Method"
                    value={booking.payment.method}
                  />

                  <InfoItem
                    label="Amount"
                    value={formatPrice(
                      booking.payment.amount
                    )}
                  />

                  {booking.payment.paidAt && (
                    <InfoItem
                      label="Paid At"
                      value={formatDateTime(
                        booking.payment.paidAt
                      )}
                    />
                  )}

                  {booking.payment.razorpayPaymentId && (
                    <InfoItem
                      label="Razorpay Payment ID"
                      value={
                        booking.payment
                          .razorpayPaymentId
                      }
                      mono
                    />
                  )}

                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-5 text-center">
                  <p className="text-sm font-semibold text-gray-400">
                    No payment recorded
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    Payment information will appear here
                    once a transaction is created.
                  </p>
                </div>
              )}

            </div>

            {/* ================================================
                BOOKING METADATA
            ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">

              <SectionHeading
                eyebrow="Metadata"
                title="Booking information."
              />

              <div className="mt-6 space-y-4">

                <InfoItem
                  label="Booking ID"
                  value={booking.id}
                  mono
                />

                <InfoItem
                  label="Car ID"
                  value={booking.carId}
                  mono
                />

                <InfoItem
                  label="Created"
                  value={formatDateTime(
                    booking.createdAt
                  )}
                />

                <InfoItem
                  label="Last Updated"
                  value={formatDateTime(
                    booking.updatedAt
                  )}
                />

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION HEADING
// ============================================================

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-black tracking-tight">
        {title}
      </h2>
    </div>
  );
}

// ============================================================
// INFO ITEM
// ============================================================

function InfoItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | number | null | undefined;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-600">
        {label}
      </p>

      <p
        className={cn(
          "mt-1 break-words text-sm font-semibold text-gray-200",
          mono &&
            "font-mono text-xs text-gray-400"
        )}
      >
        {value === null ||
        value === undefined ||
        value === ""
          ? "—"
          : value}
      </p>
    </div>
  );
}

// ============================================================
// PRICE ROW
// ============================================================

function PriceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-bold text-gray-200">
        {value}
      </span>
    </div>
  );
}

// ============================================================
// LOCATION CARD
// ============================================================

function LocationCard({
  label,
  location,
  dateTime,
}: {
  label: string;
  location: string;
  dateTime: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-yellow-300" />

        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-yellow-300">
          {label}
        </p>
      </div>

      <p className="mt-4 text-sm font-bold text-white">
        {location}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {dateTime}
      </p>

    </div>
  );
}


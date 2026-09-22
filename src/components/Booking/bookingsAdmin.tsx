
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Booking,
  getAdminBookings,
} from "../../lib/apis/booking.api";

import { cn } from "../../lib/utils";

// ============================================================
// TYPES
// ============================================================

type FilterStatus =
  | "ALL"
  | "PENDING"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

// ============================================================
// HELPERS
// ============================================================

const formatDateTime = (date: string) => {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "—";
  }

  return value.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status: string) => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// ============================================================
// STATUS HELPERS
// ============================================================

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
      return formatStatus(status);
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        badge:
          "border-yellow-300/20 bg-yellow-300/[0.08] text-yellow-300",
        dot: "bg-yellow-300",
      };

    case "PAYMENT_PENDING":
      return {
        badge:
          "border-orange-400/20 bg-orange-400/[0.08] text-orange-300",
        dot: "bg-orange-300",
      };

    case "CONFIRMED":
    case "CAR_ASSIGNED":
    case "PICKUP_SCHEDULED":
      return {
        badge:
          "border-green-400/20 bg-green-400/[0.08] text-green-300",
        dot: "bg-green-300",
      };

    case "ON_THE_WAY":
    case "ACTIVE":
      return {
        badge:
          "border-blue-400/20 bg-blue-400/[0.08] text-blue-300",
        dot: "bg-blue-300",
      };

    case "COMPLETED":
      return {
        badge:
          "border-white/10 bg-white/[0.05] text-gray-300",
        dot: "bg-gray-400",
      };

    case "CANCELLED":
    case "REJECTED":
      return {
        badge:
          "border-red-400/20 bg-red-400/[0.08] text-red-300",
        dot: "bg-red-300",
      };

    default:
      return {
        badge:
          "border-white/10 bg-white/[0.05] text-gray-300",
        dot: "bg-gray-400",
      };
  }
};

// ============================================================
// FILTER HELPERS
// ============================================================

const getFilterForBooking = (
  booking: Booking
): FilterStatus => {
  switch (booking.status) {
    case "PENDING":
    case "PAYMENT_PENDING":
      return "PENDING";

    case "CONFIRMED":
    case "CAR_ASSIGNED":
    case "PICKUP_SCHEDULED":
    case "ON_THE_WAY":
    case "ACTIVE":
      return "ACTIVE";

    case "COMPLETED":
      return "COMPLETED";

    case "CANCELLED":
    case "REJECTED":
      return "CANCELLED";

    default:
      return "ALL";
  }
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const AdminBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [filter, setFilter] =
    useState<FilterStatus>("ALL");

  // ============================================================
  // LOAD BOOKINGS
  // ============================================================

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getAdminBookings();

        console.log("Admin bookings:", data);

        setBookings(data);
      } catch (error: any) {
        console.error(
          "Failed to load admin bookings:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Unable to load bookings. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  // ============================================================
  // FILTERED BOOKINGS
  // ============================================================

  const filteredBookings = useMemo(() => {
    if (filter === "ALL") {
      return bookings;
    }

    return bookings.filter(
      (booking) =>
        getFilterForBooking(booking) === filter
    );
  }, [bookings, filter]);

  // ============================================================
  // COUNTS
  // ============================================================

  const counts = useMemo(() => {
    return {
      all: bookings.length,

      pending: bookings.filter(
        (booking) =>
          getFilterForBooking(booking) ===
          "PENDING"
      ).length,

      active: bookings.filter(
        (booking) =>
          getFilterForBooking(booking) ===
          "ACTIVE"
      ).length,

      completed: bookings.filter(
        (booking) =>
          getFilterForBooking(booking) ===
          "COMPLETED"
      ).length,

      cancelled: bookings.filter(
        (booking) =>
          getFilterForBooking(booking) ===
          "CANCELLED"
      ).length,
    };
  }, [bookings]);

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <section className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto mt-30 max-w-7xl">

          <div className="mb-8">
            <div className="h-3 w-32 animate-pulse rounded bg-white/10" />

            <div className="mt-4 h-10 w-64 animate-pulse rounded bg-white/10" />

            <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-white/5" />
          </div>

          {/* Summary skeleton */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>

          {/* Booking skeletons */}
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-3xl bg-white/[0.04]"
              />
            ))}
          </div>

        </div>
      </section>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <section className="min-h-screen bg-black px-4 py-20 text-white sm:px-6">
        <div className="mx-auto mt-30 max-w-xl text-center">

          <div className="rounded-3xl border border-red-400/20 bg-white/[0.025] px-6 py-16">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-400/[0.08] text-xl text-red-300">
              !
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Unable to load bookings
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-xl bg-yellow-300 px-6 py-3 text-sm font-black text-black transition hover:bg-yellow-200"
            >
              Try Again
            </button>

          </div>

        </div>
      </section>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <section className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto mt-30 max-w-7xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">

          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-300" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
              Admin Dashboard
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                All{" "}
                <span className="text-yellow-300">
                  bookings.
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Review customer reservations, verify
                documents and manage booking approvals.
              </p>
            </div>

            <div className="rounded-xl border border-yellow-300/20 bg-yellow-300/[0.05] px-4 py-3">

              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                Total Reservations
              </p>

              <p className="mt-1 text-2xl font-black text-yellow-300">
                {counts.all}
              </p>

            </div>

          </div>

        </div>

        {/* ======================================================
            SUMMARY
        ====================================================== */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

          <DashboardStat
            label="All"
            value={counts.all}
            active={filter === "ALL"}
            onClick={() =>
              setFilter("ALL")
            }
          />

          <DashboardStat
            label="Pending"
            value={counts.pending}
            active={filter === "PENDING"}
            onClick={() =>
              setFilter("PENDING")
            }
          />

          <DashboardStat
            label="Active"
            value={counts.active}
            active={filter === "ACTIVE"}
            onClick={() =>
              setFilter("ACTIVE")
            }
          />

          <DashboardStat
            label="Completed"
            value={counts.completed}
            active={filter === "COMPLETED"}
            onClick={() =>
              setFilter("COMPLETED")
            }
          />

        </div>

        {/* ======================================================
            FILTERS
        ====================================================== */}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">

          <div className="flex flex-wrap gap-2">

            <FilterButton
              label="All"
              active={filter === "ALL"}
              onClick={() =>
                setFilter("ALL")
              }
            />

            <FilterButton
              label="Pending"
              active={filter === "PENDING"}
              onClick={() =>
                setFilter("PENDING")
              }
            />

            <FilterButton
              label="Active"
              active={filter === "ACTIVE"}
              onClick={() =>
                setFilter("ACTIVE")
              }
            />

            <FilterButton
              label="Completed"
              active={filter === "COMPLETED"}
              onClick={() =>
                setFilter("COMPLETED")
              }
            />

            <FilterButton
              label="Cancelled"
              active={filter === "CANCELLED"}
              onClick={() =>
                setFilter("CANCELLED")
              }
            />

          </div>

          <p className="text-xs text-gray-600">
            Showing{" "}
            <span className="font-bold text-gray-300">
              {filteredBookings.length}
            </span>{" "}
            booking
            {filteredBookings.length !== 1
              ? "s"
              : ""}
          </p>

        </div>

        {/* ======================================================
            BOOKINGS
        ====================================================== */}

        {filteredBookings.length === 0 ? (

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] px-6 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-300/[0.06]">

              <span className="text-2xl">
                🚗
              </span>

            </div>

            <h2 className="mt-5 text-xl font-bold">
              No bookings found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              There are no customer bookings in
              the selected category.
            </p>

          </div>

        ) : (

          <div className="mt-6 space-y-4">

            {filteredBookings.map(
              (booking) => (
                <AdminBookingCard
                  key={booking.id}
                  booking={booking}
                  onView={() =>
                    navigate(
                      `/admin/bookings/`
                    )
                  }
                />
              )
            )}

          </div>

        )}

      </div>
    </section>
  );
};

// ============================================================
// ADMIN BOOKING CARD
// ============================================================

function AdminBookingCard({
  booking,
  onView,
}: {
  booking: Booking;
  onView: () => void;
}) {
  const styles =
    getStatusStyles(booking.status);

  const mainImage =
    booking.car?.images?.[0]?.url ||
    "https://placehold.co/800x500/111111/FDE047?text=NH37+Car";

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] transition hover:border-yellow-300/20">

      {/* ======================================================
          TOP BAR
      ====================================================== */}

      <div className="flex flex-col justify-between gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:px-6">

        <div className="flex flex-wrap items-center gap-3">

          <span
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider",
              styles.badge
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                styles.dot
              )}
            />

            {getStatusLabel(
              booking.status
            )}
          </span>

          <span className="text-xs text-gray-600">
            {booking.bookingNumber}
          </span>

        </div>

        <p className="text-xs text-gray-600">
          Created{" "}
          {formatDateTime(
            booking.createdAt
          )}
        </p>

      </div>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="p-5 sm:p-6">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">

          {/* ==================================================
              CAR IMAGE
          ================================================== */}

          <div className="relative h-44 overflow-hidden rounded-2xl bg-zinc-900 sm:h-48 lg:h-full lg:min-h-[190px]">

            <img
              src={mainImage}
              alt={`${booking.car.brand} ${booking.car.model}`}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4">

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-yellow-300">
                {booking.rentalType ===
                "SELF_DRIVE"
                  ? "Self Drive"
                  : "With Driver"}
              </p>

              <p className="mt-1 text-lg font-black text-white">
                {booking.car.brand}{" "}
                {booking.car.model}
              </p>

            </div>

          </div>

          {/* ==================================================
              DETAILS
          ================================================== */}

          <div>

            {/* Customer + Amount */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">
                  Customer
                </p>

                <h2 className="mt-1 text-xl font-black">
                  {booking.customerName}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {booking.customerPhone}
                </p>

                <p className="text-xs text-gray-500">
                  {booking.customerEmail}
                </p>

              </div>

              <div className="sm:text-right">

                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                  Total Amount
                </p>

                <p className="mt-1 text-2xl font-black text-yellow-300">
                  ₹
                  {Number(
                    booking.totalAmount
                  ).toLocaleString("en-IN")}
                </p>

              </div>

            </div>

            {/* =================================================
                CAR
            ================================================= */}

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <InfoItem
                  label="Vehicle"
                  value={`${booking.car.brand} ${booking.car.model}`}
                />

                <InfoItem
                  label="Car Name"
                  value={
                    booking.car.name ||
                    "—"
                  }
                />

                <InfoItem
                  label="Rental Type"
                  value={
                    booking.rentalType ===
                    "SELF_DRIVE"
                      ? "Self Drive"
                      : "With Driver"
                  }
                />

              </div>

            </div>

            {/* =================================================
                PICKUP / RETURN
            ================================================= */}

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">

              <TripPoint
                label="Pickup"
                location={
                  booking.pickupLocation
                }
                date={formatDateTime(
                  booking.pickupAt
                )}
              />

              <TripPoint
                label="Return"
                location={
                  booking.dropLocation ||
                  "Same as pickup"
                }
                date={formatDateTime(
                  booking.returnAt
                )}
              />

            </div>

            {/* =================================================
                AMOUNT BREAKDOWN
            ================================================= */}

            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-4">

              <AmountItem
                label="Rental"
                value={`₹${Number(
                  booking.rentalAmount
                ).toLocaleString("en-IN")}`}
              />

              <AmountItem
                label="Security Deposit"
                value={
                  booking.securityDeposit !==
                  null &&
                  booking.securityDeposit !==
                    undefined
                    ? `₹${Number(
                        booking.securityDeposit
                      ).toLocaleString(
                        "en-IN"
                      )}`
                    : "—"
                }
              />

              <AmountItem
                label="Duration"
                value={`${booking.rentalDays}d ${booking.rentalHours}h`}
              />

            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={onView}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-gray-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                Review Booking
              </button>

              {booking.status ===
                "PENDING" && (
                <button
                  type="button"
                  onClick={onView}
                  className="rounded-xl bg-yellow-300 px-6 py-3 text-sm font-black text-black transition hover:bg-yellow-200 active:scale-[0.98]"
                >
                  Verify & Approve →
                </button>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

// ============================================================
// INFO ITEM
// ============================================================

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-gray-300">
        {value}
      </p>

    </div>
  );
}

// ============================================================
// TRIP POINT
// ============================================================

function TripPoint({
  label,
  location,
  date,
}: {
  label: string;
  location: string;
  date: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">

      <div className="flex items-center gap-2">

        <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />

        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">
          {label}
        </p>

      </div>

      <p className="mt-2 truncate text-sm font-bold text-white">
        {location}
      </p>

      <p className="mt-2 text-xs text-gray-500">
        {date}
      </p>

    </div>
  );
}

// ============================================================
// AMOUNT ITEM
// ============================================================

function AmountItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-gray-300">
        {value}
      </p>

    </div>
  );
}

// ============================================================
// DASHBOARD STAT
// ============================================================

function DashboardStat({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-4 text-left transition",
        active
          ? "border-yellow-300/30 bg-yellow-300/[0.07]"
          : "border-white/10 bg-white/[0.025] hover:border-white/20"
      )}
    >

      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p
        className={cn(
          "mt-2 text-2xl font-black",
          active
            ? "text-yellow-300"
            : "text-white"
        )}
      >
        {value}
      </p>

    </button>
  );
}

// ============================================================
// FILTER BUTTON
// ============================================================

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-2.5 text-xs font-bold transition",
        active
          ? "border-yellow-300 bg-yellow-300 text-black"
          : "border-white/10 bg-white/[0.025] text-gray-500 hover:border-white/20 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

export default AdminBookings;


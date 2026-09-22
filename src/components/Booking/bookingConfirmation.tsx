
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { getBookingById } from "../../lib/apis/booking.api";

interface CarImage {
  id: string;
  url: string;
}

interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  images?: CarImage[];
}

interface Booking {
  id: string;
  status: string;
  rentalType: string;
  pickupLocation: string;
  dropLocation?: string | null;
  pickupAt: string;
  returnAt: string;

  rentalAmount?: number | string;
  securityDeposit?: number | string;
  totalAmount?: number | string;

  car: Car;
}

const formatAmount = (amount?: number | string) => {
  if (amount === undefined || amount === null) {
    return "—";
  }

  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

const formatDateTime = (date: string) => {
  return format(
    new Date(date),
    "dd MMM yyyy, hh:mm a"
  );
};

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { bookingId } = useParams<{
    bookingId: string;
  }>();

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        setError("Booking ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getBookingById(bookingId);

        setBooking(
          response
        );
      } catch (err) {
        console.error(
          "Failed to load booking:",
          err
        );

        setError(
          "Unable to load your booking details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="animate-pulse space-y-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-white/10" />

            <div className="mx-auto h-8 w-72 rounded bg-white/10" />

            <div className="mx-auto h-4 w-96 max-w-full rounded bg-white/10" />

            <div className="mt-10 h-72 rounded-3xl bg-white/[0.04]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
          <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <div className="mb-5 text-5xl">
              ⚠️
            </div>

            <h1 className="text-2xl font-bold">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm text-white/60">
              {error ||
                "We could not find this booking."}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() =>
                  navigate("/my-bookings")
                }
                className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                My Bookings
              </button>

              <button
                onClick={() => navigate("/")}
                className="rounded-xl bg-yellow-300 px-6 py-3 text-sm font-bold text-black transition hover:bg-yellow-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const carImage =
    booking.car?.images?.[0]?.url;

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ================================================== */}
        {/* SUCCESS HEADER */}
        {/* ================================================== */}

        <section className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-yellow-300/30 bg-yellow-300/10 text-4xl">
            ✓
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">
            Booking Request Submitted
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            Your booking is{" "}
            <span className="text-yellow-300">
              under review
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
            We've received your booking request and
            documents. Our team will verify your details
            before confirming the reservation.
          </p>

        </section>

        {/* ================================================== */}
        {/* STATUS */}
        {/* ================================================== */}

        <section className="mt-10 rounded-3xl border border-yellow-300/20 bg-yellow-300/[0.05] p-6 sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Booking Status
              </p>

              <h2 className="mt-2 text-2xl font-bold text-yellow-300">
                Pending for Approval
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                Your documents are being reviewed by
                the NH37 Car Rentals team. Once your
                booking is approved, you'll be able to
                proceed with payment.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-300/20 bg-black/30 px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-white/40">
                Booking ID
              </p>

              <p className="mt-1 break-all font-mono text-sm font-bold text-white">
                {booking.id}
              </p>
            </div>

          </div>
        </section>

        {/* ================================================== */}
        {/* BOOKING DETAILS */}
        {/* ================================================== */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">

          {/* CAR */}
          <div className="border-b border-white/10 p-6 sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row">

              <div className="h-48 w-full overflow-hidden rounded-2xl bg-white/5 sm:h-32 sm:w-52 sm:flex-shrink-0">

                {carImage ? (
                  <img
                    src={carImage}
                    alt={booking.car.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-white/30">
                    No image available
                  </div>
                )}

              </div>

              <div className="flex-1">

                <p className="text-xs font-semibold uppercase tracking-wider text-yellow-300">
                  Selected Vehicle
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {booking.car.name}
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  {booking.car.brand}{" "}
                  {booking.car.model} •{" "}
                  {booking.car.year}
                </p>

                <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70">
                  SELF DRIVE
                </div>

              </div>

            </div>

          </div>

          {/* DATES */}
          <div className="grid gap-6 border-b border-white/10 p-6 sm:grid-cols-2 sm:p-8">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Pickup
              </p>

              <p className="mt-2 font-semibold">
                {formatDateTime(
                  booking.pickupAt
                )}
              </p>

              <p className="mt-1 text-sm text-white/50">
                {booking.pickupLocation}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Return
              </p>

              <p className="mt-2 font-semibold">
                {formatDateTime(
                  booking.returnAt
                )}
              </p>

              <p className="mt-1 text-sm text-white/50">
                {booking.dropLocation ||
                  booking.pickupLocation}
              </p>
            </div>

          </div>

          {/* PRICE */}
          <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">

            <div className="rounded-2xl bg-white/[0.03] p-5">
              <p className="text-xs text-white/40">
                Rental Amount
              </p>

              <p className="mt-2 text-lg font-bold">
                {formatAmount(
                  booking.rentalAmount
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.03] p-5">
              <p className="text-xs text-white/40">
                Security Deposit
              </p>

              <p className="mt-2 text-lg font-bold">
                {formatAmount(
                  booking.securityDeposit
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/[0.05] p-5">
              <p className="text-xs text-white/40">
                Total Amount
              </p>

              <p className="mt-2 text-lg font-bold text-yellow-300">
                {formatAmount(
                  booking.totalAmount
                )}
              </p>
            </div>

          </div>

        </section>

        {/* ================================================== */}
        {/* WHAT HAPPENS NEXT */}
        {/* ================================================== */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
            What happens next?
          </p>

          <div className="mt-7 grid gap-6 sm:grid-cols-3">

            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-300 text-sm font-black text-black">
                1
              </div>

              <h3 className="mt-4 font-bold">
                Document Verification
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/50">
                Our team verifies the documents you
                submitted with your booking.
              </p>
            </div>

            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-black">
                2
              </div>

              <h3 className="mt-4 font-bold">
                Booking Approval
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/50">
                Once approved, your booking status will
                change and payment will become available.
              </p>
            </div>

            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-black">
                3
              </div>

              <h3 className="mt-4 font-bold">
                Complete Payment
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/50">
                Complete the payment to confirm your
                reservation and secure the vehicle.
              </p>
            </div>

          </div>

        </section>

        {/* ================================================== */}
        {/* ACTIONS */}
        {/* ================================================== */}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

          <button
            onClick={() =>
              navigate("/bookings/my")
            }
            className="rounded-xl border border-white/10 px-7 py-3.5 text-sm font-bold transition hover:bg-white/10"
          >
            View My Bookings
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-yellow-300 px-7 py-3.5 text-sm font-bold text-black transition hover:bg-yellow-200"
          >
            Back to Home
          </button>

        </div>

      </main>
    </div>
  );
}


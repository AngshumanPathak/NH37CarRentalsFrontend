 
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Booking,
  getAdminBookings,
} from "../../lib/apis/booking.api";

type FilterStatus =
  | "ALL"
  | "PENDING"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED";

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
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

const getStatusClasses = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";

    case "CONFIRMED":
      return "bg-blue-100 text-blue-800 border border-blue-200";

    case "ACTIVE":
      return "bg-green-100 text-green-800 border border-green-200";

    case "COMPLETED":
      return "bg-gray-100 text-gray-800 border border-gray-200";

    case "CANCELLED":
    case "REJECTED":
      return "bg-red-100 text-red-800 border border-red-200";

    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};

const AdminBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] =
    useState<FilterStatus>("ALL");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminBookings();

        setBookings(data);
      } catch (error: any) {
        console.error(
          "Failed to load admin bookings:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Failed to load bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    if (filter === "ALL") {
      return bookings;
    }

    return bookings.filter(
      (booking) => booking.status === filter
    );
  }, [bookings, filter]);

  const pendingCount = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "CONFIRMED"
  ).length;

  const activeCount = bookings.filter(
    (booking) => booking.status === "ACTIVE"
  ).length;

  return (
    <div className="min-h-screen bg-white">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="border-b border-gray-200 bg-black">
        <div className="mx-auto max-w-7xl px-4 py-7 md:px-8 ">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mt-30">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-300" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
                  NH37 Admin
                </span>
              </div>

              <h1 className="text-3xl font-bold text-white md:text-4xl">
                Bookings
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                Review and manage customer reservations.
              </p>
            </div>

            {/* SUMMARY */}
            <div className="flex flex-wrap gap-3">

              {/* Pending */}
              <div className="min-w-[120px] rounded-xl border border-yellow-300/30 bg-white px-5 py-3 shadow-lg">
                <p className="text-xs font-medium text-gray-500">
                  Pending
                </p>

                <p className="mt-1 text-2xl font-bold text-black">
                  {pendingCount}
                </p>

                <div className="mt-1 h-1 w-8 rounded-full bg-yellow-300" />
              </div>

              {/* Confirmed */}
              <div className="min-w-[120px] rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-lg">
                <p className="text-xs font-medium text-gray-500">
                  Confirmed
                </p>

                <p className="mt-1 text-2xl font-bold text-black">
                  {confirmedCount}
                </p>

                <div className="mt-1 h-1 w-8 rounded-full bg-black" />
              </div>

              {/* Active */}
              <div className="min-w-[120px] rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-lg">
                <p className="text-xs font-medium text-gray-500">
                  Active
                </p>

                <p className="mt-1 text-2xl font-bold text-black">
                  {activeCount}
                </p>

                <div className="mt-1 h-1 w-8 rounded-full bg-green-500" />
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">

        {/* ================================================= */}
        {/* FILTERS */}
        {/* ================================================= */}

        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">

          <div className="flex flex-wrap gap-2">

            {(
              [
                "ALL",
                "PENDING",
                "CONFIRMED",
                "ACTIVE",
                "COMPLETED",
              ] as FilterStatus[]
            ).map((status) => (

              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                  filter === status
                    ? "bg-yellow-300 text-black shadow-sm hover:bg-yellow-400"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-black hover:bg-black hover:text-white"
                }`}
              >
                {status === "ALL"
                  ? "All Bookings"
                  : formatStatus(status)}
              </button>

            ))}

          </div>

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-black">
              {filteredBookings.length}
            </span>{" "}
            booking
            {filteredBookings.length !== 1 ? "s" : ""}
          </p>

        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">

            <div className="flex items-start gap-3">

              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

              <div>
                <p className="font-semibold text-red-800">
                  Unable to load bookings
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading ? (

          <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-sm">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="font-semibold text-black">
              Loading bookings...
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Fetching the latest reservations.
            </p>

          </div>

        ) : filteredBookings.length === 0 ? (

          <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">

              <div className="h-7 w-7 rounded-full border-4 border-black" />

            </div>

            <p className="mt-5 text-xl font-bold text-black">
              No bookings found
            </p>

            <p className="mt-2 text-sm text-gray-500">
              There are no bookings matching this filter.
            </p>

          </div>

        ) : (

          /* ================================================= */
          /* TABLE */
          /* ================================================= */

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* TABLE HEADER */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-black px-5 py-4">

              <div>
                <h2 className="font-bold text-white">
                  Customer Reservations
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Review booking details and verification status.
                </p>
              </div>

              <div className="h-2 w-2 rounded-full bg-yellow-300" />

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="border-b border-gray-200 bg-gray-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Booking
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Car
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Pickup
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Return
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredBookings.map((booking) => (

                    <tr
                      key={booking.id}
                      className="group transition hover:bg-yellow-50/50"
                    >

                      {/* BOOKING */}

                      <td className="px-5 py-5">

                        <p className="font-bold text-black">
                          {booking.bookingNumber}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {formatDateTime(
                            booking.createdAt
                          )}
                        </p>

                      </td>

                      {/* CUSTOMER */}

                      <td className="px-5 py-5">

                        <p className="font-semibold text-black">
                          {booking.customerName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {booking.customerPhone}
                        </p>

                        <p className="max-w-[180px] truncate text-xs text-gray-500">
                          {booking.customerEmail}
                        </p>

                      </td>

                      {/* CAR */}

                      <td className="px-5 py-5">

                        <p className="font-semibold text-black">
                          {booking.car.brand}{" "}
                          {booking.car.model}
                        </p>

                        <p className="text-xs text-gray-500">
                          {booking.car.name}
                        </p>

                      </td>

                      {/* PICKUP */}

                      <td className="px-5 py-5">

                        <p className="font-semibold text-black">
                          {formatDateTime(
                            booking.pickupAt
                          )}
                        </p>

                        <p className="mt-1 max-w-[180px] truncate text-xs text-gray-500">
                          {booking.pickupLocation}
                        </p>

                      </td>

                      {/* RETURN */}

                      <td className="px-5 py-5">

                        <p className="font-semibold text-black">
                          {formatDateTime(
                            booking.returnAt
                          )}
                        </p>

                        <p className="mt-1 max-w-[180px] truncate text-xs text-gray-500">
                          {booking.dropLocation ||
                            "Same as pickup"}
                        </p>

                      </td>

                      {/* AMOUNT */}

                      <td className="px-5 py-5">

                        <p className="font-bold text-black">
                          ₹
                          {Number(
                            booking.totalAmount
                          ).toLocaleString("en-IN")}
                        </p>

                        <p className="text-xs text-gray-500">
                          {booking.rentalDays}d{" "}
                          {booking.rentalHours}h
                        </p>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-5">

                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                            booking.status
                          )}`}
                        >
                          {formatStatus(
                            booking.status
                          )}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-5 text-right">

                        <button
                          onClick={() =>
                            navigate(
                              `/admin/bookings/${booking.id}`
                            )
                          }
                          className="rounded-lg bg-black px-4 py-2.5 text-sm font-bold text-white transition hover:bg-yellow-300 hover:text-black"
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* TABLE FOOTER */}

            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-5 py-3">

              <p className="text-xs text-gray-500">
                NH37 Car Rentals
              </p>

              <p className="text-xs font-semibold text-black">
                {filteredBookings.length} result
                {filteredBookings.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>

        )}

      </div>
    </div>
  );
};

export default AdminBookings;


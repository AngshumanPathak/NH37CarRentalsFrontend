
import { useState } from "react";
import type { Car, RentalMode } from "./car.types";
import {
  CarPricing,
  CarPricingDetails,
} from "./CarPricing";

interface CarCardProps {
  car: Car;
  rentalMode: RentalMode;
  onBook: (carId: string) => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "border-yellow-300/30 bg-yellow-300/10 text-yellow-300";

    case "MAINTENANCE":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";

    case "BOOKED":
      return "border-orange-400/30 bg-orange-400/10 text-orange-300";

    case "ON_ROUTE":
      return "border-blue-400/30 bg-blue-400/10 text-blue-300";

    case "WITH_CUSTOMER":
      return "border-purple-400/30 bg-purple-400/10 text-purple-300";

    case "OUT_OF_SERVICE":
    case "UNAVAILABLE":
    default:
      return "border-red-400/30 bg-red-400/10 text-red-300";
  }
};

const formatStatus = (status: string) => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function CarCard({
  car,
  rentalMode,
  onBook,
}: CarCardProps) {
  const [expanded, setExpanded] = useState(false);

  const mainImage =
    car.images?.[0]?.url ||
    "https://placehold.co/800x500/111111/FDE047?text=No+Image";

  const isAvailable = car.status === "AVAILABLE";

  const isSelfDrive = rentalMode === "SELF_DRIVE";

  const bookingLabel = isSelfDrive
    ? "Book This Car"
    : "Book With Driver";

  return (
    <article
      className="
        group flex h-full flex-col
        overflow-hidden rounded-3xl
        border border-white/10
        bg-white/[0.025]
        shadow-2xl shadow-black/20
        transition-all duration-300
        hover:-translate-y-1
        hover:border-yellow-300/30
        hover:bg-white/[0.04]
      "
    >
      {/* IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
        <img
          src={mainImage}
          alt={`${car.brand} ${car.model}`}
          className="
            h-full w-full object-cover
            transition-transform duration-500
            group-hover:scale-105
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

        {/* STATUS */}
        <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
          <span
            className={`
              inline-flex items-center gap-2
              rounded-full border
              px-3 py-1.5
              text-[10px] font-bold
              uppercase tracking-wide
              backdrop-blur-md
              sm:text-xs
              ${getStatusStyles(car.status)}
            `}
          >
            <span
              className={`
                h-1.5 w-1.5 rounded-full
                ${
                  isAvailable
                    ? "bg-yellow-300"
                    : "bg-current"
                }
              `}
            />

            {formatStatus(car.status)}
          </span>
        </div>

        {/* IMAGE COUNT */}
        {car.images && car.images.length > 1 && (
          <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
            <span className="rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md sm:text-xs">
              {car.images.length} Photos
            </span>
          </div>
        )}

        {/* NAME */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-300 sm:text-xs">
            {car.brand}
          </p>

          <h3 className="mt-1 truncate text-2xl font-bold text-white sm:text-3xl">
            {car.model}
          </h3>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* SPECS */}
        <div
          className="
            grid grid-cols-3
            divide-x divide-white/10
            rounded-2xl
            border border-white/10
            bg-white/[0.025]
            py-3
          "
        >
          <Spec
            label="Seats"
            value={car.seats ? `${car.seats}` : "—"}
          />

          <Spec
            label="Fuel"
            value={car.fuelType || "—"}
          />

          <Spec
            label="Gear"
            value={car.transmission || "—"}
          />
        </div>

        {/* PRICING */}
        <CarPricing
          car={car}
          rentalMode={rentalMode}
        />

        {/* EXPAND */}
        <button
          type="button"
          onClick={() =>
            setExpanded((prev) => !prev)
          }
          className="
            mt-4 flex w-full items-center
            justify-between
            border-t border-white/10
            pt-4
            text-left text-sm
            font-bold text-gray-300
            transition-colors
            hover:text-yellow-300
          "
        >
          <span>
            {expanded
              ? "Hide details"
              : "View all details"}
          </span>

          <span
            className={`
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-full
              border border-white/10
              bg-white/[0.04]
              text-yellow-300
              transition-transform duration-300
              ${
                expanded
                  ? "rotate-180"
                  : ""
              }
            `}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>

        {/* EXPANDED DETAILS */}
        <div
          className={`
            grid transition-all duration-300
            ${
              expanded
                ? "mt-4 grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }
          `}
        >
          <div className="overflow-hidden">
            <div className="space-y-5 border-t border-white/10 pt-5">
              {/* DESCRIPTION */}
              {car.description && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
                    About this car
                  </p>

                  <p className="text-sm leading-6 text-gray-400">
                    {car.description}
                  </p>
                </div>
              )}

              {/* VEHICLE DETAILS */}
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
                  Vehicle Details
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  <Detail
                    label="Brand"
                    value={car.brand}
                  />

                  <Detail
                    label="Model"
                    value={car.model}
                  />

                  <Detail
                    label="Year"
                    value={car.year || "—"}
                  />

                  <Detail
                    label="Seats"
                    value={car.seats || "—"}
                  />

                  <Detail
                    label="Fuel Type"
                    value={car.fuelType || "—"}
                  />

                  <Detail
                    label="Transmission"
                    value={
                      car.transmission || "—"
                    }
                  />
                </div>
              </div>

              {/* RENTAL PRICING DETAILS */}
              <CarPricingDetails
                car={car}
                rentalMode={rentalMode}
              />

              {/* REGISTRATION */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-500">
                    Registration
                  </span>

                  <span className="text-sm font-bold text-white">
                    {car.registrationNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOOKING */}
        <button
          type="button"
          disabled={!isAvailable}
          onClick={() => onBook(car.id)}
          className={`
            mt-5 w-full rounded-2xl
            px-5 py-3.5
            text-sm font-black
            transition-all duration-200
            ${
              isAvailable
                ? `
                  bg-yellow-300
                  text-black
                  hover:bg-yellow-200
                  active:scale-[0.98]
                `
                : `
                  cursor-not-allowed
                  border border-white/10
                  bg-white/5
                  text-gray-600
                `
            }
          `}
        >
          {isAvailable
            ? bookingLabel
            : "Currently Unavailable"}
        </button>
      </div>
    </article>
  );
}

function Spec({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-w-0 px-2 text-center sm:px-3">
      <p className="truncate text-[9px] font-bold uppercase tracking-wider text-gray-600 sm:text-[10px]">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-gray-200 sm:text-sm">
        {value}
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold capitalize text-gray-200">
        {value}
      </p>
    </div>
  );
}


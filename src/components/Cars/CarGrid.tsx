
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { getCars } from "../../lib/apis/apis";
import { useAuth } from "../../context/AuthContext";

import CarCard from "./CarCard";
import type {
  Car,
  RentalMode,
} from "./car.types";
import { RootState } from "@//redux/store";

interface CarGridProps {
  rentalMode: RentalMode;
}

const PAGE_CONTENT = {
  SELF_DRIVE: {
    label: "Our Fleet",
    title: "Find your",
    highlight: "perfect ride.",
    description:
      "Choose from our collection of well-maintained cars available for self-drive journeys.",
  },

  WITH_DRIVER: {
    label: "Our Fleet",
    title: "Ride with",
    highlight: "a professional driver.",
    description:
      "Choose from our collection of comfortable cars available with professional driver service.",
  },
};

export default function CarGrid({
  rentalMode,
}: CarGridProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

   const searchFilters = useSelector(
    (state: RootState) => state.search
  );


  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  const content =
    PAGE_CONTENT[rentalMode];

  // ============================================================
  // FETCH CARS
  // ============================================================

  useEffect(() => {
  const fetchCars = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCars(
        searchFilters.dateFrom,
        searchFilters.dateTo
      );

      console.log("Cars API response:", response);

      const allCars: Car[] =
        response.data || [];

      const filteredCars = allCars.filter((car) => {
        if (rentalMode === "SELF_DRIVE") {
          return (
            car.rentalType === "SELF_DRIVE" ||
            car.rentalType === "BOTH"
          );
        }

        return (
          car.rentalType === "WITH_DRIVER" ||
          car.rentalType === "BOTH"
        );
      });

      setCars(filteredCars);
    } catch (error) {
      console.error("Failed to fetch cars:", error);

      setError(
        "Unable to load cars. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchCars();
}, [
  rentalMode,
  searchFilters.dateFrom,
  searchFilters.dateTo,
]);
  // ============================================================
  // BOOKING HANDLER
  // ============================================================

  const handleBookCar = (
    carId: string
  ) => {
    const bookingPath =
      rentalMode === "SELF_DRIVE"
        ? `/booking/${carId}`
        : `/booking/${carId}`;

    if (!user) {
      navigate("/login-signup", {
        state: {
          redirectTo: bookingPath,
        },
      });

      return;
    }

    navigate(bookingPath);
  };

  return (
    <section className="min-h-screen bg-black px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-300" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
                {content.label}
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {content.title}{" "}
              <span className="text-yellow-300">
                {content.highlight}
              </span>
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
              {content.description}
            </p>
          </div>

          {!loading && !error && (
            <div className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-gray-300">
              <span className="text-yellow-300">
                {cars.length}
              </span>{" "}
              {cars.length === 1
                ? "car"
                : "cars"}{" "}
              available
            </div>
          )}
        </div>

        {/* LOADING */}

        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]"
                >
                  <div className="aspect-[16/10] animate-pulse bg-white/10" />

                  <div className="space-y-4 p-5">
                    <div className="h-14 animate-pulse rounded-2xl bg-white/5" />

                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
                      <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
                      <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
                    </div>

                    <div className="h-12 animate-pulse rounded-2xl bg-white/10" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="rounded-3xl border border-red-400/20 bg-white/[0.025] px-6 py-20 text-center">
            <h3 className="text-xl font-bold text-white">
              Something went wrong
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-xl bg-yellow-300 px-6 py-3 text-sm font-bold text-black transition hover:bg-yellow-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          cars.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] px-6 py-20 text-center">
              <h3 className="text-xl font-bold text-white">
                No cars available
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Please check again later for available vehicles.
              </p>
            </div>
          )}

        {/* GRID */}

        {!loading &&
          !error &&
          cars.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
              {cars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  rentalMode={
                    rentalMode
                  }
                  onBook={
                    handleBookCar
                  }
                />
              ))}
            </div>
          )}
      </div>
    </section>
  );
}


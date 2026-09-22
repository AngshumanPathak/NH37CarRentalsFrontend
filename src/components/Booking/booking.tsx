
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  format,
  isSameDay,
  startOfDay,
} from "date-fns";

import { getCars } from "../../lib/apis/apis";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

import TimePicker from "../shared/TimePicker";

import {
  checkBookingAvailability,
  createBooking,
} from "../../lib/apis/booking.api";

import {
  uploadBookingDocuments,
} from "../../lib/apis/upload.api";

interface CarImage {
  id?: string;
  url: string;
  publicId: string;
}

interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year?: number | null;
  registrationNumber: string;
  description?: string | null;

  status: string;

  pricePerDaySelfDrive: number | string;
  pricePerHourSelfDrive?: number | string | null;
  securityDepositSelfDrive?: number | string | null;

  seats?: number | null;
  transmission?: string | null;
  fuelType?: string | null;

  images: CarImage[];
}

type LocationOption = "OFFICE" | "CUSTOM";

const OFFICE_LOCATION = "NH37 Car Rentals Office";

const formatPrice = (
  price: number | string | null | undefined
) => {
  if (price === null || price === undefined) {
    return "—";
  }

  return `₹${Number(price).toLocaleString("en-IN")}`;
};

const formatDisplayTime = (time: string) => {
  if (!time) return "—";

  const [hours, minutes] = time.split(":").map(Number);

  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(
    2,
    "0"
  )} ${suffix}`;
};

const timeToMinutes = (time: string) => {
  if (!time) return -1;

  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const combineDateAndTime = (
  date: Date,
  time: string
) => {
  const [hours, minutes] = time.split(":").map(Number);

  const result = new Date(date);

  result.setHours(hours, minutes, 0, 0);

  return result;
};

const roundUpToNextHalfHour = (date: Date) => {
  const result = new Date(date);

  result.setSeconds(0, 0);

  const minutes = result.getMinutes();

  if (minutes === 0 || minutes === 30) {
    return result;
  }

  if (minutes < 30) {
    result.setMinutes(30);
  } else {
    result.setHours(result.getHours() + 1);
    result.setMinutes(0);
  }

  return result;
};

const getTimeString = (date: Date) => {
  return `${String(date.getHours()).padStart(
    2,
    "0"
  )}:${String(date.getMinutes()).padStart(2, "0")}`;
};

export default function Booking() {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();

  const [car, setCar] = useState<Car | null>(null);
  const [isLoadingCar, setIsLoadingCar] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOCATION STATE
  // ============================================================

  const [pickupLocationType, setPickupLocationType] =
    useState<LocationOption>("OFFICE");

  const [dropLocationType, setDropLocationType] =
    useState<LocationOption>("OFFICE");

  const [customPickupLocation, setCustomPickupLocation] =
    useState("");

  const [customDropLocation, setCustomDropLocation] =
    useState("");

  // ============================================================
  // DATE / TIME STATE
  // ============================================================

  const [pickupDate, setPickupDate] =
    useState<Date | undefined>();

  const [returnDate, setReturnDate] =
    useState<Date | undefined>();

  const [pickupTime, setPickupTime] = useState("");
  const [returnTime, setReturnTime] = useState("");

  // ============================================================
  // FORM STATE
  // ============================================================

  const [formError, setFormError] = useState("");

  // ============================================================
  // DOCUMENT STATE
  // ============================================================

  const [drivingLicenseFile, setDrivingLicenseFile] =
    useState<File | null>(null);

  const [aadhaarFile, setAadhaarFile] =
    useState<File | null>(null);

  const [voterIdFile, setVoterIdFile] =
    useState<File | null>(null);

  const [documentError, setDocumentError] =
    useState("");

  // ============================================================
  // AVAILABILITY / BOOKING STATE
  // ============================================================

  interface BookingPricing {
    rentalAmount: string | number;
    securityDeposit: string | number;
    totalAmount: string | number;

    fullDays: number;
    remainingHours: number;

    pricePerDay: string | number;
    pricePerHour: string | number | null;
  }

  const [pricing, setPricing] =
    useState<BookingPricing | null>(null);

  const [isAvailable, setIsAvailable] =
    useState(false);

  const [availabilityError, setAvailabilityError] =
    useState("");

  const [isCheckingAvailability, setIsCheckingAvailability] =
    useState(false);

  const [isCreatingBooking, setIsCreatingBooking] =
    useState(false);

  // ============================================================
  // LOAD SELECTED CAR
  // ============================================================

  useEffect(() => {
    const loadSelectedCar = async () => {
      if (!carId) {
        setError("No car was selected.");
        setIsLoadingCar(false);
        return;
      }

      try {
        setIsLoadingCar(true);
        setError("");

        const response = await getCars();

        console.log(
          "Booking cars response:",
          response
        );

        const cars: Car[] = response.data || [];

        const selectedCar = cars.find(
          (item) => item.id === carId
        );

        if (!selectedCar) {
          setError(
            "The selected car could not be found."
          );

          setCar(null);
          return;
        }

        setCar(selectedCar);
      } catch (error) {
        console.error(
          "Failed to load selected car:",
          error
        );

        setError(
          "Unable to load the selected car. Please try again."
        );
      } finally {
        setIsLoadingCar(false);
      }
    };

    loadSelectedCar();
  }, [carId]);

  // ============================================================
  // INITIAL DEFAULT DATE
  // ============================================================

  useEffect(() => {
    const now = new Date();

    const defaultPickupDate = startOfDay(now);

    setPickupDate(defaultPickupDate);
    setReturnDate(defaultPickupDate);

    const nextHalfHour =
      roundUpToNextHalfHour(now);

    setPickupTime(
      getTimeString(nextHalfHour)
    );

    const nextReturn = new Date(nextHalfHour);

    nextReturn.setMinutes(
      nextReturn.getMinutes() + 60
    );

    setReturnTime(
      getTimeString(nextReturn)
    );
  }, []);

  // ============================================================
  // RESET AVAILABILITY WHEN TRIP DETAILS CHANGE
  // ============================================================

  useEffect(() => {
    setIsAvailable(false);
    setPricing(null);
    setAvailabilityError("");
  }, [
    pickupDate,
    returnDate,
    pickupTime,
    returnTime,
  ]);

  // ============================================================
  // TODAY
  // ============================================================

  const today = useMemo(
    () => startOfDay(new Date()),
    []
  );

  // ============================================================
  // DATE VALIDATION
  // ============================================================

  const disablePickupDate = (date: Date) => {
    return date < today;
  };

  const disableReturnDate = (date: Date) => {
    if (date < today) {
      return true;
    }

    if (!pickupDate) {
      return false;
    }

    return (
      date < startOfDay(pickupDate)
    );
  };

  // ============================================================
  // PICKUP TIME VALIDATION
  // ============================================================

  const isPickupTimeDisabled = (
    time: string
  ) => {
    if (!pickupDate) {
      return false;
    }

    const now = new Date();

    if (isSameDay(pickupDate, now)) {
      const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();

      return (
        timeToMinutes(time) <=
        currentMinutes
      );
    }

    return false;
  };

  // ============================================================
  // RETURN TIME VALIDATION
  // ============================================================

  const isReturnTimeDisabled = (
    time: string
  ) => {
    if (!returnDate) {
      return false;
    }

    // Same-day booking:
    // return must be AFTER pickup time.
    if (
      pickupDate &&
      isSameDay(
        returnDate,
        pickupDate
      )
    ) {
      if (!pickupTime) {
        return false;
      }

      return (
        timeToMinutes(time) <=
        timeToMinutes(pickupTime)
      );
    }

    return false;
  };

  // ============================================================
  // PICKUP DATE CHANGE
  // ============================================================

  const handlePickupDateChange = (
    date: Date | undefined
  ) => {
    setFormError("");

    if (!date) {
      setPickupDate(undefined);
      setPickupTime("");
      return;
    }

    setPickupDate(date);

    // If return date is before pickup date,
    // automatically move return date to pickup date.
    if (
      returnDate &&
      startOfDay(returnDate) <
        startOfDay(date)
    ) {
      setReturnDate(date);
      setReturnTime("");
    }

    // If selected pickup date is today and
    // existing pickup time is now invalid, clear it.
    if (
      isSameDay(date, new Date()) &&
      pickupTime &&
      isPickupTimeDisabled(pickupTime)
    ) {
      setPickupTime("");
    }
  };

  // ============================================================
  // PICKUP TIME CHANGE
  // ============================================================

  const handlePickupTimeChange = (
    time: string
  ) => {
    setFormError("");

    if (isPickupTimeDisabled(time)) {
      return;
    }

    setPickupTime(time);

    // If pickup and return are the same day,
    // invalidate an earlier/equal return time.
    if (
      pickupDate &&
      returnDate &&
      isSameDay(
        pickupDate,
        returnDate
      ) &&
      returnTime &&
      timeToMinutes(returnTime) <=
        timeToMinutes(time)
    ) {
      setReturnTime("");
    }
  };

  // ============================================================
  // RETURN DATE CHANGE
  // ============================================================

  const handleReturnDateChange = (
    date: Date | undefined
  ) => {
    setFormError("");

    if (!date) {
      setReturnDate(undefined);
      setReturnTime("");
      return;
    }

    setReturnDate(date);

    // Same-day return needs a time later than pickup.
    if (
      pickupDate &&
      isSameDay(
        date,
        pickupDate
      ) &&
      returnTime &&
      pickupTime &&
      timeToMinutes(returnTime) <=
        timeToMinutes(pickupTime)
    ) {
      setReturnTime("");
    }
  };

  // ============================================================
  // LOCATION VALUES
  // ============================================================

  const pickupLocation =
    pickupLocationType === "OFFICE"
      ? OFFICE_LOCATION
      : customPickupLocation.trim();

  const dropLocation =
    dropLocationType === "OFFICE"
      ? OFFICE_LOCATION
      : customDropLocation.trim();

  // ============================================================
  // COMBINED DATE/TIME
  // ============================================================

  const pickupAt = useMemo(() => {
    if (!pickupDate || !pickupTime) {
      return null;
    }

    return combineDateAndTime(
      pickupDate,
      pickupTime
    );
  }, [
    pickupDate,
    pickupTime,
  ]);

  const returnAt = useMemo(() => {
    if (!returnDate || !returnTime) {
      return null;
    }

    return combineDateAndTime(
      returnDate,
      returnTime
    );
  }, [
    returnDate,
    returnTime,
  ]);

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateBooking = () => {
    setFormError("");

    if (!pickupLocation) {
      setFormError(
        "Please enter a pickup location."
      );

      return false;
    }

    if (!dropLocation) {
      setFormError(
        "Please enter a drop location."
      );

      return false;
    }

    if (!pickupDate) {
      setFormError(
        "Please select a pickup date."
      );

      return false;
    }

    if (!returnDate) {
      setFormError(
        "Please select a return date."
      );

      return false;
    }

    if (!pickupTime) {
      setFormError(
        "Please select a pickup time."
      );

      return false;
    }

    if (!returnTime) {
      setFormError(
        "Please select a return time."
      );

      return false;
    }

    if (!pickupAt || !returnAt) {
      setFormError(
        "Please select valid pickup and return times."
      );

      return false;
    }

    if (pickupAt <= new Date()) {
      setFormError(
        "Pickup time must be in the future."
      );

      return false;
    }

    if (returnAt <= pickupAt) {
      setFormError(
        "Return date and time must be after pickup date and time."
      );

      return false;
    }

    return true;
  };

  // ============================================================
  // CHECK AVAILABILITY
  // ============================================================

  const handleCheckAvailability =
    async () => {
      if (!validateBooking()) {
        return;
      }

      if (
        !carId ||
        !pickupAt ||
        !returnAt
      ) {
        return;
      }

      try {
        setIsCheckingAvailability(true);

        setFormError("");
        setAvailabilityError("");
        setPricing(null);
        setIsAvailable(false);

        const availabilityPayload = {
          carId,
          rentalType: "SELF_DRIVE" as const,
          pickupAt:
            pickupAt.toISOString(),
          returnAt:
            returnAt.toISOString(),
        };

        console.log(
          "Checking booking availability:",
          availabilityPayload
        );

        const response =
          await checkBookingAvailability(
            availabilityPayload
          );

        console.log(
          "Availability response:",
          response
        );

        if (!response.available) {
          setAvailabilityError(
            response.reason ||
              "This car is not available for the selected dates and time."
          );

          return;
        }

        setIsAvailable(true);

        if (response.pricing) {
          setPricing(
            response.pricing
          );
        }
      } catch (error: any) {
        console.error(
          "Availability check failed:",
          error
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error ||
          "Unable to check car availability. Please try again.";

        setAvailabilityError(
          message
        );
      } finally {
        setIsCheckingAvailability(
          false
        );
      }
    };

  // ============================================================
  // CREATE BOOKING
  // ============================================================

  const handleCreateBooking =
    async () => {
      if (!validateBooking()) {
        return;
      }

      if (
        !carId ||
        !pickupAt ||
        !returnAt
      ) {
        return;
      }

      /*
       * Availability must have been checked first.
       */
      if (!isAvailable) {
        setFormError(
          "Please check availability before reserving the car."
        );

        return;
      }

      // ========================================================
      // DRIVING LICENSE VALIDATION
      // ========================================================

      if (!drivingLicenseFile) {
        setDocumentError(
          "Driving License is required to reserve the car."
        );

        return;
      }

      try {
        setIsCreatingBooking(true);

        setFormError("");
        setAvailabilityError("");
        setDocumentError("");

        // ======================================================
        // STEP 1: UPLOAD DOCUMENTS
        // ======================================================

        console.log(
          "Uploading booking documents..."
        );

        const uploadedDocuments =
          await uploadBookingDocuments({
            drivingLicense:
              drivingLicenseFile,
            aadhaar: aadhaarFile,
            voterId: voterIdFile,
          });

        console.log(
          "Documents uploaded:",
          uploadedDocuments
        );

        // ======================================================
        // STEP 2: CREATE BOOKING
        // ======================================================

        const bookingPayload = {
          carId,
          rentalType:
            "SELF_DRIVE" as const,

          pickupLocation,
          dropLocation,

          pickupAt:
            pickupAt.toISOString(),

          returnAt:
            returnAt.toISOString(),

          documents:
            uploadedDocuments,
        };

        console.log(
          "Creating booking:",
          bookingPayload
        );

        const response =
          await createBooking(
            bookingPayload
          );

        console.log(
          "Booking created:",
          response
        );

        const booking =
          response.data?.booking;
          
          if (!booking?.id) {
  throw new Error(
    "Booking was created but no booking ID was returned."
  );
}


        /*
         * Backend recalculates pricing during creation.
         *
         * Therefore we deliberately do NOT calculate
         * the final amount on the frontend.
         */

        navigate(
          `/bookings/${booking.id}/confirmation`
        );
      } catch (error: any) {
        console.error(
          "Booking creation failed:",
          error
        );

        /*
         * Backend may reject the booking if another
         * booking was created between availability
         * check and reservation.
         */

        if (
          error?.response?.status ===
          409
        ) {
          setIsAvailable(false);
          setPricing(null);

          setAvailabilityError(
            error?.response?.data
              ?.message ||
              "This car is no longer available for the selected time."
          );

          return;
        }

        const message =
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error ||
          error?.message ||
          "Unable to create your booking. Please try again.";

        setFormError(message);
      } finally {
        setIsCreatingBooking(
          false
        );
      }
    };

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoadingCar) {
    return (
      <section className="min-h-screen bg-black px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto mt-30 max-w-6xl">
          <div className="mb-8">
            <div className="h-3 w-32 animate-pulse rounded bg-white/10" />

            <div className="mt-3 h-10 w-72 animate-pulse rounded bg-white/10" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
            <div className="aspect-[16/8] animate-pulse bg-white/10" />

            <div className="space-y-4 p-6">
              <div className="h-8 w-64 animate-pulse rounded bg-white/10" />

              <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-white/5" />

              <div className="grid grid-cols-3 gap-3">
                <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
                <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
                <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !car) {
    return (
      <section className="min-h-screen bg-black px-4 py-20 text-white sm:px-6">
        <div className="mx-auto mt-30 max-w-xl text-center">
          <div className="rounded-3xl border border-red-400/20 bg-white/[0.025] px-6 py-16">
            <h1 className="text-2xl font-bold">
              Car Not Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {error ||
                "The selected vehicle is no longer available."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/self-drive"
                )
              }
              className="mt-6 rounded-xl bg-yellow-300 px-6 py-3 text-sm font-black text-black transition hover:bg-yellow-200"
            >
              Back to Cars
            </button>
          </div>
        </div>
      </section>
    );
  }

  const mainImage =
    car.images?.[0]?.url ||
    "https://placehold.co/800x500/111111/FDE047?text=No+Image";

  // ============================================================
  // UI
  // ============================================================

  return (
    <section className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto mt-30 max-w-6xl">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/self-drive"
              )
            }
            className="mb-5 text-sm font-semibold text-gray-500 transition hover:text-yellow-300"
          >
            ← Back to cars
          </button>

          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-300" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
              Booking
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Book your{" "}
            <span className="text-yellow-300">
              ride.
            </span>
          </h1>

          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            Complete the details below to reserve your vehicle.
          </p>
        </div>

        {/* =====================================================
            SELECTED CAR
        ===================================================== */}

        <div className="mb-8 overflow-hidden rounded-3xl border border-yellow-300/20 bg-white/[0.025] shadow-2xl shadow-black/20">

          {/* IMAGE */}

          <div className="relative aspect-[16/8] overflow-hidden bg-zinc-900 sm:aspect-[16/6]">
            <img
              src={mainImage}
              alt={`${car.brand} ${car.model}`}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
              <span className="rounded-full border border-yellow-300/30 bg-black/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-yellow-300 backdrop-blur-md sm:text-xs">
                Selected Vehicle
              </span>
            </div>

            {car.images &&
              car.images.length > 1 && (
                <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
                  <span className="rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md sm:text-xs">
                    {car.images.length} Photos
                  </span>
                </div>
              )}

            <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-yellow-300">
                {car.brand}
              </p>

              <h2 className="mt-1 text-3xl font-black text-white sm:text-4xl">
                {car.model}
              </h2>

              {car.year && (
                <p className="mt-1 text-sm text-gray-300">
                  {car.year}
                </p>
              )}
            </div>
          </div>

          {/* CAR INFORMATION */}

          <div className="p-5 sm:p-7">
            {car.description && (
              <p className="mb-5 max-w-3xl text-sm leading-6 text-gray-400">
                {car.description}
              </p>
            )}

            <div className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.025] py-4">
              <BookingSpec
                label="Seats"
                value={
                  car.seats
                    ? String(car.seats)
                    : "—"
                }
              />

              <BookingSpec
                label="Fuel"
                value={
                  car.fuelType || "—"
                }
              />

              <BookingSpec
                label="Gear"
                value={
                  car.transmission ||
                  "—"
                }
              />
            </div>

            <div className="mt-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/[0.06] p-4">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
                    Self Drive
                  </p>

                  <p className="mt-1 text-2xl font-black text-yellow-300">
                    {formatPrice(
                      car.pricePerDaySelfDrive
                    )}
                  </p>

                  <p className="text-xs text-gray-500">
                    per day
                  </p>
                </div>

                {car.pricePerHourSelfDrive !==
                  null &&
                  car.pricePerHourSelfDrive !==
                    undefined && (
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
                        Hourly
                      </p>

                      <p className="mt-1 text-xl font-bold text-white">
                        {formatPrice(
                          car.pricePerHourSelfDrive
                        )}
                      </p>

                      <p className="text-xs text-gray-500">
                        per hour
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOOKING FORM
        ===================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">

          {/* ===================================================
              LEFT
          =================================================== */}

          <div className="space-y-6">

            {/* =================================================
                TRIP DETAILS
            ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">

              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-300">
                  Step 1
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Trip Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Tell us when and where you want the car.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                {/* PICKUP LOCATION */}

                <LocationSelector
                  label="Pickup Location"
                  type={
                    pickupLocationType
                  }
                  setType={
                    setPickupLocationType
                  }
                  customValue={
                    customPickupLocation
                  }
                  setCustomValue={
                    setCustomPickupLocation
                  }
                />

                {/* DROP LOCATION */}

                <LocationSelector
                  label="Drop Location"
                  type={
                    dropLocationType
                  }
                  setType={
                    setDropLocationType
                  }
                  customValue={
                    customDropLocation
                  }
                  setCustomValue={
                    setCustomDropLocation
                  }
                />

                {/* PICKUP DATE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    Pickup Date
                  </label>

                  <Popover>
                    <PopoverTrigger
                      asChild
                    >
                      <Button
                        variant="outline"
                        className={cn(
                          "h-12 w-full justify-start rounded-xl border-white/10 bg-black px-4 text-left font-normal text-white hover:bg-white/[0.04] hover:text-white",
                          !pickupDate &&
                            "text-gray-600"
                        )}
                      >
                        <span className="mr-2">
                          📅
                        </span>

                        {pickupDate ? (
                          format(
                            pickupDate,
                            "PPP"
                          )
                        ) : (
                          <span>
                            Select pickup date
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto border-white/10 bg-zinc-950 p-0 text-white"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          pickupDate
                        }
                        onSelect={
                          handlePickupDateChange
                        }
                        disabled={
                          disablePickupDate
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* PICKUP TIME */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    Pickup Time
                  </label>

                  <TimePicker
                    value={
                      pickupTime
                    }
                    onChange={
                      handlePickupTimeChange
                    }
                    disabled={
                      !pickupDate
                    }
                    isTimeDisabled={
                      isPickupTimeDisabled
                    }
                  />
                </div>

                {/* RETURN DATE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    Return Date
                  </label>

                  <Popover>
                    <PopoverTrigger
                      asChild
                    >
                      <Button
                        variant="outline"
                        className={cn(
                          "h-12 w-full justify-start rounded-xl border-white/10 bg-black px-4 text-left font-normal text-white hover:bg-white/[0.04] hover:text-white",
                          !returnDate &&
                            "text-gray-600"
                        )}
                      >
                        <span className="mr-2">
                          📅
                        </span>

                        {returnDate ? (
                          format(
                            returnDate,
                            "PPP"
                          )
                        ) : (
                          <span>
                            Select return date
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto border-white/10 bg-zinc-950 p-0 text-white"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          returnDate
                        }
                        onSelect={
                          handleReturnDateChange
                        }
                        disabled={
                          disableReturnDate
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* RETURN TIME */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    Return Time
                  </label>

                  <TimePicker
                    value={
                      returnTime
                    }
                    onChange={
                      setReturnTime
                    }
                    disabled={
                      !returnDate
                    }
                    isTimeDisabled={
                      isReturnTimeDisabled
                    }
                  />
                </div>
              </div>

              {/* SELECTED TRIP PREVIEW */}

              {(pickupAt ||
                returnAt) && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-300">
                    Your Trip
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TripPreview
                      label="Pickup"
                      location={
                        pickupLocation ||
                        "Not selected"
                      }
                      date={
                        pickupDate
                          ? format(
                              pickupDate,
                              "dd MMM yyyy"
                            )
                          : "—"
                      }
                      time={
                        pickupTime
                          ? formatDisplayTime(
                              pickupTime
                            )
                          : "—"
                      }
                    />

                    <TripPreview
                      label="Return"
                      location={
                        dropLocation ||
                        "Not selected"
                      }
                      date={
                        returnDate
                          ? format(
                              returnDate,
                              "dd MMM yyyy"
                            )
                          : "—"
                      }
                      time={
                        returnTime
                          ? formatDisplayTime(
                              returnTime
                            )
                          : "—"
                      }
                    />
                  </div>
                </div>
              )}

              {/* FORM ERROR */}

              {formError && (
                <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300">
                  {formError}
                </div>
              )}
            </div>

            {/* =================================================
                DOCUMENTS
            ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">

              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-300">
                  Step 2
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Verification Documents
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Upload clear images or PDF documents for verification.
                  Driving License is required.
                </p>
              </div>

              <div className="space-y-4">

                <DocumentUpload
                  label="Driving License"
                  required
                  file={
                    drivingLicenseFile
                  }
                  onFileSelect={(
                    file
                  ) => {
                    setDrivingLicenseFile(
                      file
                    );
                    setDocumentError(
                      ""
                    );
                  }}
                />

                <DocumentUpload
                  label="Aadhaar Card"
                  file={
                    aadhaarFile
                  }
                  onFileSelect={
                    setAadhaarFile
                  }
                />

                <DocumentUpload
                  label="Voter ID"
                  file={
                    voterIdFile
                  }
                  onFileSelect={
                    setVoterIdFile
                  }
                />
              </div>

              {documentError && (
                <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300">
                  {documentError}
                </div>
              )}
            </div>
          </div>

          {/* ===================================================
              RIGHT
          =================================================== */}

          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6 lg:sticky lg:top-6">

            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-300">
              Booking Summary
            </p>

            <h2 className="mt-2 text-xl font-bold">
              {car.brand}{" "}
              {car.model}
            </h2>

            <div className="mt-5 space-y-3 border-t border-white/10 pt-5">

              <SummaryRow
                label="Rental Type"
                value="Self Drive"
              />

              <SummaryRow
                label="Daily Rate"
                value={formatPrice(
                  car.pricePerDaySelfDrive
                )}
              />

              <SummaryRow
                label="Pickup"
                value={
                  pickupLocation ||
                  "Not selected"
                }
              />

              <SummaryRow
                label="Return"
                value={
                  dropLocation ||
                  "Not selected"
                }
              />

              <SummaryRow
                label="Pickup Date"
                value={
                  pickupDate
                    ? format(
                        pickupDate,
                        "dd MMM yyyy"
                      )
                    : "Not selected"
                }
              />

              <SummaryRow
                label="Pickup Time"
                value={
                  pickupTime
                    ? formatDisplayTime(
                        pickupTime
                      )
                    : "Not selected"
                }
              />

              <SummaryRow
                label="Return Date"
                value={
                  returnDate
                    ? format(
                        returnDate,
                        "dd MMM yyyy"
                      )
                    : "Not selected"
                }
              />

              <SummaryRow
                label="Return Time"
                value={
                  returnTime
                    ? formatDisplayTime(
                        returnTime
                      )
                    : "Not selected"
                }
              />

              <SummaryRow
                label="Security Deposit"
                value={
                  pricing
                    ? formatPrice(
                        pricing.securityDeposit
                      )
                    : formatPrice(
                        car.securityDepositSelfDrive
                      )
                }
              />
            </div>

            {/* PRICING */}

            <div className="mt-5 border-t border-white/10 pt-5">
              {pricing ? (
                <div className="space-y-3">

                  <SummaryRow
                    label="Rental Amount"
                    value={formatPrice(
                      pricing.rentalAmount
                    )}
                  />

                  <SummaryRow
                    label="Security Deposit"
                    value={formatPrice(
                      pricing.securityDeposit
                    )}
                  />

                  <div className="border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-400">
                        Total
                      </span>

                      <span className="text-2xl font-black text-yellow-300">
                        {formatPrice(
                          pricing.totalAmount
                        )}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs leading-5 text-gray-600">
                    Final amount calculated by NH37 Car Rentals.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-400">
                    Total
                  </span>

                  <span className="text-xl font-black text-yellow-300">
                    —
                  </span>
                </div>
              )}
            </div>

            {/* AVAILABILITY ERROR */}

            {availabilityError && (
              <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm leading-5 text-red-300">
                {availabilityError}
              </div>
            )}

            {/* ACTION BUTTON */}

            <button
              type="button"
              disabled={
                isCheckingAvailability ||
                isCreatingBooking
              }
              onClick={
                isAvailable
                  ? handleCreateBooking
                  : handleCheckAvailability
              }
              className={cn(
                "mt-6 w-full rounded-2xl px-5 py-4 text-sm font-black transition active:scale-[0.98]",
                "disabled:cursor-not-allowed disabled:opacity-60",
                isAvailable
                  ? "bg-green-400 text-black hover:bg-green-300"
                  : "bg-yellow-300 text-black hover:bg-yellow-200"
              )}
            >
              {isCheckingAvailability
                ? "Checking Availability..."
                : isCreatingBooking
                ? "Uploading Documents..."
                : isAvailable
                ? "Reserve Car"
                : "Check Availability"}
            </button>

            <p className="mt-3 text-center text-[10px] leading-5 text-gray-600">
              Your booking will remain pending until NH37 Car Rentals verifies and confirms it.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// LOCATION SELECTOR
// ============================================================

function LocationSelector({
  label,
  type,
  setType,
  customValue,
  setCustomValue,
}: {
  label: string;
  type: LocationOption;
  setType: (
    value: LocationOption
  ) => void;
  customValue: string;
  setCustomValue: (
    value: string
  ) => void;
}) {
  return (
    <div className="sm:col-span-2">
      <label className="mb-2 block text-sm font-semibold text-gray-300">
        {label}
      </label>

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black p-1">

        <button
          type="button"
          onClick={() =>
            setType("OFFICE")
          }
          className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
            type === "OFFICE"
              ? "bg-yellow-300 text-black"
              : "text-gray-500 hover:bg-white/[0.04] hover:text-white"
          }`}
        >
          NH37 Office
        </button>

        <button
          type="button"
          onClick={() =>
            setType("CUSTOM")
          }
          className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
            type === "CUSTOM"
              ? "bg-yellow-300 text-black"
              : "text-gray-500 hover:bg-white/[0.04] hover:text-white"
          }`}
        >
          Custom Location
        </button>
      </div>

      {type === "OFFICE" ? (
        <div className="mt-2 rounded-xl border border-white/10 bg-black/50 px-4 py-3.5 text-sm text-gray-300">
          {OFFICE_LOCATION}
        </div>
      ) : (
        <input
          type="text"
          value={customValue}
          onChange={(event) =>
            setCustomValue(
              event.target.value
            )
          }
          placeholder="Enter your location"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-300/50"
        />
      )}
    </div>
  );
}

// ============================================================
// TRIP PREVIEW
// ============================================================

function TripPreview({
  label,
  location,
  date,
  time,
}: {
  label: string;
  location: string;
  date: string;
  time: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-600">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-white">
        {location}
      </p>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
        <span>{date}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}

// ============================================================
// BOOKING SPEC
// ============================================================

function BookingSpec({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="px-3 text-center">
      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-gray-200">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// DOCUMENT UPLOAD
// ============================================================

function DocumentUpload({
  label,
  required = false,
  file,
  onFileSelect,
}: {
  label: string;
  required?: boolean;
  file: File | null;
  onFileSelect: (
    file: File | null
  ) => void;
}) {
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {
      alert(
        "Only JPG, PNG, WEBP or PDF files are allowed."
      );

      event.target.value = "";

      return;
    }

    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {
      alert(
        "File size must be less than 5 MB."
      );

      event.target.value = "";

      return;
    }

    onFileSelect(
      selectedFile
    );
  };

  const handleRemove = () => {
    onFileSelect(null);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">

      <div className="mb-3 flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-gray-300">
          {label}

          {required && (
            <span className="ml-1 text-yellow-300">
              *
            </span>
          )}
        </label>

        <span className="text-[10px] text-gray-600">
          JPG / PNG / WEBP / PDF
        </span>
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={
          handleFileChange
        }
        className="
          block w-full
          cursor-pointer
          text-xs text-gray-500
          file:mr-4
          file:rounded-lg
          file:border-0
          file:bg-yellow-300
          file:px-4
          file:py-2
          file:text-xs
          file:font-bold
          file:text-black
          hover:file:bg-yellow-200
        "
      />

      {file && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-green-400/20 bg-green-400/[0.05] px-3 py-2">

          <p className="min-w-0 truncate text-xs text-green-300">
            {file.name}
          </p>

          <button
            type="button"
            onClick={
              handleRemove
            }
            className="shrink-0 text-xs font-semibold text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        </div>
      )}

      <p className="mt-2 text-[10px] text-gray-600">
        Maximum file size: 5 MB
      </p>
    </div>
  );
}

// ============================================================
// SUMMARY ROW
// ============================================================

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-sm text-gray-500">
        {label}
      </span>

      <span className="max-w-[210px] text-right text-sm font-bold text-gray-200">
        {value}
      </span>
    </div>
  );
}

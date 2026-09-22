import React, { useRef, useState } from "react";
import api from "../../lib/apis/apis.ts";
import { uploadCarImages } from "@//lib/apis/upload.api.ts";

type RentalType =
  | "SELF_DRIVE"
  | "WITH_DRIVER"
  | "BOTH";

interface CarFormData {
  name: string;
  brand: string;
  model: string;
  year: string;
  registrationNumber: string;
  description: string;

  pricePerDaySelfDrive: string;
  pricePerHourSelfDrive: string;
  securityDepositSelfDrive: string;

  pricePerDayWithDriver: string;
  pricePerHourWithDriver: string;
  securityDepositWithDriver: string;

  seats: string;
  transmission: string;
  fuelType: string;

  rentalType: RentalType;
  status: string;
}

const initialForm: CarFormData = {
  name: "",
  brand: "",
  model: "",
  year: "",
  registrationNumber: "",
  description: "",

  pricePerDaySelfDrive: "",
  pricePerHourSelfDrive: "",
  securityDepositSelfDrive: "",

  pricePerDayWithDriver: "",
  pricePerHourWithDriver: "",
  securityDepositWithDriver: "",

  seats: "",
  transmission: "",
  fuelType: "",

  rentalType: "SELF_DRIVE",
  status: "AVAILABLE",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-yellow-300 focus:bg-white/[0.06]";

const labelClass =
  "mb-2 block text-sm font-medium text-gray-300";

const sectionClass =
  "rounded-2xl border border-white/10 bg-white/[0.025] p-6";

const AddCar: React.FC = () => {
  const [formData, setFormData] =
    useState<CarFormData>(initialForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFiles, setSelectedFiles] =
    useState<File[]>([]);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // HANDLE RENTAL TYPE CHANGE
  // ============================================================

  const handleRentalTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const rentalType =
      e.target.value as RentalType;

    setFormData((prev) => ({
      ...prev,
      rentalType,

      // Clear pricing that is no longer applicable
      ...(rentalType === "SELF_DRIVE"
        ? {
            pricePerDayWithDriver: "",
            pricePerHourWithDriver: "",
            securityDepositWithDriver: "",
          }
        : {}),

      ...(rentalType === "WITH_DRIVER"
        ? {
            pricePerDaySelfDrive: "",
            pricePerHourSelfDrive: "",
            securityDepositSelfDrive: "",
          }
        : {}),
    }));
  };

  // ============================================================
  // HANDLE SUBMIT
  // ============================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // ========================================================
      // 1. VALIDATE REQUIRED PRICING
      // ========================================================

      if (
        (formData.rentalType === "SELF_DRIVE" ||
          formData.rentalType === "BOTH") &&
        !formData.pricePerDaySelfDrive
      ) {
        setError(
          "Self-drive price per day is required."
        );
        setLoading(false);
        return;
      }

      if (
        (formData.rentalType === "WITH_DRIVER" ||
          formData.rentalType === "BOTH") &&
        !formData.pricePerDayWithDriver
      ) {
        setError(
          "With-driver price per day is required."
        );
        setLoading(false);
        return;
      }

      // ========================================================
      // 2. UPLOAD IMAGES
      // ========================================================

      const uploadedImages =
        selectedFiles.length > 0
          ? await uploadCarImages(selectedFiles)
          : [];

      console.log(
        "Uploaded images:",
        uploadedImages
      );

      // ========================================================
      // 3. DETERMINE ACTIVE PRICING
      // ========================================================

      const hasSelfDrivePricing =
        formData.rentalType === "SELF_DRIVE" ||
        formData.rentalType === "BOTH";

      const hasWithDriverPricing =
        formData.rentalType === "WITH_DRIVER" ||
        formData.rentalType === "BOTH";

      // ========================================================
      // 4. CREATE PAYLOAD
      // ========================================================

      const payload = {
        name: formData.name.trim(),

        brand: formData.brand.trim(),

        model: formData.model.trim(),

        rentalType: formData.rentalType,

        year: formData.year
          ? Number(formData.year)
          : null,

        registrationNumber:
          formData.registrationNumber
            .trim()
            .toUpperCase(),

        description:
          formData.description.trim() || null,

        // ======================================================
        // SELF DRIVE PRICING
        // ======================================================

        pricePerDaySelfDrive:
          hasSelfDrivePricing
            ? Number(
                formData.pricePerDaySelfDrive
              )
            : null,

        pricePerHourSelfDrive:
          hasSelfDrivePricing &&
          formData.pricePerHourSelfDrive
            ? Number(
                formData.pricePerHourSelfDrive
              )
            : null,

        securityDepositSelfDrive:
          hasSelfDrivePricing &&
          formData.securityDepositSelfDrive
            ? Number(
                formData.securityDepositSelfDrive
              )
            : null,

        // ======================================================
        // WITH DRIVER PRICING
        // ======================================================

        pricePerDayWithDriver:
          hasWithDriverPricing
            ? Number(
                formData.pricePerDayWithDriver
              )
            : null,

        pricePerHourWithDriver:
          hasWithDriverPricing &&
          formData.pricePerHourWithDriver
            ? Number(
                formData.pricePerHourWithDriver
              )
            : null,

        securityDepositWithDriver:
          hasWithDriverPricing &&
          formData.securityDepositWithDriver
            ? Number(
                formData.securityDepositWithDriver
              )
            : null,

        // ======================================================
        // SPECIFICATIONS
        // ======================================================

        seats: formData.seats
          ? Number(formData.seats)
          : null,

        transmission:
          formData.transmission || null,

        fuelType:
          formData.fuelType || null,

        status: formData.status,

        // ======================================================
        // IMAGES
        // ======================================================

        images: uploadedImages,
      };

      console.log(
        "Creating car:",
        payload
      );

      // ========================================================
      // 5. CREATE CAR
      // ========================================================

      const response = await api.post(
        "/cars",
        payload
      );

      console.log(
        "Car created:",
        response.data
      );

      setSuccess(
        response.data.message ||
          "Car added successfully!"
      );

      // ========================================================
      // 6. RESET
      // ========================================================

      setFormData(initialForm);
      setSelectedFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error(
        "Create car error:",
        error
      );

      if (error.response) {
        console.log(
          "STATUS:",
          error.response.status
        );

        console.log(
          "RESPONSE DATA:",
          error.response.data
        );

        console.log(
          "RESPONSE HEADERS:",
          error.response.headers
        );

        setError(
          error.response.data?.message ||
            "Failed to add car"
        );
      } else if (error.request) {
        console.error(
          "NO RESPONSE FROM SERVER:",
          error.request
        );

        setError(
          "Unable to connect to the server"
        );
      } else {
        console.error(
          "REQUEST SETUP ERROR:",
          error.message
        );

        setError(
          error.message ||
            "Something went wrong"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RESET FORM
  // ============================================================

  const handleReset = () => {
    setFormData(initialForm);
    setSelectedFiles([]);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================================
  // PRICING VISIBILITY
  // ============================================================

  const showSelfDrivePricing =
    formData.rentalType === "SELF_DRIVE" ||
    formData.rentalType === "BOTH";

  const showWithDriverPricing =
    formData.rentalType === "WITH_DRIVER" ||
    formData.rentalType === "BOTH";

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      {/* PAGE HEADER */}

      <div className="mx-auto mt-30 mb-8 max-w-6xl">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-300" />

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
            Fleet Management
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Add New{" "}
          <span className="text-yellow-300">
            Car
          </span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-gray-400">
          Add a vehicle to your fleet and
          configure its rental pricing,
          specifications and availability.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mx-auto mb-6 max-w-6xl rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="mx-auto mb-6 max-w-6xl rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-6xl space-y-6"
      >
        {/* ====================================================
            BASIC INFORMATION
        ==================================================== */}

        <section className={sectionClass}>
          <SectionHeader
            number="01"
            title="Basic Information"
            description="Enter the vehicle's basic details."
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelClass}>
                Car Name *
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. City Sedan"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Brand *
              </label>

              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Hyundai"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Model *
              </label>

              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Creta"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Manufacturing Year
              </label>

              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="2025"
                min="1900"
                max="2100"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Registration Number *
              </label>

              <input
                name="registrationNumber"
                value={
                  formData.registrationNumber
                }
                onChange={handleChange}
                placeholder="AS01AB1234"
                className={`${inputClass} uppercase`}
                required
              />
            </div>

            {/* RENTAL TYPE */}

            <div>
              <label className={labelClass}>
                Rental Type *
              </label>

              <select
                name="rentalType"
                value={formData.rentalType}
                onChange={
                  handleRentalTypeChange
                }
                className={inputClass}
                required
              >
                <option
                  value="SELF_DRIVE"
                  className="bg-black"
                >
                  Self Drive
                </option>

                <option
                  value="WITH_DRIVER"
                  className="bg-black"
                >
                  With Driver
                </option>

                <option
                  value="BOTH"
                  className="bg-black"
                >
                  Both
                </option>
              </select>
            </div>

            {/* STATUS */}

            <div>
              <label className={labelClass}>
                Availability Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option
                  value="AVAILABLE"
                  className="bg-black"
                >
                  Available
                </option>

                <option
                  value="MAINTENANCE"
                  className="bg-black"
                >
                  Maintenance
                </option>

                <option
                  value="OUT_OF_SERVICE"
                  className="bg-black"
                >
                  Out of Service
                </option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className={labelClass}>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the car, its condition, features, etc."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>
        </section>

        {/* ====================================================
            VEHICLE SPECIFICATIONS
        ==================================================== */}

        <section className={sectionClass}>
          <SectionHeader
            number="02"
            title="Vehicle Specifications"
            description="Configure the vehicle's technical specifications."
          />

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className={labelClass}>
                Number of Seats
              </label>

              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                placeholder="5"
                min="1"
                max="50"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Transmission
              </label>

              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className={inputClass}
              >
                <option
                  value=""
                  className="bg-black"
                >
                  Select transmission
                </option>

                <option
                  value="MANUAL"
                  className="bg-black"
                >
                  Manual
                </option>

                <option
                  value="AUTOMATIC"
                  className="bg-black"
                >
                  Automatic
                </option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Fuel Type
              </label>

              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className={inputClass}
              >
                <option
                  value=""
                  className="bg-black"
                >
                  Select fuel type
                </option>

                <option
                  value="PETROL"
                  className="bg-black"
                >
                  Petrol
                </option>

                <option
                  value="DIESEL"
                  className="bg-black"
                >
                  Diesel
                </option>

                <option
                  value="CNG"
                  className="bg-black"
                >
                  CNG
                </option>

                <option
                  value="ELECTRIC"
                  className="bg-black"
                >
                  Electric
                </option>

                <option
                  value="HYBRID"
                  className="bg-black"
                >
                  Hybrid
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* ====================================================
            SELF DRIVE PRICING
        ==================================================== */}

        {showSelfDrivePricing && (
          <section className={sectionClass}>
            <div className="mb-6 flex items-center justify-between">
              <SectionHeader
                number="03"
                title="Self Drive Pricing"
                description="Configure pricing when the customer drives the vehicle."
              />

              <div className="hidden rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 text-xs font-semibold text-yellow-300 sm:block">
                SELF DRIVE
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <PriceInput
                label="Price Per Day"
                name="pricePerDaySelfDrive"
                value={
                  formData.pricePerDaySelfDrive
                }
                onChange={handleChange}
                required
              />

              <PriceInput
                label="Price Per Hour"
                name="pricePerHourSelfDrive"
                value={
                  formData.pricePerHourSelfDrive
                }
                onChange={handleChange}
              />

              <PriceInput
                label="Security Deposit"
                name="securityDepositSelfDrive"
                value={
                  formData.securityDepositSelfDrive
                }
                onChange={handleChange}
              />
            </div>
          </section>
        )}

        {/* ====================================================
            WITH DRIVER PRICING
        ==================================================== */}

        {showWithDriverPricing && (
          <section className={sectionClass}>
            <div className="mb-6 flex items-center justify-between">
              <SectionHeader
                number={
                  formData.rentalType ===
                  "BOTH"
                    ? "04"
                    : "03"
                }
                title="With Driver Pricing"
                description="Configure pricing when the vehicle includes a driver."
              />

              <div className="hidden rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 text-xs font-semibold text-yellow-300 sm:block">
                WITH DRIVER
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <PriceInput
                label="Price Per Day"
                name="pricePerDayWithDriver"
                value={
                  formData.pricePerDayWithDriver
                }
                onChange={handleChange}
                required
              />

              <PriceInput
                label="Price Per Hour"
                name="pricePerHourWithDriver"
                value={
                  formData.pricePerHourWithDriver
                }
                onChange={handleChange}
              />

              <PriceInput
                label="Security Deposit"
                name="securityDepositWithDriver"
                value={
                  formData.securityDepositWithDriver
                }
                onChange={handleChange}
              />
            </div>
          </section>
        )}

        {/* ====================================================
            VEHICLE IMAGES
        ==================================================== */}

        <section className={sectionClass}>
          <SectionHeader
            number={
              formData.rentalType === "BOTH"
                ? "05"
                : "04"
            }
            title="Vehicle Images"
            description="Upload images of the vehicle."
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(
                e.target.files || []
              );

              if (files.length === 0) {
                return;
              }

              if (
                selectedFiles.length +
                  files.length >
                10
              ) {
                setError(
                  "You can upload a maximum of 10 images."
                );
                return;
              }

              const invalidFiles =
                files.filter(
                  (file) =>
                    !file.type.startsWith(
                      "image/"
                    )
                );

              if (invalidFiles.length > 0) {
                setError(
                  "Only image files are allowed."
                );
                return;
              }

              const oversizedFiles =
                files.filter(
                  (file) =>
                    file.size >
                    5 * 1024 * 1024
                );

              if (
                oversizedFiles.length > 0
              ) {
                setError(
                  "Each image must be smaller than 5MB."
                );
                return;
              }

              setError("");

              setSelectedFiles(
                (prev) => [
                  ...prev,
                  ...files,
                ]
              );

              e.target.value = "";
            }}
          />

          <div
            className="cursor-pointer rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center transition hover:border-yellow-300/40 hover:bg-yellow-300/[0.02]"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-300/10">
              <span className="text-2xl text-yellow-300">
                +
              </span>
            </div>

            <h3 className="font-semibold text-white">
              Upload Vehicle Images
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add multiple photos of the
              vehicle
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();

                fileInputRef.current?.click();
              }}
              className="mt-5 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:border-yellow-300 hover:text-yellow-300"
            >
              Choose Images
            </button>

            <p className="mt-3 text-xs text-gray-600">
              Maximum 10 images · 5MB per image
            </p>
          </div>

          {/* IMAGE PREVIEWS */}

          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-300">
                  Selected Images
                </p>

                <span className="text-xs text-gray-500">
                  {selectedFiles.length}/10
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {selectedFiles.map(
                  (file, index) => {
                    const previewUrl =
                      URL.createObjectURL(
                        file
                      );

                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
                      >
                        <img
                          src={previewUrl}
                          alt={`Vehicle ${
                            index + 1
                          }`}
                          className="h-full w-full object-cover"
                          onLoad={() =>
                            URL.revokeObjectURL(
                              previewUrl
                            )
                          }
                        />

                        <div className="absolute left-2 top-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-medium text-white">
                          {index + 1}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            setSelectedFiles(
                              (prev) =>
                                prev.filter(
                                  (_, i) =>
                                    i !==
                                    index
                                )
                            );
                          }}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-sm text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </section>

        {/* ====================================================
            SUBMIT
        ==================================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-yellow-300 px-8 py-3 text-sm font-bold text-black transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Adding Vehicle..."
              : "Add Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================
// SECTION HEADER
// ============================================================

interface SectionHeaderProps {
  number: string;
  title: string;
  description: string;
}

const SectionHeader = ({
  number,
  title,
  description,
}: SectionHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-3">
        <span className="text-xs font-bold text-yellow-300">
          {number}
        </span>

        <div className="h-px w-6 bg-yellow-300/40" />

        <h2 className="text-lg font-bold text-white">
          {title}
        </h2>
      </div>

      <p className="text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
};

// ============================================================
// PRICE INPUT
// ============================================================

interface PriceInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  required?: boolean;
}

const PriceInput = ({
  label,
  name,
  value,
  onChange,
  required,
}: PriceInputProps) => {
  return (
    <div>
      <label className={labelClass}>
        {label} {required && "*"}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-yellow-300">
          ₹
        </span>

        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          required={required}
          className={`${inputClass} pl-9`}
        />
      </div>
    </div>
  );
};

export default AddCar;
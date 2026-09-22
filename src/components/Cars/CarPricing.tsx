
import type { Car, RentalMode } from "./car.types";

interface CarPricingProps {
  car: Car;
  rentalMode: RentalMode;
}

export const formatPrice = (
  price: number | string | null | undefined
) => {
  if (price === null || price === undefined) {
    return "—";
  }

  return `₹${Number(price).toLocaleString("en-IN")}`;
};

export function CarPricing({
  car,
  rentalMode,
}: CarPricingProps) {
  const isSelfDrive = rentalMode === "SELF_DRIVE";

  const pricePerDay = isSelfDrive
    ? car.pricePerDaySelfDrive
    : car.pricePerDayWithDriver;

  const pricePerHour = isSelfDrive
    ? car.pricePerHourSelfDrive
    : car.pricePerHourWithDriver;

  const label = isSelfDrive
    ? "Self Drive"
    : "With Driver";

  return (
    <div className="mt-4 rounded-2xl border border-yellow-300/20 bg-yellow-300/[0.06] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
            {label}
          </p>

          <p className="mt-1 text-xl font-black text-yellow-300">
            {formatPrice(pricePerDay)}
          </p>

          <p className="text-xs text-gray-500">
            per day
          </p>
        </div>

        {pricePerHour !== null &&
          pricePerHour !== undefined && (
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
                Hourly
              </p>

              <p className="mt-1 text-lg font-bold text-white">
                {formatPrice(pricePerHour)}
              </p>

              <p className="text-xs text-gray-500">
                per hour
              </p>
            </div>
          )}
      </div>
    </div>
  );
}

interface CarPricingDetailsProps {
  car: Car;
  rentalMode: RentalMode;
}

export function CarPricingDetails({
  car,
  rentalMode,
}: CarPricingDetailsProps) {
  const isSelfDrive = rentalMode === "SELF_DRIVE";

  const pricePerDay = isSelfDrive
    ? car.pricePerDaySelfDrive
    : car.pricePerDayWithDriver;

  const pricePerHour = isSelfDrive
    ? car.pricePerHourSelfDrive
    : car.pricePerHourWithDriver;

  const securityDeposit = isSelfDrive
    ? car.securityDepositSelfDrive
    : car.securityDepositWithDriver;

  const label = isSelfDrive
    ? "Self Drive"
    : "With Driver";

  return (
    <div>
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-300">
        {label}
      </p>

      <div className="space-y-2">
        <PriceRow
          label="Per Day"
          value={formatPrice(pricePerDay)}
        />

        <PriceRow
          label="Per Hour"
          value={formatPrice(pricePerHour)}
        />

        <PriceRow
          label="Security Deposit"
          value={formatPrice(securityDeposit)}
        />
      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.025] px-4 py-3">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-bold text-gray-200">
        {value}
      </span>
    </div>
  );
}


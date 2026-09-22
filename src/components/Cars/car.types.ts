
export type RentalMode = "SELF_DRIVE" | "WITH_DRIVER";

export type CarRentalType =
  | "SELF_DRIVE"
  | "WITH_DRIVER"
  | "BOTH";

export interface CarImage {
  id?: string;
  url: string;
  publicId: string;
}

export interface Car {
  id: string;

  name: string;
  brand: string;
  model: string;

  year?: number | null;
  registrationNumber: string;
  description?: string | null;

  rentalType: CarRentalType;

  status:
    | "AVAILABLE"
    | "UNAVAILABLE"
    | "MAINTENANCE"
    | "BOOKED"
    | "ON_ROUTE"
    | "WITH_CUSTOMER"
    | "OUT_OF_SERVICE"
    | string;

  // Self-drive pricing
  pricePerDaySelfDrive?: number | string | null;
  pricePerHourSelfDrive?: number | string | null;
  securityDepositSelfDrive?: number | string | null;

  // With-driver pricing
  pricePerDayWithDriver?: number | string | null;
  pricePerHourWithDriver?: number | string | null;
  securityDepositWithDriver?: number | string | null;

  seats?: number | null;
  transmission?: string | null;
  fuelType?: string | null;

  images: CarImage[];
}

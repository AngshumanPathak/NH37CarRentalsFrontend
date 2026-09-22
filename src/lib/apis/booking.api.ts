
import api from "./apis";

export interface BookingPricing {
  rentalAmount: string | number;
  securityDeposit: string | number;
  totalAmount: string | number;
  fullDays: number;
  remainingHours: number;
  pricePerDay: string | number;
  pricePerHour: string | number | null;
}

export interface BookingDocument {
  id: string;
  type: "AADHAAR" | "DRIVING_LICENSE" | "VOTER_ID";
  url: string;
  publicId?: string | null;
  verificationStatus:
    | "PENDING"
    | "VERIFIED"
    | "REJECTED";
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingStatusHistory {
  id: string;
  status: string;
  note?: string | null;
  createdAt: string;
  changedById?: string | null;
}

export interface BookingImage {
  id?: string;
  url: string;
  publicId?: string | null;
}

export interface BookingCar {
  id: string;
  name: string;
  brand: string;
  model: string;
  year?: number | null;
  registrationNumber?: string;
  description?: string | null;
  status?: string;

  pricePerDaySelfDrive?: string | number;
  pricePerHourSelfDrive?: string | number | null;
  securityDepositSelfDrive?: string | number | null;

  seats?: number | null;
  transmission?: string | null;
  fuelType?: string | null;

  images: BookingImage[];
}

export interface BookingPayment {
  id: string;
  amount: string | number;
  status:
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED";
  method: "RAZORPAY" | "CASH";
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  paidAt?: string | null;
}

export interface Booking {
  id: string;
  bookingNumber: string;

  pickupLocation: string;
  dropLocation?: string | null;

  pickupAt: string;
  returnAt: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  rentalType: "SELF_DRIVE" | "WITH_DRIVER";

  rentalDays: number;
  rentalHours: number;

  pricePerDay: string | number;
  pricePerHour?: string | number | null;

  rentalAmount: string | number;
  securityDeposit?: string | number | null;
  totalAmount: string | number;

  status: string;

  userId: string;
  carId: string;

  createdAt: string;
  updatedAt: string;

  car: BookingCar;
  documents: BookingDocument[];
  statusHistory: BookingStatusHistory[];
  payment?: BookingPayment | null;
}

export interface CreateBookingPayload {
  carId: string;
  rentalType: "SELF_DRIVE";
  pickupLocation: string;
  dropLocation?: string | null;
  pickupAt: string;
  returnAt: string;

  documents?: {
    type:
      | "AADHAAR"
      | "DRIVING_LICENSE"
      | "VOTER_ID";
    url: string;
    publicId?: string | null;
  }[];
}

export interface AvailabilityPayload {
  carId: string;
  rentalType: "SELF_DRIVE" | "WITH_DRIVER";
  pickupAt: string;
  returnAt: string;
}

export interface AvailabilityResponse {
  available: boolean;
  reason: string | null;
  pricing: BookingPricing | null;
}

/**
 * Check whether the selected car is available.
 */
export const checkBookingAvailability = async (
  payload: AvailabilityPayload
): Promise<AvailabilityResponse> => {
  const response = await api.post(
    "/bookings/check-availability",
    payload
  );

  return response.data;
};

/**
 * Create a booking.
 */
export const createBooking = async (
  payload: CreateBookingPayload
) => {
  const response = await api.post(
    "/bookings",
    payload
  );

  return response.data;
};

/**
 * Get all bookings belonging to the logged-in customer.
 */
export const getMyBookings = async (): Promise<Booking[]> => {
  const response = await api.get("/bookings/my");

  return response.data.data;
};
/**
 * Get one booking belonging to the logged-in customer.
 */
export const getMyBooking = async (
  bookingId: string
): Promise<Booking> => {
  const response = await api.get(
    `/bookings/${bookingId}`
  );

  return response.data?.booking ?? response.data;
};

export const getBookingById = async (bookingId: string) => {
  const response = await api.get(`/bookings/${bookingId}`);

  return response.data.data;
};


/**
 * Get all bookings for admin.
 */
export const getAdminBookings = async (): Promise<Booking[]> => {
  const response = await api.get("/bookings/admin");

  return response.data.data;
};

/**
 * Get a single booking for admin review.
 */
export const getAdminBookingById = async (
  bookingId: string
): Promise<Booking> => {
  const response = await api.get(
    `/bookings/admin/${bookingId}`
  );

  return response.data.data;
};

/**
 * Confirm a pending booking.
 */
export const confirmAdminBooking = async (
  bookingId: string,
  note?: string
): Promise<Booking> => {
  const response = await api.patch(
    `/bookings/admin/${bookingId}/confirm`,
    {
      note,
    }
  );

  return response.data.data;
};


export const rejectAdminBooking = async (
  bookingId: string,
  reason?: string
): Promise<Booking> => {
  const response = await api.patch(
    `/bookings/admin/${bookingId}/reject`,
    {
      reason,
    }
  );

  return response.data;
};
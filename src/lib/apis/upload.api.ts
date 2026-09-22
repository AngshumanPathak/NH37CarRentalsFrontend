
import api from "./apis.ts";

export interface UploadedImage {
  url: string;
  publicId: string;
}

export const uploadCarImages = async (
  files: File[]
): Promise<UploadedImage[]> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post(
    "/upload/cars/images",
    formData
  );

  return response.data.data;
};


// ===============================
// BOOKING DOCUMENT UPLOAD
// ===============================

export type BookingDocumentType =
  | "AADHAAR"
  | "DRIVING_LICENSE"
  | "VOTER_ID";

export interface UploadedBookingDocument {
  type: BookingDocumentType;
  url: string;
  publicId: string;
}

export interface BookingDocumentFiles {
  drivingLicense?: File | null;
  aadhaar?: File | null;
  voterId?: File | null;
}

export const uploadBookingDocuments = async (
  files: BookingDocumentFiles
): Promise<UploadedBookingDocument[]> => {
  const formData = new FormData();

  if (files.drivingLicense) {
    formData.append(
      "drivingLicense",
      files.drivingLicense
    );
  }

  if (files.aadhaar) {
    formData.append(
      "aadhaar",
      files.aadhaar
    );
  }

  if (files.voterId) {
    formData.append(
      "voterId",
      files.voterId
    );
  }

  const response = await api.post(
    "/upload/bookings/documents",
    formData
  );

  return response.data.data;
};

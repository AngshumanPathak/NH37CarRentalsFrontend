
import data from './vehicleData.json'

import axios from "axios";


const VITE_API_BASE_URL = "";

console.log(VITE_API_BASE_URL);

export const addVehicle = async (vehicleData: any) => {
    try {
        const formData = new FormData();

        // Append all fields except images
        Object.entries(vehicleData).forEach(([key, value]) => {
            if (key !== "image") {
                formData.append(key, value as string); // Convert other values to string
            }
        });

        // Append multiple images correctly
        if (vehicleData.image && Array.isArray(vehicleData.image)) {
            vehicleData.image.forEach((file: File) => {
                if (file instanceof File) {
                    formData.append("images", file); // ✅ Matches backend field name
                }
            });
        } else if (vehicleData.image instanceof File) {
            formData.append("images", vehicleData.image); // ✅ Single image case
        }

        const response = await fetch(`${VITE_API_BASE_URL}/vehicles`, {
            method: "POST",
            body: formData, // ✅ No need to set Content-Type manually
        });

        if (!response.ok) {
            throw new Error("Failed to upload vehicle.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding vehicle:", error);
        throw error;
    }
};



export const getVehicles = async () => {
    try {
      
        return data;
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        throw error;
    }
};


export const getReviews = async () => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/reviews`);
      const data = await response.json();
  
      console.log("Raw API Response:", data); // Debugging
  
      return data; // Directly return the data since it's already an array
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  };
  
  

  export const addBooking = async (bookingData: { vehicleId: string; bookedFrom: string; bookedTill: string }) => {
    try {
        const response = await fetch(`${VITE_API_BASE_URL}/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            throw new Error("Failed to add booking.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding booking:", error);
        throw error;
    }
};



export const deleteBooking = async (bookingData: { vehicleId: string; bookedFrom: string; bookedTill: string }) => {
    try {
        const response = await fetch(`${VITE_API_BASE_URL}/bookings`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            throw new Error("Failed to delete booking.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting booking:", error);
        throw error;
    }
};


const api = axios.create({
  baseURL: import.meta.env.BASE_URL,
  withCredentials: true,

});

export default api;


export const getCars = async (
  dateFrom?: string | null,
  dateTo?: string | null
) => {
  const response = await api.get("/cars", {
    params: {
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    },
  });

  return response.data;
};

export const getCarById = async (id: string) => {
  const response = await api.get(`/cars/${id}`);
  return response.data;
};
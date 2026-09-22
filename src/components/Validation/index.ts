import {z} from 'zod'

export const formSchema = z.object({

    name: z.string().min(2).max(50),
    fuelType: z.string().min(2).max(50),
    category: z.string().min(2).max(50),
    seatCapacity: z.string().min(2).max(50),
    image: z.array(z.instanceof(File)),
    price: z.number().int().positive(),
    bookedFrom: z.date(),
    bookedTill: z.date(),
    availability: z.boolean(),
})




const documentSchema = z
  .instanceof(File)
  .refine(
    (file) =>
      [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ].includes(file.type),
    "Only JPG, PNG, WEBP or PDF files are allowed"
  )
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "File size must be less than 5 MB"
  );

export const bookingFormSchema = z
  .object({
    rentalType: z.enum(["SELF_DRIVE", "WITH_DRIVER"], {
      message: "Please select a rental type",
    }),

    pickupLocation: z
      .string()
      .min(3, "Pickup location is required")
      .max(200, "Pickup location is too long"),

    dropLocation: z
      .string()
      .max(200, "Drop location is too long")
      .optional()
      .or(z.literal("")),

    pickupAt: z.date({
      message: "Please select a pickup date and time",
    }),

    returnAt: z.date({
      message: "Please select a return date and time",
    }),

    pickupLatitude: z.number().optional(),
    pickupLongitude: z.number().optional(),

    dropLatitude: z.number().optional(),
    dropLongitude: z.number().optional(),

    aadhaar: documentSchema.optional(),

    drivingLicense: documentSchema.optional(),

    voterId: documentSchema.optional(),
  })
  .superRefine((data, ctx) => {
    // Pickup must be in the future
    if (data.pickupAt <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pickupAt"],
        message: "Pickup date must be in the future",
      });
    }

    // Return must be after pickup
    if (data.returnAt <= data.pickupAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["returnAt"],
        message: "Return date must be after pickup date",
      });
    }

    // Self-drive requirements
    if (data.rentalType === "SELF_DRIVE") {
      if (!data.aadhaar) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["aadhaar"],
          message: "Aadhaar is required for self-drive",
        });
      }

      if (!data.drivingLicense) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["drivingLicense"],
          message: "Driving License is required for self-drive",
        });
      }
    }

    // With-driver requirement
    if (data.rentalType === "WITH_DRIVER" && !data.aadhaar) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["aadhaar"],
        message: "Aadhaar is required",
      });
    }
  });

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
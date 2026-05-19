import { z } from "zod";

export const personalizeSchema = z.object({
  birthday: z.date({ error: "Please select your birthday" }).max(new Date(), "Birthday cannot be in the future"),

  locationName: z.string().trim().min(1, "Please enter a city"),

  locationCoordinates: z
    .array(z.number())
    .length(2, "Please click the pin or press Enter to select a valid location")
    .refine(([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90, "Please select a valid location"),
});

export type PersonalizeFormData = z.infer<typeof personalizeSchema>;

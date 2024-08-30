import z from "zod";

const daysCreateSchema = z.object({
  title: z
    .string({ required_error: "Title is required to create days" })
    .min(3, { message: "title must be 3 characters long." }),
  location: z
    .string({ required_error: "location is required to create days" })
    .min(3, { message: "Location must be 3 characters long." }),
  summary: z
    .string({ required_error: "Summary is required to create days" })
    .min(10, { message: "Summary must be 10 characters long." }),
});

export { daysCreateSchema };

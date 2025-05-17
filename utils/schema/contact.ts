import * as z from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(5),
  email: z.string().email().min(5),
  message: z.string().min(15),
});

export type ContactFormSchema = z.output<typeof contactFormSchema>


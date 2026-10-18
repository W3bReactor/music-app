import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Enter your name"),
  email: z.email("Enter a valid email address").trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["Engineer", "Designer", "Admin"], {
    error: "Please select a role",
  }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

import { z } from "zod";

export const step1Schema = z.object({
  project_name: z.string().min(2, "Project name must be at least 2 characters").max(100),
  website_url: z.string().url("Please enter a valid URL"),
  twitter_url: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => url.includes("x.com") || url.includes("twitter.com"),
      "Must be an X.com or Twitter profile link"
    ),
  one_liner: z.string().min(10, "At least 10 characters").max(150, "Max 150 characters"),
});

export const step2Schema = z.object({
  mainnet_status: z.enum(["live", "testnet", "migrating"], {
    error: "Please select your mainnet status",
  }),
  daily_txs: z.enum(["<50", "50-250", "250-1000", "1000+"], {
    error: "Please select your daily transaction volume",
  }),
  gas_solution: z.enum(["users_pay", "built_own", "third_party"], {
    error: "Please select your current gas solution",
  }),
});

export const step4Schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  telegram: z.string().min(1, "Telegram handle is required").max(64),
  data_agreement: z.literal(true, {
    error: "You must agree to share data to participate",
  }),
  // Honeypot field - should ALWAYS be empty (catches bots)
  website_field: z.string().max(0).optional(),
});

export const fullApplicationSchema = step1Schema
  .merge(step2Schema)
  .merge(step4Schema);

export type FullApplication = z.infer<typeof fullApplicationSchema>;

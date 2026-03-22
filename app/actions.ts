"use server";

import { createClient } from "@supabase/supabase-js";
import { fullApplicationSchema, type FullApplication } from "@/lib/validators";

export type SubmitResult =
  | { success: true; id: string }
  | { success: false; error: string };

export async function submitApplication(
  data: FullApplication
): Promise<SubmitResult> {
  // Validate data server-side
  const parsed = fullApplicationSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid form data: " + parsed.error.issues[0].message,
    };
  }

  // For anonymous application submissions, we use the anon key
  // and let RLS policies enforce security at the database level
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  // Check honeypot - if filled, it's a bot
  // Return fake success to fool the bot (don't let them know they were caught)
  if (parsed.data.website_field) {
    console.log('Bot detected via honeypot field');
    return { success: true, id: "bot-detected" };
  }

  const { error } = await supabase
    .from("applications")
    .insert([
      {
        project_name: parsed.data.project_name,
        website_url: parsed.data.website_url,
        twitter_url: parsed.data.twitter_url,
        one_liner: parsed.data.one_liner,
        mainnet_status: parsed.data.mainnet_status,
        daily_txs: parsed.data.daily_txs,
        gas_solution: parsed.data.gas_solution,
        why_gasless: parsed.data.why_gasless,
        email: parsed.data.email,
        telegram: parsed.data.telegram,
        data_agreement: parsed.data.data_agreement,
        // status and admin_notes use database defaults
      },
    ]);

  if (error) {
    console.error("Supabase insert error:", error);
    return {
      success: false,
      error: "Failed to submit application. Please try again.",
    };
  }

  return { success: true, id: "submitted" };
}

export async function updateApplicationStatus(
  id: string,
  status: "new" | "reviewing" | "selected" | "rejected"
): Promise<{ success: boolean; error?: string }> {
  const { createClient } = await import("@/utils/supabase/server");
  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateApplicationNotes(
  id: string,
  admin_notes: string
): Promise<{ success: boolean; error?: string }> {
  const { createClient } = await import("@/utils/supabase/server");
  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({ admin_notes })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}


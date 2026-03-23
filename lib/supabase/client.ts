import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Application = {
  id: string;
  created_at: string;
  project_name: string;
  website_url: string;
  twitter_url: string;
  one_liner: string;
  mainnet_status: "live" | "testnet" | "migrating";
  daily_txs: "<50" | "50-250" | "250-1000" | "1000+";
  gas_solution: "users_pay" | "built_own" | "third_party";
  email: string;
  telegram: string;
  data_agreement: boolean;
  status: "new" | "reviewing" | "selected" | "rejected";
  admin_notes: string;
};

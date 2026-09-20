import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";

/**
 * Supabase client configuration.
 * In Stage 2, replace these with your actual Supabase URL and Anon Key,
 * or place them in your .env file as EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY.
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;

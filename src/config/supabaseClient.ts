import { createClient } from "@supabase/supabase-js";

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_ANON_KEY = import.meta.env.VITE_ANON_KEY;


if (!VITE_SUPABASE_URL || !VITE_ANON_KEY) {
  throw new Error("Missing SUPABASE_URL or ANON_KEY environment variable");
}

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_ANON_KEY);

export default supabase;

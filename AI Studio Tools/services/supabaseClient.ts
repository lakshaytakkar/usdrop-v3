import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zkqycjedtxggvsncdpus.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprcXljamVkdHhnZ3ZzbmNkcHVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzAxNjMsImV4cCI6MjA3MjE0NjE2M30.GZqYA-R9Bt1TiM3U3vN2j2Wpnz2LDt_JKLXZta_J2mw";

if (!supabaseUrl || !supabaseAnonKey) {
  // This check is kept as a safeguard, but with hardcoded values, it should not be triggered.
  throw new Error("Supabase URL and Anon Key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kcskxgyhnfjedehaoyli.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjc2t4Z3lobmZqZWRlaGFveWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNDM0OTgsImV4cCI6MjA5NTYxOTQ5OH0.n9BUJKI9qGlBq4TKiK_6tomo410JRSCRI19fqcRlkuw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type SaasUser = {
  id: string;
  email: string | null;
  nom: string | null;
  prenom: string | null;
  created_at: string | null;
};

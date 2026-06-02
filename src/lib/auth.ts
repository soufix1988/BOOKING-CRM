import { supabase, type SaasUser } from "./supabase";

const SESSION_KEY = "nova_session";

export async function login(email: string, password: string): Promise<SaasUser> {
  const { data, error } = await supabase
    .from("saas_users")
    .select("id, email, nom, prenom, created_at")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data) {
    throw new Error("Invalid email or password");
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  return data as SaasUser;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): SaasUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SaasUser;
  } catch {
    return null;
  }
}

export function getUserDisplayName(user: SaasUser): string {
  if (user.prenom || user.nom) {
    return [user.prenom, user.nom].filter(Boolean).join(" ");
  }
  return user.email ?? "User";
}

export function getUserInitials(user: SaasUser): string {
  const name = getUserDisplayName(user);
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

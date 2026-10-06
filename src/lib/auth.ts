import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "customer" | "professional" | "admin" | "super_admin";

export async function getAuthenticatedProfile(next = "/account") {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    redirect("/auth?error=Supabase is not configured yet.");
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/auth?next=${encodeURIComponent(next)}`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone, avatar_url")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/auth?error=Your account profile could not be loaded.");
  }

  return { supabase, user, profile: profile as { id: string; role: AppRole; full_name: string; phone: string | null; avatar_url: string | null } };
}

export async function requireRole(allowed: AppRole[]) {
  const context = await getAuthenticatedProfile();

  if (!allowed.includes(context.profile.role)) {
    redirect("/account?error=You do not have permission to view that page.");
  }

  return context;
}

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function authUrl(path: string, message?: string) {
  const params = message ? `?error=${encodeURIComponent(message)}` : "";
  return `${path}${params}`;
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(authUrl("/auth", "Email and password are required."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(authUrl("/auth", error.message));
  }

  const next = String(formData.get("next") ?? "/account");
  redirect(next.startsWith("/") ? next : "/account");
}

export async function signUpAction(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const requestedRole = String(formData.get("role") ?? "customer");
  const role = requestedRole === "professional" ? "professional" : "customer";

  if (!fullName || !email || password.length < 8) {
    redirect(authUrl("/auth", "Enter your name, a valid email, and a password of at least 8 characters."));
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (error) {
    redirect(authUrl("/auth", error.message));
  }

  if (data.session) {
    redirect(role === "professional" ? "/professional/apply" : "/account");
  }

  redirect("/auth/check-email");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

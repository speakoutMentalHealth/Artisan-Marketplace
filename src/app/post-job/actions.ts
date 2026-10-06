"use server";

import { redirect } from "next/navigation";
import { getAuthenticatedProfile } from "@/lib/auth";

function parseMoneyToMinor(value: FormDataEntryValue | null) {
  if (value == null || String(value).trim() === "") return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100);
}

export async function createJobAction(formData: FormData) {
  const { supabase, user } = await getAuthenticatedProfile("/post-job");

  const title = String(formData.get("title") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const locationName = String(formData.get("location_name") ?? "").trim();
  const urgency = String(formData.get("urgency") ?? "flexible");
  const budgetMinMinor = parseMoneyToMinor(formData.get("budget_min"));
  const budgetMaxMinor = parseMoneyToMinor(formData.get("budget_max"));

  if (!title || !description || !locationName) {
    redirect("/post-job?error=Add a job title, description and location.");
  }

  if (budgetMinMinor != null && budgetMaxMinor != null && budgetMaxMinor < budgetMinMinor) {
    redirect("/post-job?error=Maximum budget cannot be lower than minimum budget.");
  }

  const allowedUrgency = ["now", "today", "scheduled", "flexible"];
  const safeUrgency = allowedUrgency.includes(urgency) ? urgency : "flexible";

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      customer_id: user.id,
      category_id: categoryId || null,
      title,
      description,
      status: "open",
      location_name: locationName,
      urgency: safeUrgency,
      budget_min_minor: budgetMinMinor,
      budget_max_minor: budgetMaxMinor,
      currency: "NGN",
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/post-job?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/account?job_posted=${data.id}`);
}

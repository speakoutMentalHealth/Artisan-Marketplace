"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export async function submitApplicationAction(formData: FormData) {
  const { supabase, user } = await requireRole(["professional"]);

  const businessName = String(formData.get("business_name") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const baseLocation = String(formData.get("base_location_name") ?? "").trim();
  const yearsExperience = Number(formData.get("years_experience") ?? 0);
  const serviceRadius = Number(formData.get("service_radius_km") ?? 15);

  if (!businessName || !headline || !bio || !baseLocation) {
    redirect("/professional/apply?error=Complete all required fields before submitting.");
  }

  if (!Number.isFinite(yearsExperience) || yearsExperience < 0 || yearsExperience > 80) {
    redirect("/professional/apply?error=Enter a valid number of years of experience.");
  }

  if (!Number.isFinite(serviceRadius) || serviceRadius < 1 || serviceRadius > 200) {
    redirect("/professional/apply?error=Service radius must be between 1 and 200 km.");
  }

  const { error: updateError } = await supabase
    .from("professional_profiles")
    .update({
      business_name: businessName,
      headline,
      bio,
      base_location_name: baseLocation,
      years_experience: Math.floor(yearsExperience),
      service_radius_km: Math.floor(serviceRadius),
    })
    .eq("user_id", user.id);

  if (updateError) {
    redirect(`/professional/apply?error=${encodeURIComponent(updateError.message)}`);
  }

  const { error: submitError } = await supabase.rpc("submit_professional_application");

  if (submitError) {
    redirect(`/professional/apply?error=${encodeURIComponent(submitError.message)}`);
  }

  redirect("/professional/apply?submitted=1");
}

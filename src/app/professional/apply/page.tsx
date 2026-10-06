import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { submitApplicationAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProfessionalApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; submitted?: string }>;
}) {
  const { error, submitted } = await searchParams;
  const { supabase, user } = await requireRole(["professional"]);

  const { data: professional } = await supabase
    .from("professional_profiles")
    .select("business_name, headline, bio, years_experience, base_location_name, service_radius_km, application_status")
    .eq("user_id", user.id)
    .single();

  const locked = ["submitted", "under_review", "approved", "suspended"].includes(professional?.application_status ?? "");

  return (
    <div className="shell page narrowPage">
      <div className="pageHeading">
        <span className="eyebrow">Professional onboarding</span>
        <h1>Build your professional profile</h1>
        <p>Complete the core information first. Identity documents, portfolio, services and certificate checks will be added in the next onboarding stage.</p>
      </div>

      {error ? <div className="formAlert" role="alert">{error}</div> : null}
      {submitted ? <div className="formSuccess">Application submitted. The profile is now waiting for review.</div> : null}

      <section className="contentCard applicationStatus">
        <span>Status</span>
        <strong>{professional?.application_status?.replace("_", " ") ?? "draft"}</strong>
      </section>

      <form className="formCard" action={submitApplicationAction}>
        <label>Business or professional name
          <input name="business_name" defaultValue={professional?.business_name ?? ""} required disabled={locked} />
        </label>
        <label>Professional headline
          <input name="headline" defaultValue={professional?.headline ?? ""} placeholder="e.g. Electrician · Solar Installer" required disabled={locked} />
        </label>
        <label>About your work
          <textarea name="bio" rows={6} defaultValue={professional?.bio ?? ""} required disabled={locked} />
        </label>
        <div className="twoCol">
          <label>Years of experience
            <input name="years_experience" type="number" min="0" max="80" defaultValue={professional?.years_experience ?? 0} required disabled={locked} />
          </label>
          <label>Service radius (km)
            <input name="service_radius_km" type="number" min="1" max="200" defaultValue={professional?.service_radius_km ?? 15} required disabled={locked} />
          </label>
        </div>
        <label>Base location
          <input name="base_location_name" defaultValue={professional?.base_location_name ?? ""} placeholder="Keffi, Nasarawa" required disabled={locked} />
        </label>

        {locked ? (
          <div className="privacyNote">
            <strong>This application is locked while it is being reviewed.</strong>
            <span>If the verification team requests more information, it can be reopened for correction.</span>
          </div>
        ) : (
          <button className="button fullButton" type="submit">Submit application for review</button>
        )}
      </form>

      <p className="authFootnote"><Link href="/account">← Back to account</Link></p>
    </div>
  );
}

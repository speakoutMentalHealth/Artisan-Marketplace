import Link from "next/link";
import { getAuthenticatedProfile } from "@/lib/auth";
import { signOutAction } from "@/app/auth/actions";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; job_posted?: string }>;
}) {
  const { error, job_posted } = await searchParams;
  const { supabase, user, profile } = await getAuthenticatedProfile();

  let professional:
    | { business_name: string | null; application_status: string; is_available: boolean }
    | null = null;

  if (profile.role === "professional") {
    const { data } = await supabase
      .from("professional_profiles")
      .select("business_name, application_status, is_available")
      .eq("user_id", user.id)
      .single();

    professional = data;
  }

  return (
    <div className="shell page">
      <div className="dashboardHead">
        <div>
          <span className="eyebrow">My account</span>
          <h1>{profile.full_name || "Marketplace account"}</h1>
          <p>{user.email} · {profile.role.replace("_", " ")}</p>
        </div>
        <form action={signOutAction}>
          <button className="button buttonGhost" type="submit">Sign out</button>
        </form>
      </div>

      {error ? <div className="formAlert" role="alert">{error}</div> : null}\n      {job_posted ? <div className="formSuccess">Job posted successfully. Verified professionals can now see it in the opportunities feed.</div> : null}

      {profile.role === "professional" ? (
        <div className="dashboardLayout">
          <section className="contentCard">
            <span className="eyebrow">Professional account</span>
            <h2>{professional?.business_name || "Complete your professional profile"}</h2>
            <div className="metricRow"><span>Application status</span><strong>{professional?.application_status?.replace("_", " ") || "draft"}</strong></div>
            <div className="metricRow"><span>Availability</span><strong>{professional?.is_available ? "Available" : "Not listed as available"}</strong></div>
            <p>Your profile only appears in public search after the platform verifies and approves your application.</p>
            <div className="accountActions">
              <Link className="button" href="/professional/apply">Professional application</Link>
              {professional?.application_status === "approved" ? (
                <Link className="button buttonGhost" href="/professional/dashboard">Open dashboard</Link>
              ) : null}
            </div>
          </section>
          <aside className="contentCard">
            <span className="eyebrow">Verification</span>
            <h2>Build trust step by step</h2>
            <p>Identity, phone, certificates, bank details and references are tracked separately so each badge states what was actually verified.</p>
          </aside>
        </div>
      ) : (
        <div className="dashboardLayout">
          <section className="contentCard">
            <span className="eyebrow">Customer account</span>
            <h2>Ready to get something done?</h2>
            <p>Browse professionals or post a job and receive suitable quotations.</p>
            <div className="accountActions">
              <Link className="button" href="/explore">Find a professional</Link>
              <Link className="button buttonGhost" href="/post-job">Post a job</Link>
            </div>
          </section>
          <aside className="contentCard">
            <span className="eyebrow">Account security</span>
            <p>Your account identity controls access to bookings, quotes, payments and private job details.</p>
          </aside>
        </div>
      )}
    </div>
  );
}

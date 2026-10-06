import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { supabase } = await requireRole(["admin", "super_admin"]);

  const [
    pendingResult,
    approvedResult,
    disputesResult,
    completedResult,
    applicationsResult,
  ] = await Promise.all([
    supabase.from("professional_profiles").select("*", { count: "exact", head: true }).in("application_status", ["submitted", "under_review"]),
    supabase.from("professional_profiles").select("*", { count: "exact", head: true }).eq("application_status", "approved"),
    supabase.from("disputes").select("*", { count: "exact", head: true }).in("status", ["open", "under_review"]),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase
      .from("professional_profiles")
      .select("user_id, business_name, headline, base_location_name, application_status, created_at")
      .in("application_status", ["submitted", "under_review"])
      .order("created_at", { ascending: true })
      .limit(8),
  ]);

  return (
    <div className="shell page">
      <div className="dashboardHead">
        <div>
          <span className="eyebrow">Operations console</span>
          <h1>Admin dashboard</h1>
          <p>Verification, disputes and marketplace operations.</p>
        </div>
      </div>

      <div className="metricGrid">
        <div className="metricCard warning"><span>Applications</span><strong>{pendingResult.count ?? 0}</strong><small>Need review</small></div>
        <div className="metricCard"><span>Verified professionals</span><strong>{approvedResult.count ?? 0}</strong><small>Approved profiles</small></div>
        <div className="metricCard warning"><span>Open disputes</span><strong>{disputesResult.count ?? 0}</strong><small>Need resolution</small></div>
        <div className="metricCard"><span>Completed jobs</span><strong>{completedResult.count ?? 0}</strong><small>Marketplace total</small></div>
      </div>

      <section className="contentCard">
        <div className="sectionHead">
          <div><span className="eyebrow">Needs attention</span><h2>Professional applications</h2></div>
        </div>
        <div className="adminTable" role="table" aria-label="Professional applications">
          <div className="tableRow tableHead" role="row"><span>Applicant</span><span>Service</span><span>Location</span><span>Status</span><span>Submitted</span><span></span></div>
          {(applicationsResult.data ?? []).map((application) => (
            <div className="tableRow" role="row" key={application.user_id}>
              <strong>{application.business_name || "Unnamed professional"}</strong>
              <span>{application.headline || "Profile pending"}</span>
              <span>{application.base_location_name || "Not set"}</span>
              <span className="statusText">{application.application_status.replace("_", " ")}</span>
              <span>{new Date(application.created_at).toLocaleDateString()}</span>
              <button className="button buttonGhost" disabled>Review next</button>
            </div>
          ))}
          {!applicationsResult.data?.length ? <p>No applications currently waiting for review.</p> : null}
        </div>
      </section>

      <section className="contentCard">
        <span className="eyebrow">Access control</span>
        <h2>Admin access is server-verified.</h2>
        <p>This route now checks the signed-in profile role before rendering. Customer and professional accounts cannot load this dashboard.</p>
      </section>
    </div>
  );
}

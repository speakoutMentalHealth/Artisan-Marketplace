import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

function formatMinor(value: number | null) {
  if (value == null) return "Request quote";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

export default async function ProfessionalDashboard() {
  const { supabase, user, profile } = await requireRole(["professional"]);

  const { data: professional } = await supabase
    .from("professional_profiles")
    .select("business_name, application_status, average_rating, completed_jobs, reputation_score, is_available")
    .eq("user_id", user.id)
    .single();

  if (!professional || professional.application_status !== "approved") {
    redirect("/professional/apply?error=Your professional profile must be approved before the work dashboard opens.");
  }

  const [opportunitiesResult, bookingsResult, paymentsResult] = await Promise.all([
    supabase
      .from("jobs")
      .select("id, title, location_name, urgency, budget_min_minor, budget_max_minor, preferred_at")
      .in("status", ["open", "quoting"])
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("bookings")
      .select("id, status, scheduled_at")
      .eq("professional_id", user.id)
      .in("status", ["confirmed", "en_route", "arrived", "in_progress", "awaiting_customer_confirmation"]),
    supabase
      .from("payments")
      .select("professional_amount_minor, status")
      .eq("status", "paid"),
  ]);

  const earningsMinor = (paymentsResult.data ?? []).reduce(
    (total, payment) => total + Number(payment.professional_amount_minor ?? 0),
    0
  );

  const opportunities = opportunitiesResult.data ?? [];
  const activeBookings = bookingsResult.data ?? [];

  return (
    <div className="shell page">
      <div className="dashboardHead">
        <div>
          <span className="eyebrow">Professional dashboard</span>
          <h1>{professional.business_name || profile.full_name}</h1>
          <p>{professional.is_available ? "Available for matching" : "Currently marked unavailable"}</p>
        </div>
      </div>

      <div className="metricGrid">
        <div className="metricCard"><span>New opportunities</span><strong>{opportunities.length}</strong><small>Current open jobs</small></div>
        <div className="metricCard"><span>Active bookings</span><strong>{activeBookings.length}</strong><small>Confirmed or in progress</small></div>
        <div className="metricCard"><span>Completed jobs</span><strong>{professional.completed_jobs}</strong><small>Verified completions</small></div>
        <div className="metricCard"><span>Total paid earnings</span><strong>{formatMinor(earningsMinor)}</strong><small>From recorded paid transactions</small></div>
      </div>

      <div className="dashboardLayout">
        <section className="contentCard">
          <div className="sectionHead"><div><span className="eyebrow">Nearby jobs</span><h2>New opportunities</h2></div></div>
          {opportunities.map((job) => (
            <div className="jobRow" key={job.id}>
              <div>
                <strong>{job.title}</strong>
                <span>{job.location_name} · {job.urgency || "Flexible timing"}</span>
              </div>
              <div>
                <strong>
                  {job.budget_min_minor != null || job.budget_max_minor != null
                    ? `${formatMinor(job.budget_min_minor)} – ${formatMinor(job.budget_max_minor)}`
                    : "Request quote"}
                </strong>
                <button className="button buttonGhost" disabled>Quote flow next</button>
              </div>
            </div>
          ))}
          {!opportunities.length ? <p>No matching open jobs are available right now.</p> : null}
        </section>

        <aside>
          <section className="contentCard">
            <span className="eyebrow">Reputation</span>
            <h2>{professional.average_rating || 0} ★</h2>
            <p>{professional.reputation_score || 0}/100 reputation score · {professional.completed_jobs} completed jobs.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

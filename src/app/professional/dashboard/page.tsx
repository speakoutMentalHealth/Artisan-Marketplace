const opportunities = [
  { job: "Install two ceiling fans", category: "Electrical", distance: "3.4 km", budget: "₦15,000–₦25,000", when: "Tomorrow" },
  { job: "Diagnose inverter fault", category: "Solar / Electrical", distance: "5.1 km", budget: "Request quote", when: "Today" },
  { job: "Replace damaged wall socket", category: "Electrical", distance: "1.8 km", budget: "₦5,000–₦10,000", when: "This week" }
];

export default function ProfessionalDashboard() {
  return (
    <div className="shell page">
      <div className="dashboardHead">
        <div><span className="eyebrow">Professional dashboard</span><h1>Good evening, Musa.</h1><p>Here is what needs your attention.</p></div>
        <button className="button">Update availability</button>
      </div>

      <div className="metricGrid">
        <div className="metricCard"><span>New opportunities</span><strong>7</strong><small>Matching your service area</small></div>
        <div className="metricCard"><span>Today's bookings</span><strong>2</strong><small>Next at 10:00 AM</small></div>
        <div className="metricCard"><span>Active jobs</span><strong>3</strong><small>1 awaiting completion</small></div>
        <div className="metricCard"><span>This month's earnings</span><strong>₦185k</strong><small>Before settlement fees</small></div>
      </div>

      <div className="dashboardLayout">
        <section className="contentCard">
          <div className="sectionHead"><div><span className="eyebrow">Nearby jobs</span><h2>New opportunities</h2></div><button className="textButton">View all</button></div>
          {opportunities.map(o => <div className="jobRow" key={o.job}><div><strong>{o.job}</strong><span>{o.category} · {o.distance} · {o.when}</span></div><div><strong>{o.budget}</strong><button className="button buttonGhost">Send quote</button></div></div>)}
        </section>
        <aside>
          <section className="contentCard">
            <span className="eyebrow">Profile strength</span><div className="progressLabel"><strong>85%</strong><span>complete</span></div><div className="progressTrack"><span style={{width:"85%"}} /></div>
            <p>Add two more portfolio jobs and your weekly availability to improve matching.</p><button className="button buttonGhost fullButton">Improve profile</button>
          </section>
          <section className="contentCard"><span className="eyebrow">Reputation</span><h2>4.9 ★</h2><p>96 completed jobs · excellent standing.</p></section>
        </aside>
      </div>
    </div>
  );
}

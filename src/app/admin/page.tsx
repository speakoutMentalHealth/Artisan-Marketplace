const applications = [
  { name: "Ibrahim Yusuf", service: "Plumbing", location: "Keffi", state: "Identity review", age: "18 min" },
  { name: "Mercy Beauty Studio", service: "Hair & Beauty", location: "Abuja", state: "Documents ready", age: "42 min" },
  { name: "Sani Auto Works", service: "Auto Repair", location: "Keffi", state: "Reference review", age: "1 hr" }
];

export default function AdminPage() {
  return (
    <div className="shell page">
      <div className="dashboardHead"><div><span className="eyebrow">Operations console</span><h1>Admin dashboard</h1><p>Prioritize trust, verification, disputes and payment exceptions.</p></div><button className="button buttonGhost">Export report</button></div>
      <div className="metricGrid">
        <div className="metricCard warning"><span>Applications</span><strong>17</strong><small>Need review</small></div>
        <div className="metricCard"><span>Verified professionals</span><strong>142</strong><small>Across active service areas</small></div>
        <div className="metricCard warning"><span>Open disputes</span><strong>3</strong><small>1 high priority</small></div>
        <div className="metricCard"><span>Completed jobs</span><strong>486</strong><small>Demo operations data</small></div>
      </div>

      <section className="contentCard">
        <div className="sectionHead"><div><span className="eyebrow">Needs attention</span><h2>Professional applications</h2></div><button className="textButton">Open verification queue</button></div>
        <div className="adminTable" role="table" aria-label="Professional applications">
          <div className="tableRow tableHead" role="row"><span>Applicant</span><span>Service</span><span>Location</span><span>Status</span><span>Waiting</span><span></span></div>
          {applications.map(a => <div className="tableRow" role="row" key={a.name}><strong>{a.name}</strong><span>{a.service}</span><span>{a.location}</span><span className="statusText">{a.state}</span><span>{a.age}</span><button className="button buttonGhost">Review</button></div>)}
        </div>
      </section>

      <section className="contentCard">
        <span className="eyebrow">Safety principle</span>
        <h2>Verification must describe what was actually checked.</h2>
        <p>An identity check does not automatically prove technical competence. The data model separates phone, identity, certificate, bank and reference verification so the public badge remains accurate.</p>
      </section>
    </div>
  );
}

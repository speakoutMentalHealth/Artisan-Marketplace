export default function PostJobPage() {
  return (
    <div className="shell page narrowPage">
      <div className="pageHeading">
        <span className="eyebrow">Post a job</span>
        <h1>Tell us what you need done</h1>
        <p>We'll use the service type, location and timing to match the request with suitable verified professionals.</p>
      </div>

      <form className="formCard">
        <div className="formProgress"><span className="active"></span><span></span><span></span><span></span></div>
        <label>Job title<input placeholder="e.g. Install two ceiling fans" /></label>
        <label>Service category
          <select defaultValue=""><option value="" disabled>Select a service</option><option>Electrical</option><option>Plumbing</option><option>Cleaning</option><option>Carpentry</option><option>AC & Cooling</option><option>Auto Repair</option><option>Tailoring</option><option>Beauty</option></select>
        </label>
        <label>Describe the work<textarea rows={5} placeholder="Include enough detail for a professional to understand the job before quoting." /></label>
        <div className="uploadBox"><strong>Add photos</strong><span>Photos help professionals quote more accurately.</span><button type="button" className="button buttonGhost">Choose images</button></div>
        <div className="twoCol">
          <label>Area or city<input placeholder="Keffi" /></label>
          <label>When do you need it?<select><option>As soon as possible</option><option>Today</option><option>Tomorrow</option><option>Select a date</option></select></label>
        </div>
        <label>Budget preference<select><option>Let professionals quote</option><option>I have a budget range</option><option>Fixed budget</option></select></label>
        <div className="privacyNote"><strong>Your exact address stays private.</strong><span>Only share precise job-location details when a booking reaches the appropriate stage.</span></div>
        <button className="button fullButton" type="submit">Continue</button>
      </form>
    </div>
  );
}

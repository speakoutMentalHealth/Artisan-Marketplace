import { createJobAction } from "./actions";
import { getServiceCategories } from "@/lib/data/categories";

export default async function PostJobPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const categories = await getServiceCategories();

  return (
    <div className="shell page narrowPage">
      <div className="pageHeading">
        <span className="eyebrow">Post a job</span>
        <h1>Tell us what you need done</h1>
        <p>We'll use the service type, location and timing to match the request with suitable verified professionals.</p>
      </div>

      {error ? <div className="formAlert" role="alert">{error}</div> : null}

      <form className="formCard" action={createJobAction}>
        <div className="formProgress"><span className="active"></span><span className="active"></span><span></span><span></span></div>

        <label>Job title
          <input name="title" placeholder="e.g. Install two ceiling fans" required />
        </label>

        <label>Service category
          <select name="category_id" defaultValue="">
            <option value="">Select a service</option>
            {categories.map((category) => (
              <option value={category.id ?? ""} key={category.slug}>{category.name}</option>
            ))}
          </select>
        </label>

        <label>Describe the work
          <textarea
            name="description"
            rows={5}
            placeholder="Include enough detail for a professional to understand the job before quoting."
            required
          />
        </label>

        <div className="uploadBox">
          <strong>Job photos</strong>
          <span>Private photo uploads are the next build step. The job can be posted now without exposing files publicly.</span>
        </div>

        <div className="twoCol">
          <label>Area or city
            <input name="location_name" placeholder="Keffi, Nasarawa" required />
          </label>
          <label>When do you need it?
            <select name="urgency" defaultValue="flexible">
              <option value="now">As soon as possible</option>
              <option value="today">Today</option>
              <option value="scheduled">Scheduled</option>
              <option value="flexible">Flexible</option>
            </select>
          </label>
        </div>

        <div className="twoCol">
          <label>Minimum budget (₦)
            <input name="budget_min" type="number" min="0" step="100" placeholder="Optional" />
          </label>
          <label>Maximum budget (₦)
            <input name="budget_max" type="number" min="0" step="100" placeholder="Optional" />
          </label>
        </div>

        <div className="privacyNote">
          <strong>Your exact address stays private.</strong>
          <span>This first job record stores only the public area/city. Precise addresses belong in the accepted-booking workflow.</span>
        </div>

        <button className="button fullButton" type="submit">Post job</button>
      </form>
    </div>
  );
}

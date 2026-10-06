import Link from "next/link";
import { naira, professionals } from "@/lib/demo-data";
import { getServiceCategories } from "@/lib/data/categories";

export default async function ExplorePage() {
  const categories = await getServiceCategories();

  return (
    <div className="shell page">
      <div className="pageHeading">
        <span className="eyebrow">Explore professionals</span>
        <h1>Find the right person for the job</h1>
        <p>Compare location, verification, reputation, experience and price — not just the cheapest quote.</p>
      </div>

      <div className="exploreLayout">
        <aside className="filterPanel">
          <h3>Filters</h3>
          <label>Service<select defaultValue=""><option value="">All services</option>{categories.map(c => <option key={c.name}>{c.name}</option>)}</select></label>
          <label>Distance<select><option>Within 5 km</option><option>Within 10 km</option><option>Within 25 km</option></select></label>
          <label>Availability<select><option>Any time</option><option>Available now</option><option>Today</option><option>This week</option></select></label>
          <label>Rating<select><option>Any rating</option><option>4.0+</option><option>4.5+</option></select></label>
          <label className="checkRow"><input type="checkbox" /> Verified only</label>
          <button className="button fullButton">Apply filters</button>
        </aside>

        <section className="resultList">
          <div className="resultHead"><strong>{professionals.length} recommended professionals</strong><select><option>Recommended</option><option>Nearest</option><option>Highest rated</option></select></div>
          {professionals.map((professional) => (
            <article className="resultCard" key={professional.slug}>
              <div className="avatar">{professional.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
              <div className="resultMain">
                <div className="resultTitle">
                  <div><h2>{professional.name}</h2><p>{professional.trade}</p></div>
                  <span className={professional.available ? "statusPill" : "statusPill muted"}>{professional.available ? "Available today" : "Check availability"}</span>
                </div>
                <div className="cardBadges"><span>✓ {professional.badges[0]}</span><span>{professional.area} · {professional.distanceKm} km</span></div>
                <div className="ratingRow"><strong>{professional.rating} ★</strong><span>{professional.reviews} reviews · {professional.completedJobs} completed jobs · ~{professional.responseMinutes} min response</span></div>
                <div className="resultActions">
                  <strong>{professional.startingPrice ? "From " + naira(professional.startingPrice) : "Request quote"}</strong>
                  <Link className="button buttonGhost" href={"/professionals/" + professional.slug}>View profile</Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

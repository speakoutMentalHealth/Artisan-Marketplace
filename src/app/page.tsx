import Link from "next/link";
import { naira, professionals } from "@/lib/demo-data";
import { getServiceCategories } from "@/lib/data/categories";

export default async function HomePage() {
  const categories = await getServiceCategories();

  return (
    <>
      <section className="hero">
        <div className="shell heroGrid">
          <div className="heroCopy">
            <span className="eyebrow">Verified local professionals</span>
            <h1>Trusted skills.<br />Right around you.</h1>
            <p className="heroLead">
              Find, compare and hire skilled professionals for repairs, maintenance,
              beauty, technical work and everyday services.
            </p>
            <form className="searchBar" action="/explore">
              <label>
                <span>What do you need?</span>
                <input name="service" placeholder="Plumber, electrician, cleaner..." />
              </label>
              <label>
                <span>Where?</span>
                <input name="location" placeholder="City or area" />
              </label>
              <button type="submit">Find a professional</button>
            </form>
            <div className="heroMeta">
              <span>✓ Verified profiles</span>
              <span>✓ Real booking reviews</span>
              <span>✓ Location-based discovery</span>
            </div>
          </div>
          <aside className="trustCard">
            <span className="statusPill">Available today</span>
            <div className="avatarLarge">MT</div>
            <h2>Musa Technical Services</h2>
            <p>Electrician · Solar Installer</p>
            <div className="ratingRow"><strong>4.9 ★</strong><span>96 completed jobs</span></div>
            <div className="miniStats">
              <div><strong>2.3 km</strong><span>away</span></div>
              <div><strong>~12 min</strong><span>response</span></div>
              <div><strong>3</strong><span>verifications</span></div>
            </div>
            <Link className="button fullButton" href="/professionals/musa-technical-services">View profile</Link>
          </aside>
        </div>
      </section>

      <section className="section shell">
        <div className="sectionHead">
          <div><span className="eyebrow">Popular services</span><h2>What do you need done?</h2></div>
          <Link href="/explore">View all services →</Link>
        </div>
        <div className="categoryGrid">
          {categories.map((category) => (
            <Link className="categoryCard" href={"/explore?service=" + encodeURIComponent(category.name)} key={category.name}>
              <span className="categoryIcon">{category.icon}</span>
              <strong>{category.name}</strong>
              <small>{category.description}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="section shell">
        <div className="urgentCard">
          <div>
            <span className="eyebrow inverse">Urgent service</span>
            <h2>Need someone as soon as possible?</h2>
            <p>Find verified professionals who have marked themselves available nearby.</p>
          </div>
          <Link className="button buttonLight" href="/explore?availability=now">Find someone now</Link>
        </div>
      </section>

      <section className="section shell">
        <div className="sectionHead">
          <div><span className="eyebrow">Recommended nearby</span><h2>Professionals people trust</h2></div>
          <Link href="/explore">Explore all →</Link>
        </div>
        <div className="professionalGrid">
          {professionals.map((professional) => (
            <article className="professionalCard" key={professional.slug}>
              <div className="professionalTop">
                <div className="avatar">{professional.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                <span className={professional.available ? "statusPill" : "statusPill muted"}>
                  {professional.available ? "Available" : "Next available"}
                </span>
              </div>
              <h3>{professional.name}</h3>
              <p>{professional.trade}</p>
              <div className="cardBadges">
                <span>✓ Identity verified</span>
                <span>{professional.distanceKm} km away</span>
              </div>
              <div className="ratingRow">
                <strong>{professional.rating} ★</strong>
                <span>{professional.completedJobs} jobs · {professional.reviews} reviews</span>
              </div>
              <div className="priceRow">
                <div>
                  <small>Starting from</small>
                  <strong>{professional.startingPrice ? naira(professional.startingPrice) : "Request quote"}</strong>
                </div>
                <Link className="button buttonGhost" href={"/professionals/" + professional.slug}>View profile</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell">
        <div className="postJobBanner">
          <div>
            <span className="eyebrow">Not sure who to choose?</span>
            <h2>Post the job. Let suitable professionals come to you.</h2>
            <p>Describe the work, choose your location and timing, then compare quotations alongside reputation.</p>
          </div>
          <Link className="button" href="/post-job">Post a job</Link>
        </div>
      </section>

      <nav className="mobileNav" aria-label="Mobile navigation">
        <Link href="/">Home</Link>
        <Link href="/explore">Explore</Link>
        <Link className="mobilePrimary" href="/post-job">＋</Link>
        <Link href="/professional/apply">Work</Link>
        <Link href="/account">Account</Link>
      </nav>
    </>
  );
}

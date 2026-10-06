import Link from "next/link";
import { notFound } from "next/navigation";
import { naira, professionals } from "@/lib/demo-data";

export default async function ProfessionalProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const professional = professionals.find((item) => item.slug === slug);
  if (!professional) notFound();

  return (
    <div className="shell page">
      <div className="profileHero">
        <div className="avatar avatarProfile">{professional.name.split(" ").map(w => w[0]).slice(0,2).join("")}</div>
        <div className="profileIdentity">
          <span className={professional.available ? "statusPill" : "statusPill muted"}>{professional.available ? "Available today" : "Check availability"}</span>
          <h1>{professional.name}</h1>
          <p>{professional.trade}</p>
          <div className="cardBadges">{professional.badges.map(b => <span key={b}>✓ {b}</span>)}</div>
          <div className="ratingRow"><strong>{professional.rating} ★</strong><span>{professional.reviews} reviews · {professional.completedJobs} completed jobs</span></div>
        </div>
        <div className="profileActions">
          <Link className="button fullButton" href="/post-job">Request service</Link>
          <button className="button buttonGhost fullButton">Message</button>
        </div>
      </div>

      <div className="profileLayout">
        <div>
          <section className="contentCard"><span className="eyebrow">About</span><h2>Experienced local professional</h2><p>{professional.bio}</p><div className="infoStrip"><span>📍 {professional.area}</span><span>↔ Serves nearby areas</span><span>⚡ ~{professional.responseMinutes} min response</span></div></section>
          <section className="contentCard"><span className="eyebrow">Services</span><h2>Services & pricing</h2>{professional.services.map(s => <div className="serviceRow" key={s.name}><strong>{s.name}</strong><span>{s.price}</span></div>)}</section>
          <section className="contentCard"><span className="eyebrow">Portfolio</span><h2>Recent work</h2><div className="portfolioGrid">{professional.portfolio.map((item, i) => <div className="portfolioTile" key={item}><span>Work {i + 1}</span><strong>{item}</strong></div>)}</div></section>
        </div>

        <aside>
          <section className="contentCard stickyCard">
            <span className="eyebrow">Reputation</span>
            <div className="reputationScore"><strong>{Math.round(professional.rating * 20)}</strong><span>/100</span></div>
            <h3>Excellent</h3>
            <div className="metricRow"><span>Completed jobs</span><strong>{professional.completedJobs}</strong></div>
            <div className="metricRow"><span>Average rating</span><strong>{professional.rating}</strong></div>
            <div className="metricRow"><span>Response</span><strong>~{professional.responseMinutes} min</strong></div>
            <div className="metricRow"><span>Starting price</span><strong>{professional.startingPrice ? naira(professional.startingPrice) : "Quote"}</strong></div>
          </section>
        </aside>
      </div>
    </div>
  );
}

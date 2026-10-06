import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artisan Marketplace",
  description: "Find verified skilled professionals near you."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="siteHeader">
          <div className="shell navBar">
            <Link className="brand" href="/">
              <span className="brandMark">A</span>
              <span>Artisan Marketplace</span>
            </Link>
            <nav className="desktopNav" aria-label="Primary navigation">
              <Link href="/explore">Explore</Link>
              <Link href="/post-job">Post a job</Link>
              <Link href="/professional/dashboard">For professionals</Link>
              <Link href="/admin">Admin</Link>
            </nav>
            <Link className="button buttonSmall" href="/post-job">Get help</Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="shell footerGrid">
            <div>
              <div className="brand footerBrand"><span className="brandMark">A</span><span>Artisan Marketplace</span></div>
              <p>Trusted local skills, easier to discover and hire.</p>
            </div>
            <div>
              <strong>Customers</strong>
              <Link href="/explore">Find a professional</Link>
              <Link href="/post-job">Post a job</Link>
            </div>
            <div>
              <strong>Professionals</strong>
              <Link href="/professional/apply">Professional onboarding</Link>
              <span>Verification</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

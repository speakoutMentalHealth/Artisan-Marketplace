import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="shell page narrowPage">
      <section className="contentCard centeredCard">
        <span className="eyebrow">Almost there</span>
        <h1>Check your email</h1>
        <p>Use the confirmation link we sent you. After verification, you can continue into your marketplace account.</p>
        <Link className="button" href="/auth">Back to sign in</Link>
      </section>
    </div>
  );
}

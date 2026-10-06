import Link from "next/link";
import { signInAction, signUpAction } from "./actions";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="shell page authPage">
      <div className="pageHeading authHeading">
        <span className="eyebrow">Account access</span>
        <h1>Join the marketplace</h1>
        <p>Customers find trusted professionals. Skilled professionals build verified profiles and receive relevant jobs.</p>
      </div>

      {error ? <div className="formAlert" role="alert">{error}</div> : null}

      <div className="authGrid">
        <form className="formCard" action={signInAction}>
          <span className="eyebrow">Welcome back</span>
          <h2>Sign in</h2>
          <input type="hidden" name="next" value={next ?? "/account"} />
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
          <button className="button fullButton" type="submit">Sign in</button>
        </form>

        <form className="formCard" action={signUpAction}>
          <span className="eyebrow">New account</span>
          <h2>Create account</h2>
          <label>Full name<input name="full_name" autoComplete="name" required /></label>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" minLength={8} autoComplete="new-password" required /></label>
          <fieldset className="roleChoice">
            <legend>I want to</legend>
            <label><input type="radio" name="role" value="customer" defaultChecked /> Hire professionals</label>
            <label><input type="radio" name="role" value="professional" /> Offer my skills</label>
          </fieldset>
          <button className="button fullButton" type="submit">Create account</button>
          <small className="formHelp">Professional accounts still require review before they appear publicly.</small>
        </form>
      </div>

      <p className="authFootnote">By creating an account, you agree to follow the platform's safety, payment and conduct rules. <Link href="/">Return home</Link>.</p>
    </div>
  );
}

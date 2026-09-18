import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export default function Page() {
  return (
    <LegalPage title="Terms &amp; Conditions" updated="September 2026">
      <p>
        These Terms &amp; Conditions govern your use of Intern Bangla (the &quot;Platform&quot;), operated by
        AR Solutions. By creating an account, you agree to these terms.
      </p>

      <h2>1. Who Can Use Intern Bangla</h2>
      <p>
        The Platform is available to students located in Bangladesh, and to companies that are
        registered and operating within Bangladesh. Company accounts must provide accurate identity
        and location information as part of verification (see our Privacy Policy).
      </p>

      <h2>2. Your Account</h2>
      <p>
        You are responsible for keeping your login credentials secure and for all activity under your
        account. You must provide accurate information when registering and keep it up to date.
      </p>

      <h2>3. Acceptable Use &amp; Complaints</h2>
      <p>
        Students and companies may file a complaint against each other for harassment, fraud, fake
        listings, no-shows, spam, or other misconduct. Our admin team reviews every complaint and may:
      </p>
      <ul>
        <li>Dismiss the complaint if no violation is found,</li>
        <li>Issue a warning to the account in question, or</li>
        <li>Permanently ban the account if the violation is serious or repeated.</li>
      </ul>
      <p>
        A permanently banned account loses all access to the Platform. A banned user may submit an
        appeal, up to a maximum of <strong>2 appeals</strong>, which an admin will review and may approve
        (restoring access) or reject.
      </p>

      <h2>4. Company Verification</h2>
      <p>
        Every company account must be verified by our admin team before it can post internship listings.
        Verification requires proof the company is genuinely located and operating in Bangladesh (such as
        a trade license, TIN certificate, or RJSC certificate of incorporation) along with an accurate
        business address. Intern Bangla may reject or revoke verification at its discretion.
      </p>

      <h2>5. Content You Submit</h2>
      <p>
        You retain ownership of content you upload (resumes/CVs, profile photos, project submissions).
        By uploading it, you grant Intern Bangla a limited license to store and display it on the
        Platform for the purpose of operating the service (e.g. showing your resume to a company you
        applied to). Uploaded profile images are limited to 2MB.
      </p>

      <h2>6. Certificates</h2>
      <p>
        Intern Bangla may issue a completion certificate after a qualifying internship. Host companies
        and Intern Bangla admins may also upload their own certificates to a student&apos;s account.
        Certificates reflect participation in a specific tracked internship and are not a guarantee of
        employment.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        The Intern Bangla name, logo, and platform design are the property of AR Solutions. This
        Platform uses open-source software components under their respective licenses - see{" "}
        <Link href="/legal/credits" className="text-primary hover:underline">Credits &amp; Sources</Link>. Market
        statistics referenced on the Platform are cited to their original public sources.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        Intern Bangla is a platform connecting students and companies; we do not guarantee the outcome of
        any internship, employment offer, or stipend payment. Disputes over pay or work terms are
        primarily between the student and the host company, though you may file a complaint if either
        party violates these terms.
      </p>

      <h2>9. Contact</h2>
      <p>Questions about these terms can be sent via our <Link href="/contact" className="text-primary hover:underline">Contact page</Link>.</p>
    </LegalPage>
  );
}

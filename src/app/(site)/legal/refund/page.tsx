import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export default function Page() {
  return (
    <LegalPage title="Refund Policy" updated="September 2026">
      <p>
        Applying for internships and posting/finding internship listings on Intern Bangla is free. This
        policy covers our paid, self-paced courses only.
      </p>

      <h2>1. Free Courses &amp; Internships</h2>
      <p>
        Internships, the Pro Internship track, and courses marked &quot;Free&quot; have no charge and are
        not eligible for a refund since no payment was made.
      </p>

      <h2>2. Paid Courses</h2>
      <ul>
        <li>You may request a full refund within 7 days of purchase if you have completed less than 20% of the course content.</li>
        <li>No refund is available after 7 days, or after completing 20% or more of the course.</li>
        <li>Refunds are processed to the original payment method within 7-10 business days of approval.</li>
      </ul>

      <h2>3. How to Request a Refund</h2>
      <p>
        Contact us via our <Link href="/contact" className="text-primary hover:underline">Contact page</Link>{" "}
        with your account email and the course name. We will confirm eligibility and process approved
        refunds promptly.
      </p>

      <h2>4. Exceptions</h2>
      <p>
        We may deny a refund request where there is evidence of abuse (e.g. repeated purchase-and-refund
        cycles) or where the account has been banned for a Terms &amp; Conditions violation.
      </p>
    </LegalPage>
  );
}

import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export default function Page() {
  return (
    <LegalPage title="Cancellation Policy" updated="September 2026">
      <h2>1. Cancelling a Course Enrollment</h2>
      <p>
        You can cancel your enrollment in a self-paced course at any time from your student dashboard.
        Cancelling a paid course follows our{" "}
        <Link href="/legal/refund" className="text-primary hover:underline">Refund Policy</Link>.
      </p>

      <h2>2. Withdrawing from an Internship</h2>
      <p>
        If you need to withdraw from an internship you&apos;ve been accepted into, notify the host
        company and Intern Bangla as early as possible. Repeated last-minute withdrawals or no-shows may
        be reported as a complaint and reviewed by our admin team, which can result in a warning.
      </p>

      <h2>3. Companies Cancelling a Listing</h2>
      <p>
        A verified company may close or cancel an internship listing at any time from their dashboard.
        Students who already applied will be notified that the listing was closed.
      </p>

      <h2>4. Account Cancellation</h2>
      <p>
        You may request full account deletion by contacting us via our{" "}
        <Link href="/contact" className="text-primary hover:underline">Contact page</Link>. Note that records
        tied to an active complaint or ban may be retained as described in our Privacy Policy.
      </p>
    </LegalPage>
  );
}

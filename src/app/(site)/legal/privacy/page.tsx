import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export default function Page() {
  return (
    <LegalPage title="Privacy Policy" updated="September 2026">
      <p>
        This Privacy Policy explains what data Intern Bangla (operated by AR Solutions) collects, why,
        and how it is protected.
      </p>

      <h2>1. Data We Collect</h2>
      <ul>
        <li>Account details: name, email address, and optionally phone number</li>
        <li>A profile photo you upload (max 2MB)</li>
        <li>For students: your resume/CV (PDF), skills, and application history</li>
        <li>For companies: business name, industry, address, and identity verification documents (e.g. trade license, TIN, or RJSC certificate)</li>
        <li>Complaints you file or that are filed against your account, and any appeal you submit</li>
        <li>Basic technical data such as login timestamps, for security purposes</li>
      </ul>

      <h2>2. How We Use Your Data</h2>
      <ul>
        <li>To operate your account and match students with internships</li>
        <li>To verify company identity and location before a company can post listings</li>
        <li>To review complaints, issue warnings or bans, and process appeals</li>
        <li>To issue and display completion certificates</li>
        <li>To send account-related emails (welcome, profile updates, password resets)</li>
      </ul>

      <h2>3. Who Can See Your Data</h2>
      <p>
        Your resume is visible to companies you apply to and to Intern Bangla admins. Your profile
        details are visible to yourself and admins; other users cannot browse arbitrary profiles.
        Complaint details are visible only to the reporter, the reported party (in general terms), and
        admins.
      </p>

      <h2>4. Data Retention &amp; Deletion</h2>
      <p>
        We retain your data while your account is active. If your account is deleted, associated
        records (resumes, applications) are removed or anonymized within a reasonable period, except
        where we are required to retain records for legal or dispute-resolution purposes (e.g. an
        active complaint or ban record).
      </p>

      <h2>5. Security</h2>
      <p>
        Passwords are hashed and never stored in plain text. File uploads are size- and type-restricted.
        Access to administrative functions requires an authenticated admin account, and every
        permission check is enforced on our servers.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You can view and edit your profile at any time from your account page, including changing your
        email, phone number, or password. You may request account deletion by contacting us.
      </p>

      <h2>7. Contact</h2>
      <p>
        For privacy questions or data requests, reach us via our{" "}
        <Link href="/contact" className="text-primary hover:underline">Contact page</Link>.
      </p>
    </LegalPage>
  );
}

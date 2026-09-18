import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { blogPosts } from "@/lib/marketData";

const backendLibraries = [
  ["NestJS (@nestjs/*)", "MIT"],
  ["TypeORM", "MIT"],
  ["passport, passport-jwt", "MIT"],
  ["bcrypt", "MIT"],
  ["class-validator, class-transformer", "MIT"],
  ["helmet", "MIT"],
  ["@nestjs/swagger, swagger-ui-express", "MIT / Apache-2.0"],
  ["nodemailer, handlebars", "MIT"],
];

const frontendLibraries = [
  ["Next.js, React, React DOM", "MIT"],
  ["Tailwind CSS", "MIT"],
  ["Framer Motion", "MIT"],
  ["Radix UI (@radix-ui/*)", "MIT"],
  ["Lucide icons", "ISC"],
  ["Geist, Sora, Space Grotesk fonts (via Google Fonts)", "SIL Open Font License"],
];


export default function Page() {
  const allSources = blogPosts.flatMap((p) => p.sources);

  return (
    <LegalPage title="Credits &amp; Sources" updated="September 2026">
      <p>
        Intern Bangla is built on open-source software and, where we reference real market data, on
        publicly available sources. This page credits both, in the interest of transparency and
        respecting others&apos; work.
      </p>

      <h2>Copyright</h2>
      <p>
        Intern Bangla &copy; {new Date().getFullYear()} AR Solutions. All rights reserved. The
        third-party components below remain the property of their respective authors under their own
        licenses (see LICENSE and THIRD_PARTY_NOTICES.md in the project repositories for full text).
      </p>

      <h2>Backend Libraries</h2>
      <ul>
        {backendLibraries.map(([name, license]) => (
          <li key={name}>{name} &mdash; {license}</li>
        ))}
      </ul>

      <h2>Frontend Libraries</h2>
      <ul>
        {frontendLibraries.map(([name, license]) => (
          <li key={name}>{name} &mdash; {license}</li>
        ))}
      </ul>

      <h2>Market Data Sources</h2>
      <p>
        Statistics referenced in our{" "}
        <Link href="/blog" className="text-primary hover:underline">blog</Link> and program pages (typical
        stipend ranges, in-demand skills, freelancer counts) are drawn from these public sources:
      </p>
      <ul>
        {allSources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {s.label}
            </a>
          </li>
        ))}
      </ul>

      <h2>Photography</h2>
      <p>
        Background photography on the homepage is sourced from{" "}
        <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          Unsplash
        </a>{" "}
        under the{" "}
        <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          Unsplash License
        </a>
        , which permits free use for commercial purposes. We deliberately avoid using images sourced from
        Pinterest or similar re-sharing platforms, since the original photographer and license are often
        unclear there.
      </p>

      <h2>External Resources We Recommend</h2>
      <p>
        Where we don&apos;t build a tool ourselves, we link to genuinely free, reputable external
        resources rather than reinventing them - see our{" "}
        <Link href="/student-corner/resume-builder" className="text-primary hover:underline">Career Toolkit</Link>{" "}
        page for CV builders and beginner learning resources.
      </p>

      <h2>Something Missing?</h2>
      <p>
        If you believe any content on Intern Bangla uses your work without proper credit, please contact
        us via our <Link href="/contact" className="text-primary hover:underline">Contact page</Link> and we
        will review and correct it promptly.
      </p>
    </LegalPage>
  );
}

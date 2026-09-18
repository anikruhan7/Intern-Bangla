// Tommy's grounding knowledge - a hand-written summary of what's actually
// published on Intern Bangla, kept in sync with the frontend's own content
// (see Intern-Bangla-frontend/src/lib/marketData.ts and the site's pages).
// This is genuine "search our own resources" - not a placeholder.

export type KnowledgeEntry = {
  keywords: string[];
  title: string;
  url: string;
  answer: string;
};

export const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ["register", "sign up", "create account", "join", "student account", "company account"],
    title: "Creating an Account",
    url: "/register",
    answer:
      "You can register as either a Student or a Company from the Register page. Students only need a name, email, and password (a phone number is optional and lets you log in with it too). Companies also provide a company name, industry, and address - every company account is reviewed by an admin before it can post internships.",
  },
  {
    keywords: ["login", "log in", "sign in", "forgot password", "reset password", "phone login"],
    title: "Logging In",
    url: "/login",
    answer:
      "Log in with either your email or phone number, plus your password. If you forget your password, use 'Forgot password?' on the login page - it emails you a 6-digit code that's valid for 1 minute. Passwords can also be changed anytime from My Account once logged in.",
  },
  {
    keywords: ["internship", "apply", "stipend", "salary", "pay", "how much"],
    title: "Internships & Stipends",
    url: "/programs/internships",
    answer:
      "Intern Bangla lists internships across 7 domains (web dev, data analytics, cybersecurity, AI/ML, Python, Java, HR). Typical stipends in the Bangladeshi market run about ৳10,000-25,000/month, with our Pro Internship track (mentor-led, guaranteed project) paying more, around ৳20,000-35,000/month.",
  },
  {
    keywords: ["pro internship", "mentor", "guaranteed project"],
    title: "Pro Internships",
    url: "/programs/pro-internships",
    answer:
      "Pro Internships are paid, mentor-led tracks with guaranteed project ownership and a certificate at the end - a step up from a standard internship, aimed at students who want closer mentorship and a stronger portfolio piece.",
  },
  {
    keywords: ["course", "courses", "learn", "learning track", "free course"],
    title: "Courses",
    url: "/programs/courses",
    answer:
      "We offer self-paced courses in Web Development, Data Analytics, Cybersecurity, AI/ML, Python, Java, and HR. Some are free (like the Python and HR fundamentals courses); others are paid, self-paced, and project-based.",
  },
  {
    keywords: ["certificate", "certificates", "certification", "verify certificate", "completion", "get certified"],
    title: "Certificates",
    url: "/student-corner/verify-certificate",
    answer:
      "After completing a qualifying internship, Intern Bangla issues a completion certificate, viewable from your student portal. Your host company or an admin can also upload a certificate directly to your account.",
  },
  {
    keywords: [
      "complaint",
      "complaints",
      "report",
      "harassment",
      "scam",
      "fraud",
      "ban",
      "banned",
      "get banned",
      "appeal",
      "appeals",
      "file a complaint",
    ],
    title: "Complaints & Appeals",
    url: "/legal/terms",
    answer:
      "Students and companies can file a complaint against each other for issues like harassment, fraud, fake listings, or no-shows. Our admin team reviews every complaint and can issue a warning or a permanent ban. A banned account can submit an appeal - up to 2 appeals are allowed - which an admin reviews and may approve to restore access.",
  },
  {
    keywords: [
      "verify company",
      "verified as a company",
      "verification",
      "verified",
      "verify",
      "get verified",
      "trade license",
      "tin",
      "rjsc",
      "company identity",
    ],
    title: "Company Verification",
    url: "/company/hire-talent",
    answer:
      "Every company must be located in Bangladesh and is verified by our admin team before posting listings, using documents like a trade license, TIN certificate, or RJSC certificate of incorporation, plus a verified business address.",
  },
  {
    keywords: ["resume", "cv", "cv builder", "resume builder", "career toolkit"],
    title: "Career Toolkit",
    url: "/student-corner/resume-builder",
    answer:
      "Rather than build a worse in-house tool, we link you to genuinely good free resources: CV builders like FlowCV, FreeCV, and OpenResume, plus learning channels like freeCodeCamp, Traversy Media, and Bangladesh's own Programming Hero.",
  },
  {
    keywords: ["contact", "support", "help", "email", "phone number of intern bangla"],
    title: "Contact Us",
    url: "/contact",
    answer:
      "You can reach Intern Bangla via the Contact page, by phone at +880 1615-002383, or by email at internbangla@gmail.com. We're based in Bashundhara R/A, Dhaka.",
  },
  {
    keywords: ["refund", "cancel", "cancellation"],
    title: "Refunds & Cancellations",
    url: "/legal/refund",
    answer:
      "Internships and free courses have no charge and aren't refundable since nothing was paid. Paid courses can be refunded in full within 7 days if you've completed less than 20% of the content - see our Refund Policy for details.",
  },
  {
    keywords: ["copyright", "license", "credit", "source", "attribution"],
    title: "Credits & Copyright",
    url: "/legal/credits",
    answer:
      "Intern Bangla is © AR Solutions, built on properly-licensed open-source software and citing every external statistic we reference. See the Credits & Sources page for the full list.",
  },
];

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Whole-word/phrase match only - "learn" must not match inside "learning". */
function matchesKeyword(question: string, keyword: string): boolean {
  const pattern = new RegExp(`\\b${escapeRegExp(keyword.toLowerCase())}\\b`);
  return pattern.test(question);
}

export function searchKnowledgeBase(question: string): KnowledgeEntry[] {
  const q = question.toLowerCase();
  const scored = knowledgeBase
    .map((entry) => ({
      entry,
      score: entry.keywords.filter((k) => matchesKeyword(q, k)).length,
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 2).map((s) => s.entry);
}

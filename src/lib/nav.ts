export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; links: NavLink[] };

export const navGroups: NavGroup[] = [
  {
    label: "Programs",
    links: [
      { label: "Pro Internships", href: "/programs/pro-internships" },
      { label: "Courses", href: "/programs/courses" },
      { label: "Internships", href: "/programs/internships" },
      { label: "Events & Workshops", href: "/programs/events" },
    ],
  },
  {
    label: "Student Corner",
    links: [
      { label: "Projects", href: "/student-corner/projects" },
      { label: "Career Toolkit", href: "/student-corner/resume-builder" },
      { label: "Hall of Fame", href: "/student-corner/hall-of-fame" },
      { label: "Verify Certificate", href: "/student-corner/verify-certificate" },
      { label: "Campus Ambassador", href: "/student-corner/campus-ambassador" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "Hire Talent", href: "/company/hire-talent" },
      { label: "About Us", href: "/company/about" },
    ],
  },
];

export const singleLinks: NavLink[] = [{ label: "Blog", href: "/blog" }];

export const footerLegalLinks: NavLink[] = [
  { label: "Terms & Conditions", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Refund Policy", href: "/legal/refund" },
  { label: "Cancellation Policy", href: "/legal/cancellation" },
];

export const domains = [
  { name: "Full Stack Web Development", slug: "web-development" },
  { name: "Data Analytics & Business Intelligence", slug: "data-analytics" },
  { name: "Cybersecurity & Ethical Hacking", slug: "cyber-security" },
  { name: "Artificial Intelligence & Machine Learning", slug: "ai-ml" },
  { name: "Python Programming & Automation", slug: "python" },
  { name: "Java Software Development", slug: "java" },
  { name: "Human Resources", slug: "human-resources" },
];

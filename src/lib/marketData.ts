// Demo/sample content for the marketing site, grounded in real, publicly
// reported facts about the Bangladesh job & internship market (freelancer
// counts, typical stipend ranges, in-demand skill areas). Company names,
// listings, and student profiles below are illustrative examples built for
// this demo - not real postings or real people.

export type Internship = {
  title: string;
  domainSlug: string;
  domain: string;
  domainShort: string;
  company: string;
  mode: "Remote" | "Hybrid - Dhaka" | "On-site - Dhaka";
  duration: string;
  stipend: string;
  description: string;
  requirements: string[];
};

export const internships: Internship[] = [
  {
    title: "Frontend Development Intern",
    domainSlug: "web-development",
    domainShort: "Web Dev",
    domain: "Full Stack Web Development",
    company: "NovaTech BD",
    mode: "Remote",
    duration: "6 weeks",
    stipend: "৳10,000–15,000/month",
    description:
      "Build responsive interfaces for a live product using React and Tailwind, working directly with a senior engineer.",
    requirements: ["HTML/CSS/JavaScript fundamentals", "Basic React", "Git basics"],
  },
  {
    title: "Data Analytics Intern",
    domainSlug: "data-analytics",
    domainShort: "Data Analytics",
    domain: "Data Analytics & Business Intelligence",
    company: "Dhaka Analytics Lab",
    mode: "Hybrid - Dhaka",
    duration: "8 weeks",
    stipend: "৳12,000–18,000/month",
    description:
      "Clean and analyze real business datasets, build dashboards in Power BI/Looker, and present findings to stakeholders.",
    requirements: ["SQL basics", "Excel/Sheets", "Comfort with numbers"],
  },
  {
    title: "Cybersecurity Analyst Intern",
    domainSlug: "cyber-security",
    domainShort: "Cybersecurity",
    domain: "Cybersecurity & Ethical Hacking",
    company: "CyberShield BD",
    mode: "On-site - Dhaka",
    duration: "8 weeks",
    stipend: "৳15,000–20,000/month",
    description:
      "Assist with vulnerability scans, log monitoring, and basic penetration testing under a security lead's supervision.",
    requirements: ["Networking basics", "Linux fundamentals", "Curiosity for security"],
  },
  {
    title: "AI/ML Research Intern",
    domainSlug: "ai-ml",
    domainShort: "AI/ML",
    domain: "Artificial Intelligence & Machine Learning",
    company: "Prantor AI",
    mode: "Remote",
    duration: "8 weeks",
    stipend: "৳15,000–22,000/month",
    description:
      "Support model training and evaluation for applied ML use cases, with weekly mentorship from a data scientist.",
    requirements: ["Python", "Basic statistics", "NumPy/Pandas familiarity"],
  },
  {
    title: "Python Automation Intern",
    domainSlug: "python",
    domainShort: "Python",
    domain: "Python Programming & Automation",
    company: "Codeshala",
    mode: "Remote",
    duration: "6 weeks",
    stipend: "৳10,000–15,000/month",
    description:
      "Write scripts that automate internal reporting and data pipelines for a small SaaS team.",
    requirements: ["Python fundamentals", "Basic APIs", "Problem-solving mindset"],
  },
  {
    title: "Java Backend Intern",
    domainSlug: "java",
    domainShort: "Java",
    domain: "Java Software Development",
    company: "Enterprise Softworks Ltd.",
    mode: "On-site - Dhaka",
    duration: "8 weeks",
    stipend: "৳12,000–18,000/month",
    description:
      "Contribute to a Spring Boot service used internally, writing tests and fixing real bugs alongside the backend team.",
    requirements: ["Core Java", "OOP concepts", "Basic SQL"],
  },
  {
    title: "HR & Talent Acquisition Intern",
    domainSlug: "human-resources",
    domainShort: "HR",
    domain: "Human Resources",
    company: "PeopleFirst HR Solutions",
    mode: "Hybrid - Dhaka",
    duration: "6 weeks",
    stipend: "৳8,000–12,000/month",
    description:
      "Screen candidates, coordinate interviews, and help design onboarding materials for a growing startup.",
    requirements: ["Strong communication", "Organized", "Comfortable with spreadsheets"],
  },
];

export type ProInternship = {
  title: string;
  domain: string;
  company: string;
  duration: string;
  stipend: string;
  perks: string[];
  description: string;
};

export const proInternships: ProInternship[] = [
  {
    title: "Pro Track: Full Stack Engineer",
    domain: "Web Development",
    company: "NovaTech BD",
    duration: "12 weeks",
    stipend: "৳25,000–35,000/month",
    perks: ["1:1 mentor", "Guaranteed project ownership", "Letter of recommendation"],
    description:
      "A structured, mentor-led track where you ship a production feature end-to-end and get evaluated for a junior developer conversion.",
  },
  {
    title: "Pro Track: Data Scientist",
    domain: "Data Analytics & AI",
    company: "Dhaka Analytics Lab",
    duration: "12 weeks",
    stipend: "৳25,000–32,000/month",
    perks: ["1:1 mentor", "Real client dataset", "Portfolio-ready case study"],
    description:
      "Work a full analytics project lifecycle - from raw data to a decision-ready report presented to a real stakeholder.",
  },
  {
    title: "Pro Track: Security Operations",
    domain: "Cybersecurity",
    company: "CyberShield BD",
    duration: "10 weeks",
    stipend: "৳22,000–30,000/month",
    perks: ["Industry-recognized mentor", "Hands-on lab environment", "Certificate + reference"],
    description:
      "Rotate through SOC monitoring, incident response drills, and a guided penetration testing exercise.",
  },
];

export type CourseInfo = {
  title: string;
  domain: string;
  durationWeeks: number;
  isFree: boolean;
  price?: number;
  summary: string;
  curriculum: string[];
};

export const coursesCatalog: CourseInfo[] = [
  {
    title: "Full Stack Web Development",
    domain: "Web Development",
    durationWeeks: 8,
    isFree: false,
    price: 2500,
    summary: "Go from HTML basics to a deployed React + Node.js application.",
    curriculum: ["HTML/CSS/JS fundamentals", "React & component design", "REST APIs with Node.js", "Deploying your first app"],
  },
  {
    title: "Data Analytics with SQL & Power BI",
    domain: "Data Analytics",
    durationWeeks: 6,
    isFree: false,
    price: 2000,
    summary: "Learn to query, clean, and visualize real datasets employers actually use.",
    curriculum: ["SQL for analysts", "Data cleaning in Excel/Sheets", "Power BI dashboards", "Presenting insights"],
  },
  {
    title: "Ethical Hacking Fundamentals",
    domain: "Cybersecurity",
    durationWeeks: 6,
    isFree: false,
    price: 2200,
    summary: "A hands-on introduction to networking, scanning, and common attack vectors.",
    curriculum: ["Networking basics", "Reconnaissance & scanning", "Web app vulnerabilities", "Reporting findings"],
  },
  {
    title: "AI & Machine Learning Foundations",
    domain: "AI/ML",
    durationWeeks: 8,
    isFree: false,
    price: 3000,
    summary: "Build and evaluate your first ML models with Python and scikit-learn.",
    curriculum: ["Python for data science", "Supervised learning", "Model evaluation", "A capstone ML project"],
  },
  {
    title: "Python Programming & Automation",
    domain: "Python",
    durationWeeks: 4,
    isFree: true,
    summary: "A free, beginner-friendly path into Python scripting and automation.",
    curriculum: ["Python syntax & control flow", "Working with files", "Writing your first automation script", "Intro to APIs"],
  },
  {
    title: "Java for Backend Development",
    domain: "Java",
    durationWeeks: 6,
    isFree: false,
    price: 2200,
    summary: "Core Java and Spring Boot basics to build your first backend service.",
    curriculum: ["Core Java & OOP", "Spring Boot basics", "Connecting to a database", "Building a REST API"],
  },
  {
    title: "HR Fundamentals for Startups",
    domain: "Human Resources",
    durationWeeks: 4,
    isFree: true,
    summary: "A free course covering recruiting, onboarding, and people ops basics.",
    curriculum: ["Sourcing & screening", "Structured interviewing", "Onboarding design", "Basic labor law in Bangladesh"],
  },
];

export type EventInfo = {
  title: string;
  mode: "Online" | "Offline - Dhaka";
  when: string;
  description: string;
};

export const eventsCatalog: EventInfo[] = [
  {
    title: "Resume & LinkedIn Workshop for Freshers",
    mode: "Online",
    when: "Every 2nd Saturday, 8:00 PM",
    description: "A live session on building a resume and LinkedIn profile that actually gets past recruiter screening.",
  },
  {
    title: "Cracking the Technical Interview",
    mode: "Online",
    when: "Every 4th Saturday, 8:00 PM",
    description: "Mock technical rounds and common DSA/system-design questions asked by Bangladeshi tech employers.",
  },
  {
    title: "Freelancing 101: Landing Your First Gig",
    mode: "Online",
    when: "Monthly, 1st Friday",
    description: "How to set up a Upwork/Fiverr profile, price your work, and win your first international client.",
  },
  {
    title: "Campus Meetup: AI/ML Careers in Bangladesh",
    mode: "Offline - Dhaka",
    when: "Quarterly",
    description: "An in-person meetup with past interns and mentors discussing the local AI/ML job market.",
  },
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  tag: string;
  body: string[];
  sources: { label: string; url: string }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "state-of-freelancing-bangladesh-2026",
    title: "The State of Freelancing in Bangladesh, 2026",
    excerpt:
      "Bangladesh now has over a million active freelancers and ranks among the world's top freelancing nations. Here's what that means if you're just starting out.",
    readTime: "5 min read",
    tag: "Market Insight",
    body: [
      "Bangladesh has become one of the world's largest freelancing markets, with well over a million active freelancers competing for contracts from clients in the US, UK, and Australia. Multiple industry reports place the country among the top ten globally by freelancer headcount.",
      "The categories seeing the most demand are web development (particularly Python, PHP, and JavaScript), graphic and UI/UX design, digital marketing, content writing, video editing, and virtual assistance. Virtual assistance in particular offers steady work in the $5–25/hour range for those building an initial portfolio.",
      "For students, the practical takeaway is that freelancing and traditional employment aren't an either/or choice anymore - many of the same skills (a portfolio, client communication, and delivering on scope) apply to both. An internship is often the fastest way to build that first portfolio before taking on freelance clients independently.",
    ],
    sources: [
      { label: "Jobbers.io - Freelancing in Bangladesh Guide", url: "https://www.jobbers.io/bangladesh-freelancing-guide-2025-skills-opportunities-success-strategies/" },
      { label: "DemandSage - Freelance Statistics 2026", url: "https://www.demandsage.com/freelance-statistics/" },
    ],
  },
  {
    slug: "what-interns-actually-get-paid",
    title: "What Interns Actually Get Paid in Bangladesh",
    excerpt:
      "Stipends vary a lot by company size. Here's a realistic breakdown so you know what to expect and what to negotiate for.",
    readTime: "4 min read",
    tag: "Careers",
    body: [
      "Tech internship stipends in Bangladesh typically fall between ৳10,000 and ৳25,000 per month, with successful conversions to full-time junior roles landing around ৳25,000–45,000. Stronger firms, MNCs, and export-oriented service companies tend to pay toward the higher end - often ৳35,000–70,000 for junior roles.",
      "Well-known structured programs exist too - for example, Grameenphone runs an internship program (branded 'Nextern') with a monthly stipend widely reported in the ৳10,000–15,000 range, alongside mentorship and a shot at full-time conversion.",
      "The gap between the lowest and highest end mostly comes down to company size and whether the role is local-market-facing or export/remote-facing. If you can build a portfolio strong enough for remote international clients, compensation can look very different - remote roles for foreign clients can pay several times the local range.",
    ],
    sources: [
      { label: "The CV Guy - Internships in Bangladesh 2026", url: "https://thecvguy.net/internships/internships-in-bangladesh-2026/" },
      { label: "Nucamp - Top Tech Internships in Bangladesh", url: "https://www.nucamp.co/blog/coding-bootcamp-bangladesh-bgd-top-10-tech-internships-offered-in-bangladesh" },
    ],
  },
  {
    slug: "5-skills-employers-want-2026",
    title: "5 Skills Bangladeshi Employers Are Hiring For in 2026",
    excerpt:
      "AI/ML and cloud infrastructure top the list this year - but the fundamentals still matter more than employers let on.",
    readTime: "4 min read",
    tag: "Skills",
    body: [
      "Industry surveys heading into 2026 consistently name AI/ML integration and cloud infrastructure management as the top two in-demand skill areas in Bangladesh's IT job market, followed closely by modern web development (React, Node.js), cybersecurity fundamentals, and data analytics.",
      "That said, local hiring managers repeatedly flag a skills gap: universities tend to produce generalists, while employers are looking for candidates who can demonstrate depth in at least one specific area - even at the internship level.",
      "The practical implication: pick one domain, build 2-3 real projects in it (not tutorials), and be able to explain your decisions in an interview. That's usually worth more than a broad but shallow skill list.",
    ],
    sources: [
      { label: "BizMend - ICT Sector in Bangladesh", url: "https://bizmend.com/blog/ict-sector-in-bangladesh/" },
      { label: "DEV Community - Bangladesh's Software Industry 2026", url: "https://dev.to/mir_mursalin_ankur/navigating-bangladeshs-software-industry-a-practical-guide-for-developers-in-2026-22ob" },
    ],
  },
  {
    slug: "why-your-first-internship-matters",
    title: "Why Your First Internship Matters More Than Your CGPA",
    excerpt:
      "Bangladesh's job market has a well-known catch-22 for freshers: no experience, no job. Here's how an internship actually breaks that cycle.",
    readTime: "3 min read",
    tag: "Careers",
    body: [
      "One of the most consistent complaints from fresh graduates in Bangladesh is the 'no experience, no job' problem - most employers want at least 1-2 years of experience even for entry-level roles, which is difficult when you're just starting out.",
      "Internships are the most reliable way to break that cycle. Multiple industry sources note that internships in Bangladesh frequently lead directly to permanent roles, since employers already know your work quality and don't have to take a hiring risk on an unknown candidate.",
      "In a market where salaries for generalist fresh graduates often lag behind (commonly cited around ৳30,000-60,000/month for those without specialization), a well-chosen internship - even an unpaid or low-stipend one at a good company - can be worth more long-term than an extra semester spent only on coursework.",
    ],
    sources: [
      { label: "Bangladesh Job Market Trends 2026", url: "https://blog.nextjobz.com.bd/bangladesh-job-market-trends/" },
      { label: "Fresh Graduate Salary in Bangladesh 2026", url: "https://blog.nextjobz.com.bd/fresh-graduate-salary-in-bangladesh/" },
    ],
  },
];

export type HallOfFameProfile = {
  name: string;
  domain: string;
  outcome: string;
  quote: string;
};

// Illustrative sample profiles showing the kind of outcome these tracks are
// designed for - not real students. Real profiles will replace these once
// the platform has graduates.
export const hallOfFameProfiles: HallOfFameProfile[] = [
  {
    name: "Tasnim R.",
    domain: "Web Development",
    outcome: "Converted from ৳12,000/month intern to ৳32,000/month junior developer",
    quote: "The pro track project became the centerpiece of my portfolio - it's what got me the interview.",
  },
  {
    name: "Fahim K.",
    domain: "Data Analytics",
    outcome: "Now freelancing internationally, averaging $600/month on top of a full-time role",
    quote: "The dashboard project from my internship is almost identical to what I now build for clients.",
  },
  {
    name: "Nusrat J.",
    domain: "Cybersecurity",
    outcome: "Hired full-time as a SOC analyst after an 8-week internship",
    quote: "Hands-on lab time mattered more than any certificate I'd done before.",
  },
  {
    name: "Rakib H.",
    domain: "AI/ML",
    outcome: "Built a capstone model that became a real internal tool at his host company",
    quote: "I went in knowing Python syntax and came out understanding how ML actually ships.",
  },
];

export type ProjectShowcase = {
  title: string;
  domain: string;
  stack: string[];
  description: string;
};

// Illustrative example projects showing the kind of work each track
// produces - not submissions from real students yet.
export const projectShowcase: ProjectShowcase[] = [
  {
    title: "E-Commerce Storefront",
    domain: "Web Development",
    stack: ["React", "Node.js", "PostgreSQL"],
    description: "A full storefront with cart, checkout, and an admin panel for managing products.",
  },
  {
    title: "Sales Performance Dashboard",
    domain: "Data Analytics",
    stack: ["SQL", "Power BI", "Python"],
    description: "An interactive dashboard analyzing a simulated retail dataset across regions and time.",
  },
  {
    title: "Network Vulnerability Scanner",
    domain: "Cybersecurity",
    stack: ["Python", "Nmap", "Linux"],
    description: "A CLI tool that scans a local network and reports common misconfigurations.",
  },
  {
    title: "Resume Screening Classifier",
    domain: "AI/ML",
    stack: ["Python", "scikit-learn", "Pandas"],
    description: "A model that scores resumes against a job description, built as a learning project.",
  },
  {
    title: "Inventory Management System",
    domain: "Java",
    stack: ["Java", "Spring Boot", "MySQL"],
    description: "A backend service for tracking stock levels across multiple warehouse locations.",
  },
  {
    title: "Automated Report Generator",
    domain: "Python",
    stack: ["Python", "Pandas", "APIs"],
    description: "A script that pulls data from an API daily and emails a formatted summary report.",
  },
];

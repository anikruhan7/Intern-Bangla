import Link from "next/link";
import { domains } from "@/lib/nav";

const stats = [
  { label: "Students Trained", value: "10,000+" },
  { label: "Industry Domains", value: "7" },
  { label: "Weeks Duration", value: "4-6" },
  { label: "Verified Certificates", value: "100%" },
];

const whyUs = [
  { title: "Real-World Projects", desc: "Work on live briefs, not toy exercises." },
  { title: "Offer Letter", desc: "Get an official internship offer letter on day one." },
  { title: "Verified Certificate", desc: "Digital + physical certificates you can share anywhere." },
  { title: "Flexible Learning", desc: "Self-paced weekly tracks that fit around your schedule." },
];

const steps = [
  { title: "Apply & Enroll", desc: "Pick a domain and complete your application." },
  { title: "Access the Dashboard", desc: "Log in to your personalized student dashboard." },
  { title: "Build Projects", desc: "Complete weekly tasks and get mentor feedback." },
  { title: "Get Certified", desc: "Receive your verified internship certificate." },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            Welcome to Intern Bangla
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl dark:text-white">
            Build real skills. Land real jobs.
          </h1>
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-300">
            Premium virtual internships and learning tracks for students in Bangladesh &mdash;
            real projects, industry mentorship, and verified certificates.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/programs/internships"
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Explore Programs
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-md border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-800 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-100"
            >
              How it works
            </Link>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-neutral-200 pt-10 sm:grid-cols-4 dark:border-neutral-800">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">{s.label}</dt>
              <dd className="mt-1 text-3xl font-bold text-neutral-900 dark:text-white">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Explore All Domains</h2>
            <Link href="/programs/internships" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              Explore All &rarr;
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((d) => (
              <Link
                key={d.slug}
                href={`/programs/internships#${d.slug}`}
                className="rounded-xl border border-neutral-200 bg-white p-6 transition hover:border-indigo-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
              >
                <p className="font-semibold text-neutral-900 dark:text-white">{d.name}</p>
                <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-400">Apply Now &rarr;</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Why Intern Bangla
        </h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">More than just an internship.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item) => (
            <div key={item.title} className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
              <p className="font-semibold text-neutral-900 dark:text-white">{item.title}</p>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Your Path to Success</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <p className="mt-4 font-semibold text-neutral-900 dark:text-white">{step.title}</p>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Student Stories
        </p>
        <h2 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">What Our Interns Say</h2>
        <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-400 dark:border-neutral-700">
          Testimonials coming soon
        </div>
      </section>

      <section className="border-t border-neutral-200 py-16 dark:border-neutral-800">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            Stay Connected
          </p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">
            Subscribe to our Newsletter
          </h2>
          <form className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 rounded-md border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

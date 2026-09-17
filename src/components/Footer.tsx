import Link from "next/link";
import { footerLegalLinks } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-neutral-900 dark:text-white">Intern Bangla</p>
            <p className="mt-2 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
              Build real skills. Land real jobs. Virtual internships and learning tracks for
              students across Bangladesh.
            </p>
            <div className="mt-4 flex gap-3 text-sm text-neutral-500 dark:text-neutral-400">
              <a href="#" aria-label="LinkedIn" className="hover:text-indigo-500">LinkedIn</a>
              <a href="#" aria-label="Instagram" className="hover:text-indigo-500">Instagram</a>
              <a href="#" aria-label="WhatsApp" className="hover:text-indigo-500">WhatsApp</a>
              <a href="#" aria-label="YouTube" className="hover:text-indigo-500">YouTube</a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
              <li><Link href="/programs/internships" className="hover:text-indigo-500">Internships</Link></li>
              <li><Link href="/programs/courses" className="hover:text-indigo-500">Courses</Link></li>
              <li><Link href="/student-corner/hall-of-fame" className="hover:text-indigo-500">Hall of Fame</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
              <li><Link href="/company/hire-talent" className="hover:text-indigo-500">Hire Top Talent</Link></li>
              <li><Link href="/company/about" className="hover:text-indigo-500">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-500">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
              {footerLegalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-indigo-500">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-neutral-200 pt-6 text-xs text-neutral-400 sm:flex-row sm:items-center dark:border-neutral-800">
          <p>&copy; {new Date().getFullYear()} Intern Bangla. All rights reserved.</p>
          <p>Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}

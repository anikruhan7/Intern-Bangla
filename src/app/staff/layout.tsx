import Link from "next/link";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <Link href="/" className="text-lg font-bold text-neutral-900 dark:text-white">
          Intern Bangla <span className="text-sm font-normal text-neutral-400">Staff Portal</span>
        </Link>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

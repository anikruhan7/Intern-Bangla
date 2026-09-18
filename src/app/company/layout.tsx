import Link from "next/link";

export default function CompanyPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-muted/40">
      <header className="border-b border-border bg-background px-6 py-4">
        <Link href="/" className="text-lg font-bold">
          Intern <span className="brand-gradient-text">Bangla</span>{" "}
          <span className="text-sm font-normal text-muted-foreground">Company Portal</span>
        </Link>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

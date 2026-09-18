import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora, Space_Grotesk } from "next/font/google";
import { TommyWidget } from "@/components/TommyWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display font for headlines - pairs with Geist for a livelier, less
// uniform look than a single font family everywhere.
const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

// Distinct font for stat numbers / data-forward moments.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-numeric",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Intern Bangla - Virtual Internships & Learning Tracks",
  description:
    "Accelerate your career with Intern Bangla. Gain real-world project experience, mentorship, and verified internship certificates in Web Development, AI, Data Analytics, and more.",
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored ? stored === "dark" : prefersDark) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        {children}
        <TommyWidget />
      </body>
    </html>
  );
}

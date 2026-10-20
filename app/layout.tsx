import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { THEME_COOKIE, isTheme } from "../lib/theme";
import CursorGlow from "./_components/CursorGlow";

// Keeps the legacy next-themes-era `.dark` class accurate for the pages
// that haven't been re-platformed onto the data-theme token system yet
// (admin, vision, login/auth) so their existing `dark:` utility classes
// keep working with no flash — mirrors what next-themes itself injected.
// New/redesigned surfaces (the home page) don't need this class at all;
// they're driven by the --background/--foreground tokens directly.
const NO_FLASH_DARK_CLASS_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=([^;]*)/);var t=m?decodeURIComponent(m[1]):null;var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const SITE_URL = "https://taufikhamid.com";
const SITE_TITLE = "Muhammad Taufik — Full-stack Developer";
const SITE_DESCRIPTION =
  "Portfolio of Muhammad Taufik, a full-stack developer in Malaysia building web, API and mobile products with Next.js, ASP.NET Core, Supabase and Kotlin.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE)?.value;
  const theme = isTheme(themeCookie) ? themeCookie : "system";

  return (
    <html lang="en" data-theme={theme === "system" ? undefined : theme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_DARK_CLASS_SCRIPT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to main content
        </a>
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}

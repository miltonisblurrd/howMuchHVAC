import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import { ContactProvider } from "@/components/contact/ContactProvider";
import { getPublicContact } from "@/lib/business";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} Air & Home Improvements | Orange County HVAC`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — Honest HVAC for Southern California`,
    description: site.description,
    url: site.url,
    siteName: site.legalName,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Honest HVAC`,
    description: site.description,
  },
  alternates: {
    canonical: site.url,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const contact = await getPublicContact();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-hm-fog text-hm-charcoal">
        <ContactProvider contact={contact}>
          <LocalBusinessJsonLd telephone={contact.directDisplay} email={contact.publicEmail} />
          {children}
        </ContactProvider>
      </body>
    </html>
  );
}

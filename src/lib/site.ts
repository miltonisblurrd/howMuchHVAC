export const site = {
  name: "How Much?",
  legalName: "How Much? Air & Home Improvements",
  tagline: "Honest HVAC. Transparent pricing. Real answers.",
  description:
    "Licensed, insured HVAC experts serving Orange County, Los Angeles, and San Diego. Fair options, no pressure — just trustworthy service for your family.",
  url: "https://www.trusthowmuch.com",
  email: "howmuchandy@gmail.com",
  phones: {
    direct: {
      display: "(562) 612-8961",
      href: "tel:+15626128961",
      label: "Direct",
    },
    office: {
      display: "(562) 612-8961",
      href: "tel:+15626128961",
      label: "Office",
    },
  },
  license: "CA Lic #107-3814",
  yearsExperience: 15,
  google: {
    rating: 5.0,
    reviewCount: 298,
    cid: "9203829125753190958",
    mapsUrl:
      "https://www.google.com/maps?ll=33.851178,-118.051427&z=7&t=m&hl=en&gl=US&mapclient=embed&cid=9203829125753190958",
    reviewUrl: "https://www.google.com/maps?cid=9203829125753190958",
  },
  addressRegion: "Orange County, CA",
  social: {
    hashtag: "#howmuch",
  },
  /** Drop `public/videos/andy-welcome.mp4` or set NEXT_PUBLIC_PORTAL_INTRO_VIDEO */
  portalIntroVideo:
    process.env.NEXT_PUBLIC_PORTAL_INTRO_VIDEO || "/videos/andy-welcome.mp4",
  /** Andy's dealer-prefilled Synchrony application (same as the booth QR). */
  synchrony: {
    applyUrl: "https://www.synchrony.com/mmc/S6223632100?sitecode=acewel402",
    label: "Finance with Synchrony",
  },
} as const;

export const navPrimary = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
] as const;

export const navFooter = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/team", label: "Our Team" },
      { href: "/partners", label: "Partners" },
      { href: "/projects", label: "Projects" },
      { href: "/brand", label: "Brand Assets" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/services", label: "All Services" },
      { href: "/booking", label: "Book / Get Quote" },
      { href: "/second-opinion", label: "Second Opinion" },
      { href: "/financing", label: "Financing" },
      { href: "/maintenance", label: "Maintenance Plans" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/faqs", label: "FAQs" },
      { href: "/blog", label: "Blog" },
      { href: "/reviews", label: "Reviews" },
      { href: "/warranty", label: "Warranty" },
      { href: "/portal/login", label: "Client Portal" },
    ],
  },
] as const;

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";

export function SiteShell({
  children,
  headerTone = "light",
  stickyCta = true,
}: {
  children: React.ReactNode;
  headerTone?: "light" | "dark" | "transparent";
  stickyCta?: boolean;
}) {
  return (
    <>
      <Header tone={headerTone} />
      <main className={`flex-1 ${stickyCta ? "pb-20 md:pb-0" : ""}`}>{children}</main>
      <Footer />
      {stickyCta && <StickyMobileCTA />}
    </>
  );
}

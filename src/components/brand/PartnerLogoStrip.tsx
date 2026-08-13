import Image from "next/image";
import { Container } from "@/components/ui/Section";
import { partners } from "@/lib/partners";

/** Slim credibility strip for under heroes */
export function PartnerLogoStrip() {
  return (
    <div className="border-b border-hm-line bg-white">
      <Container className="flex flex-col items-center gap-4 py-5 md:flex-row md:gap-8 md:py-6">
        <p className="shrink-0 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-hm-muted">
          Equipment Partners
        </p>
        <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-3 md:flex-1 md:justify-between md:gap-x-4">
          {partners.map((partner) => (
            <div
              key={partner.name}
              title={partner.name}
              className="flex h-9 items-center justify-center md:h-10"
            >
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                width={120}
                height={40}
                className="h-7 w-auto max-w-[96px] object-contain opacity-80 md:h-8 md:max-w-[110px]"
              />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

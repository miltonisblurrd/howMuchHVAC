import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { GuideDownloadForm } from "@/components/forms/GuideDownloadForm";
import { GuideCover } from "@/components/home/GuideCover";

export function GuideDownloadBand() {
  return (
    <section className="relative overflow-hidden bg-hm-red text-white">
      <div className="absolute inset-0 hm-noise opacity-30" />
      <Container className="relative grid items-center gap-10 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-20">
        <div>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">
            Free Homeowner Guide
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.03em] md:text-5xl">
            Download The Fair HVAC Pricing Guide
          </h2>
          <p className="mt-4 max-w-lg text-lg text-white/85">
            Learn what a fair quote looks like, when repair beats replacement, and which red flags
            to watch for ? before you spend thousands.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-white/85">
            {[
              "Repair vs replace questions that actually matter",
              "Red flags in high-pressure HVAC quotes",
              "How to use a second opinion without the runaround",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <GuideDownloadForm className="mt-8" />
        </div>
        <div className="flex justify-center md:justify-end">
          <GuideCover />
        </div>
      </Container>
    </section>
  );
}

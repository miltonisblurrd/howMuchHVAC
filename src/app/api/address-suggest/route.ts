import { NextResponse } from "next/server";

type PhotonFeature = {
  properties?: {
    name?: string;
    housenumber?: string;
    street?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    countrycode?: string;
  };
};

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() || "";
  if (query.length < 3) return NextResponse.json({ suggestions: [] });

  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "6");
  url.searchParams.set("lang", "en");
  url.searchParams.set("lat", "33.72");
  url.searchParams.set("lon", "-117.83");

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "HowMuchAirHome/1.0 (address suggest)" },
      next: { revalidate: 0 },
    });
    if (!res.ok) return NextResponse.json({ suggestions: [] });
    const data = (await res.json()) as { features?: PhotonFeature[] };
    const suggestions = (data.features || [])
      .map((feature) => {
        const p = feature.properties || {};
        if (p.countrycode && p.countrycode.toUpperCase() !== "US") return null;
        const street = [p.housenumber, p.street || p.name].filter(Boolean).join(" ");
        const city = p.city || p.town || p.village || "";
        const label = [street, city, p.state].filter(Boolean).join(", ");
        if (!street || !label) return null;
        return { label, street, city };
      })
      .filter((item): item is { label: string; street: string; city: string } => Boolean(item));

    const seen = new Set<string>();
    const unique = suggestions.filter((item) => {
      if (seen.has(item.label)) return false;
      seen.add(item.label);
      return true;
    });
    return NextResponse.json({ suggestions: unique.slice(0, 5) });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}

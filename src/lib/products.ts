export type ProductCategory = {
  slug: string;
  name: string;
  summary: string;
};

export type CatalogProduct = {
  slug: string;
  name: string;
  categorySlug: string;
  image: string;
};

export const productCategories: ProductCategory[] = [
  {
    slug: "ductless-mini-splits",
    name: "Ductless Mini-Splits",
    summary: "Room-by-room heating and cooling, including the DIY lines and the contractor-installed Olympus systems.",
  },
  {
    slug: "universal",
    name: "Universal",
    summary: "Central heat pumps that tie into existing ductwork, as a split or a packaged unit.",
  },
  {
    slug: "geocool",
    name: "GeoCool",
    summary: "Geothermal heat pumps for homes that can use the ground as the heat source.",
  },
  {
    slug: "central-split-systems",
    name: "Central Split Systems",
    summary: "Condensers, air handlers, furnaces, hyper-heat systems, and pre-charged coils for a full central install.",
  },
  {
    slug: "central-package-units",
    name: "Central Package Units",
    summary: "All-in-one packaged units for homes that use a rooftop or pad-mounted system.",
  },
  {
    slug: "fan-solutions",
    name: "Fan Solutions",
    summary: "Air movers for a room or a large open space, separate from the heating and cooling system.",
  },
  {
    slug: "water-solutions",
    name: "Water Solutions",
    summary: "Electric tank water heaters from the same equipment family.",
  },
  {
    slug: "thermostats",
    name: "Thermostats",
    summary: "Controls that pair with these systems, from a simple stat to a smart one.",
  },
  {
    slug: "compact-hvac",
    name: "Compact HVAC",
    summary: "Smaller systems for a tight space or an RV, when a full central system is the wrong fit.",
  },
  {
    slug: "refrigeration",
    name: "Refrigeration",
    summary: "A compact refrigeration system for a cold room or a small commercial space.",
  },
];

export const catalogProducts: CatalogProduct[] = [
  { slug: "diy-5th-generation", name: "DIY 5th Generation", categorySlug: "ductless-mini-splits", image: "/products/diy-5th-generation.webp" },
  { slug: "diy-select", name: "DIY Select", categorySlug: "ductless-mini-splits", image: "/products/diy-select.png" },
  { slug: "diy-easy-pro", name: "DIY Easy Pro", categorySlug: "ductless-mini-splits", image: "/products/diy-easy-pro.png" },
  { slug: "diy-outtasight-ceiling-cassette", name: "DIY OuttaSight Ceiling Cassette", categorySlug: "ductless-mini-splits", image: "/products/diy-outtasight-ceiling-cassette.webp" },
  { slug: "advantage-5th-generation", name: "Advantage 5th Generation", categorySlug: "ductless-mini-splits", image: "/products/advantage-5th-generation.webp" },
  { slug: "olympus-e-star", name: "Olympus E Star", categorySlug: "ductless-mini-splits", image: "/products/olympus-e-star.webp" },
  { slug: "olympus-multi-zone", name: "Olympus Multi Zone", categorySlug: "ductless-mini-splits", image: "/products/olympus-multi-zone.webp" },
  { slug: "universal-split-r454b", name: "Universal Split R-454B", categorySlug: "universal", image: "/products/universal-split-r454b.png" },
  { slug: "universal-packaged-heat-pump", name: "Universal Packaged Heat Pump", categorySlug: "universal", image: "/products/universal-packaged-heat-pump.webp" },
  { slug: "geocool-inverter-series", name: "GeoCool Inverter Series", categorySlug: "geocool", image: "/products/geocool-inverter-series.webp" },
  { slug: "versapro-gas-furnaces", name: "VersaPro Gas Furnaces", categorySlug: "central-split-systems", image: "/products/versapro-gas-furnaces.png" },
  { slug: "versapro-2nd-generation", name: "VersaPro 2nd Generation", categorySlug: "central-split-systems", image: "/products/versapro-2nd-generation.webp" },
  { slug: "central-ducted-hyper-heat-2nd-generation", name: "Central Ducted Hyper Heat 2nd Generation", categorySlug: "central-split-systems", image: "/products/central-ducted-hyper-heat-2nd-generation.png" },
  { slug: "signature-series", name: "Signature Series", categorySlug: "central-split-systems", image: "/products/signature-series.png" },
  { slug: "pre-charged-evaporator-coils", name: "Pre-Charged Evaporator Coils", categorySlug: "central-split-systems", image: "/products/pre-charged-evaporator-coils.png" },
  { slug: "versapro-2nd-gen-packaged-unit", name: "VersaPro 2nd Gen Packaged Unit", categorySlug: "central-package-units", image: "/products/versapro-2nd-gen-packaged-unit.png" },
  { slug: "mrbreeze-bladeless-fan", name: "MRBREEZE Bladeless Fan", categorySlug: "fan-solutions", image: "/products/mrbreeze-bladeless-fan.png" },
  { slug: "coolblade-hvls-fan", name: "CoolBlade HVLS Fan", categorySlug: "fan-solutions", image: "/products/coolblade-hvls-fan.png" },
  { slug: "heatwise-electric-tank-water-heater", name: "HeatWise Electric Tank Water Heater", categorySlug: "water-solutions", image: "/products/heatwise-electric-tank-water-heater.png" },
  { slug: "mini-stat", name: "Mini-Stat", categorySlug: "thermostats", image: "/products/mini-stat.webp" },
  { slug: "smart-thermostat", name: "Smart Thermostat", categorySlug: "thermostats", image: "/products/smart-thermostat.png" },
  { slug: "monoblock", name: "Monoblock", categorySlug: "compact-hvac", image: "/products/monoblock.png" },
  { slug: "travelcool", name: "TravelCool", categorySlug: "compact-hvac", image: "/products/travelcool.png" },
  { slug: "compact-refrigeration-system", name: "Compact Refrigeration System", categorySlug: "refrigeration", image: "/products/compact-refrigeration-system.png" },
];

export function getCategory(slug: string) {
  return productCategories.find((category) => category.slug === slug);
}

export function productsInCategory(slug: string) {
  return catalogProducts.filter((product) => product.categorySlug === slug);
}

export function getProduct(categorySlug: string, slug: string) {
  return catalogProducts.find(
    (product) => product.categorySlug === categorySlug && product.slug === slug,
  );
}

export function categoryPath(slug: string) {
  return `/products/${slug}`;
}

export function productPath(product: Pick<CatalogProduct, "slug" | "categorySlug">) {
  return `/products/${product.categorySlug}/${product.slug}`;
}

export function productScenes(slug: string) {
  return {
    hero: `/products/scenes/${slug}-hero.jpg`,
    secondary: `/products/scenes/${slug}-install.jpg`,
  };
}

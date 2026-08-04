export type Review = {
  id: string;
  name: string;
  quote: string;
  rating: 5;
  source: "Google";
  featured?: boolean;
};

export const reviews: Review[] = [
  {
    id: "1",
    name: "Christina Guerrero",
    quote:
      "I'm a preschool director and it's very important to maintain our AC and heater. Andy has been my go-to since day one. I've been using How Much? Air for the past 3 years and I couldn't be happier.",
    rating: 5,
    source: "Google",
    featured: true,
  },
  {
    id: "2",
    name: "Marlet Andaya",
    quote:
      "As a single woman and homeowner it's important to find a reliable and trustworthy source for household repairs. Andy was professional, honest, and fair. Immediately after the work my home was cooler! Definitely recommend Andy and How Much Air!",
    rating: 5,
    source: "Google",
    featured: true,
  },
  {
    id: "3",
    name: "Christopher Mejia",
    quote:
      "Originally I just wanted a diagnostic. Andy was very honest and suggested options without applying any pressure ? unlike previous companies. Done on time, within budget, and I'll recommend him to friends and family.",
    rating: 5,
    source: "Google",
    featured: true,
  },
  {
    id: "4",
    name: "Maribel Pineda",
    quote: "Andy was very professional and attentive to detail! Thank you for helping fix my AC unit!",
    rating: 5,
    source: "Google",
  },
  {
    id: "5",
    name: "Ken Phung",
    quote: "Quality service and quality turnaround time. Can't thank Andy and his team enough!!",
    rating: 5,
    source: "Google",
  },
  {
    id: "6",
    name: "K.C.",
    quote: "Andy and the crew provided great service!",
    rating: 5,
    source: "Google",
  },
];

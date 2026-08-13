export type ReviewTag =
  | "install"
  | "repair"
  | "emergency"
  | "mini-split"
  | "ducts"
  | "commercial"
  | "maintenance"
  | "second-opinion";

export type Review = {
  id: string;
  name: string;
  quote: string;
  rating: 4 | 5;
  source: "Google";
  /** Rough recency label for display, e.g. "2 months ago" */
  when?: string;
  tags?: ReviewTag[];
  featured?: boolean;
};

export const reviews: Review[] = [
  {
    id: "jess-noriega",
    name: "Jess Noriega",
    quote:
      "Andy and his team installed 4 mini split units for us and did an excellent job. Very professional, clean installation, and everything went perfectly. Great communication from start to finish. Highly recommend their team!",
    rating: 5,
    source: "Google",
    when: "2 months ago",
    tags: ["install", "mini-split"],
    featured: true,
  },
  {
    id: "dario-gutierrez",
    name: "Dario Gutierrez",
    quote:
      "Andy and his team were amazing and professional. We had our AC go out during this recent heatwave here in SoCal. 3 other companies wanted to charge me over $25,000 to replace my system. Andy was able to provide many affordable options and found out that only the cooling portion needed to be replaced. We saved over $11,000 by going with him and his team. They were on time and educated us on everything they were doing. Would recommend Andy to anyone that needs heating and air conditioning.",
    rating: 5,
    source: "Google",
    when: "5 months ago",
    tags: ["repair", "emergency", "second-opinion"],
    featured: true,
  },
  {
    id: "alex-shah",
    name: "Alex Shah",
    quote:
      "How Much Air has consistently delivered exceptional service, both at my bakery and at my residence. They responded to a last-minute call without hesitation and arrived promptly, fully prepared to handle the job. Their technicians are highly skilled, professional, and incredibly thorough — every visit has resulted in flawless work and noticeable improvements in performance. What truly sets this company apart is their reliability and integrity. They communicate clearly, respect your time, and treat your property with genuine care. Whether it's routine maintenance or an urgent repair, they approach every task with the same level of excellence. I highly recommend How Much Air to anyone seeking trustworthy, top-tier HVAC service.",
    rating: 5,
    source: "Google",
    when: "8 months ago",
    tags: ["commercial", "repair", "maintenance", "emergency"],
    featured: true,
  },
  {
    id: "kim-de-montmorency",
    name: "Kim de Montmorency",
    quote:
      "What a wonderful experience I had with TrustHowMuch Air and home improvements. I had them install new A/C and heating. Andy is honest, straight forward, informative, and takes the time necessary to go over every aspect of the process so you can make an informed decision. Andy is a man of integrity. I was very impressed with all aspects of his company. They are very professional, clean, and careful while in your home. Excellent work ethic. I was equally impressed with Jerry who took as much care and pride with my install as Andy did. What a great team! Thank you guys — you deserve way more than 5 stars.",
    rating: 5,
    source: "Google",
    when: "4 years ago",
    tags: ["install"],
    featured: true,
  },
  {
    id: "eric-kirst",
    name: "Eric Kirst",
    quote:
      "Andy recently installed a new HVAC system in our home. My wife and I are very pleased. Andy is very professional, knowledgeable, and courteous. He and his team completed the whole system in one day and for a great price. Before and after photos attached. Very satisfied.",
    rating: 5,
    source: "Google",
    when: "a year ago",
    tags: ["install"],
    featured: true,
  },
  {
    id: "vge-frank",
    name: "Frank (Vge)",
    quote:
      "I cannot tell you how pleased I am with How Much. They replaced my whole HVAC system. They were always on time, courteous, and did the whole job in one day. Their quote was all inclusive, no surprise add-ons, and was very competitive or better than others. Andy was very pleasant to work with. I highly recommend this small business man for your air and heating needs.",
    rating: 5,
    source: "Google",
    when: "9 months ago",
    tags: ["install"],
    featured: true,
  },
  {
    id: "adam-aleman",
    name: "Adam Aleman",
    quote:
      "The owner Andy came right away and saved us from one of the hottest days in Orange County. Super honest and very affordable for the same-day call. He also went around and checked the filters and went the extra mile to make sure we hopefully wouldn't have to call them again soon. He gave us recommendations on how to work the vents for maximum cool. If you have heating or air-conditioning needs, I couldn't recommend him more!",
    rating: 5,
    source: "Google",
    when: "3 years ago",
    tags: ["emergency", "repair", "maintenance"],
    featured: true,
  },
  {
    id: "german-vizcarra",
    name: "German Vizcarra",
    quote:
      "Andy and his team did an amazing job here at our new home. Would recommend to anybody needing new work or fixes around the home. Goes above and beyond and fully explains everything before the work starts to give a clear understanding of what's going to be done. Couldn't have been happier about hiring their team!",
    rating: 5,
    source: "Google",
    when: "9 months ago",
    tags: ["install", "repair"],
    featured: true,
  },
  {
    id: "christina-guerrero",
    name: "Christina Guerrero",
    quote:
      "I'm a preschool director and it's very important to maintain our AC and heater. Andy has been my go-to since day one. I've been using How Much? Air for the past 3 years and I couldn't be happier.",
    rating: 5,
    source: "Google",
    when: "4 years ago",
    tags: ["maintenance", "repair"],
    featured: true,
  },
  {
    id: "marlet-andaya",
    name: "Marlet Andaya",
    quote:
      "As a single woman and homeowner it's important to find a reliable and trustworthy source for household repairs. Andy was professional, honest, and fair at the time of fixing my AC unit. Immediately after doing the work my home was cooler! Definitely recommend Andy and How Much Air!",
    rating: 5,
    source: "Google",
    when: "4 years ago",
    tags: ["repair"],
    featured: true,
  },
  {
    id: "felipe-cortes",
    name: "Felipe Cortes",
    quote:
      "I recently had a fantastic experience with Andy at How Much? Air & Home when they replaced my condenser and a bad thermostatic expansion valve. Not only did they do a great job with the installation, but their pricing was also incredibly fair and they resolved it in a timely manner.",
    rating: 5,
    source: "Google",
    when: "a year ago",
    tags: ["repair", "install"],
  },
  {
    id: "fernando-mancilla",
    name: "Fernando Mancilla",
    quote:
      "Andy and his team to the rescue!! My AC unit went down in the summer as temperatures were hitting 109 and above. I called Andy and told him my situation. He was helpful enough to do some troubleshooting over the phone to identify the issue and get us moving fast.",
    rating: 5,
    source: "Google",
    when: "8 months ago",
    tags: ["emergency", "repair"],
  },
  {
    id: "maddie-nitzen",
    name: "Maddie Nitzen",
    quote:
      "Andy was the best!!! He was able to detect the issue with our AC unit and fixed it quickly! Great price too. Only HVAC guy I will use from here on out! Thank you!!!!",
    rating: 5,
    source: "Google",
    when: "8 months ago",
    tags: ["repair"],
  },
  {
    id: "alexa-vega",
    name: "Alexa Vega",
    quote:
      "I'm grateful for the recommendation to this company. Andy assisted me in selecting the ideal mini split for my trailer, and Marcos provided excellent, efficient installation. Great guys, highly recommend.",
    rating: 5,
    source: "Google",
    when: "8 months ago",
    tags: ["mini-split", "install"],
  },
  {
    id: "rob-wert",
    name: "Rob Wert",
    quote:
      "How Much? Air was awesome again! They were knowledgeable, professional, and willing to stay until the job was done right! So appreciative of Andy and his guys!",
    rating: 5,
    source: "Google",
    when: "6 months ago",
    tags: ["repair"],
  },
  {
    id: "meisam",
    name: "Meisam Saeedalzakerin",
    quote:
      "I have been working with him for a long time. He is the best AC guy I have ever worked with. Best price, on time. I 100% recommend him.",
    rating: 5,
    source: "Google",
    when: "8 months ago",
    tags: ["repair", "maintenance"],
  },
  {
    id: "ted-wert",
    name: "Ted Wert",
    quote:
      "We had How Much? Air replace our A/C and furnace, along with the old duct work and could not be happier with the job they did! Andy and his crew were friendly, knowledgeable, and professional! They identified multiple issues that needed to be addressed and took care of them the right way.",
    rating: 5,
    source: "Google",
    when: "3 years ago",
    tags: ["install", "ducts"],
  },
  {
    id: "christopher-mejia",
    name: "Christopher Mejia",
    quote:
      "Andy and the employees of How Much Air did an exceptional job at our home. Originally I had just wanted a diagnostic check and with that Andy was very honest and suggested options that were available, not once applying any pressure on purchasing anything I didn't need like the previous companies I had inquired with. All in all I was extremely satisfied with the job Andy delivered and it was all done on time, within my budget, and I will definitely recommend him to friends and family.",
    rating: 5,
    source: "Google",
    when: "4 years ago",
    tags: ["repair", "second-opinion"],
    featured: true,
  },
  {
    id: "estela-hernandez",
    name: "Estela Hernandez",
    quote:
      "I am very satisfied with the service that was provided to me. They were very professional, fast, and efficient. I will definitely use them again if I need to.",
    rating: 5,
    source: "Google",
    when: "8 months ago",
    tags: ["repair"],
  },
  {
    id: "gretchen-anderson",
    name: "Gretchen Anderson",
    quote:
      "They were so helpful and professional. They even repaired our roof during a downpour. We are so thankful!",
    rating: 5,
    source: "Google",
    when: "8 months ago",
    tags: ["repair"],
  },
  {
    id: "louie-hvac-papi",
    name: "Louie (Hvac Papi)",
    quote:
      "Want to say thank you to How Much Air Conditioning for helping me get my HVAC system fixed. We appreciate you coming as soon as you said you were coming — especially on a Saturday. Thank you again. Would highly recommend.",
    rating: 5,
    source: "Google",
    when: "3 years ago",
    tags: ["repair", "emergency"],
  },
  {
    id: "peter-min",
    name: "Peter Min",
    quote: "10/10 would go to Andy for any HVAC issues. He's the best!",
    rating: 5,
    source: "Google",
    when: "6 months ago",
    tags: ["repair"],
  },
  {
    id: "sylvia-neal",
    name: "Sylvia Neal",
    quote:
      "Work was done quickly, efficiently, professionally and at competitive rates.",
    rating: 4,
    source: "Google",
    when: "6 months ago",
    tags: ["repair"],
  },
  {
    id: "scarlet-w",
    name: "Scarlet W",
    quote: "Great service, people driven, reliable and detail oriented!",
    rating: 5,
    source: "Google",
    when: "6 months ago",
  },
  {
    id: "kg-kat",
    name: "K G",
    quote: "Great company. Nice workers.",
    rating: 5,
    source: "Google",
    when: "5 months ago",
  },
  {
    id: "maribel-pineda",
    name: "Maribel Pineda",
    quote:
      "Andy was very professional and attentive to detail! Thank you for helping fix my AC unit!",
    rating: 5,
    source: "Google",
    when: "4 years ago",
    tags: ["repair"],
  },
  {
    id: "don-ramstead",
    name: "Don Ramstead",
    quote:
      "Did a complete duct removal and new installation — would recommend. Great price and great work.",
    rating: 5,
    source: "Google",
    when: "4 years ago",
    tags: ["ducts", "install"],
  },
  {
    id: "kc",
    name: "KC",
    quote: "Andy and the crew provided great service!",
    rating: 5,
    source: "Google",
    when: "4 years ago",
    tags: ["install", "ducts"],
  },
  {
    id: "ken-phung",
    name: "Ken Phung",
    quote:
      "Quality service and quality turnaround time. Can't thank Andy and his team enough!!",
    rating: 5,
    source: "Google",
    when: "4 years ago",
    tags: ["install"],
  },
  {
    id: "laura-robledo",
    name: "Laura Robledo",
    quote:
      "Responsive, punctual, professional, and great value — from AC and heating install to duct work and thermostat.",
    rating: 5,
    source: "Google",
    when: "Recent",
    tags: ["install", "ducts"],
  },
];

export function getFeaturedReviews(limit = 3) {
  return reviews.filter((r) => r.featured).slice(0, limit);
}

export function getReviewsByTag(tag: ReviewTag) {
  return reviews.filter((r) => r.tags?.includes(tag));
}

export const reviewStats = {
  average: 5.0,
  /** Public Google count — keep in sync with Business Profile */
  googleCount: 298,
  onSiteCount: reviews.length,
} as const;

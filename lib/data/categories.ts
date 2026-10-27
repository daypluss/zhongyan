import type { CategoryId, Domain } from "@/lib/types";

export type Category = {
  id: CategoryId;
  name: string;
  short: string;
  domain: Domain;
  blurb: string;
};

export const categories: Category[] = [
  {
    id: "ai",
    name: "AI & Technology",
    short: "AI",
    domain: "ai",
    blurb: "Models, agents, and the path from a trial to a budget.",
  },
  {
    id: "vc",
    name: "Venture Capital & Private Equity",
    short: "VC & PE",
    domain: "vc",
    blurb: "Rounds, term sheets, and what funds are willing to underwrite.",
  },
  {
    id: "internet",
    name: "Internet & Software",
    short: "Internet",
    domain: "internet",
    blurb: "Platforms, enterprise software, and how bills get paid.",
  },
  {
    id: "semiconductors",
    name: "Semiconductors",
    short: "Semis",
    domain: "semiconductors",
    blurb: "Compute, equipment, materials, and where capex actually sits.",
  },
  {
    id: "ev",
    name: "EV & Mobility",
    short: "EV",
    domain: "ev",
    blurb: "Price, margin, and the suppliers behind the vehicle.",
  },
  {
    id: "consumer",
    name: "Consumer",
    short: "Consumer",
    domain: "consumer",
    blurb: "Brands, repeat purchase, and unit economics after subsidies.",
  },
  {
    id: "robotics",
    name: "Robotics & Hardware",
    short: "Robotics",
    domain: "robotics",
    blurb: "Prototypes, yield, and the distance to a real delivery.",
  },
  {
    id: "policy",
    name: "Policy & Regulation",
    short: "Policy",
    domain: "policy",
    blurb: "Filing, data rules, and how regulation enters a term sheet.",
  },
  {
    id: "macro",
    name: "Macro / Economy",
    short: "Macro",
    domain: "macro",
    blurb: "Capacity, credit, and fees — translated into company language.",
  },
  {
    id: "outbound",
    name: "China Outbound",
    short: "Outbound",
    domain: "outbound",
    blurb: "Localization, tariffs, and cash before the overseas story works.",
  },
];

export const categoryById = Object.fromEntries(
  categories.map((c) => [c.id, c])
) as Record<CategoryId, Category>;

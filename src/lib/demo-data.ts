export type Professional = {
  slug: string;
  name: string;
  trade: string;
  area: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  completedJobs: number;
  responseMinutes: number;
  startingPrice: number | null;
  available: boolean;
  badges: string[];
  bio: string;
  services: { name: string; price: string }[];
  portfolio: string[];
};

export const categories = [
  { name: "Plumbing", icon: "🔧", description: "Leaks, pipes, fittings and water systems" },
  { name: "Electrical", icon: "⚡", description: "Wiring, faults, installations and power" },
  { name: "Cleaning", icon: "🧹", description: "Home, office and post-construction cleaning" },
  { name: "Carpentry", icon: "🪚", description: "Furniture, doors, repairs and fittings" },
  { name: "AC & Cooling", icon: "❄️", description: "AC, refrigeration and cooling repairs" },
  { name: "Auto Repair", icon: "🚗", description: "Mechanics, diagnostics and auto electrical" },
  { name: "Tailoring", icon: "🧵", description: "Alterations, custom sewing and fashion" },
  { name: "Beauty", icon: "✂️", description: "Barbing, hair styling, makeup and grooming" }
];

export const professionals: Professional[] = [
  {
    slug: "musa-technical-services",
    name: "Musa Technical Services",
    trade: "Electrician · Solar Installer",
    area: "Keffi",
    distanceKm: 2.3,
    rating: 4.9,
    reviews: 51,
    completedJobs: 96,
    responseMinutes: 12,
    startingPrice: 5000,
    available: true,
    badges: ["Identity Verified", "Phone Verified", "Certificate Verified"],
    bio: "Residential and commercial electrician focused on safe fault diagnosis, wiring, maintenance and solar installations.",
    services: [
      { name: "Electrical inspection", price: "From ₦5,000" },
      { name: "Fault repair", price: "Request quote" },
      { name: "House wiring", price: "Request quote" },
      { name: "Solar installation", price: "Request quote" }
    ],
    portfolio: ["Residential rewiring", "Solar inverter installation", "Distribution board upgrade"]
  },
  {
    slug: "amina-home-services",
    name: "Amina Home Services",
    trade: "Cleaner · Home Care",
    area: "Keffi",
    distanceKm: 3.1,
    rating: 4.8,
    reviews: 37,
    completedJobs: 68,
    responseMinutes: 18,
    startingPrice: 7000,
    available: true,
    badges: ["Identity Verified", "Phone Verified"],
    bio: "Reliable home and office cleaning with flexible one-off and recurring service options.",
    services: [
      { name: "Home cleaning", price: "From ₦7,000" },
      { name: "Office cleaning", price: "Request quote" },
      { name: "Post-construction cleaning", price: "Request quote" }
    ],
    portfolio: ["Family home deep clean", "Small office reset", "Move-in cleaning"]
  },
  {
    slug: "smartfix-plumbing",
    name: "SmartFix Plumbing",
    trade: "Plumber · Water Systems",
    area: "Keffi",
    distanceKm: 4.7,
    rating: 4.7,
    reviews: 29,
    completedJobs: 54,
    responseMinutes: 21,
    startingPrice: 6500,
    available: false,
    badges: ["Identity Verified", "Phone Verified"],
    bio: "Plumbing repairs, installations and water-system maintenance for homes and small businesses.",
    services: [
      { name: "Leak repair", price: "From ₦6,500" },
      { name: "Fixture installation", price: "Request quote" },
      { name: "Water-system inspection", price: "From ₦5,000" }
    ],
    portfolio: ["Kitchen sink repair", "Bathroom fixture replacement", "Water line maintenance"]
  }
];

export function naira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);
}

export const BRAND = {
  blue: "#1565C0",
  blueDark: "#0D47A1",
  blueLight: "#E3F2FD",
  accent: "#29B6F6",
  green: "#2E7D32",
  greenLight: "#E8F5E9",
  purple: "#6A1B9A",
  gray: "#37474F",
  grayLight: "#ECEFF1",
  white: "#FFFFFF",
};

export const DEFAULT_KEY_ACHIEVEMENTS = [
  "Trichy - Successfully conducted a Pre-Incubation Program at the iFactory Lab, with participation from 9+ companies. The event generated strong industry interest, and discussions were initiated for future skilling, training, and Industry 4.0 capacity-building programs.",
  "Ludhiana – Successfully conducted a Workshop on Smart Manufacturing: Leveraging Industry 4.0 Tools to Drive Efficiency, Cost Savings, and Quality in the Bicycle & Parts Industry, in collaboration with UNIDO. The program witnessed participation from 43 industry professionals representing 16+ companies.",
  "Jamshedpur - Successfully trained 86+ industry professionals from Tata Motors supplier companies through a specialized Industry 4.0 and advanced manufacturing training program, supporting workforce upskilling and strengthening industry readiness for digital transformation.",
  "Pune - Successfully conducted the ELEVATES Program on Agentic AI, with participation from 35 students and industry professionals. The program enhanced participants understanding of next-generation AI technologies.",
];

export const DEFAULT_PROGRAM_SUMMARY =
  "As we conclude our efforts in {monthYear}, we step into the next phase with renewed energy and a bold vision for the future. Our mission is to amplify our impact by accelerating the adoption of Industry 4.0 and expanding the i-Factory Network across India. These cutting-edge advancements will be instrumental in driving society's digital transformation, fostering innovation, and ensuring sustained growth in the years ahead.";

export const OUR_FOCUS_ITEMS = [
  "Co-creating the future of manufacturing",
  "Accelerating the adoption of Industry 4.0 Solutions",
  "Unlocking the power of Digital Transformation, promoting collaboration and knowledge sharing",
];

export const BENEFICIARIES_ITEMS = [
  "Industry professionals, managers and leaders",
  "Lifelong learners and change embracers",
  "Digital transformation evangelist",
  "Aspiring entrepreneurs",
  "Students, faculties, career advancers and innovators",
];

export const TRAINING_DESCRIPTION =
  "The Industry 4.0 Hands-on Training, allows participants to interact, learn and understand the impact of different digital solutions. The training will provide an overview of the basic concepts of Industry 4.0 production strategies. Skill building through the iFactory Training includes both theoretical (in-classroom) and shop-floor experiential learning sessions.";

export const NETWORK_DESCRIPTION =
  "A network of 10 cutting-edge Industry 4.0 experience centers acting as torchbearers for promoting innovation and adoption of Industry 4.0 solutions in order to make Indian Industries globally competitive across sectors and parts of the country in alignment with national priorities.";

export {
  HEADER_LOGO,
  CONTACT_FOOTER_LOGOS,
  LINKEDIN_QR,
  OUR_FOCUS_BADGES,
  LOCATION_LOGOS,
  getLocationLogo,
  CONTACT_LOCATIONS,
} from "./reportLogos";

export const HEAD_OFFICE = {
  address:
    "Ground Floor, SPPU Research Park Foundation, Savitribai Phule Pune University, Ganeshkhind, 411007",
  phone: "+91-9175756900",
  email: "support.ifactory@c4i4.org",
  website: "https://ifactory.c4i4.org/",
};

export const BENEFICIARIES_HISTORY = [
  { label: "Mar 25", value: 1167 },
  { label: "Apr 25", value: 290 },
  { label: "May 25", value: 313 },
  { label: "Jun 25", value: 482 },
  { label: "Jul 25", value: 491 },
  { label: "Aug 25", value: 2435 },
];

export const ORGANIZATIONS_HISTORY = [
  { label: "Mar 25", value: 88 },
  { label: "Apr 25", value: 41 },
  { label: "May 25", value: 32 },
  { label: "Jun 25", value: 58 },
  { label: "Jul 25", value: 61 },
  { label: "Aug 25", value: 75 },
];

export const COLLAGE_IMAGE_COUNTS = [2, 4, 6, 8];

export const SECTION_TYPES = {
  KEY_ACHIEVEMENTS: "KEY_ACHIEVEMENTS_GLIMPSES",
  LOCATION: "LOCATION_GLIMPSES",
};

export const formatMonthYear = (month, year) =>
  new Date(year, month - 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

export const PREFERRED_LOCATION_ORDER = [
  "Pune",
  "Trichy",
  "Ludhiana",
  "Jamshedpur",
  "Ahmedabad",
  "Kashmir",
  "Indore",
  "Visakhapatnam",
  "Delhi",
];

/** Sort location names to match the PDF contents page order. */
export const sortLocationsByPreferred = (locations = []) => {
  const order = new Map(PREFERRED_LOCATION_ORDER.map((loc, i) => [loc.toLowerCase(), i]));
  return [...locations].sort((a, b) => {
    const ai = order.get(a.toLowerCase()) ?? 999;
    const bi = order.get(b.toLowerCase()) ?? 999;
    return ai - bi;
  });
};

export const buildContentsItems = (locations) => [
  "About i-Factory Network & Offerings",
  "Key Achievements",
  ...locations.map((loc) => `i-Factory Network ${loc}`),
  "Program Summary",
  "Contact Us",
];

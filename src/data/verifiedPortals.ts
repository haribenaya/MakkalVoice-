import type { ComplaintCategory, PortalEntry } from "../types";

export interface VerifiedPortalRecord extends PortalEntry {
  id: string;
  domain: string;
  states?: string[];
  districts?: string[];
  tags: string[];
}

export const VERIFIED_PORTALS: Record<string, VerifiedPortalRecord> = {
  // --- National & Sector-Specific Official Portals ---
  cpgrams: {
    id: "cpgrams",
    name: "CPGRAMS — Central Public Grievance Portal (DARPG)",
    url: "https://pgportal.gov.in/",
    domain: "pgportal.gov.in",
    authorityScope: "Government of India — Central & State Escalation",
    description:
      "Official Government of India portal for central ministries, public sector utilities, postal, telecom, and escalated state grievances.",
    tags: ["central", "government", "escalation", "telecom", "pension", "general"],
  },
  national_consumer: {
    id: "national_consumer",
    name: "National Consumer Helpline (NCH)",
    url: "https://consumerhelpline.gov.in/",
    domain: "consumerhelpline.gov.in",
    authorityScope: "Department of Consumer Affairs, Govt. of India",
    description:
      "Official portal for overbilling, defective goods, e-commerce refunds, broadband/telecom disputes, and service deficiency.",
    helpline: "1915",
    officialEmail: "nch-ca@gov.in",
    officialWhatsApp: "918800001915",
    officialWhatsAppDisplay: "+91 88000 01915",
    tags: ["consumer", "billing", "refund", "ecommerce", "product", "overcharge"],
  },
  railmadad: {
    id: "railmadad",
    name: "RailMadad — Indian Railways Grievance Portal",
    url: "https://railmadad.indianrailways.gov.in/",
    domain: "railmadad.indianrailways.gov.in",
    authorityScope: "Ministry of Railways, Govt. of India",
    description:
      "Official Indian Railways portal for train delays, station facilities, coach cleanliness, ticket refunds, and passenger safety.",
    helpline: "139",
    tags: ["railway", "train", "station", "irctc", "ticket"],
  },
  rbi_cms: {
    id: "rbi_cms",
    name: "RBI Complaint Management System (CMS)",
    url: "https://cms.rbi.org.in/",
    domain: "cms.rbi.org.in",
    authorityScope: "Reserve Bank of India — Banking Ombudsman",
    description:
      "Official portal for unresolved bank, ATM, UPI transaction failure, credit card, or NBFC complaints.",
    helpline: "14448",
    officialEmail: "crpc@rbi.org.in",
    tags: ["bank", "upi", "atm", "loan", "finance", "credit card"],
  },
  cybercrime_india: {
    id: "cybercrime_india",
    name: "National Cyber Crime Reporting Portal",
    url: "https://cybercrime.gov.in/",
    domain: "cybercrime.gov.in",
    authorityScope: "Ministry of Home Affairs, Govt. of India",
    description:
      "Official reporting portal for online financial fraud, UPI scams, cyber harassment, and digital crimes.",
    helpline: "1930 (Cyber Fraud) / 112 (Emergency)",
    tags: ["cyber", "scam", "fraud", "online", "safety", "police"],
  },
  nalsa_legal: {
    id: "nalsa_legal",
    name: "NALSA — National Legal Services Authority",
    url: "https://nalsa.gov.in/",
    domain: "nalsa.gov.in",
    authorityScope: "Free Legal Aid & District Legal Services Authority",
    description:
      "Official portal to apply for free legal aid, Lok Adalat mediation, and legal support for eligible citizens.",
    helpline: "15100",
    officialEmail: "nalsa-dla@nic.in",
    tags: ["legal", "lawyer", "court", "aid", "dispute"],
  },
  rti_online: {
    id: "rti_online",
    name: "RTI Online — Right to Information Portal",
    url: "https://rtionline.gov.in/",
    domain: "rtionline.gov.in",
    authorityScope: "Government of India — Department of Personnel & Training",
    description:
      "File official Right to Information requests with central ministries and public authorities.",
    tags: ["rti", "information", "records", "transparency"],
  },

  // --- Tamil Nadu State, Municipal & Utility Portals ---
  tn_cm_helpline: {
    id: "tn_cm_helpline",
    name: "Tamil Nadu CM Helpline (Mudhalvarin Mugavari)",
    url: "https://cmhelpline.tnega.org/",
    domain: "cmhelpline.tnega.org",
    authorityScope: "Government of Tamil Nadu — Unified Grievance Portal",
    description:
      "Official Tamil Nadu state portal for municipal, revenue, ration card, pension, water, electricity, and district complaints.",
    helpline: "1100",
    officialEmail: "cmcell@tn.gov.in",
    states: ["Tamil Nadu"],
    tags: ["tamil nadu", "state", "civic", "revenue", "ration", "government"],
  },
  gcc_chennai: {
    id: "gcc_chennai",
    name: "Greater Chennai Corporation (Namma Chennai)",
    url: "https://chennaicorporation.gov.in/",
    domain: "chennaicorporation.gov.in",
    authorityScope: "Greater Chennai Corporation — Civic Services",
    description:
      "Direct municipal portal for Chennai street lights, roads, potholes, storm water drains, garbage collection, and public health.",
    helpline: "1913",
    officialEmail: "commissioner@chennaicorporation.gov.in",
    officialWhatsApp: "919445061913",
    officialWhatsAppDisplay: "+91 94450 61913",
    states: ["Tamil Nadu"],
    districts: ["Chennai"],
    tags: ["chennai", "streetlight", "road", "garbage", "stormwater", "civic"],
  },
  cmwssb_chennai: {
    id: "cmwssb_chennai",
    name: "CMWSSB — Chennai Metro Water & Sewerage Board",
    url: "https://cmwssb.tn.gov.in/",
    domain: "cmwssb.tn.gov.in",
    authorityScope: "Chennai Metropolitan Water Supply & Sewerage Board",
    description:
      "Direct official portal for drinking water supply, pipe leakage, sewage overflow, and drainage blockage in Chennai.",
    helpline: "044-45674567",
    officialEmail: "cmwssb@tn.gov.in",
    states: ["Tamil Nadu"],
    districts: ["Chennai"],
    tags: ["chennai", "water", "sewage", "drainage", "pipeline"],
  },
  tangedco_tn: {
    id: "tangedco_tn",
    name: "TANGEDCO / TNEB Minnagam (Tamil Nadu Electricity)",
    url: "https://www.tangedco.org/",
    domain: "tangedco.org",
    authorityScope: "Tamil Nadu Generation and Distribution Corporation",
    description:
      "Official electricity portal for power cuts, damaged poles, hanging live wires, transformer faults, and EB billing issues across Tamil Nadu.",
    helpline: "94987 94987",
    officialEmail: "chairman@tnebnet.org",
    states: ["Tamil Nadu"],
    tags: ["electricity", "power", "eb", "transformer", "wire", "bill", "tamil nadu"],
  },

  // --- Karnataka Portals ---
  karnataka_janaspandana: {
    id: "karnataka_janaspandana",
    name: "Janaspandana — Karnataka Integrated Grievance Portal",
    url: "https://ipgrs.karnataka.gov.in/",
    domain: "ipgrs.karnataka.gov.in",
    authorityScope: "Government of Karnataka",
    description:
      "Official statewide portal for district administration, civic services, utilities, and government schemes in Karnataka.",
    helpline: "1902",
    states: ["Karnataka"],
    tags: ["karnataka", "state", "civic", "government"],
  },
  bbmp_bengaluru: {
    id: "bbmp_bengaluru",
    name: "BBMP Sahaaya 2.0 — Bengaluru Civic Grievances",
    url: "https://nammabengaluru.org.in/",
    domain: "nammabengaluru.org.in",
    authorityScope: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
    description:
      "Direct municipal portal for Bengaluru street lights, potholes, waste collection, trees, and storm drains.",
    helpline: "1533",
    officialEmail: "comm@bbmp.gov.in",
    officialWhatsApp: "919480685700",
    officialWhatsAppDisplay: "+91 94806 85700",
    states: ["Karnataka"],
    districts: ["Bengaluru Urban"],
    tags: ["bengaluru", "bangalore", "streetlight", "road", "garbage", "drainage", "civic"],
  },
  bescom_karnataka: {
    id: "bescom_karnataka",
    name: "BESCOM — Bengaluru Electricity Supply Company",
    url: "https://bescom.karnataka.gov.in/",
    domain: "bescom.karnataka.gov.in",
    authorityScope: "BESCOM — Government of Karnataka",
    description:
      "Official electricity portal for power outages, meter/billing issues, and electric line hazards in Bengaluru and surrounding districts.",
    helpline: "1912",
    officialEmail: "helpline@bescom.co.in",
    officialWhatsApp: "919449844640",
    officialWhatsAppDisplay: "+91 94498 44640",
    states: ["Karnataka"],
    districts: ["Bengaluru Urban", "Bengaluru Rural", "Ramanagara", "Tumakuru", "Kolar", "Chikkaballapura"],
    tags: ["electricity", "power", "bill", "wire", "bengaluru"],
  },

  // --- Maharashtra Portals ---
  maharashtra_aaple_sarkar: {
    id: "maharashtra_aaple_sarkar",
    name: "Aaple Sarkar — Maharashtra Grievance Redressal Portal",
    url: "https://grievances.maharashtra.gov.in/",
    domain: "grievances.maharashtra.gov.in",
    authorityScope: "Government of Maharashtra",
    description:
      "Official state grievance portal covering district offices, municipal bodies, utilities, and state schemes across Maharashtra.",
    states: ["Maharashtra"],
    tags: ["maharashtra", "state", "civic", "government"],
  },
  bmc_mumbai: {
    id: "bmc_mumbai",
    name: "BMC — Brihanmumbai Municipal Corporation Portal",
    url: "https://portal.mcgm.gov.in/",
    domain: "portal.mcgm.gov.in",
    authorityScope: "Brihanmumbai Municipal Corporation (Mumbai)",
    description:
      "Direct civic portal for Mumbai drainage, water supply, potholes, street lights, and solid waste grievances.",
    helpline: "1916",
    officialWhatsApp: "918999228999",
    officialWhatsAppDisplay: "+91 89992 28999",
    states: ["Maharashtra"],
    districts: ["Mumbai City", "Mumbai Suburban"],
    tags: ["mumbai", "civic", "drainage", "water", "road", "streetlight"],
  },
  mahavitaran_mh: {
    id: "mahavitaran_mh",
    name: "MSEDCL Mahavitaran — Maharashtra Electricity Portal",
    url: "https://www.mahadiscom.in/",
    domain: "mahadiscom.in",
    authorityScope: "Maharashtra State Electricity Distribution Co. Ltd.",
    description:
      "Official electricity portal for power faults, high bills, meter reading disputes, and line safety across Maharashtra.",
    helpline: "1912 / 1800-212-3435",
    officialEmail: "customercare@mahadiscom.in",
    states: ["Maharashtra"],
    tags: ["electricity", "power", "bill", "meter", "maharashtra"],
  },

  // --- Other State Portals ---
  kerala_cmo: {
    id: "kerala_cmo",
    name: "CMO Kerala — Public Grievance Redressal Portal",
    url: "https://cmo.kerala.gov.in/",
    domain: "cmo.kerala.gov.in",
    authorityScope: "Government of Kerala",
    description:
      "Official Chief Minister's Office grievance portal for local body, utility, and state government issues in Kerala.",
    officialEmail: "chiefminister@kerala.gov.in",
    states: ["Kerala"],
    tags: ["kerala", "state", "civic", "government"],
  },
  ap_pgrs: {
    id: "ap_pgrs",
    name: "Andhra Pradesh PGRS (Public Grievance Redressal)",
    url: "https://meekosam.ap.gov.in/",
    domain: "meekosam.ap.gov.in",
    authorityScope: "Government of Andhra Pradesh",
    description:
      "Official state portal for civic, revenue, welfare, and municipal grievance submission across Andhra Pradesh.",
    helpline: "1100",
    states: ["Andhra Pradesh"],
    tags: ["andhra pradesh", "state", "civic", "government"],
  },
  telangana_prajavani: {
    id: "telangana_prajavani",
    name: "Prajavani — Telangana Public Grievance Portal",
    url: "https://prajavani.telangana.gov.in/",
    domain: "prajavani.telangana.gov.in",
    authorityScope: "Government of Telangana",
    description:
      "Official Telangana state portal for district, municipal, and public service grievances.",
    states: ["Telangana"],
    tags: ["telangana", "state", "civic", "government"],
  },
  ghmc_hyderabad: {
    id: "ghmc_hyderabad",
    name: "GHMC — Greater Hyderabad Municipal Corporation",
    url: "https://www.ghmc.gov.in/",
    domain: "ghmc.gov.in",
    authorityScope: "Greater Hyderabad Municipal Corporation",
    description:
      "Direct municipal portal for Hyderabad roads, sanitation, street lights, and storm drains.",
    helpline: "040-21111111",
    states: ["Telangana"],
    districts: ["Hyderabad"],
    tags: ["hyderabad", "civic", "road", "streetlight", "garbage", "drainage"],
  },
  up_jansunwai: {
    id: "up_jansunwai",
    name: "Jansunwai Samadhan (IGRS Uttar Pradesh)",
    url: "https://jansunwai.up.nic.in/",
    domain: "jansunwai.up.nic.in",
    authorityScope: "Government of Uttar Pradesh",
    description:
      "Official integrated portal for civic, revenue, utility, and district complaints across Uttar Pradesh.",
    helpline: "1076",
    states: ["Uttar Pradesh"],
    tags: ["uttar pradesh", "state", "civic", "government"],
  },
  delhi_pgms: {
    id: "delhi_pgms",
    name: "Delhi Public Grievance Monitoring System (PGMS)",
    url: "https://pgms.delhi.gov.in/",
    domain: "pgms.delhi.gov.in",
    authorityScope: "Government of NCT of Delhi",
    description:
      "Official portal for civic, water, road, and Delhi government department grievances.",
    states: ["Delhi (NCT)"],
    tags: ["delhi", "state", "civic", "government"],
  },
  gujarat_swagat: {
    id: "gujarat_swagat",
    name: "SWAGAT — Gujarat Public Grievance Portal",
    url: "https://swagat.gujarat.gov.in/",
    domain: "swagat.gujarat.gov.in",
    authorityScope: "Government of Gujarat",
    description:
      "Official citizen grievance platform for taluka, district, and state issues across Gujarat.",
    states: ["Gujarat"],
    tags: ["gujarat", "state", "civic", "government"],
  },
  rajasthan_sampark: {
    id: "rajasthan_sampark",
    name: "Rajasthan Sampark Portal",
    url: "https://sampark.rajasthan.gov.in/",
    domain: "sampark.rajasthan.gov.in",
    authorityScope: "Government of Rajasthan",
    description:
      "Centralized grievance redressal portal for civic, utility, and administrative issues across Rajasthan.",
    helpline: "181",
    states: ["Rajasthan"],
    tags: ["rajasthan", "state", "civic", "government"],
  },
  mp_cm_helpline: {
    id: "mp_cm_helpline",
    name: "CM Helpline Madhya Pradesh",
    url: "https://cmhelpline.mp.gov.in/",
    domain: "cmhelpline.mp.gov.in",
    authorityScope: "Government of Madhya Pradesh",
    description:
      "Official state portal for civic amenities, utility billing, and department complaints in Madhya Pradesh.",
    helpline: "181",
    states: ["Madhya Pradesh"],
    tags: ["madhya pradesh", "state", "civic", "government"],
  },
  wb_portal: {
    id: "wb_portal",
    name: "West Bengal Government Citizen Portal",
    url: "https://wb.gov.in/",
    domain: "wb.gov.in",
    authorityScope: "Government of West Bengal",
    description:
      "Official state gateway linking to municipal and district grievance departments in West Bengal.",
    states: ["West Bengal"],
    tags: ["west bengal", "state", "civic", "government"],
  },
  bihar_bpgrs: {
    id: "bihar_bpgrs",
    name: "Bihar Lok Shikayat Nivaran (BPGRS)",
    url: "https://lokshikayat.bihar.gov.in/",
    domain: "lokshikayat.bihar.gov.in",
    authorityScope: "Government of Bihar",
    description:
      "Right to Public Grievance Redressal portal for time-bound district and municipal resolution in Bihar.",
    states: ["Bihar"],
    tags: ["bihar", "state", "civic", "government"],
  },
  odisha_janasunani: {
    id: "odisha_janasunani",
    name: "Jana Sunani — Odisha Grievance Portal",
    url: "https://janasunani.odisha.gov.in/",
    domain: "janasunani.odisha.gov.in",
    authorityScope: "Government of Odisha",
    description:
      "Unified public grievance registration and tracking platform for Odisha state departments.",
    states: ["Odisha"],
    tags: ["odisha", "state", "civic", "government"],
  },
  punjab_pgrms: {
    id: "punjab_pgrms",
    name: "PGRMS — Punjab Public Grievance Portal",
    url: "https://connect.punjab.gov.in/",
    domain: "connect.punjab.gov.in",
    authorityScope: "Government of Punjab",
    description:
      "Citizen grievance and public service portal for Punjab state and district offices.",
    states: ["Punjab"],
    tags: ["punjab", "state", "civic", "government"],
  },
  haryana_cm_window: {
    id: "haryana_cm_window",
    name: "CM Window Haryana",
    url: "https://cmharyanacell.nic.in/",
    domain: "cmharyanacell.nic.in",
    authorityScope: "Government of Haryana",
    description:
      "Statewide public grievance filing and tracking portal for Haryana.",
    states: ["Haryana"],
    tags: ["haryana", "state", "civic", "government"],
  },
};

export const VERIFIED_PORTAL_IDS = Object.keys(VERIFIED_PORTALS);

export function getPortalCatalogSummaryForPrompt(): string {
  return Object.values(VERIFIED_PORTALS)
    .map(
      (p) =>
        `- id: "${p.id}" | name: ${p.name} | scope: ${p.authorityScope} | states: ${
          p.states?.join(", ") ?? "All India"
        }${p.districts ? ` | districts: ${p.districts.join(", ")}` : ""} | topics: ${p.tags.join(", ")}`,
    )
    .join("\n");
}

function findStatePortalId(state: string): string | undefined {
  const match = Object.values(VERIFIED_PORTALS).find(
    (p) => p.states?.includes(state) && !p.districts && p.tags.includes("state"),
  );
  return match?.id;
}

export function selectFallbackPortalIds(
  category: ComplaintCategory,
  state: string,
  district: string,
  complaintText = "",
): { primaryId: string; secondaryId: string } {
  const lower = complaintText.toLowerCase();
  const stateId = findStatePortalId(state) ?? "cpgrams";

  // Sector keyword checks for high-precision routing
  if (/(train|railway|irctc|station|coach|pnr)/i.test(lower)) {
    return { primaryId: "railmadad", secondaryId: "cpgrams" };
  }
  if (/(bank|upi|atm|fraud|scam|cyber|phishing)/i.test(lower)) {
    if (/(scam|fraud|cyber|phishing|hacked)/i.test(lower)) {
      return { primaryId: "cybercrime_india", secondaryId: "rbi_cms" };
    }
    return { primaryId: "rbi_cms", secondaryId: "national_consumer" };
  }
  if (/(electricity|power cut|eb bill|tneb|transformer|electric pole|बिजली|மின்சாரம்|கரண்ட்)/i.test(lower)) {
    if (state === "Tamil Nadu") return { primaryId: "tangedco_tn", secondaryId: "tn_cm_helpline" };
    if (state === "Karnataka" && district.includes("Bengaluru")) {
      return { primaryId: "bescom_karnataka", secondaryId: "karnataka_janaspandana" };
    }
    if (state === "Maharashtra") return { primaryId: "mahavitaran_mh", secondaryId: "maharashtra_aaple_sarkar" };
  }
  if (
    state === "Tamil Nadu" &&
    district === "Chennai" &&
    /(water|sewage|drain|drainage|கழிவுநீர்|குடிநீர்|சாக்கடை)/i.test(lower)
  ) {
    return { primaryId: "cmwssb_chennai", secondaryId: "gcc_chennai" };
  }

  if (category === "Consumer Complaints") {
    return { primaryId: "national_consumer", secondaryId: stateId !== "cpgrams" ? stateId : "cpgrams" };
  }
  if (category === "Legal Assistance") {
    return { primaryId: "nalsa_legal", secondaryId: stateId };
  }
  if (category === "Public Safety") {
    return { primaryId: stateId, secondaryId: "cybercrime_india" };
  }

  // City civic matches
  if (category === "Civic Issues") {
    if (district === "Chennai") return { primaryId: "gcc_chennai", secondaryId: "tn_cm_helpline" };
    if (district === "Bengaluru Urban") return { primaryId: "bbmp_bengaluru", secondaryId: "karnataka_janaspandana" };
    if (district === "Mumbai City" || district === "Mumbai Suburban") {
      return { primaryId: "bmc_mumbai", secondaryId: "maharashtra_aaple_sarkar" };
    }
    if (district === "Hyderabad") return { primaryId: "ghmc_hyderabad", secondaryId: "telangana_prajavani" };
  }

  return {
    primaryId: stateId,
    secondaryId: stateId === "cpgrams" ? "national_consumer" : "cpgrams",
  };
}

import type { ComplaintCategory, LanguageOption } from "../types";

export const LANGUAGES: LanguageOption[] = [
  { name: "English", nativeLabel: "English", locale: "en-IN" },
  { name: "Tamil", nativeLabel: "தமிழ்", locale: "ta-IN" },
  { name: "Hindi", nativeLabel: "हिन्दी", locale: "hi-IN" },
  { name: "Telugu", nativeLabel: "తెలుగు", locale: "te-IN" },
  { name: "Kannada", nativeLabel: "ಕನ್ನಡ", locale: "kn-IN" },
  { name: "Malayalam", nativeLabel: "മലയാളം", locale: "ml-IN" },
  { name: "Bengali", nativeLabel: "বাংলা", locale: "bn-IN" },
  { name: "Marathi", nativeLabel: "मराठी", locale: "mr-IN" },
  { name: "Gujarati", nativeLabel: "ગુજરાતી", locale: "gu-IN" },
  { name: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ", locale: "pa-IN" },
  { name: "Odia", nativeLabel: "ଓଡ଼ିଆ", locale: "or-IN" },
  { name: "Assamese", nativeLabel: "অসমীয়া", locale: "as-IN" },
  { name: "Urdu", nativeLabel: "اردو", locale: "ur-IN" },
];

export const LANGUAGE_LOCALE_MAP: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.name, l.locale]),
);

export const COMPLAINT_CATEGORIES: Array<{
  value: ComplaintCategory;
  examples: string;
}> = [
  {
    value: "Civic Issues",
    examples: "Drainage, street lights, potholes, drinking water, waste collection",
  },
  {
    value: "Consumer Complaints",
    examples: "Billing disputes, defective goods, telecom or utility overcharging",
  },
  {
    value: "Public Safety",
    examples: "Open manholes, hanging live wires, unsafe roads, local hazards",
  },
  {
    value: "Legal Assistance",
    examples: "Free legal aid inquiries, property disputes, worker rights",
  },
  {
    value: "Government Services",
    examples: "Ration card, pension, certificates, municipal permits, RTI",
  },
  {
    value: "Other",
    examples: "Any other local public grievance or administrative request",
  },
];

export interface SampleScenario {
  label: string;
  language: string;
  category: ComplaintCategory;
  state: string;
  district: string;
  town: string;
  street: string;
  complaint: string;
}

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    label: "Drainage overflow (Tamil / Chennai)",
    language: "Tamil",
    category: "Civic Issues",
    state: "Tamil Nadu",
    district: "Chennai",
    town: "Velachery",
    street: "3rd Main Road, Vijaya Nagar",
    complaint:
      "எங்கள் தெருவில் கடந்த இரண்டு நாட்களாக கழிவுநீர் சாலை முழுவதும் வழிந்து ஓடுகிறது. நடந்து செல்லவும் வாகனங்கள் செல்லவும் மிகவும் சிரமமாக உள்ளது.",
  },
  {
    label: "Street lights out (English / Bengaluru)",
    language: "English",
    category: "Civic Issues",
    state: "Karnataka",
    district: "Bengaluru Urban",
    town: "Indiranagar",
    street: "12th Cross, HAL 2nd Stage",
    complaint:
      "Five consecutive street lights along our stretch have not been working for the past four nights, making the road dark and unsafe for pedestrians and senior citizens.",
  },
  {
    label: "Excess electricity bill (Hindi / Pune)",
    language: "Hindi",
    category: "Consumer Complaints",
    state: "Maharashtra",
    district: "Pune",
    town: "Kothrud",
    street: "Paud Road, Sector B",
    complaint:
      "इस महीने का बिजली बिल सामान्य से तीन गुना अधिक आया है जबकि मीटर रीडिंग पिछले महीने जैसी ही है। कृपया बिल की जांच और सुधार किया जाए।",
  },
];

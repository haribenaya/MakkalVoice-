import type {
  ComplaintCategory,
  DocumentChecklistItem,
  DraftResponse,
  PortalEntry,
  PortalGuidance,
} from "../types";
import { selectFallbackPortalIds, VERIFIED_PORTALS } from "./verifiedPortals";
import { getLocalizedFallbackDocs, localizePortalEntry } from "./localizedPortals";

export function buildFallbackDocuments(
  category: ComplaintCategory,
  primaryPortalId: string,
): DocumentChecklistItem[] {
  const baseIdDoc: DocumentChecklistItem = {
    id: "doc-mobile-id",
    title: "Active mobile number (for OTP) & basic photo ID",
    detail: "Most Indian government portals verify your mobile via OTP and may ask for an ID or address reference.",
    mandatory: true,
  };

  if (primaryPortalId === "tangedco_tn" || primaryPortalId === "bescom_karnataka" || primaryPortalId === "mahavitaran_mh") {
    return [
      {
        id: "doc-eb-bill",
        title: "Latest electricity bill or Consumer / Service Connection Number",
        detail: "Helps the electricity board locate your exact meter, feeder, or billing account immediately.",
        mandatory: true,
      },
      {
        id: "doc-site-photo",
        title: "Clear photo of the issue (meter reading, damaged pole, or bill copy)",
        detail: "Keep photos under 2 MB in JPG/PNG or PDF format.",
        mandatory: true,
      },
      baseIdDoc,
      {
        id: "doc-prev-ticket",
        title: "Previous complaint number or payment receipt",
        detail: "Attach if you have already reported the outage or disputed the bill earlier.",
        mandatory: false,
      },
    ];
  }

  if (primaryPortalId === "railmadad") {
    return [
      {
        id: "doc-pnr",
        title: "PNR number, UTS ticket, or Train Number & Coach/Seat details",
        detail: "Required on RailMadad so railway staff can route your complaint to the exact train or station.",
        mandatory: true,
      },
      {
        id: "doc-rail-photo",
        title: "Photo or short clip of the coach/station issue or overcharged bill",
        detail: "Speeds up verification by railway supervisors.",
        mandatory: false,
      },
      baseIdDoc,
    ];
  }

  if (primaryPortalId === "rbi_cms" || primaryPortalId === "cybercrime_india") {
    return [
      {
        id: "doc-txn-proof",
        title: "Transaction ID / UTR number & bank/UPI statement screenshot",
        detail: "Shows exact date, time, amount, and recipient account details.",
        mandatory: true,
      },
      {
        id: "doc-bank-ack",
        title: "Earlier bank complaint acknowledgment or SMS/email alerts",
        detail: "For RBI CMS, proof of initial bank complaint (if already raised) is very helpful.",
        mandatory: true,
      },
      baseIdDoc,
      {
        id: "doc-scam-evidence",
        title: "Screenshots of suspicious messages, phone numbers, or links",
        detail: "Do not delete chats or call logs; save screenshots as JPG or PDF.",
        mandatory: false,
      },
    ];
  }

  if (category === "Consumer Complaints") {
    return [
      {
        id: "doc-invoice",
        title: "Purchase invoice, tax bill, or order confirmation receipt",
        detail: "Clearly showing seller name, date, amount paid, and item/service description.",
        mandatory: true,
      },
      {
        id: "doc-defect-proof",
        title: "Photo of defective product or screenshot of wrong billing / failed refund",
        detail: "Clear visual proof helps the National Consumer Helpline contact the company.",
        mandatory: true,
      },
      {
        id: "doc-company-chat",
        title: "Copy of earlier email/chat with customer care",
        detail: "Shows you tried resolving the issue with the company first.",
        mandatory: false,
      },
      baseIdDoc,
    ];
  }

  if (category === "Government Services") {
    return [
      {
        id: "doc-app-ack",
        title: "Application number, acknowledgment slip, or card number (Ration / Pension / Certificate)",
        detail: "Allows the department officer to pull up your existing file quickly.",
        mandatory: true,
      },
      {
        id: "doc-address-id",
        title: "Relevant ID or address proof copy (PDF/JPG)",
        detail: "Mask sensitive digits if not explicitly required by the official portal.",
        mandatory: true,
      },
      baseIdDoc,
      {
        id: "doc-prev-corresp",
        title: "Any earlier rejection notice or office visit slip",
        detail: "Helpful when appealing a delay or incorrect status.",
        mandatory: false,
      },
    ];
  }

  if (category === "Legal Assistance") {
    return [
      {
        id: "doc-case-papers",
        title: "Copies of notices, agreements, FIR, or relevant correspondence",
        detail: "Helps the District Legal Services Authority understand your matter accurately.",
        mandatory: true,
      },
      {
        id: "doc-eligibility",
        title: "Identity proof & income/eligibility certificate (for free legal aid under NALSA)",
        detail: "Required if applying for free legal aid under NALSA guidelines.",
        mandatory: true,
      },
      baseIdDoc,
    ];
  }

  // Default Civic Issues / Public Safety / Other
  return [
    {
      id: "doc-site-photo",
      title: "1–2 clear photos of the problem spot with nearby landmark visible",
      detail: "Helps field engineers identify the exact street, pole, drain, or road section.",
      mandatory: true,
    },
    {
      id: "doc-location-proof",
      title: "Exact ward/zone name, street address, or property/water tax number (if municipal)",
      detail: "Ensures your complaint goes to the right local ward officer instead of bouncing.",
      mandatory: true,
    },
    baseIdDoc,
    {
      id: "doc-prior-ref",
      title: "Earlier complaint / ticket number (if reported before)",
      detail: "Include only if you already filed a request earlier and it remained unresolved.",
      mandatory: false,
    },
  ];
}

function buildFallbackButtonGuide(uiLanguage: string) {
  const byLang: Record<string, Array<{ englishLabel: string; localMeaning: string }>> = {
    Tamil: [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "புதிய புகாரைப் பதிவு செய்யவும்" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "உங்கள் மொபைல் எண்ணுக்கு வரும் OTP-ஐ உள்ளிடவும்" },
      { englishLabel: "Select Department / Category", localMeaning: "சம்பந்தப்பட்ட அரசு துறையைத் தேர்ந்தெடுக்கவும்" },
      { englishLabel: "Grievance Description", localMeaning: "இங்கே நகலெடுத்த புகார் கடிதத்தை ஒட்டவும் (Paste)" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "புகைப்படம் அல்லது பில் கோப்பை இணைக்கவும்" },
      { englishLabel: "Submit", localMeaning: "புகாரை இறுதியாகச் சமர்ப்பிக்கவும்" },
    ],
    Hindi: [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "नई शिकायत दर्ज करें" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "अपने मोबाइल पर आया OTP दर्ज करें" },
      { englishLabel: "Select Department / Category", localMeaning: "संबंधित सरकारी विभाग चुनें" },
      { englishLabel: "Grievance Description", localMeaning: "यहाँ कॉपी किया गया शिकायत पत्र पेस्ट करें" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "फ़ोटो या बिल अपलोड करें" },
      { englishLabel: "Submit", localMeaning: "शिकायत अंतिम रूप से जमा करें" },
    ],
    Telugu: [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "కొత్త ఫిర్యాదు నమోదు చేయండి" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "మీ మొబైల్‌కు వచ్చిన OTP నమోదు చేయండి" },
      { englishLabel: "Select Department / Category", localMeaning: "సంబంధిత ప్రభుత్వ శాఖను ఎంచుకోండి" },
      { englishLabel: "Grievance Description", localMeaning: "కాపీ చేసిన ఫిర్యాదు లేఖను ఇక్కడ పేస్ట్ చేయండి" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "ఫోటో లేదా బిల్లు జత చేయండి" },
      { englishLabel: "Submit", localMeaning: "ఫిర్యాదును సమర్పించండి" },
    ],
    Kannada: [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "ಹೊಸ ದೂರು ದಾಖಲಿಸಿ" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ ಬಂದ OTP ನಮೂದಿಸಿ" },
      { englishLabel: "Select Department / Category", localMeaning: "ಸಂಬಂಧಿತ ಸರ್ಕಾರಿ ಇಲಾಖೆ ಆಯ್ಕೆಮಾಡಿ" },
      { englishLabel: "Grievance Description", localMeaning: "ಕಾಪಿ ಮಾಡಿದ ದೂರು ಪತ್ರವನ್ನು ಇಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "ಫೋಟೋ ಅಥವಾ ಬಿಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ" },
      { englishLabel: "Submit", localMeaning: "ದೂರನ್ನು ಸಲ್ಲಿಸಿ" },
    ],
    Malayalam: [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "പുതിയ പരാതി രജിസ്റ്റർ ചെയ്യുക" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "മൊബൈലിൽ വന്ന OTP നൽകുക" },
      { englishLabel: "Select Department / Category", localMeaning: "ബന്ധപ്പെട്ട സർക്കാർ വകുപ്പ് തിരഞ്ഞെടുക്കുക" },
      { englishLabel: "Grievance Description", localMeaning: "കോപ്പി ചെയ്ത പരാതി കത്ത് ഇവിടെ പേസ്റ്റ് ചെയ്യുക" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "ഫോട്ടോ അല്ലെങ്കിൽ ബിൽ അപ്‌ലോഡ് ചെയ്യുക" },
      { englishLabel: "Submit", localMeaning: "പരാതി സമർപ്പിക്കുക" },
    ],
    Bengali: [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "নতুন অভিযোগ নথিভুক্ত করুন" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "মোবাইলে আসা OTP লিখুন" },
      { englishLabel: "Select Department / Category", localMeaning: "সংশ্লিষ্ট সরকারি দপ্তর বেছে নিন" },
      { englishLabel: "Grievance Description", localMeaning: "কপি করা অভিযোগ পত্রটি এখানে পেস্ট করুন" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "ছবি বা বিল আপলোড করুন" },
      { englishLabel: "Submit", localMeaning: "অভিযোগ জমা দিন" },
    ],
    Marathi: [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "नवीन तक्रार नोंदवा" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "मोबाईलवर आलेला OTP टाका" },
      { englishLabel: "Select Department / Category", localMeaning: "संबंधित सरकारी विभाग निवडा" },
      { englishLabel: "Grievance Description", localMeaning: "कॉपी केलेले तक्रार पत्र येथे पेस्ट करा" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "फोटो किंवा बिल अपलोड करा" },
      { englishLabel: "Submit", localMeaning: "तक्रार सादर करा" },
    ],
    Gujarati: [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "નવી ફરિયાદ નોંધાવો" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "મોબાઇલ પર આવેલો OTP દાખલ કરો" },
      { englishLabel: "Select Department / Category", localMeaning: "સંબંધિત સરકારી વિભાગ પસંદ કરો" },
      { englishLabel: "Grievance Description", localMeaning: "કોપી કરેલો ફરિયાદ પત્ર અહીં પેસ્ટ કરો" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "ફોટો અથવા બિલ અપલોડ કરો" },
      { englishLabel: "Submit", localMeaning: "ફરિયાદ સબમિટ કરો" },
    ],
    Punjabi: [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "ਨਵੀਂ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "ਆਪਣੇ ਮੋਬਾਈਲ 'ਤੇ ਆਇਆ OTP ਦਰਜ ਕਰੋ" },
      { englishLabel: "Select Department / Category", localMeaning: "ਸੰਬੰਧਿਤ ਸਰਕਾਰੀ ਵਿਭਾਗ ਚੁਣੋ" },
      { englishLabel: "Grievance Description", localMeaning: "ਕਾਪੀ ਕੀਤਾ ਸ਼ਿਕਾਇਤ ਪੱਤਰ ਇੱਥੇ ਪੇਸਟ ਕਰੋ" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "ਫ਼ੋਟੋ ਜਾਂ ਬਿੱਲ ਅਪਲੋਡ ਕਰੋ" },
      { englishLabel: "Submit", localMeaning: "ਸ਼ਿਕਾਇਤ ਅੰਤਿਮ ਰੂਪ ਵਿੱਚ ਜਮ੍ਹਾਂ ਕਰੋ" },
    ],
    Odia: [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "ନୂତନ ଅଭିଯୋଗ ପଞ୍ଜୀକରଣ କରନ୍ତୁ" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "ଆପଣଙ୍କ ମୋବାଇଲ୍‌କୁ ଆସିଥିବା OTP ଦିଅନ୍ତୁ" },
      { englishLabel: "Select Department / Category", localMeaning: "ସମ୍ପୃକ୍ତ ସରକାରୀ ବିଭାଗ ବାଛନ୍ତୁ" },
      { englishLabel: "Grievance Description", localMeaning: "କପି ହୋଇଥିବା ଅଭିଯୋଗ ପତ୍ର ଏଠାରେ ପେଷ୍ଟ କରନ୍ତୁ" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "ଫଟୋ କିମ୍ବା ବିଲ୍ ଅପଲୋଡ୍ କରନ୍ତୁ" },
      { englishLabel: "Submit", localMeaning: "ଅଭିଯୋଗ ଚୂଡ଼ାନ୍ତ ଭାବରେ ଦାଖଲ କରନ୍ତୁ" },
    ],
    Assamese: [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "নতুন অভিযোগ পঞ্জীয়ন কৰক" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "আপোনাৰ ম'বাইলত অহা OTP দিয়ক" },
      { englishLabel: "Select Department / Category", localMeaning: "সংশ্লিষ্ট চৰকাৰী বিভাগ বাছনি কৰক" },
      { englishLabel: "Grievance Description", localMeaning: "কপি কৰা অভিযোগ পত্ৰ ইয়াত পেষ্ট কৰক" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "ফটো বা বিল আপলোড কৰক" },
      { englishLabel: "Submit", localMeaning: "অভিযোগ চূড়ান্তভাৱে দাখিল কৰক" },
    ],
    Urdu: [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "نئی شکایت درج کریں" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "اپنے موبائل پر آنے والا OTP درج کریں" },
      { englishLabel: "Select Department / Category", localMeaning: "متعلقہ سرکاری محکمہ منتخب کریں" },
      { englishLabel: "Grievance Description", localMeaning: "کاپی کیا ہوا شکایت نامہ یہاں پیسٹ کریں" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "تصویر یا بل اپ لوڈ کریں" },
      { englishLabel: "Submit", localMeaning: "شکایت حتمی طور پر جمع کریں" },
    ],
  };

  return (
    byLang[uiLanguage] ?? [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "Start filing a new complaint on the portal" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "Enter the one-time code sent to your mobile number" },
      { englishLabel: "Select Department / Category", localMeaning: "Pick the matching government department" },
      { englishLabel: "Grievance Description", localMeaning: "Paste your prepared formal complaint letter here" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "Attach supporting photos, bills, or PDF proof" },
      { englishLabel: "Submit", localMeaning: "Send your complaint and receive your tracking ID" },
    ]
  );
}

export function resolvePortalGuidance(
  category: ComplaintCategory,
  state: string,
  district: string,
  complaintText: string,
  draftData: DraftResponse | null,
  emergencyNoteText: string,
  verificationNoteText: string,
  uiLanguage = "English",
): PortalGuidance {
  const fallback = selectFallbackPortalIds(category, state, district, complaintText);

  const primaryId =
    draftData?.primaryPortalId && VERIFIED_PORTALS[draftData.primaryPortalId]
      ? draftData.primaryPortalId
      : fallback.primaryId;

  const secondaryCandidate =
    draftData?.secondaryPortalId &&
    VERIFIED_PORTALS[draftData.secondaryPortalId] &&
    draftData.secondaryPortalId !== primaryId
      ? draftData.secondaryPortalId
      : fallback.secondaryId !== primaryId
        ? fallback.secondaryId
        : undefined;

  const rawPrimary = VERIFIED_PORTALS[primaryId] ?? VERIFIED_PORTALS.cpgrams;
  const rawSecondary = secondaryCandidate ? VERIFIED_PORTALS[secondaryCandidate] : undefined;

  const primary = localizePortalEntry(rawPrimary, uiLanguage);
  const secondary = rawSecondary ? localizePortalEntry(rawSecondary, uiLanguage) : undefined;

  const requiredDocuments =
    draftData?.requiredDocuments && draftData.requiredDocuments.length > 0
      ? draftData.requiredDocuments
      : getLocalizedFallbackDocs(category, uiLanguage) ??
        buildFallbackDocuments(category, primaryId);

  const englishButtonGuide =
    draftData?.englishButtonGuide && draftData.englishButtonGuide.length > 0
      ? draftData.englishButtonGuide
      : buildFallbackButtonGuide(uiLanguage);

  return {
    primary,
    secondary,
    whyThisPortal: draftData?.whyThisPortal,
    portalLanguageTip: draftData?.portalLanguageTip,
    filingSteps: draftData?.filingSteps,
    requiredDocuments,
    englishButtonGuide,
    emergencyNote: category === "Public Safety" ? emergencyNoteText : undefined,
    verificationNote: verificationNoteText,
  };
}

export const FEATURED_OFFICIAL_PORTALS: PortalEntry[] = [
  VERIFIED_PORTALS.cpgrams,
  VERIFIED_PORTALS.national_consumer,
  VERIFIED_PORTALS.tn_cm_helpline,
  VERIFIED_PORTALS.railmadad,
  VERIFIED_PORTALS.cybercrime_india,
  VERIFIED_PORTALS.nalsa_legal,
];

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
  if (uiLanguage === "Tamil") {
    return [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "புதிய புகாரைப் பதிவு செய்யவும்" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "உங்கள் மொபைல் எண்ணுக்கு வரும் OTP-ஐ உள்ளிடவும்" },
      { englishLabel: "Select Department / Category", localMeaning: "சம்பந்தப்பட்ட அரசு துறையைத் தேர்ந்தெடுக்கவும்" },
      { englishLabel: "Grievance Description", localMeaning: "இங்கே நகலெடுத்த புகார் கடிதத்தை ஒட்டவும் (Paste)" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "புகைப்படம் அல்லது பில் கோப்பை இணைக்கவும்" },
      { englishLabel: "Submit", localMeaning: "புகாரை இறுதியாகச் சமர்ப்பிக்கவும்" },
    ];
  }
  if (uiLanguage === "Hindi") {
    return [
      { englishLabel: "Register / Lodge Grievance", localMeaning: "नई शिकायत दर्ज करें" },
      { englishLabel: "Mobile OTP Verification", localMeaning: "अपने मोबाइल पर आया OTP दर्ज करें" },
      { englishLabel: "Select Department / Category", localMeaning: "संबंधित सरकारी विभाग चुनें" },
      { englishLabel: "Grievance Description", localMeaning: "यहाँ कॉपी किया गया शिकायत पत्र पेस्ट करें" },
      { englishLabel: "Upload Attachment / Document", localMeaning: "फ़ोटो या बिल अपलोड करें" },
      { englishLabel: "Submit", localMeaning: "शिकायत अंतिम रूप से जमा करें" },
    ];
  }
  return [
    { englishLabel: "Register / Lodge Grievance", localMeaning: "Start filing a new complaint on the portal" },
    { englishLabel: "Mobile OTP Verification", localMeaning: "Enter the one-time code sent to your mobile number" },
    { englishLabel: "Select Department / Category", localMeaning: "Pick the matching government department" },
    { englishLabel: "Grievance Description", localMeaning: "Paste your prepared formal complaint letter here" },
    { englishLabel: "Upload Attachment / Document", localMeaning: "Attach supporting photos, bills, or PDF proof" },
    { englishLabel: "Submit", localMeaning: "Send your complaint and receive your tracking ID" },
  ];
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

export type ComplaintCategory =
  | "Civic Issues"
  | "Consumer Complaints"
  | "Public Safety"
  | "Legal Assistance"
  | "Government Services"
  | "Other";

export type StepId = "describe" | "clarify" | "review";

export type SubmissionMode = "complaint" | "rti" | "escalation";

export interface LanguageOption {
  name: string;
  nativeLabel: string;
  locale: string;
}

export interface AnswerEntry {
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: string;
}

export interface ComplaintFormState {
  mode: SubmissionMode;
  previousTicketId: string;
  language: string;
  category: ComplaintCategory;
  state: string;
  district: string;
  customDistrict: string;
  town: string;
  street: string;
  pincode: string;
  gpsLat?: number;
  gpsLng?: number;
  referenceNumber: string;
  name: string;
  contact: string;
  complaint: string;
}

export interface GpsLocationResult {
  lat: number;
  lng: number;
  state: string;
  district: string;
  town: string;
  street: string;
  pincode: string;
  formattedAddress: string;
}

export interface ScannedEvidenceResult {
  issueSummary: string;
  extractedReferenceNumber: string;
  suggestedCategory: ComplaintCategory;
  extractedLocationHint: string;
}

export interface EvidenceAttachment {
  id: string;
  name: string;
  dataUrl: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  width: number;
  height: number;
}

export type SavedComplaintStatus = "drafted" | "submitted" | "followup_due" | "resolved";

export interface SavedComplaintRecord {
  id: string;
  createdAt: string;
  mode: SubmissionMode;
  language: string;
  category: ComplaintCategory;
  subject: string;
  draft: string;
  state: string;
  district: string;
  town: string;
  street: string;
  pincode: string;
  referenceNumber: string;
  portalName: string;
  portalUrl: string;
  portalHelpline?: string;
  trackingId: string;
  status: SavedComplaintStatus;
  reminderDate: string;
}

export interface PortalEntry {
  id?: string;
  name: string;
  url: string;
  domain?: string;
  authorityScope: string;
  description: string;
  helpline?: string;
}

export interface DocumentChecklistItem {
  id: string;
  title: string;
  detail: string;
  mandatory: boolean;
}

export interface PortalButtonGuideItem {
  englishLabel: string;
  localMeaning: string;
}

export interface DraftResponse {
  subject: string;
  draft: string;
  suggestedAuthority: string;
  summaryPoints: string[];
  draftLanguage: string;
  primaryPortalId: string;
  secondaryPortalId?: string;
  whyThisPortal: string;
  portalLanguageTip?: string;
  filingSteps: string[];
  requiredDocuments: DocumentChecklistItem[];
  englishButtonGuide?: PortalButtonGuideItem[];
}

export interface VoiceExtractionResponse {
  category?: ComplaintCategory;
  state?: string;
  district?: string;
  town?: string;
  street?: string;
}

export interface PortalGuidance {
  primary: PortalEntry;
  secondary?: PortalEntry;
  whyThisPortal?: string;
  portalLanguageTip?: string;
  filingSteps?: string[];
  requiredDocuments: DocumentChecklistItem[];
  englishButtonGuide: PortalButtonGuideItem[];
  emergencyNote?: string;
  verificationNote: string;
}

export interface PortalChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}



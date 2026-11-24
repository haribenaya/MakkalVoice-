export interface SubmissionUiStrings {
  // Next Steps Section & Modal
  nextStepsKicker: string;
  nextStepsHeading: string;
  nextStepsSubheading: string;
  openStepGuideBtn: string;
  modalTitle: string;
  modalCloseLabel: string;
  modalStepPrefix: string;
  modalPrevBtn: string;
  modalNextBtn: string;
  modalDoneBtn: string;
  modalStep1Title: string;
  modalStep1Desc: string;
  modalStep2Title: string;
  modalStep2Desc: string;
  modalStep3Title: string;
  modalStep3Desc: string;
  modalStep4Title: string;
  modalStep4Desc: string;
  modalCopyHint: string;
  modalPortalLaunchHint: string;
  modalTrackingReminder: string;
  readStepAloud: string;
  stopStepAudio: string;
  // Document Checklist
  documentsTitle: string;
  documentsSubtitle: string;
  docRequiredTag: string;
  docOptionalTag: string;
  docsReadyLabel: string;
  docFormatNote: string;
  // Gemini Multi-Turn Chatbot
  chatOpenBtn: string;
  chatTitle: string;
  chatSubtitle: string;
  chatRoleLabel: string;
  chatWelcome: string;
  chatContextActive: string;
  chatPlaceholder: string;
  chatSendBtn: string;
  chatSending: string;
  chatClearBtn: string;
  chatSpeakBtn: string;
  chatStopListening: string;
  chatListenReply: string;
  chatStopReply: string;
  chatSuggestionsLabel: string;
  chatSuggestion1: string;
  chatSuggestion2: string;
  chatSuggestion3: string;
  chatAskInSectionBtn: string;
  chatEmptyHint: string;
  // Required Citizen Details (Non-Optional)
  citizenDetailsTitle: string;
  citizenDetailsNote: string;
  requiredNameLabel: string;
  requiredNamePlaceholder: string;
  requiredPhoneLabel: string;
  requiredPhonePlaceholder: string;
  errMissingName: string;
  errInvalidPhone: string;
  privacyRequiredLocalDesc: string;
  // Portal-needed extra fields & aligned Step 1 parts
  step1Part1Title: string;
  pincodeLabel: string;
  pincodePlaceholder: string;
  referenceNumberLabel: string;
  referenceNumberPlaceholder: string;
  // Portal language availability & English-only portal bridge
  portalLanguageNoticeTitle: string;
  portalLangTamilAndEnglish: string;
  portalLangHindiAndEnglish: string;
  portalLangMultiIndian: string;
  portalLangEnglishOnly: string;
  portalFormSheetTitle: string;
  portalFormSheetSubtitle: string;
  copyFieldBtn: string;
  copiedFieldBtn: string;
  buttonGuideTitle: string;
  buttonGuideSubtitle: string;
  otpSubmissionNote: string;
  chatYouLabel: string;
}

const EN: SubmissionUiStrings = {
  nextStepsKicker: "Next Steps · Ready to File",
  nextStepsHeading: "How to submit your draft on the official portal",
  nextStepsSubheading:
    "Gather the supporting documents below, then follow the step-by-step submission guide to file your complaint directly on the official portal.",
  openStepGuideBtn: "Open Step-by-Step Submission Guide",
  modalTitle: "Step-by-Step Submission Guide",
  modalCloseLabel: "Close guide",
  modalStepPrefix: "Step",
  modalPrevBtn: "Previous",
  modalNextBtn: "Next Step",
  modalDoneBtn: "Finish Guide",
  modalStep1Title: "Gather your supporting documents",
  modalStep1Desc:
    "Check off the photos, bills, or IDs you have ready. Having them saved on your phone or computer makes uploading fast.",
  modalStep2Title: "Copy or download your complaint draft",
  modalStep2Desc:
    "Copy the subject and formal complaint letter below so you can paste it directly into the portal's grievance box.",
  modalStep3Title: "Open the verified official portal",
  modalStep3Desc:
    "Follow the portal-specific steps below to sign in, choose the department, paste your draft, and attach your files.",
  modalStep4Title: "Submit & save your tracking number",
  modalStep4Desc:
    "After clicking Submit on the government site, note down the official Grievance / Ticket ID and SMS receipt for follow-up.",
  modalCopyHint: "Draft text ready to copy",
  modalPortalLaunchHint: "Opens in a new browser tab so this guide stays open.",
  modalTrackingReminder:
    "Keep your official registration number safe. If there is no response within the portal's service timeframe, you can escalate using the backup portal.",
  readStepAloud: "Read Step Aloud",
  stopStepAudio: "Stop Audio",
  documentsTitle: "Documents & Proof You May Need to Attach",
  documentsSubtitle:
    "Check each item as you prepare it. Most Indian government portals accept JPG/PNG photos or PDF files under 2 MB.",
  docRequiredTag: "Recommended",
  docOptionalTag: "If available",
  docsReadyLabel: "prepared",
  docFormatNote:
    "Tip: Take clear daylight photos and keep file sizes small (PDF or JPG) before opening the portal.",
  chatOpenBtn: "Submission Help",
  chatTitle: "Portal & Submission Assistant",
  chatSubtitle: "Ask anything about filing, documents, tracking IDs, or escalation",
  chatRoleLabel: "Civic Filing Guide",
  chatWelcome:
    "Hello! I am your MakkalVoice Filing Guide. Ask me how to submit your complaint on the official portal, which documents to attach, how to resize files, or what to do if you don't get a reply.",
  chatContextActive: "Using your current portal & complaint details",
  chatPlaceholder: "Ask about filing steps, documents, or portal help...",
  chatSendBtn: "Send",
  chatSending: "Replying...",
  chatClearBtn: "New chat",
  chatSpeakBtn: "Speak",
  chatStopListening: "Stop",
  chatListenReply: "Listen",
  chatStopReply: "Stop",
  chatSuggestionsLabel: "Quick questions",
  chatSuggestion1: "What documents should I attach?",
  chatSuggestion2: "How do I file and get a tracking ID?",
  chatSuggestion3: "What if there is no response after filing?",
  chatAskInSectionBtn: "Ask AI Filing Guide",
  chatEmptyHint: "Tap a quick question or type / speak your own below.",
  citizenDetailsTitle: "Your Name & Phone Number",
  citizenDetailsNote:
    "Required to sign your formal complaint letter. Filled locally on your device — never sent to AI.",
  requiredNameLabel: "Full Name",
  requiredNamePlaceholder: "Enter your full name",
  requiredPhoneLabel: "Phone Number",
  requiredPhonePlaceholder: "Enter your 10-digit mobile number",
  errMissingName: "Please enter your full name before continuing.",
  errInvalidPhone: "Please enter a valid 10-digit phone number before continuing.",
  privacyRequiredLocalDesc:
    "Your name and phone number are filled into your complaint locally in your browser and are never sent to AI.",
  step1Part1Title: "Describe your problem (Voice or Typing)",
  pincodeLabel: "Pincode (optional)",
  pincodePlaceholder: "e.g., 600042",
  referenceNumberLabel: "Consumer / Bill / PNR / Application No. (if any)",
  referenceNumberPlaceholder: "Optional — speeds up official portal filing",
  portalLanguageNoticeTitle: "Portal Language Info",
  portalLangTamilAndEnglish: "Portal offers Tamil & English language switch at top",
  portalLangHindiAndEnglish: "Portal offers Hindi & English language switch (mostly English forms)",
  portalLangMultiIndian: "Portal supports multiple Indian languages via top language menu",
  portalLangEnglishOnly: "External government portal is in English — use our 1-tap copy sheet & button guide below",
  portalFormSheetTitle: "Ready-to-Paste Portal Form Fields",
  portalFormSheetSubtitle:
    "Government portals ask for details in English boxes. Tap Copy beside each field and paste directly into the matching English box on the portal.",
  copyFieldBtn: "Copy",
  copiedFieldBtn: "Copied",
  buttonGuideTitle: "English Portal Button Guide",
  buttonGuideSubtitle:
    "What the English buttons and headings on the external government portal mean:",
  otpSubmissionNote:
    "Official Indian government portals require direct citizen OTP and CAPTCHA verification to issue a real tracking ID. MakkalVoice prepares every English field and button translation so you can finish in minutes.",
  chatYouLabel: "You",
};

const TA: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "அடுத்த படிகள் · சமர்ப்பிக்க தயார்",
  nextStepsHeading: "அதிகாரப்பூர்வ போர்ட்டலில் புகாரை சமர்ப்பிப்பது எப்படி",
  nextStepsSubheading:
    "கீழே உள்ள ஆவணங்களைத் தயார் செய்து, படிப்படியான வழிகாட்டியைப் பின்பற்றி நேரடியாக அரசு போர்ட்டலில் சமர்ப்பிக்கவும்.",
  openStepGuideBtn: "படிப்படியான சமர்ப்பிப்பு வழிகாட்டியைத் திறக்கவும்",
  modalTitle: "படிப்படியான புகார் சமர்ப்பிப்பு வழிகாட்டி",
  modalCloseLabel: "வழிகாட்டியை மூடு",
  modalStepPrefix: "படி",
  modalPrevBtn: "முந்தையது",
  modalNextBtn: "அடுத்த படி",
  modalDoneBtn: "முடிந்தது",
  modalStep1Title: "தேவையான ஆவணங்களைத் தயார் செய்யுங்கள்",
  modalStep1Desc:
    "புகைப்படங்கள், பில்கள் அல்லது அடையாள அட்டையைத் தயார் செய்து டிக் செய்யவும்.",
  modalStep2Title: "உங்கள் புகார் கடிதத்தை நகலெடுக்கவும்",
  modalStep2Desc:
    "போர்ட்டலில் உடனே ஒட்ட (Paste) வசதியாக புகார் தலைப்பு மற்றும் கடிதத்தை நகலெடுக்கவும்.",
  modalStep3Title: "அதிகாரப்பூர்வ அரசு போர்ட்டலைத் திறக்கவும்",
  modalStep3Desc:
    "கீழே உள்ள படிகளைப் பின்பற்றி உள்நுழைந்து, துறையைத் தேர்ந்தெடுத்து, கடிதத்தையும் ஆவணங்களையும் இணைக்கவும்.",
  modalStep4Title: "சமர்ப்பித்து புகார் எண்ணை (Tracking ID) சேமிக்கவும்",
  modalStep4Desc:
    "சமர்ப்பித்த பிறகு வரும் அதிகாரப்பூர்வ புகார் எண்ணை மற்றும் SMS-ஐப் பாதுகாப்பாக குறித்து வைக்கவும்.",
  modalCopyHint: "நகலெடுக்கத் தயாராக உள்ள புகார் கடிதம்",
  modalPortalLaunchHint: "புதிய தாவலில் (New Tab) திறக்கும்; இந்த வழிகாட்டி இங்கேயே இருக்கும்.",
  modalTrackingReminder:
    "உங்கள் அதிகாரப்பூர்வ புகார் எண்ணைப் பாதுகாப்பாக வைத்திருங்கள். குறிப்பிட்ட நாட்களில் பதில் வரவில்லை என்றால் மாற்று போர்ட்டலில் மேல்முறையீடு செய்யலாம்.",
  readStepAloud: "இந்தப் படியைக் கேட்க",
  stopStepAudio: "ஒலியை நிறுத்து",
  documentsTitle: "இணைக்கத் தேவைப்படக்கூடிய ஆவணங்கள் & ஆதாரங்கள்",
  documentsSubtitle:
    "தயார் செய்த ஆவணங்களை டிக் செய்யவும். பெரும்பாலான அரசு போர்ட்டல்கள் 2 MB-க்குள் JPG/PNG அல்லது PDF கோப்புகளை ஏற்கும்.",
  docRequiredTag: "பரிந்துரைக்கப்பட்டது",
  docOptionalTag: "இருந்தால் இணைக்கவும்",
  docsReadyLabel: "தயார்",
  docFormatNote:
    "குறிப்பு: தெளிவான புகைப்படங்களை எடுத்து JPG அல்லது PDF வடிவில் தயாராக வைத்திருக்கவும்.",
  chatOpenBtn: "சமர்ப்பிப்பு உதவி",
  chatTitle: "போர்ட்டல் & சமர்ப்பிப்பு உதவியாளர்",
  chatSubtitle: "புகார் பதிவு, ஆவணங்கள், புகார் எண் பற்றி எதையும் கேளுங்கள்",
  chatRoleLabel: "புகார் வழிகாட்டி",
  chatWelcome:
    "வணக்கம்! நான் MakkalVoice புகார் வழிகாட்டி. அரசு போர்ட்டலில் எப்படிப் புகார் பதிவது, என்ன ஆவணங்கள் இணைப்பது, அல்லது பதில் வரவில்லை என்றால் என்ன செய்வது என்று என்னிடம் கேளுங்கள்.",
  chatContextActive: "உங்கள் தற்போதைய போர்ட்டல் & புகார் விவரங்களுடன் இணைக்கப்பட்டுள்ளது",
  chatPlaceholder: "போர்ட்டல் பதிவு அல்லது ஆவணங்கள் பற்றி கேளுங்கள்...",
  chatSendBtn: "அனுப்பு",
  chatSending: "பதில் தயாராகிறது...",
  chatClearBtn: "புதிய உரையாடல்",
  chatSpeakBtn: "பேசுக",
  chatStopListening: "நிறுத்து",
  chatListenReply: "கேட்க",
  chatStopReply: "நிறுத்து",
  chatSuggestionsLabel: "விரைவு கேள்விகள்",
  chatSuggestion1: "எந்த ஆவணங்களை இணைக்க வேண்டும்?",
  chatSuggestion2: "புகார் பதிவு செய்து Tracking ID பெறுவது எப்படி?",
  chatSuggestion3: "சமர்ப்பித்த பிறகு பதில் வரவில்லை என்றால் என்ன செய்வது?",
  chatAskInSectionBtn: "AI வழிகாட்டியிடம் கேளுங்கள்",
  chatEmptyHint: "மேலே உள்ள கேள்வியைத் தட்டவும் அல்லது கீழே பேசவும் / தட்டச்சு செய்யவும்.",
  citizenDetailsTitle: "உங்கள் பெயர் & தொலைபேசி எண்",
  citizenDetailsNote:
    "உங்கள் அதிகாரப்பூர்வ புகார் கடிதத்தில் கையொப்பமிட அவசியம். உங்கள் சாதனத்திலேயே சேர்க்கப்படும் — AI-க்கு அனுப்பப்படாது.",
  requiredNameLabel: "முழுப் பெயர்",
  requiredNamePlaceholder: "உங்கள் முழுப் பெயரை உள்ளிடவும்",
  requiredPhoneLabel: "தொலைபேசி எண்",
  requiredPhonePlaceholder: "உங்கள் 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்",
  errMissingName: "தொடர்வதற்கு முன் உங்கள் முழுப் பெயரை உள்ளிடவும்.",
  errInvalidPhone: "தொடர்வதற்கு முன் சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்.",
  privacyRequiredLocalDesc:
    "உங்கள் பெயர் மற்றும் தொலைபேசி எண் உங்கள் சாதனத்திலேயே கடிதத்தில் சேர்க்கப்படும் — AI-க்கு அனுப்பப்படாது.",
  step1Part1Title: "உங்கள் பிரச்சனையைப் பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள்",
  pincodeLabel: "அஞ்சல் குறியீடு / Pincode (விருப்பம்)",
  pincodePlaceholder: "உதா: 600042",
  referenceNumberLabel: "நுகர்வோர் / பில் / PNR / விண்ணப்ப எண் (இருந்தால்)",
  referenceNumberPlaceholder: "விருப்பம் — போர்ட்டலில் புகார் பதிய உதவும்",
  portalLanguageNoticeTitle: "போர்ட்டல் மொழித் தகவல்",
  portalLangTamilAndEnglish: "இந்த அரசு போர்ட்டலில் மேல் பகுதியில் தமிழ் / English மொழி மாற்றும் வசதி உள்ளது",
  portalLangHindiAndEnglish: "இந்த மத்திய அரசு போர்ட்டல் ஆங்கிலம் / ஹிந்தியில் இருக்கும் — கீழே உள்ள தமிழ் வழிகாட்டியைப் பயன்படுத்தி எளிதாகச் சமர்ப்பிக்கலாம்",
  portalLangMultiIndian: "இந்தப் போர்ட்டலின் மேல் மெனுவில் தமிழ் உட்பட இந்திய மொழிகளைத் தேர்ந்தெடுக்கலாம்",
  portalLangEnglishOnly: "இந்த அரசு போர்ட்டல் ஆங்கிலத்தில் மட்டுமே உள்ளது — கீழே உள்ள 1-தட்டல் நகலெடுப்பு & தமிழ் பொத்தான் வழிகாட்டியைப் பயன்படுத்தவும்",
  portalFormSheetTitle: "அரசு போர்ட்டலில் ஒட்டத் தயாரான படிவ விவரங்கள்",
  portalFormSheetSubtitle:
    "அரசு போர்ட்டல் ஆங்கிலத்தில் விவரங்களைக் கேட்கும். ஒவ்வொரு வரிக்கும் அருகில் உள்ள 'நகலெடு' பொத்தானைத் தட்டி, அதே ஆங்கிலப் பெட்டியில் ஒட்டவும் (Paste).",
  copyFieldBtn: "நகலெடு",
  copiedFieldBtn: "நகலெடுக்கப்பட்டது",
  buttonGuideTitle: "ஆங்கில போர்ட்டல் பொத்தான்களின் தமிழ் அர்த்தம்",
  buttonGuideSubtitle:
    "அரசு இணையதளத்தில் காணப்படும் ஆங்கில பொத்தான்களும் அவற்றின் எளிய தமிழ் விளக்கமும்:",
  otpSubmissionNote:
    "அதிகாரப்பூர்வ அரசு போர்ட்டல்களில் உங்கள் மொபைல் OTP மற்றும் CAPTCHA சரிபார்ப்பு தேவைப்படுவதால், இறுதி சமர்ப்பிப்பை நீங்களே அங்கே செய்ய வேண்டும். அதற்கான அனைத்து ஆங்கில விவரங்களையும் தமிழ் விளக்கத்தையும் MakkalVoice தயாராகக் கொடுத்துள்ளது.",
  chatYouLabel: "நீங்கள்",
};

const HI: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "अगले चरण · जमा करने के लिए तैयार",
  nextStepsHeading: "आधिकारिक पोर्टल पर अपनी शिकायत कैसे जमा करें",
  nextStepsSubheading:
    "नीचे दिए गए दस्तावेज़ तैयार करें और चरण-दर-चरण गाइड का पालन करके सीधे सरकारी पोर्टल पर शिकायत दर्ज करें।",
  openStepGuideBtn: "चरण-दर-चरण सबमिशन गाइड खोलें",
  modalTitle: "शिकायत जमा करने की चरण-दर-चरण गाइड",
  modalCloseLabel: "गाइड बंद करें",
  modalStepPrefix: "चरण",
  modalPrevBtn: "पिछला",
  modalNextBtn: "अगला चरण",
  modalDoneBtn: "गाइड पूरा करें",
  modalStep1Title: "सहायक दस्तावेज़ तैयार करें",
  modalStep1Desc:
    "जो फ़ोटो, बिल या पहचान पत्र आपके पास तैयार हैं, उन पर टिक लगाएं ताकि अपलोड करना आसान हो।",
  modalStep2Title: "शिकायत का ड्राफ्ट कॉपी या डाउनलोड करें",
  modalStep2Desc:
    "विषय और पूरा पत्र कॉपी करें ताकि आप इसे पोर्टल के शिकायत बॉक्स में सीधे पेस्ट कर सकें।",
  modalStep3Title: "सत्यापित आधिकारिक पोर्टल खोलें",
  modalStep3Desc:
    "नीचे दिए गए चरणों के अनुसार लॉगिन करें, विभाग चुनें, ड्राफ्ट पेस्ट करें और दस्तावेज़ अपलोड करें।",
  modalStep4Title: "जमा करें और ट्रैकिंग नंबर संभालकर रखें",
  modalStep4Desc:
    "सरकारी वेबसाइट पर सबमिट करने के बाद मिलने वाला शिकायत / टिकट नंबर और SMS सुरक्षित रखें।",
  modalCopyHint: "कॉपी करने के लिए ड्राफ्ट तैयार है",
  modalPortalLaunchHint: "नए टैब में खुलेगा ताकि यह गाइड आपके सामने रहे।",
  modalTrackingReminder:
    "अपना आधिकारिक पंजीकरण नंबर संभालकर रखें। यदि तय समय में कार्रवाई न हो, तो वैकल्पिक पोर्टल से आगे शिकायत करें।",
  readStepAloud: "यह चरण सुनें",
  stopStepAudio: "ऑडियो रोकें",
  documentsTitle: "संलग्न करने के लिए ज़रूरी दस्तावेज़ और प्रमाण",
  documentsSubtitle:
    "तैयार दस्तावेज़ों पर टिक लगाएं। अधिकतर सरकारी पोर्टल 2 MB से कम की JPG/PNG फ़ोटो या PDF स्वीकार करते हैं।",
  docRequiredTag: "सुझाया गया",
  docOptionalTag: "यदि उपलब्ध हो",
  docsReadyLabel: "तैयार",
  docFormatNote:
    "सुझाव: पोर्टल खोलने से पहले साफ़ फ़ोटो लें और फ़ाइल का आकार छोटा (PDF या JPG) रखें।",
  chatOpenBtn: "सबमिशन सहायता",
  chatTitle: "पोर्टल और सबमिशन सहायक",
  chatSubtitle: "शिकायत दर्ज करने, दस्तावेज़ों या ट्रैकिंग नंबर के बारे में पूछें",
  chatRoleLabel: "शिकायत गाइड",
  chatWelcome:
    "नमस्ते! मैं MakkalVoice सबमिशन गाइड हूँ। आप मुझसे पूछ सकते हैं कि आधिकारिक पोर्टल पर शिकायत कैसे दर्ज करें, कौन से दस्तावेज़ लगाएं, या जवाब न मिलने पर क्या करें।",
  chatContextActive: "आपके वर्तमान पोर्टल और शिकायत विवरण से जुड़ा है",
  chatPlaceholder: "पोर्टल चरण, दस्तावेज़ या सहायता के बारे में पूछें...",
  chatSendBtn: "भेजें",
  chatSending: "जवाब तैयार हो रहा है...",
  chatClearBtn: "नई चैट",
  chatSpeakBtn: "बोलें",
  chatStopListening: "रोकें",
  chatListenReply: "सुनें",
  chatStopReply: "रोकें",
  chatSuggestionsLabel: "त्वरित प्रश्न",
  chatSuggestion1: "मुझे कौन से दस्तावेज़ संलग्न करने चाहिए?",
  chatSuggestion2: "पोर्टल पर दर्ज करके ट्रैकिंग नंबर कैसे मिलेगा?",
  chatSuggestion3: "शिकायत दर्ज करने के बाद जवाब न आए तो क्या करें?",
  chatAskInSectionBtn: "AI गाइड से पूछें",
  chatEmptyHint: "ऊपर दिए गए प्रश्न चुनें या नीचे बोलकर / लिखकर पूछें।",
  citizenDetailsTitle: "आपका नाम और फ़ोन नंबर",
  citizenDetailsNote:
    "औपचारिक शिकायत पत्र पर हस्ताक्षर के लिए आवश्यक। यह आपके डिवाइस पर ही भरा जाता है — AI को नहीं भेजा जाता।",
  requiredNameLabel: "पूरा नाम",
  requiredNamePlaceholder: "अपना पूरा नाम लिखें",
  requiredPhoneLabel: "फ़ोन नंबर",
  requiredPhonePlaceholder: "अपना 10 अंकों का मोबाइल नंबर लिखें",
  errMissingName: "आगे बढ़ने से पहले कृपया अपना पूरा नाम लिखें।",
  errInvalidPhone: "आगे बढ़ने से पहले कृपया सही 10 अंकों का फ़ोन नंबर लिखें।",
  privacyRequiredLocalDesc:
    "आपका नाम और फ़ोन नंबर आपके ब्राउज़र में ही शिकायत पत्र में जोड़े जाते हैं और कभी AI को नहीं भेजे जाते।",
  step1Part1Title: "अपनी समस्या बोलकर या लिखकर बताएं",
  pincodeLabel: "पिनकोड / Pincode (वैकल्पिक)",
  pincodePlaceholder: "उदा. 110001",
  referenceNumberLabel: "उपभोक्ता / बिल / PNR / आवेदन संख्या (यदि हो)",
  referenceNumberPlaceholder: "वैकल्पिक — पोर्टल पर दर्ज करने में मददगार",
  portalLanguageNoticeTitle: "पोर्टल की भाषा जानकारी",
  portalLangTamilAndEnglish: "इस राज्य पोर्टल में तमिल और अंग्रेज़ी भाषा चुनने का विकल्प उपलब्ध है",
  portalLangHindiAndEnglish: "इस सरकारी पोर्टल के ऊपर हिंदी और अंग्रेज़ी भाषा बदलने का विकल्प है",
  portalLangMultiIndian: "इस पोर्टल के भाषा मेनू में कई भारतीय भाषाएँ उपलब्ध हैं",
  portalLangEnglishOnly: "यह सरकारी पोर्टल अंग्रेज़ी में है — नीचे दिए गए 1-टैप कॉपी फ़ील्ड और हिंदी बटन गाइड का उपयोग करें",
  portalFormSheetTitle: "पोर्टल फ़ॉर्म में पेस्ट करने के लिए तैयार विवरण",
  portalFormSheetSubtitle:
    "सरकारी पोर्टल अंग्रेज़ी बॉक्स में जानकारी मांगते हैं। हर फ़ील्ड के सामने 'कॉपी' दबाएं और पोर्टल के उसी अंग्रेज़ी बॉक्स में पेस्ट करें।",
  copyFieldBtn: "कॉपी",
  copiedFieldBtn: "कॉपी हुआ",
  buttonGuideTitle: "अंग्रेज़ी पोर्टल बटनों का हिंदी अर्थ",
  buttonGuideSubtitle:
    "सरकारी वेबसाइट पर दिखने वाले अंग्रेज़ी बटनों और शीर्षकों का सरल अर्थ:",
  otpSubmissionNote:
    "आधिकारिक सरकारी पोर्टल पर असली ट्रैकिंग नंबर पाने के लिए आपका मोबाइल OTP और CAPTCHA सत्यापन आवश्यक होता है। MakkalVoice हर अंग्रेज़ी फ़ील्ड और बटन का अनुवाद तैयार रखता है ताकि आप मिनटों में शिकायत जमा कर सकें।",
  chatYouLabel: "आप",
};

const TE: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "తదుపరి దశలు · సమర్పించడానికి సిద్ధం",
  nextStepsHeading: "అధికారిక పోర్టల్‌లో మీ ఫిర్యాదును ఎలా సమర్పించాలి",
  nextStepsSubheading:
    "క్రింద ఉన్న డాక్యుమెంట్లను సిద్ధం చేసుకొని, దశలవారీ గైడ్‌ను అనుసరించి అధికారిక పోర్టల్‌లో నేరుగా సమర్పించండి.",
  openStepGuideBtn: "దశలవారీ సమర్పణ గైడ్ తెరవండి",
  modalTitle: "దశలవారీ ఫిర్యాదు సమర్పణ గైడ్",
  modalCloseLabel: "గైడ్ మూసివేయి",
  modalStepPrefix: "దశ",
  modalPrevBtn: "మునుపటి",
  modalNextBtn: "తదుపరి దశ",
  modalDoneBtn: "పూర్తయింది",
  modalStep1Title: "సహాయక పత్రాలను సిద్ధం చేసుకోండి",
  modalStep1Desc: "ఫోటోలు, బిల్లులు లేదా ID ప్రూఫ్‌లను సిద్ధం చేసి టిక్ చేయండి.",
  modalStep2Title: "ఫిర్యాదు డ్రాఫ్ట్‌ను కాపీ చేయండి",
  modalStep2Desc: "పోర్టల్‌లో నేరుగా పేస్ట్ చేయడానికి సబ్జెక్ట్ మరియు లేఖను కాపీ చేయండి.",
  modalStep3Title: "ధృవీకరించబడిన అధికారిక పోర్టల్ తెరవండి",
  modalStep3Desc: "లాగిన్ అయి, విభాగాన్ని ఎంచుకొని, మీ ఫిర్యాదు మరియు పత్రాలను అప్‌లోడ్ చేయండి.",
  modalStep4Title: "సమర్పించి ట్రాకింగ్ నంబర్ సేవ్ చేయండి",
  modalStep4Desc: "సమర్పించిన తర్వాత వచ్చే అధికారిక ఫిర్యాదు సంఖ్య మరియు SMS ను భద్రపరచుకోండి.",
  modalCopyHint: "ఫిర్యాదు డ్రాఫ్ట్ కాపీ చేయడానికి సిద్ధంగా ఉంది",
  modalPortalLaunchHint: "కొత్త ట్యాబ్‌లో తెరవబడుతుంది కాబట్టి ఈ గైడ్ ఇక్కడే ఉంటుంది.",
  modalTrackingReminder:
    "చాలా ప్రభుత్వ పోర్టల్‌లు 7–15 రోజుల్లో సమాధానం ఇస్తాయి. మీ ట్రాకింగ్ నంబర్ మరియు రసీదును భద్రంగా ఉంచుకోండి.",
  readStepAloud: "ఈ దశను వినండి",
  stopStepAudio: "ఆడియో ఆపండి",
  documentsTitle: "జత చేయవలసిన పత్రాలు & ఆధారాలు",
  documentsSubtitle:
    "సిద్ధం చేసిన పత్రాలకు టిక్ పెట్టండి. చాలా పోర్టల్‌లు 2 MB లోపు JPG/PNG లేదా PDF ఫైళ్లను అంగీకరిస్తాయి.",
  docRequiredTag: "సిఫార్సు చేయబడింది",
  docOptionalTag: "అందుబాటులో ఉంటే",
  docFormatNote: "సూచన: స్పష్టమైన ఫోటోలు తీయండి లేదా 2 MB లోపు PDF గా సేవ్ చేయండి.",
  docsReadyLabel: "సిద్ధం",
  chatOpenBtn: "సమర్పణ సహాయం",
  chatTitle: "పోర్టల్ & సమర్పణ సహాయకుడు",
  chatSubtitle: "ఫిర్యాదు నమోదు, పత్రాలు లేదా ట్రాకింగ్ ID గురించి అడగండి",
  chatRoleLabel: "ఫిర్యాదు గైడ్",
  chatWelcome:
    "నమస్కారం! నేను MakkalVoice సమర్పణ గైడ్‌ను. అధికారిక పోర్టల్‌లో ఫిర్యాదు ఎలా సమర్పించాలి, ఏ పత్రాలు జత చేయాలి అనే దానిపై నన్ను అడగండి.",
  chatContextActive: "మీ ప్రస్తుత పోర్టల్ మరియు ఫిర్యాదు వివరాలను ఉపయోగిస్తోంది",
  chatPlaceholder: "సమర్పణ దశలు లేదా పత్రాల గురించి అడగండి...",
  chatSendBtn: "పంపు",
  chatSending: "సమాధానం ఇస్తోంది...",
  chatClearBtn: "కొత్త చాట్",
  chatSpeakBtn: "మాట్లాడండి",
  chatStopListening: "ఆపండి",
  chatListenReply: "వినండి",
  chatStopReply: "ఆపండి",
  chatSuggestionsLabel: "త్వరిత ప్రశ్నలు",
  chatSuggestion1: "నేను ఏ పత్రాలను జత చేయాలి?",
  chatSuggestion2: "నమోదు చేసి ట్రాకింగ్ ID ఎలా పొందాలి?",
  chatSuggestion3: "సమర్పించిన తర్వాత స్పందన లేకపోతే ఏమి చేయాలి?",
  chatEmptyHint: "ఫిర్యాదు నమోదుపై సహాయం కోసం త్వరిత ప్రశ్నను ఎంచుకోండి లేదా మీ ప్రశ్నను అడగండి.",
  chatAskInSectionBtn: "AI గైడ్‌ను అడగండి",
  citizenDetailsTitle: "మీ పేరు & ఫోన్ నంబర్",
  citizenDetailsNote:
    "అధికారిక ఫిర్యాదు లేఖపై సంతకం కోసం అవసరం. మీ పరికరంలోనే పూరించబడుతుంది — AI కి పంపబడదు.",
  requiredNameLabel: "పూర్తి పేరు",
  requiredNamePlaceholder: "మీ పూర్తి పేరు నమోదు చేయండి",
  requiredPhoneLabel: "ఫోన్ నంబర్",
  requiredPhonePlaceholder: "మీ 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి",
  errMissingName: "కొనసాగే ముందు దయచేసి మీ పూర్తి పేరును నమోదు చేయండి.",
  errInvalidPhone: "కొనసాగే ముందు దయచేసి సరైన 10 అంకెల ఫోన్ నంబర్‌ను నమోదు చేయండి.",
  privacyRequiredLocalDesc:
    "మీ పేరు మరియు ఫోన్ నంబర్ మీ బ్రౌజర్‌లోనే ఫిర్యాదులో చేర్చబడతాయి — AI కి పంపబడవు.",
  step1Part1Title: "మీ సమస్యను మాట్లాడి లేదా టైప్ చేసి చెప్పండి",
  pincodeLabel: "పిన్‌కోడ్ / Pincode (ఐచ్ఛికం)",
  pincodePlaceholder: "ఉదా: 500001",
  referenceNumberLabel: "బిల్లు / కన్స్యూమర్ / PNR / దరఖాస్తు నంబర్ (ఉంటే)",
  referenceNumberPlaceholder: "ఐచ్ఛికం — పోర్టల్‌లో త్వరగా నమోదు చేయడానికి",
  portalLanguageNoticeTitle: "పోర్టల్ భాష సమాచారం",
  portalLangTamilAndEnglish: "ఈ పోర్టల్‌లో తమిళం మరియు ఇంగ్లీష్ భాషా ఎంపిక ఉంది",
  portalLangHindiAndEnglish: "ఈ పోర్టల్ ఇంగ్లీష్ / హిందీలో ఉంటుంది — క్రింది తెలుగు గైడ్‌తో సులభంగా సమర్పించవచ్చు",
  portalLangMultiIndian: "ఈ పోర్టల్‌లో పలు భారతీయ భాషల ఎంపిక అందుబాటులో ఉంది",
  portalLangEnglishOnly: "ఈ ప్రభుత్వ పోర్టల్ ఇంగ్లీష్‌లో ఉంటుంది — క్రింది 1-ట్యాప్ కాపీ ఫీల్డ్స్ ఉపయోగించండి",
  portalFormSheetTitle: "పోర్టల్ ఫారమ్‌లో పేస్ట్ చేయడానికి సిద్ధమైన వివరాలు",
  portalFormSheetSubtitle:
    "ప్రభుత్వ పోర్టల్‌లు ఇంగ్లీష్ బాక్సుల్లో వివరాలు అడుగుతాయి. ప్రతి ఫీల్డ్ పక్కన ఉన్న 'కాపీ' నొక్కి పోర్టల్‌లో పేస్ట్ చేయండి.",
  copyFieldBtn: "కాపీ",
  copiedFieldBtn: "కాపీ అయింది",
  buttonGuideTitle: "ఇంగ్లీష్ పోర్టల్ బటన్ల తెలుగు అర్థం",
  buttonGuideSubtitle: "ప్రభుత్వ వెబ్‌సైట్‌లో కనిపించే ఇంగ్లీష్ బటన్లు మరియు శీర్షికల సులభ అర్థం:",
  otpSubmissionNote:
    "అసలు ప్రభుత్వ ట్రాకింగ్ నంబర్ పొందడానికి మీ మొబైల్ OTP మరియు CAPTCHA ధృవీకరణ అవసరం. సులభంగా సమర్పించడానికి MakkalVoice అన్ని వివరాలు సిద్ధం చేసింది.",
  chatYouLabel: "మీరు",
};

const KN: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "ಮುಂದಿನ ಹಂತಗಳು · ಸಲ್ಲಿಸಲು ಸಿದ್ಧ",
  nextStepsHeading: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ದೂರು ಸಲ್ಲಿಸುವುದು ಹೇಗೆ",
  nextStepsSubheading:
    "ಕೆಳಗಿನ ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ ಮತ್ತು ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಅನುಸರಿಸಿ ನೇರವಾಗಿ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಸಲ್ಲಿಸಿ.",
  openStepGuideBtn: "ಹಂತ-ಹಂತದ ಸಲ್ಲಿಕೆ ಮಾರ್ಗದರ್ಶಿ ತೆರೆಯಿರಿ",
  modalTitle: "ಹಂತ-ಹಂತದ ದೂರು ಸಲ್ಲಿಕೆ ಮಾರ್ಗದರ್ಶಿ",
  modalCloseLabel: "ಮಾರ್ಗದರ್ಶಿ ಮುಚ್ಚಿ",
  modalStepPrefix: "ಹಂತ",
  modalPrevBtn: "ಹಿಂದಿನದು",
  modalNextBtn: "ಮುಂದಿನ ಹಂತ",
  modalDoneBtn: "ಪೂರ್ಣಗೊಳಿಸಿ",
  modalStep1Title: "ಬೆಂಬಲ ದಾಖಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ",
  modalStep1Desc: "ಫೋಟೋಗಳು, ಬಿಲ್‌ಗಳು ಅಥವಾ ಗುರುತಿನ ಚೀಟಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಿ ಟಿಕ್ ಮಾಡಿ.",
  modalStep2Title: "ದೂರು ಕರಡನ್ನು ನಕಲಿಸಿ ಅಥವಾ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
  modalStep2Desc: "ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ಪೇಸ್ಟ್ ಮಾಡಲು ವಿಷಯ ಮತ್ತು ಪತ್ರವನ್ನು ಕಾಪಿ ಮಾಡಿ.",
  modalStep3Title: "ಪರಿಶೀಲಿಸಿದ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ",
  modalStep3Desc: "ಲಾಗಿನ್ ಮಾಡಿ, ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ, ನಿಮ್ಮ ದೂರು ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
  modalStep4Title: "ಸಲ್ಲಿಸಿ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆಯನ್ನು ಉಳಿಸಿ",
  modalStep4Desc: "ಸಲ್ಲಿಸಿದ ನಂತರ ಬರುವ ಅಧಿಕೃತ ದೂರು ಸಂಖ್ಯೆ ಮತ್ತು SMS ಅನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಉಳಿಸಿ.",
  modalCopyHint: "ದೂರು ಕರಡು ಕಾಪಿ ಮಾಡಲು ಸಿದ್ಧವಾಗಿದೆ",
  modalPortalLaunchHint: "ಹೊಸ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ತೆರೆಯುತ್ತದೆ ಆದ್ದರಿಂದ ಈ ಮಾರ್ಗದರ್ಶಿ ಇಲ್ಲೇ ಇರುತ್ತದೆ.",
  modalTrackingReminder:
    "ಹೆಚ್ಚಿನ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗಳು 7–15 ದಿನಗಳಲ್ಲಿ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತವೆ. ನಿಮ್ಮ ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿಡಿ.",
  readStepAloud: "ಈ ಹಂತವನ್ನು ಕೇಳಿ",
  stopStepAudio: "ಆಡಿಯೊ ನಿಲ್ಲಿಸಿ",
  documentsTitle: "ಲಗತ್ತಿಸಬೇಕಾದ ದಾಖಲೆಗಳು ಮತ್ತು ಪುರಾವೆಗಳು",
  documentsSubtitle:
    "ಸಿದ್ಧವಿರುವ ದಾಖಲೆಗಳಿಗೆ ಟಿಕ್ ಮಾಡಿ. ಹೆಚ್ಚಿನ ಪೋರ್ಟಲ್‌ಗಳು 2 MB ಒಳಗಿನ JPG/PNG ಅಥವಾ PDF ಸ್ವೀಕರಿಸುತ್ತವೆ.",
  docRequiredTag: "ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
  docOptionalTag: "ಲಭ್ಯವಿದ್ದರೆ",
  docFormatNote: "ಸಲಹೆ: ಸ್ಪಷ್ಟವಾದ ಫೋಟೋಗಳನ್ನು ತೆಗೆಯಿರಿ ಅಥವಾ 2 MB ಒಳಗೆ PDF ಆಗಿ ಉಳಿಸಿ.",
  docsReadyLabel: "ಸಿದ್ಧವಾಗಿದೆ",
  chatOpenBtn: "ಸಲ್ಲಿಕೆ ಸಹಾಯ",
  chatTitle: "ಪೋರ್ಟಲ್ ಮತ್ತು ಸಲ್ಲಿಕೆ ಸಹಾಯಕ",
  chatSubtitle: "ದೂರು ಸಲ್ಲಿಕೆ, ದಾಖಲೆಗಳು ಅಥವಾ ಟ್ರ್ಯಾಕಿಂಗ್ ID ಬಗ್ಗೆ ಕೇಳಿ",
  chatRoleLabel: "ದೂರು ಮಾರ್ಗದರ್ಶಿ",
  chatWelcome:
    "ನಮಸ್ಕಾರ! ನಾನು MakkalVoice ಸಲ್ಲಿಕೆ ಮಾರ್ಗದರ್ಶಿ. ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ದೂರು ಸಲ್ಲಿಸುವುದು ಹೇಗೆ ಮತ್ತು ಯಾವ ದಾಖಲೆಗಳನ್ನು ಲಗತ್ತಿಸಬೇಕು ಎಂದು ಕೇಳಿ.",
  chatContextActive: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಪೋರ್ಟಲ್ ಮತ್ತು ದೂರಿನ ವಿವರಗಳನ್ನು ಬಳಸುತ್ತಿದೆ",
  chatPlaceholder: "ಸಲ್ಲಿಕೆ ಹಂತಗಳು ಅಥವಾ ದಾಖಲೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
  chatSendBtn: "ಕಳುಹಿಸಿ",
  chatSending: "ಉತ್ತರಿಸುತ್ತಿದೆ...",
  chatClearBtn: "ಹೊಸ ಚಾಟ್",
  chatSpeakBtn: "ಮಾತನಾಡಿ",
  chatStopListening: "ನಿಲ್ಲಿಸಿ",
  chatListenReply: "ಕೇಳಿ",
  chatStopReply: "ನಿಲ್ಲಿಸಿ",
  chatSuggestionsLabel: "ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು",
  chatSuggestion1: "ನಾನು ಯಾವ ದಾಖಲೆಗಳನ್ನು ಲಗತ್ತಿಸಬೇಕು?",
  chatSuggestion2: "ದೂರು ಸಲ್ಲಿಸಿ ಟ್ರ್ಯಾಕಿಂಗ್ ID ಪಡೆಯುವುದು ಹೇಗೆ?",
  chatSuggestion3: "ಪ್ರತಿಕ್ರಿಯೆ ಬರದಿದ್ದರೆ ಮುಂದೇನು ಮಾಡಬೇಕು?",
  chatEmptyHint: "ದೂರು ಸಲ್ಲಿಕೆಯ ಸಹಾಯಕ್ಕಾಗಿ ತ್ವರಿತ ಪ್ರಶ್ನೆಯನ್ನು ಆರಿಸಿ ಅಥವಾ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ.",
  chatAskInSectionBtn: "AI ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಕೇಳಿ",
  citizenDetailsTitle: "ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆ",
  citizenDetailsNote:
    "ಅಧಿಕೃತ ದೂರು ಪತ್ರಕ್ಕೆ ಅಗತ್ಯವಿದೆ. ನಿಮ್ಮ ಸಾಧನದಲ್ಲೇ ಸೇರಿಸಲಾಗುತ್ತದೆ — AI ಗೆ ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ.",
  requiredNameLabel: "ಪೂರ್ಣ ಹೆಸರು",
  requiredNamePlaceholder: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
  requiredPhoneLabel: "ಫೋನ್ ಸಂಖ್ಯೆ",
  requiredPhonePlaceholder: "ನಿಮ್ಮ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
  errMissingName: "ಮುಂದುವರಿಯುವ ಮೊದಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",
  errInvalidPhone: "ಮುಂದುವರಿಯುವ ಮೊದಲು ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10 ಅಂಕಿಯ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
  privacyRequiredLocalDesc:
    "ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಪತ್ರದಲ್ಲಿ ಸೇರಿಸಲಾಗುತ್ತದೆ — AI ಗೆ ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ.",
  step1Part1Title: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ",
  pincodeLabel: "ಪಿನ್‌ಕೋಡ್ / Pincode (ಐಚ್ಛಿಕ)",
  pincodePlaceholder: "ಉದಾ: 560001",
  referenceNumberLabel: "ಬಿಲ್ / ಗ್ರಾಹಕ / PNR / ಅರ್ಜಿ ಸಂಖ್ಯೆ (ಇದ್ದರೆ)",
  referenceNumberPlaceholder: "ಐಚ್ಛಿಕ — ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಸುಲಭವಾಗಿ ಭರ್ತಿ ಮಾಡಲು",
  portalLanguageNoticeTitle: "ಪೋರ್ಟಲ್ ಭಾಷಾ ಮಾಹಿತಿ",
  portalLangTamilAndEnglish: "ಈ ಪೋರ್ಟಲ್ ತಮಿಳು ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಭಾಷಾ ಆಯ್ಕೆಯನ್ನು ಹೊಂದಿದೆ",
  portalLangHindiAndEnglish: "ಈ ಪೋರ್ಟಲ್ ಇಂಗ್ಲಿಷ್ / ಹಿಂದಿಯಲ್ಲಿದೆ — ಕೆಳಗಿನ ಕನ್ನಡ ಮಾರ್ಗದರ್ಶಿಯೊಂದಿಗೆ ಸುಲಭವಾಗಿ ಸಲ್ಲಿಸಿ",
  portalLangMultiIndian: "ಈ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಹಲವು ಭಾರತೀಯ ಭಾಷೆಗಳ ಆಯ್ಕೆ ಲಭ್ಯವಿದೆ",
  portalLangEnglishOnly: "ಈ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿದೆ — ಕೆಳಗಿನ 1-ಟ್ಯಾಪ್ ಕಾಪಿ ವಿವರಗಳನ್ನು ಬಳಸಿ",
  portalFormSheetTitle: "ಪೋರ್ಟಲ್ ಫಾರ್ಮ್‌ಗೆ ಸಿದ್ಧಪಡಿಸಿದ ವಿವರಗಳು",
  portalFormSheetSubtitle:
    "ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗಳು ಇಂಗ್ಲಿಷ್ ಬಾಕ್ಸ್‌ಗಳಲ್ಲಿ ವಿವರ ಕೇಳುತ್ತವೆ. ಪ್ರತಿ ಸಾಲಿನ ಪಕ್ಕ 'ಕಾಪಿ' ಒತ್ತಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ.",
  copyFieldBtn: "ಕಾಪಿ",
  copiedFieldBtn: "ಕಾಪಿ ಆಗಿದೆ",
  buttonGuideTitle: "ಇಂಗ್ಲಿಷ್ ಪೋರ್ಟಲ್ ಬಟನ್‌ಗಳ ಕನ್ನಡ ಅರ್ಥ",
  buttonGuideSubtitle: "ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಕಾಣುವ ಇಂಗ್ಲಿಷ್ ಬಟನ್ ಮತ್ತು ಶೀರ್ಷಿಕೆಗಳ ಸರಳ ಅರ್ಥ:",
  otpSubmissionNote:
    "ಅಧಿಕೃತ ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆ ಪಡೆಯಲು ನಿಮ್ಮ ಮೊಬೈಲ್ OTP ಮತ್ತು CAPTCHA ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ. ಸುಲಭ ಸಲ್ಲಿಕೆಗಾಗಿ MakkalVoice ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿದೆ.",
  chatYouLabel: "ನೀವು",
};

const ML: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "അടുത്ത ഘട്ടങ്ങൾ · സമർപ്പിക്കാൻ തയ്യാറാണ്",
  nextStepsHeading: "ഔദ്യോഗിക പോർട്ടലിൽ പരാതി എങ്ങനെ സമർപ്പിക്കാം",
  nextStepsSubheading:
    "താഴെ പറയുന്ന രേഖകൾ തയ്യാറാക്കി ഘട്ടം ഘട്ടമായുള്ള നിർദ്ദേശങ്ങൾ പിന്തുടർന്ന് ഔദ്യോഗിക പോർട്ടലിൽ സമർപ്പിക്കുക.",
  openStepGuideBtn: "ഘട്ടം ഘട്ടമായുള്ള സമർപ്പണ ഗൈഡ് തുറക്കുക",
  modalTitle: "ഘട്ടം ഘട്ടമായുള്ള സമർപ്പണ ഗൈഡ്",
  modalCloseLabel: "ഗൈഡ് അടയ്ക്കുക",
  modalStepPrefix: "ഘട്ടം",
  modalPrevBtn: "മുൻപത്തേത്",
  modalNextBtn: "അടുത്ത ഘട്ടം",
  modalDoneBtn: "പൂർത്തിയാക്കുക",
  modalStep1Title: "ആവശ്യമായ രേഖകൾ തയ്യാറാക്കുക",
  modalStep1Desc: "ഫോട്ടോകൾ, ബില്ലുകൾ അല്ലെങ്കിൽ തിരിച്ചറിയൽ രേഖ തയ്യാറാക്കി ടിക്ക് ചെയ്യുക.",
  modalStep2Title: "പരാതിയുടെ കരട് പകർത്തുക",
  modalStep2Desc: "പോർട്ടലിൽ ഉടൻ പേസ്റ്റ് ചെയ്യാൻ വിഷയവും കത്തും കോപ്പി ചെയ്യുക.",
  modalStep3Title: "ഔദ്യോഗിക പോർട്ടൽ തുറക്കുക",
  modalStep3Desc: "ലോഗിൻ ചെയ്ത് വകുപ്പ് തിരഞ്ഞെടുത്ത് നിങ്ങളുടെ പരാതിയും രേഖകളും അപ്‌ലോഡ് ചെയ്യുക.",
  modalStep4Title: "സമർപ്പിച്ച് ട്രാക്കിംഗ് നമ്പർ സൂക്ഷിക്കുക",
  modalStep4Desc: "സമർപ്പിച്ച ശേഷം ലഭിക്കുന്ന ഔദ്യോഗിക പരാതി നമ്പറും SMS-ഉം സുരക്ഷിതമായി സൂക്ഷിക്കുക.",
  modalCopyHint: "പരാതി കരട് കോപ്പി ചെയ്യാൻ തയ്യാറാണ്",
  modalPortalLaunchHint: "പുതിയ ടാബിൽ തുറക്കും, അതിനാൽ ഈ ഗൈഡ് ഇവിടെത്തന്നെ ഉണ്ടാകും.",
  modalTrackingReminder:
    "മിക്ക സർക്കാർ പോർട്ടലുകളും 7–15 ദിവസത്തിനുള്ളിൽ മറുപടി നൽകും. നിങ്ങളുടെ ട്രാക്കിംഗ് നമ്പർ സൂക്ഷിക്കുക.",
  readStepAloud: "ഈ ഘട്ടം കേൾക്കുക",
  stopStepAudio: "ഓഡിയോ നിർത്തുക",
  documentsTitle: "അറ്റാച്ച് ചെയ്യേണ്ട രേഖകളും തെളിവുകളും",
  documentsSubtitle:
    "തയ്യാറാക്കിയ രേഖകളിൽ ടിക്ക് ചെയ്യുക. മിക്ക പോർട്ടലുകളും 2 MB-ക്ക് താഴെയുള്ള JPG/PNG അല്ലെങ്കിൽ PDF സ്വീകരിക്കും.",
  docRequiredTag: "ശുപാർശ ചെയ്യുന്നത്",
  docOptionalTag: "ലഭ്യമാണെങ്കിൽ",
  docFormatNote: "സൂചന: വ്യക്തമായ ഫോട്ടോകൾ എടുക്കുക അല്ലെങ്കിൽ 2 MB-ക്ക് താഴെയുള്ള PDF ആയി സേവ് ചെയ്യുക.",
  docsReadyLabel: "തയ്യാറാണ്",
  chatOpenBtn: "സമർപ്പണ സഹായം",
  chatTitle: "പോർട്ടൽ & സമർപ്പണ സഹായി",
  chatSubtitle: "പരാതി സമർപ്പണം, രേഖകൾ, ട്രാക്കിംഗ് നമ്പർ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക",
  chatRoleLabel: "പരാതി ഗൈഡ്",
  chatWelcome:
    "നമസ്കാരം! ഞാൻ MakkalVoice സമർപ്പണ ഗൈഡ് ആണ്. ഔദ്യോഗിക പോർട്ടലിൽ പരാതി സമർപ്പിക്കുന്നതിനെക്കുറിച്ചും രേഖകളെക്കുറിച്ചും എന്തും ചോദിക്കാം.",
  chatContextActive: "നിങ്ങളുടെ നിലവിലെ പോർട്ടലും പരാതി വിവരങ്ങളും ഉപയോഗിക്കുന്നു",
  chatPlaceholder: "സമർപ്പണ ഘട്ടങ്ങളെക്കുറിച്ചോ രേഖകളെക്കുറിച്ചോ ചോദിക്കുക...",
  chatSendBtn: "അയയ്ക്കുക",
  chatSending: "മറുപടി തയ്യാറാക്കുന്നു...",
  chatClearBtn: "പുതിയ ചാറ്റ്",
  chatSpeakBtn: "സംസാരിക്കുക",
  chatStopListening: "നിർത്തുക",
  chatListenReply: "കേൾക്കുക",
  chatStopReply: "നിർത്തുക",
  chatSuggestionsLabel: "വേഗത്തിലുള്ള ചോദ്യങ്ങൾ",
  chatSuggestion1: "ഏതൊക്കെ രേഖകൾ അറ്റാച്ച് ചെയ്യണം?",
  chatSuggestion2: "പരാതി നൽകി ട്രാക്കിംഗ് ID എങ്ങനെ ലഭിക്കും?",
  chatSuggestion3: "മറുപടി ലഭിച്ചില്ലെങ്കിൽ എന്തു ചെയ്യണം?",
  chatEmptyHint: "പരാതി സമർപ്പണ സഹായത്തിന് വേഗത്തിലുള്ള ചോദ്യം തിരഞ്ഞെടുക്കുക അല്ലെങ്കിൽ സ്വയം ചോദിക്കുക.",
  chatAskInSectionBtn: "AI ഗൈഡിനോട് ചോദിക്കുക",
  citizenDetailsTitle: "നിങ്ങളുടെ പേരും ഫോൺ നമ്പറും",
  citizenDetailsNote:
    "ഔദ്യോഗിക പരാതിക്കത്തിൽ ഒപ്പിടാൻ ആവശ്യമാണ്. നിങ്ങളുടെ ഫോണിൽ തന്നെ ചേർക്കും — AI-ലേക്ക് അയക്കില്ല.",
  requiredNameLabel: "പൂർണ്ണ നാമം",
  requiredNamePlaceholder: "നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകുക",
  requiredPhoneLabel: "ഫോൺ നമ്പർ",
  requiredPhonePlaceholder: "നിങ്ങളുടെ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക",
  errMissingName: "തുടരുന്നതിന് മുമ്പ് ദയവായി നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകുക.",
  errInvalidPhone: "തുടരുന്നതിന് മുമ്പ് സാധുവായ 10 അക്ക ഫോൺ നമ്പർ നൽകുക.",
  privacyRequiredLocalDesc:
    "നിങ്ങളുടെ പേരും ഫോൺ നമ്പറും നിങ്ങളുടെ ബ്രൗസറിൽ തന്നെ കത്തിൽ ചേർക്കും — AI-ലേക്ക് അയക്കില്ല.",
  step1Part1Title: "നിങ്ങളുടെ പ്രശ്നം സംസാരിക്കുകയോ ടൈപ്പ് ചെയ്യുകയോ ചെയ്യുക",
  pincodeLabel: "പിൻകോഡ് / Pincode (ഐച്ഛികം)",
  pincodePlaceholder: "ഉദാ: 682001",
  referenceNumberLabel: "ബിൽ / കൺസ്യൂമർ / PNR / അപേക്ഷ നമ്പർ (ഉണ്ടെങ്കിൽ)",
  referenceNumberPlaceholder: "ഐച്ഛികം — പോർട്ടലിൽ വേഗം ചേർക്കാൻ സഹായകം",
  portalLanguageNoticeTitle: "പോർട്ടൽ ഭാഷാ വിവരം",
  portalLangTamilAndEnglish: "ഈ പോർട്ടലിൽ തമിഴ്, ഇംഗ്ലീഷ് ഭാഷാ തിരഞ്ഞെടുപ്പ് ലഭ്യമാണ്",
  portalLangHindiAndEnglish: "ഈ പോർട്ടൽ ഇംഗ്ലീഷ് / ഹിന്ദിയിലാണ് — താഴെയുള്ള മലയാളം ഗൈഡ് ഉപയോഗിച്ച് എളുപ്പം സമർപ്പിക്കാം",
  portalLangMultiIndian: "ഈ പോർട്ടലിൽ നിരവധി ഇന്ത്യൻ ഭാഷകൾ ലഭ്യമാണ്",
  portalLangEnglishOnly: "ഈ സർക്കാർ പോർട്ടൽ ഇംഗ്ലീഷിലാണ് — താഴെയുള്ള 1-ടാപ്പ് കോപ്പി വിവരങ്ങൾ ഉപയോഗിക്കുക",
  portalFormSheetTitle: "പോർട്ടൽ ഫോമിൽ പേസ്റ്റ് ചെയ്യാനുള്ള വിവരങ്ങൾ",
  portalFormSheetSubtitle:
    "സർക്കാർ പോർട്ടലുകൾ ഇംഗ്ലീഷ് ബോക്സുകളിൽ വിവരങ്ങൾ ചോദിക്കും. ഓരോ വരിയിലും 'കോപ്പി' അമർത്തി പോർട്ടലിൽ പേസ്റ്റ് ചെയ്യുക.",
  copyFieldBtn: "കോപ്പി",
  copiedFieldBtn: "കോപ്പി ചെയ്തു",
  buttonGuideTitle: "ഇംഗ്ലീഷ് പോർട്ടൽ ബട്ടണുകളുടെ മലയാളം അർത്ഥം",
  buttonGuideSubtitle: "സർക്കാർ വെബ്സൈറ്റിൽ കാണുന്ന ഇംഗ്ലീഷ് ബട്ടണുകളുടെയും തലക്കെട്ടുകളുടെയും ലളിതമായ അർത്ഥം:",
  otpSubmissionNote:
    "ഔദ്യോഗിക ട്രാക്കിംഗ് നമ്പർ ലഭിക്കാൻ നിങ്ങളുടെ മൊബൈൽ OTP-യും CAPTCHA-യും ആവശ്യമാണ്. എളുപ്പത്തിൽ സമർപ്പിക്കാൻ MakkalVoice എല്ലാ വിവരങ്ങളും തയ്യാറാക്കിയിട്ടുണ്ട്.",
  chatYouLabel: "നിങ്ങൾ",
};

const BN: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "পরবর্তী ধাপ · জমা দেওয়ার জন্য প্রস্তুত",
  nextStepsHeading: "অফিশিয়াল পোর্টালে আপনার অভিযোগ কীভাবে জমা দেবেন",
  nextStepsSubheading:
    "নিচের নথিপত্রগুলো গুছিয়ে নিন এবং ধাপে ধাপে নির্দেশিকা অনুসরণ করে সরকারি পোর্টালে জমা দিন।",
  openStepGuideBtn: "ধাপে ধাপে জমা দেওয়ার গাইড খুলুন",
  modalTitle: "ধাপে ধাপে অভিযোগ জমা দেওয়ার গাইড",
  modalCloseLabel: "গাইড বন্ধ করুন",
  modalStepPrefix: "ধাপ",
  modalPrevBtn: "আগের ধাপ",
  modalNextBtn: "পরবর্তী ধাপ",
  modalDoneBtn: "সম্পন্ন",
  modalStep1Title: "প্রয়োজনীয় নথিপত্র প্রস্তুত করুন",
  modalStep1Desc: "ছবি, বিল বা পরিচয়পত্র প্রস্তুত করে টিক দিন যাতে আপলোড করা সহজ হয়।",
  modalStep2Title: "অভিযোগের খসড়া কপি বা ডাউনলোড করুন",
  modalStep2Desc: "পোর্টালে সরাসরি পেস্ট করার জন্য বিষয় ও চিঠিটি কপি করুন।",
  modalStep3Title: "যাচাইকৃত অফিশিয়াল পোর্টাল খুলুন",
  modalStep3Desc: "লগইন করুন, সংশ্লিষ্ট দপ্তর বাছুন, খসড়া পেস্ট করুন এবং নথি আপলোড করুন।",
  modalStep4Title: "জমা দিন এবং ট্র্যাকিং নম্বর সংরক্ষণ করুন",
  modalStep4Desc: "জমা দেওয়ার পর প্রাপ্ত সরকারি অভিযোগ নম্বর ও SMS সংরক্ষণ করে রাখুন।",
  modalCopyHint: "অভিযোগের খসড়া কপি করার জন্য প্রস্তুত",
  modalPortalLaunchHint: "নতুন ট্যাবে খুলবে যাতে এই গাইডটি আপনার সামনেই থাকে।",
  modalTrackingReminder:
    "অধিকাংশ সরকারি পোর্টাল ৭–১৫ দিনের মধ্যে উত্তর দেয়। আপনার ট্র্যাকিং নম্বর যত্ন করে রাখুন।",
  readStepAloud: "এই ধাপটি শুনুন",
  stopStepAudio: "অডিও বন্ধ করুন",
  documentsTitle: "সংযুক্ত করার জন্য প্রয়োজনীয় নথি ও প্রমাণ",
  documentsSubtitle:
    "প্রস্তুত নথিতে টিক দিন। বেশিরভাগ পোর্টাল ২ MB-এর কম JPG/PNG বা PDF ফাইল গ্রহণ করে।",
  docRequiredTag: "প্রস্তাবিত",
  docOptionalTag: "যদি থাকে",
  docFormatNote: "পরামর্শ: স্পষ্ট ছবি তুলুন অথবা ২ MB-এর নিচে PDF হিসেবে সংরক্ষণ করুন।",
  docsReadyLabel: "প্রস্তুত",
  chatOpenBtn: "জমা দেওয়ার সহায়তা",
  chatTitle: "পোর্টাল ও জমা দেওয়ার সহায়ক",
  chatSubtitle: "অভিযোগ জমা, নথিপত্র বা ট্র্যাকিং নম্বর সম্পর্কে জিজ্ঞাসা করুন",
  chatRoleLabel: "অভিযোগ গাইড",
  chatWelcome:
    "নমস্কার! আমি MakkalVoice জমা দেওয়ার গাইড। সরকারি পোর্টালে অভিযোগ জমা দেওয়া বা প্রয়োজনীয় নথিপত্র সম্পর্কে যেকোনো প্রশ্ন করুন।",
  chatContextActive: "আপনার বর্তমান পোর্টাল ও অভিযোগের তথ্য ব্যবহার করছে",
  chatPlaceholder: "জমা দেওয়ার ধাপ বা নথিপত্র সম্পর্কে জিজ্ঞাসা করুন...",
  chatSendBtn: "পাঠান",
  chatSending: "উত্তর তৈরি হচ্ছে...",
  chatClearBtn: "নতুন চ্যাট",
  chatSpeakBtn: "বলুন",
  chatStopListening: "থামান",
  chatListenReply: "শুনুন",
  chatStopReply: "থামান",
  chatSuggestionsLabel: "দ্রুত প্রশ্ন",
  chatSuggestion1: "কোন নথিপত্রগুলো সংযুক্ত করা উচিত?",
  chatSuggestion2: "অভিযোগ জমা দিয়ে ট্র্যাকিং নম্বর কীভাবে পাব?",
  chatSuggestion3: "জমা দেওয়ার পর উত্তর না পেলে কী করব?",
  chatEmptyHint: "সহায়তার জন্য একটি দ্রুত প্রশ্ন বাছুন অথবা নিজের প্রশ্ন লিখুন।",
  chatAskInSectionBtn: "AI গাইডকে জিজ্ঞাসা করুন",
  citizenDetailsTitle: "আপনার নাম ও ফোন নম্বর",
  citizenDetailsNote:
    "আনুষ্ঠানিক অভিযোগপত্রে স্বাক্ষরের জন্য আবশ্যক। আপনার ডিভাইসেই যুক্ত হয় — AI-তে পাঠানো হয় না।",
  requiredNameLabel: "পূর্ণ নাম",
  requiredNamePlaceholder: "আপনার পূর্ণ নাম লিখুন",
  requiredPhoneLabel: "ফোন নম্বর",
  requiredPhonePlaceholder: "আপনার ১০ সংখ্যার মোবাইল নম্বর লিখুন",
  errMissingName: "এগিয়ে যাওয়ার আগে অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।",
  errInvalidPhone: "এগিয়ে যাওয়ার আগে অনুগ্রহ করে একটি সঠিক ১০ সংখ্যার ফোন নম্বর লিখুন।",
  privacyRequiredLocalDesc:
    "আপনার নাম ও ফোন নম্বর আপনার ব্রাউজারেই চিঠিতে যুক্ত হয় এবং কখনো AI-তে পাঠানো হয় না।",
  step1Part1Title: "আপনার সমস্যা বলুন বা টাইপ করুন",
  pincodeLabel: "পিনকোড / Pincode (ঐচ্ছিক)",
  pincodePlaceholder: "যেমন: 700001",
  referenceNumberLabel: "বিল / কনজিউমার / PNR / আবেদন নম্বর (যদি থাকে)",
  referenceNumberPlaceholder: "ঐচ্ছিক — পোর্টালে দ্রুত তথ্য পূরণ করতে",
  portalLanguageNoticeTitle: "পোর্টালের ভাষা তথ্য",
  portalLangTamilAndEnglish: "এই পোর্টালে তামিল ও ইংরেজি ভাষা পরিবর্তনের বিকল্প আছে",
  portalLangHindiAndEnglish: "এই পোর্টাল ইংরেজি / হিন্দিতে চলে — নিচের বাংলা গাইডের সাহায্যে সহজেই জমা দিন",
  portalLangMultiIndian: "এই পোর্টালে একাধিক ভারতীয় ভাষা ব্যবহারের সুবিধা আছে",
  portalLangEnglishOnly: "এই সরকারি পোর্টাল ইংরেজিতে — নিচের ১-ট্যাপ কপি ফিল্ড ও বাংলা গাইড ব্যবহার করুন",
  portalFormSheetTitle: "পোর্টালে পেস্ট করার জন্য প্রস্তুত তথ্য",
  portalFormSheetSubtitle:
    "সরকারি পোর্টাল ইংরেজি বক্সে তথ্য চায়। প্রতিটি তথ্যের পাশে 'কপি' টিপে পোর্টালে পেস্ট করুন।",
  copyFieldBtn: "কপি",
  copiedFieldBtn: "কপি হয়েছে",
  buttonGuideTitle: "ইংরেজি পোর্টাল বাটনের বাংলা অর্থ",
  buttonGuideSubtitle: "সরকারি ওয়েবসাইটে থাকা ইংরেজি বাটন ও শিরোনামের সহজ বাংলা অর্থ:",
  otpSubmissionNote:
    "আসল সরকারি ট্র্যাকিং নম্বর পেতে আপনার মোবাইল OTP ও CAPTCHA যাচাই জরুরি। সহজ জমার জন্য MakkalVoice সব তথ্য প্রস্তুত রেখেছে।",
  chatYouLabel: "আপনি",
};

const MR: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "पुढील पायऱ्या · सादर करण्यासाठी तयार",
  nextStepsHeading: "अधिकृत पोर्टलवर तुमची तक्रार कशी सादर करावी",
  nextStepsSubheading:
    "खालील कागदपत्रे तयार ठेवा आणि टप्प्याटप्प्याने मार्गदर्शकाचे पालन करून अधिकृत पोर्टलवर तक्रार नोंदवा.",
  openStepGuideBtn: "टप्प्याटप्प्याने सादरीकरण मार्गदर्शक उघडा",
  modalTitle: "टप्प्याटप्प्याने तक्रार सादरीकरण मार्गदर्शक",
  modalCloseLabel: "मार्गदर्शक बंद करा",
  modalStepPrefix: "टप्पा",
  modalPrevBtn: "मागील",
  modalNextBtn: "पुढील टप्पा",
  modalDoneBtn: "पूर्ण करा",
  modalStep1Title: "आवश्यक कागदपत्रे गोळा करा",
  modalStep1Desc: "फोटो, बिले किंवा ओळखपत्र तयार ठेवा आणि टिक करा म्हणजे अपलोड करणे सोपे होईल.",
  modalStep2Title: "तक्रारीचा मसुदा कॉपी किंवा डाउनलोड करा",
  modalStep2Desc: "पोर्टलवर थेट पेस्ट करण्यासाठी विषय आणि तक्रार पत्र कॉपी करा.",
  modalStep3Title: "सत्यापित अधिकृत पोर्टल उघडा",
  modalStep3Desc: "लॉगिन करा, योग्य विभाग निवडा, तुमची तक्रार पेस्ट करा आणि कागदपत्रे जोडा.",
  modalStep4Title: "सादर करा आणि ट्रॅकिंग नंबर जतन करा",
  modalStep4Desc: "तक्रार नोंदवल्यानंतर मिळालेला अधिकृत तक्रार क्रमांक आणि SMS जतन करा.",
  modalCopyHint: "तक्रारीचा मसुदा कॉपी करण्यासाठी तयार आहे",
  modalPortalLaunchHint: "नवीन टॅबमध्ये उघडेल त्यामुळे हे मार्गदर्शक इथेच राहील.",
  modalTrackingReminder:
    "बहुतेक सरकारी पोर्टल ७–१५ दिवसांत उत्तर देतात. तुमचा ट्रॅकिंग क्रमांक सुरक्षित ठेवा.",
  readStepAloud: "हा टप्पा ऐका",
  stopStepAudio: "ऑडिओ थांबवा",
  documentsTitle: "जोडण्यासाठी आवश्यक कागदपत्रे व पुरावे",
  documentsSubtitle:
    "तयार असलेल्या कागदपत्रांवर टिक करा. बहुतेक पोर्टल २ MB पेक्षा कमी JPG/PNG किंवा PDF स्वीकारतात.",
  docRequiredTag: "शिफारस केलेले",
  docOptionalTag: "उपलब्ध असल्यास",
  docFormatNote: "सूचना: स्पष्ट फोटो काढा किंवा २ MB पेक्षा कमी PDF मध्ये जतन करा.",
  docsReadyLabel: "तयार",
  chatOpenBtn: "सादरीकरण मदत",
  chatTitle: "पोर्टल व सादरीकरण सहाय्यक",
  chatSubtitle: "तक्रार नोंदणी, कागदपत्रे किंवा ट्रॅकिंग नंबरबद्दल विचारा",
  chatRoleLabel: "तक्रार मार्गदर्शक",
  chatWelcome:
    "नमस्कार! मी MakkalVoice सादरीकरण मार्गदर्शक आहे. अधिकृत पोर्टलवर तक्रार कशी नोंदवायची आणि कोणती कागदपत्रे जोडायची याबद्दल मला काहीही विचारा.",
  chatContextActive: "तुमच्या सध्याच्या पोर्टल आणि तक्रारीच्या तपशिलाचा वापर करत आहे",
  chatPlaceholder: "पोर्टल पायऱ्या किंवा कागदपत्रांबद्दल विचारा...",
  chatSendBtn: "पाठवा",
  chatSending: "उत्तर तयार होत आहे...",
  chatClearBtn: "नवीन चॅट",
  chatSpeakBtn: "बोला",
  chatStopListening: "थांबा",
  chatListenReply: "ऐका",
  chatStopReply: "थांबा",
  chatSuggestionsLabel: "जलद प्रश्न",
  chatSuggestion1: "मी कोणती कागदपत्रे जोडावीत?",
  chatSuggestion2: "तक्रार नोंदवून ट्रॅकिंग नंबर कसा मिळेल?",
  chatSuggestion3: "प्रतिसाद न मिळाल्यास पुढे काय करावे?",
  chatEmptyHint: "मदतीसाठी झटपट प्रश्न निवडा किंवा तुमचा प्रश्न येथे विचारा.",
  chatAskInSectionBtn: "AI मार्गदर्शकाला विचारा",
  citizenDetailsTitle: "तुमचे नाव आणि फोन नंबर",
  citizenDetailsNote:
    "औपचारिक तक्रार पत्रासाठी आवश्यक. तुमच्या डिव्हाइसवरच भरले जाते — AI कडे पाठवले जात नाही.",
  requiredNameLabel: "पूर्ण नाव",
  requiredNamePlaceholder: "तुमचे पूर्ण नाव लिहा",
  requiredPhoneLabel: "फोन नंबर",
  requiredPhonePlaceholder: "तुमचा १० अंकी मोबाईल नंबर लिहा",
  errMissingName: "पुढे जाण्यापूर्वी कृपया तुमचे पूर्ण नाव लिहा.",
  errInvalidPhone: "पुढे जाण्यापूर्वी कृपया वैध १० अंकी फोन नंबर लिहा.",
  privacyRequiredLocalDesc:
    "तुमचे नाव आणि फोन नंबर तुमच्या ब्राउझरमध्येच पत्रात जोडले जातात आणि कधीही AI कडे पाठवले जात नाहीत.",
  step1Part1Title: "तुमची समस्या बोलून किंवा टाइप करून सांगा",
  pincodeLabel: "पिनकोड / Pincode (ऐच्छिक)",
  pincodePlaceholder: "उदा. 400001",
  referenceNumberLabel: "बिल / ग्राहक / PNR / अर्ज क्रमांक (असल्यास)",
  referenceNumberPlaceholder: "ऐच्छिक — पोर्टलवर पटकन माहिती भरण्यासाठी",
  portalLanguageNoticeTitle: "पोर्टल भाषा माहिती",
  portalLangTamilAndEnglish: "या पोर्टलवर तमिळ आणि इंग्रजी भाषेचा पर्याय उपलब्ध आहे",
  portalLangHindiAndEnglish: "हे पोर्टल इंग्रजी / हिंदीमध्ये आहे — खालील मराठी मार्गदर्शकाद्वारे सहज नोंदणी करा",
  portalLangMultiIndian: "या पोर्टलवर अनेक भारतीय भाषांचा पर्याय उपलब्ध आहे",
  portalLangEnglishOnly: "हे सरकारी पोर्टल इंग्रजीत आहे — खालील १-टॅप कॉपी फील्ड आणि मराठी गाइड वापरा",
  portalFormSheetTitle: "पोर्टल फॉर्ममध्ये पेस्ट करण्यासाठी तयार माहिती",
  portalFormSheetSubtitle:
    "सरकारी पोर्टल इंग्रजी बॉक्समध्ये माहिती मागतात. प्रत्येक ओळीसमोर 'कॉपी' दाबा आणि पोर्टलमध्ये पेस्ट करा.",
  copyFieldBtn: "कॉपी",
  copiedFieldBtn: "कॉपी झाले",
  buttonGuideTitle: "इंग्रजी पोर्टल बटनांचा मराठी अर्थ",
  buttonGuideSubtitle: "सरकारी वेबसाइटवर दिसणाऱ्या इंग्रजी बटनांचा आणि शीर्षकांचा सोपा अर्थ:",
  otpSubmissionNote:
    "अधिकृत ट्रॅकिंग नंबर मिळण्यासाठी तुमचा मोबाईल OTP आणि CAPTCHA पडताळणी आवश्यक असते. सहज सादरीकरणासाठी MakkalVoice ने सर्व तपशील तयार ठेवले आहेत.",
  chatYouLabel: "तुम्ही",
};

const GU: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "આગળના પગલાં · સબમિટ કરવા તૈયાર",
  nextStepsHeading: "અધિકૃત પોર્ટલ પર તમારી ફરિયાદ કેવી રીતે સબમિટ કરવી",
  nextStepsSubheading:
    "નીચેના દસ્તાવેજો તૈયાર રાખો અને પગલાવાર માર્ગદર્શિકા મુજબ સીધા સરકારી પોર્ટલ પર ફરિયાદ નોંધાવો.",
  openStepGuideBtn: "પગલાવાર સબમિશન ગાઇડ ખોલો",
  modalTitle: "પગલાવાર ફરિયાદ સબમિશન ગાઇડ",
  modalCloseLabel: "ગાઇડ બંધ કરો",
  modalStepPrefix: "પગલું",
  modalPrevBtn: "પાછલું",
  modalNextBtn: "આગળનું પગલું",
  modalDoneBtn: "પૂર્ણ કરો",
  modalStep1Title: "સહાયક દસ્તાવેજો તૈયાર કરો",
  modalStep1Desc: "ફોટા, બિલ અથવા ઓળખપત્ર તૈયાર રાખીને ટિક કરો જેથી અપલોડ કરવું સરળ બને.",
  modalStep2Title: "ફરિયાદનો ડ્રાફ્ટ કૉપિ કરો",
  modalStep2Desc: "પોર્ટલમાં સીધું પેસ્ટ કરવા માટે વિષય અને પત્ર કૉપિ કરો.",
  modalStep3Title: "ચકાસાયેલ અધિકૃત પોર્ટલ ખોલો",
  modalStep3Desc: "લોગિન કરો, યોગ્ય વિભાગ પસંદ કરો, તમારી ફરિયાદ પેસ્ટ કરો અને દસ્તાવેજો જોડો.",
  modalStep4Title: "સબમિટ કરો અને ટ્રેકિંગ નંબર સાચવો",
  modalStep4Desc: "ફરિયાદ નોંધાવ્યા બાદ મળતો અધિકૃત ટ્રેકિંગ નંબર અને SMS સુરક્ષિત રાખો.",
  modalCopyHint: "ફરિયાદનો ડ્રાફ્ટ કૉપિ કરવા માટે તૈયાર છે",
  modalPortalLaunchHint: "નવા ટેબમાં ખુલશે જેથી આ ગાઇડ તમારી સામે જ રહેશે.",
  modalTrackingReminder:
    "મોટાભાગના સરકારી પોર્ટલ ૭–૧૫ દિવસમાં જવાબ આપે છે. તમારો ટ્રેકિંગ નંબર સાચવી રાખો.",
  readStepAloud: "આ પગલું સાંભળો",
  stopStepAudio: "ઑડિયો બંધ કરો",
  documentsTitle: "જોડવા માટે જરૂરી દસ્તાવેજો અને પુરાવા",
  documentsSubtitle:
    "તૈયાર દસ્તાવેજો પર ટિક કરો. મોટાભાગના પોર્ટલ 2 MB થી ઓછી JPG/PNG અથવા PDF ફાઇલો સ્વીકારે છે.",
  docRequiredTag: "ભલામણ કરેલ",
  docOptionalTag: "જો ઉપલબ્ધ હોય",
  docFormatNote: "સૂચના: સ્પષ્ટ ફોટા પાડો અથવા 2 MB થી ઓછી PDF ફાઇલ બનાવો.",
  docsReadyLabel: "તૈયાર",
  chatOpenBtn: "સબમિશન મદદ",
  chatTitle: "પોર્ટલ અને સબમિશન સહાયક",
  chatSubtitle: "ફરિયાદ નોંધણી, દસ્તાવેજો અથવા ટ્રેકિંગ ID વિશે પૂછો",
  chatRoleLabel: "ફરિયાદ ગાઇડ",
  chatWelcome:
    "નમસ્તે! હું MakkalVoice સબમિશન ગાઇડ છું. સરકારી પોર્ટલ પર ફરિયાદ કેવી રીતે નોંધાવવી અને કયા દસ્તાવેજો જોડવા તે વિશે પૂછો.",
  chatContextActive: "તમારા વર્તમાન પોર્ટલ અને ફરિયાદની વિગતોનો ઉપયોગ કરે છે",
  chatPlaceholder: "સબમિશન પગલાં અથવા દસ્તાવેજો વિશે પૂછો...",
  chatSendBtn: "મોકલો",
  chatSending: "જવાબ તૈયાર થઈ રહ્યો છે...",
  chatClearBtn: "નવી ચેટ",
  chatSpeakBtn: "બોલો",
  chatStopListening: "રોકો",
  chatListenReply: "સાંભળો",
  chatStopReply: "રોકો",
  chatSuggestionsLabel: "ઝડપી પ્રશ્નો",
  chatSuggestion1: "મારે કયા દસ્તાવેજો જોડવા જોઈએ?",
  chatSuggestion2: "ફરિયાદ નોંધાવીને ટ્રેકિંગ નંબર કેવી રીતે મેળવવો?",
  chatSuggestion3: "જો જવાબ ન મળે તો આગળ શું કરવું?",
  chatEmptyHint: "મદદ માટે કોઈ ઝડપી પ્રશ્ન પસંદ કરો અથવા તમારો પ્રશ્ન લખો.",
  chatAskInSectionBtn: "AI ગાઇડને પૂછો",
  citizenDetailsTitle: "તમારું નામ અને ફોન નંબર",
  citizenDetailsNote:
    "ઔપચારિક ફરિયાદ પત્ર માટે જરૂરી. તમારા ડિવાઇસ પર જ ભરાય છે — AI ને મોકલવામાં આવતું નથી.",
  requiredNameLabel: "પૂરું નામ",
  requiredNamePlaceholder: "તમારું પૂરું નામ લખો",
  requiredPhoneLabel: "ફોન નંબર",
  requiredPhonePlaceholder: "તમારો 10 અંકનો મોબાઇલ નંબર લખો",
  errMissingName: "આગળ વધતા પહેલા કૃપા કરીને તમારું પૂરું નામ લખો.",
  errInvalidPhone: "આગળ વધતા પહેલા કૃપા કરીને માન્ય 10 અંકનો ફોન નંબર લખો.",
  privacyRequiredLocalDesc:
    "તમારું નામ અને ફોન નંબર તમારા બ્રાઉઝરમાં જ ફરિયાદ પત્રમાં ઉમેરાય છે અને ક્યારેય AI ને મોકલાતા નથી.",
  step1Part1Title: "તમારી સમસ્યા બોલીને અથવા લખીને જણાવો",
  pincodeLabel: "પિનકોડ / Pincode (વૈકલ્પિક)",
  pincodePlaceholder: "દા.ત. 380001",
  referenceNumberLabel: "બિલ / ગ્રાહક / PNR / અરજી નંબર (જો હોય)",
  referenceNumberPlaceholder: "વૈકલ્પિક — પોર્ટલમાં ઝડપથી ભરવા માટે",
  portalLanguageNoticeTitle: "પોર્ટલ ભાષા માહિતી",
  portalLangTamilAndEnglish: "આ પોર્ટલમાં તમિલ અને અંગ્રેજી ભાષાનો વિકલ્પ છે",
  portalLangHindiAndEnglish: "આ પોર્ટલ અંગ્રેજી / હિન્દીમાં છે — નીચેની ગુજરાતી ગાઇડથી સરળતાથી સબમિટ કરો",
  portalLangMultiIndian: "આ પોર્ટલમાં ઘણી ભારતીય ભાષાઓનો વિકલ્પ ઉપલબ્ધ છે",
  portalLangEnglishOnly: "આ સરકારી પોર્ટલ અંગ્રેજીમાં છે — નીચેના 1-ટેપ કૉપિ ફીલ્ડ્સ અને ગુજરાતી ગાઇડ વાપરો",
  portalFormSheetTitle: "પોર્ટલમાં પેસ્ટ કરવા તૈયાર વિગતો",
  portalFormSheetSubtitle:
    "સરકારી પોર્ટલ અંગ્રેજી બોક્સમાં વિગતો માંગે છે. દરેક લાઇન સામે 'કૉપિ' દબાવીને પોર્ટલમાં પેસ્ટ કરો.",
  copyFieldBtn: "કૉપિ",
  copiedFieldBtn: "કૉપિ થયું",
  buttonGuideTitle: "અંગ્રેજી પોર્ટલ બટનોનો ગુજરાતી અર્થ",
  buttonGuideSubtitle: "સરકારી વેબસાઇટ પર દેખાતા અંગ્રેજી બટનો અને શીર્ષકોનો સરળ અર્થ:",
  otpSubmissionNote:
    "અધિકૃત ટ્રેકિંગ નંબર મેળવવા માટે તમારો મોબાઇલ OTP અને CAPTCHA ચકાસણી જરૂરી છે. સરળ સબમિશન માટે MakkalVoice એ બધી વિગતો તૈયાર રાખી છે.",
  chatYouLabel: "તમે",
};

const PA: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "ਅਗਲੇ ਕਦਮ · ਜਮ੍ਹਾਂ ਕਰਨ ਲਈ ਤਿਆਰ",
  nextStepsHeading: "ਅਧਿਕਾਰਤ ਪੋਰਟਲ 'ਤੇ ਆਪਣੀ ਸ਼ਿਕਾਇਤ ਕਿਵੇਂ ਦਰਜ ਕਰੀਏ",
  nextStepsSubheading:
    "ਹੇਠਾਂ ਦਿੱਤੇ ਦਸਤਾਵੇਜ਼ ਤਿਆਰ ਕਰੋ ਅਤੇ ਕਦਮ-ਦਰ-ਕਦਮ ਗਾਈਡ ਅਨੁਸਾਰ ਸਿੱਧੇ ਸਰਕਾਰੀ ਪੋਰਟਲ 'ਤੇ ਦਰਜ ਕਰੋ।",
  openStepGuideBtn: "ਕਦਮ-ਦਰ-ਕਦਮ ਸਬਮਿਸ਼ਨ ਗਾਈਡ ਖੋਲ੍ਹੋ",
  modalTitle: "ਕਦਮ-ਦਰ-ਕਦਮ ਸ਼ਿਕਾਇਤ ਸਬਮਿਸ਼ਨ ਗਾਈਡ",
  modalCloseLabel: "ਗਾਈਡ ਬੰਦ ਕਰੋ",
  modalStepPrefix: "ਕਦਮ",
  modalPrevBtn: "ਪਿਛਲਾ",
  modalNextBtn: "ਅਗਲਾ ਕਦਮ",
  modalDoneBtn: "ਪੂਰਾ ਕਰੋ",
  modalStep1Title: "ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼ ਤਿਆਰ ਕਰੋ",
  modalStep1Desc: "ਫ਼ੋਟੋਆਂ, ਬਿੱਲ ਜਾਂ ਪਛਾਣ ਪੱਤਰ ਤਿਆਰ ਕਰਕੇ ਟਿੱਕ ਕਰੋ ਤਾਂ ਜੋ ਅਪਲੋਡ ਕਰਨਾ ਸੌਖਾ ਹੋਵੇ।",
  modalStep2Title: "ਸ਼ਿਕਾਇਤ ਦਾ ਡਰਾਫਟ ਕਾਪੀ ਕਰੋ",
  modalStep2Desc: "ਪੋਰਟਲ ਵਿੱਚ ਸਿੱਧਾ ਪੇਸਟ ਕਰਨ ਲਈ ਵਿਸ਼ਾ ਅਤੇ ਪੱਤਰ ਕਾਪੀ ਕਰੋ।",
  modalStep3Title: "ਅਧਿਕਾਰਤ ਸਰਕਾਰੀ ਪੋਰਟਲ ਖੋਲ੍ਹੋ",
  modalStep3Desc: "ਲਾਗਇਨ ਕਰੋ, ਸਬੰਧਤ ਵਿਭਾਗ ਚੁਣੋ, ਆਪਣੀ ਸ਼ਿਕਾਇਤ ਪੇਸਟ ਕਰੋ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਨੱਥੀ ਕਰੋ।",
  modalStep4Title: "ਜਮ੍ਹਾਂ ਕਰੋ ਅਤੇ ਟਰੈਕਿੰਗ ਨੰਬਰ ਸੰਭਾਲੋ",
  modalStep4Desc: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨ ਤੋਂ ਬਾਅਦ ਮਿਲਿਆ ਅਧਿਕਾਰਤ ਟਰੈਕਿੰਗ ਨੰਬਰ ਅਤੇ SMS ਸੰਭਾਲ ਕੇ ਰੱਖੋ।",
  modalCopyHint: "ਸ਼ਿਕਾਇਤ ਦਾ ਡਰਾਫਟ ਕਾਪੀ ਕਰਨ ਲਈ ਤਿਆਰ ਹੈ",
  modalPortalLaunchHint: "ਨਵੇਂ ਟੈਬ ਵਿੱਚ ਖੁੱਲ੍ਹੇਗਾ ਤਾਂ ਜੋ ਇਹ ਗਾਈਡ ਤੁਹਾਡੇ ਸਾਹਮਣੇ ਰਹੇ।",
  modalTrackingReminder:
    "ਜ਼ਿਆਦਾਤਰ ਸਰਕਾਰੀ ਪੋਰਟਲ 7–15 ਦਿਨਾਂ ਵਿੱਚ ਜਵਾਬ ਦਿੰਦੇ ਹਨ। ਆਪਣਾ ਟਰੈਕਿੰਗ ਨੰਬਰ ਸੰਭਾਲ ਕੇ ਰੱਖੋ।",
  readStepAloud: "ਇਹ ਕਦਮ ਸੁਣੋ",
  stopStepAudio: "ਆਡੀਓ ਬੰਦ ਕਰੋ",
  documentsTitle: "ਨੱਥੀ ਕਰਨ ਲਈ ਦਸਤਾਵੇਜ਼ ਅਤੇ ਸਬੂਤ",
  documentsSubtitle:
    "ਤਿਆਰ ਦਸਤਾਵੇਜ਼ਾਂ 'ਤੇ ਟਿੱਕ ਕਰੋ। ਜ਼ਿਆਦਾਤਰ ਪੋਰਟਲ 2 MB ਤੋਂ ਘੱਟ JPG/PNG ਜਾਂ PDF ਸਵੀਕਾਰ ਕਰਦੇ ਹਨ।",
  docRequiredTag: "ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਗਈ",
  docOptionalTag: "ਜੇ ਉਪਲਬਧ ਹੋਵੇ",
  docFormatNote: "ਸੁਝਾਅ: ਸਾਫ਼ ਫ਼ੋਟੋਆਂ ਖਿੱਚੋ ਜਾਂ 2 MB ਤੋਂ ਘੱਟ PDF ਵਜੋਂ ਸੰਭਾਲੋ।",
  docsReadyLabel: "ਤਿਆਰ",
  chatOpenBtn: "ਸਬਮਿਸ਼ਨ ਮਦਦ",
  chatTitle: "ਪੋਰਟਲ ਅਤੇ ਸਬਮਿਸ਼ਨ ਸਹਾਇਕ",
  chatSubtitle: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨ, ਦਸਤਾਵੇਜ਼ਾਂ ਜਾਂ ਟਰੈਕਿੰਗ ID ਬਾਰੇ ਪੁੱਛੋ",
  chatRoleLabel: "ਸ਼ਿਕਾਇਤ ਗਾਈਡ",
  chatWelcome:
    "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ MakkalVoice ਸਬਮਿਸ਼ਨ ਗਾਈਡ ਹਾਂ। ਸਰਕਾਰੀ ਪੋਰਟਲ 'ਤੇ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਨੱਥੀ ਕਰਨ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।",
  chatContextActive: "ਤੁਹਾਡੇ ਮੌਜੂਦਾ ਪੋਰਟਲ ਅਤੇ ਸ਼ਿਕਾਇਤ ਦੇ ਵੇਰਵਿਆਂ ਦੀ ਵਰਤੋਂ ਕਰ ਰਿਹਾ ਹੈ",
  chatPlaceholder: "ਪੋਰਟਲ ਕਦਮਾਂ ਜਾਂ ਦਸਤਾਵੇਜ਼ਾਂ ਬਾਰੇ ਪੁੱਛੋ...",
  chatSendBtn: "ਭੇਜੋ",
  chatSending: "ਜਵਾਬ ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ...",
  chatClearBtn: "ਨਵੀਂ ਚੈਟ",
  chatSpeakBtn: "ਬੋਲੋ",
  chatStopListening: "ਰੋਕੋ",
  chatListenReply: "ਸੁਣੋ",
  chatStopReply: "ਰੋਕੋ",
  chatSuggestionsLabel: "ਤੁਰੰਤ ਸਵਾਲ",
  chatSuggestion1: "ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਨੱਥੀ ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ?",
  chatSuggestion2: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਕੇ ਟਰੈਕਿੰਗ ID ਕਿਵੇਂ ਮਿਲੇਗੀ?",
  chatSuggestion3: "ਜੇ ਜਵਾਬ ਨਾ ਮਿਲੇ ਤਾਂ ਅੱਗੇ ਕੀ ਕਰੀਏ?",
  chatEmptyHint: "ਮਦਦ ਲਈ ਕੋਈ ਤੁਰੰਤ ਸਵਾਲ ਚੁਣੋ ਜਾਂ ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ।",
  chatAskInSectionBtn: "AI ਗਾਈਡ ਤੋਂ ਪੁੱਛੋ",
  citizenDetailsTitle: "ਤੁਹਾਡਾ ਨਾਮ ਅਤੇ ਫ਼ੋਨ ਨੰਬਰ",
  citizenDetailsNote:
    "ਰਸਮੀ ਸ਼ਿਕਾਇਤ ਪੱਤਰ ਲਈ ਲਾਜ਼ਮੀ। ਤੁਹਾਡੇ ਡਿਵਾਈਸ ਵਿੱਚ ਹੀ ਭਰਿਆ ਜਾਂਦਾ ਹੈ — AI ਨੂੰ ਨਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ।",
  requiredNameLabel: "ਪੂਰਾ ਨਾਮ",
  requiredNamePlaceholder: "ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਲਿਖੋ",
  requiredPhoneLabel: "ਫ਼ੋਨ ਨੰਬਰ",
  requiredPhonePlaceholder: "ਆਪਣਾ 10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਲਿਖੋ",
  errMissingName: "ਅੱਗੇ ਵਧਣ ਤੋਂ ਪਹਿਲਾਂ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਲਿਖੋ।",
  errInvalidPhone: "ਅੱਗੇ ਵਧਣ ਤੋਂ ਪਹਿਲਾਂ ਕਿਰਪਾ ਕਰਕੇ ਸਹੀ 10 ਅੰਕਾਂ ਦਾ ਫ਼ੋਨ ਨੰਬਰ ਲਿਖੋ।",
  privacyRequiredLocalDesc:
    "ਤੁਹਾਡਾ ਨਾਮ ਅਤੇ ਫ਼ੋਨ ਨੰਬਰ ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਹੀ ਪੱਤਰ ਵਿੱਚ ਜੋੜੇ ਜਾਂਦੇ ਹਨ ਅਤੇ ਕਦੇ AI ਨੂੰ ਨਹੀਂ ਭੇਜੇ ਜਾਂਦੇ।",
  step1Part1Title: "ਆਪਣੀ ਸਮੱਸਿਆ ਬੋਲ ਕੇ ਜਾਂ ਟਾਈਪ ਕਰਕੇ ਦੱਸੋ",
  pincodeLabel: "ਪਿੰਨਕੋਡ / Pincode (ਵਿਕਲਪਿਕ)",
  pincodePlaceholder: "ਜਿਵੇਂ: 160001",
  referenceNumberLabel: "ਬਿੱਲ / ਖਪਤਕਾਰ / PNR / ਅਰਜ਼ੀ ਨੰਬਰ (ਜੇ ਹੋਵੇ)",
  referenceNumberPlaceholder: "ਵਿਕਲਪਿਕ — ਪੋਰਟਲ ਵਿੱਚ ਜਲਦੀ ਭਰਨ ਲਈ",
  portalLanguageNoticeTitle: "ਪੋਰਟਲ ਭਾਸ਼ਾ ਜਾਣਕਾਰੀ",
  portalLangTamilAndEnglish: "ਇਸ ਪੋਰਟਲ ਵਿੱਚ ਤਮਿਲ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਭਾਸ਼ਾ ਦਾ ਵਿਕਲਪ ਹੈ",
  portalLangHindiAndEnglish: "ਇਹ ਪੋਰਟਲ ਅੰਗਰੇਜ਼ੀ / ਹਿੰਦੀ ਵਿੱਚ ਹੈ — ਹੇਠਾਂ ਦਿੱਤੀ ਪੰਜਾਬੀ ਗਾਈਡ ਨਾਲ ਆਸਾਨੀ ਨਾਲ ਦਰਜ ਕਰੋ",
  portalLangMultiIndian: "ਇਸ ਪੋਰਟਲ ਵਿੱਚ ਕਈ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਦਾ ਵਿਕਲਪ ਉਪਲਬਧ ਹੈ",
  portalLangEnglishOnly: "ਇਹ ਸਰਕਾਰੀ ਪੋਰਟਲ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੈ — ਹੇਠਾਂ ਦਿੱਤੇ 1-ਟੈਪ ਕਾਪੀ ਵੇਰਵੇ ਅਤੇ ਪੰਜਾਬੀ ਗਾਈਡ ਵਰਤੋ",
  portalFormSheetTitle: "ਪੋਰਟਲ ਵਿੱਚ ਪੇਸਟ ਕਰਨ ਲਈ ਤਿਆਰ ਵੇਰਵੇ",
  portalFormSheetSubtitle:
    "ਸਰਕਾਰੀ ਪੋਰਟਲ ਅੰਗਰੇਜ਼ੀ ਬਾਕਸਾਂ ਵਿੱਚ ਜਾਣਕਾਰੀ ਮੰਗਦੇ ਹਨ। ਹਰ ਲਾਈਨ ਸਾਹਮਣੇ 'ਕਾਪੀ' ਦਬਾਓ ਅਤੇ ਪੋਰਟਲ ਵਿੱਚ ਪੇਸਟ ਕਰੋ।",
  copyFieldBtn: "ਕਾਪੀ",
  copiedFieldBtn: "ਕਾਪੀ ਹੋਇਆ",
  buttonGuideTitle: "ਅੰਗਰੇਜ਼ੀ ਪੋਰਟਲ ਬਟਨਾਂ ਦਾ ਪੰਜਾਬੀ ਅਰਥ",
  buttonGuideSubtitle: "ਸਰਕਾਰੀ ਵੈੱਬਸਾਈਟ 'ਤੇ ਦਿਖਣ ਵਾਲੇ ਅੰਗਰੇਜ਼ੀ ਬਟਨਾਂ ਅਤੇ ਸਿਰਲੇਖਾਂ ਦਾ ਸਰਲ ਅਰਥ:",
  otpSubmissionNote:
    "ਅਸਲ ਸਰਕਾਰੀ ਟਰੈਕਿੰਗ ਨੰਬਰ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਤੁਹਾਡਾ ਮੋਬਾਈਲ OTP ਅਤੇ CAPTCHA ਤਸਦੀਕ ਜ਼ਰੂਰੀ ਹੈ। ਆਸਾਨੀ ਨਾਲ ਜਮ੍ਹਾਂ ਕਰਨ ਲਈ MakkalVoice ਨੇ ਸਾਰੇ ਵੇਰਵੇ ਤਿਆਰ ਰੱਖੇ ਹਨ।",
  chatYouLabel: "ਤੁਸੀਂ",
};

const OR: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ · ଦାଖଲ ପାଇଁ ପ୍ରସ୍ତୁତ",
  nextStepsHeading: "ସରକାରୀ ପୋର୍ଟାଲରେ ଆପଣଙ୍କ ଅଭିଯୋଗ କିପରି ଦାଖଲ କରିବେ",
  nextStepsSubheading:
    "ନିମ୍ନରେ ଥିବା ଦସ୍ତାବିଜ୍ ପ୍ରସ୍ତୁତ ରଖନ୍ତୁ ଏବଂ ପଦକ୍ଷେପ-ଅନୁସାରେ ଗାଇଡ୍ ଅନୁସରଣ କରି ସିଧାସଳଖ ସରକାରୀ ପୋର୍ଟାଲରେ ଦାଖଲ କରନ୍ତୁ।",
  openStepGuideBtn: "ପଦକ୍ଷେପ-ଅନୁସାରେ ଦାଖଲ ଗାଇଡ୍ ଖୋଲନ୍ତୁ",
  modalTitle: "ପଦକ୍ଷେପ-ଅନୁସାରେ ଅଭିଯୋଗ ଦାଖଲ ଗାଇଡ୍",
  modalCloseLabel: "ଗାଇଡ୍ ବନ୍ଦ କରନ୍ତୁ",
  modalStepPrefix: "ପଦକ୍ଷେପ",
  modalPrevBtn: "ପୂର୍ବବର୍ତ୍ତୀ",
  modalNextBtn: "ପରବର୍ତ୍ତୀ",
  modalDoneBtn: "ସମ୍ପୂର୍ଣ୍ଣ",
  modalStep1Title: "ଆବଶ୍ୟକ ଦସ୍ତାବିଜ୍ ଓ ପ୍ରମାଣ ପ୍ରସ୍ତୁତ କରନ୍ତୁ",
  modalStep1Desc: "ଫଟୋ, ବିଲ୍ କିମ୍ବା ପରିଚୟ ପତ୍ର ପ୍ରସ୍ତୁତ କରି ଟିକ୍ କରନ୍ତୁ ଯାହାଫଳରେ ଅପଲୋଡ୍ ସହଜ ହେବ।",
  modalStep2Title: "ଅଭିଯୋଗ ଚିଠି କପି କିମ୍ବା ଡାଉନଲୋଡ୍ କରନ୍ତୁ",
  modalStep2Desc: "ପୋର୍ଟାଲରେ ସିଧା ପେଷ୍ଟ କରିବାକୁ ବିଷୟ ଓ ଅଭିଯୋଗ ପତ୍ର କପି କରନ୍ତୁ।",
  modalStep3Title: "ଯାଞ୍ଚ ହୋଇଥିବା ସରକାରୀ ପୋର୍ଟାଲ୍ ଖୋଲନ୍ତୁ",
  modalStep3Desc: "ଲଗଇନ୍ କରନ୍ତୁ, ସମ୍ପୃକ୍ତ ବିଭାଗ ବାଛନ୍ତୁ, ଚିଠି ପେଷ୍ଟ କରନ୍ତୁ ଏବଂ ଦସ୍ତାବିଜ୍ ଅପଲୋଡ୍ କରନ୍ତୁ।",
  modalStep4Title: "ଦାଖଲ କରନ୍ତୁ ଏବଂ ଟ୍ରାକିଂ ନମ୍ବର ସଂରକ୍ଷଣ କରନ୍ତୁ",
  modalStep4Desc: "ଦାଖଲ ପରେ ମିଳିଥିବା ସରକାରୀ ଅଭିଯୋଗ ନମ୍ବର ଓ SMS ସୁରକ୍ଷିତ ରଖନ୍ତୁ।",
  modalCopyHint: "ଅଭିଯୋଗ ପତ୍ର କପି କରିବାକୁ ପ୍ରସ୍ତୁତ",
  modalPortalLaunchHint: "ନୂଆ ଟ୍ୟାବ୍‌ରେ ଖୋଲିବ ଯାହାଫଳରେ ଏହି ଗାଇଡ୍ ଆପଣଙ୍କ ସାମ୍ନାରେ ରହିବ।",
  modalTrackingReminder:
    "ଅଧିକାଂଶ ସରକାରୀ ପୋର୍ଟାଲ୍ ୭–୧୫ ଦିନ ମଧ୍ୟରେ ଉତ୍ତର ଦିଅନ୍ତି। ଆପଣଙ୍କ ଟ୍ରାକିଂ ନମ୍ବର ସୁରକ୍ଷିତ ରଖନ୍ତୁ।",
  readStepAloud: "ଏହି ପଦକ୍ଷେପ ଶୁଣନ୍ତୁ",
  stopStepAudio: "ଅଡିଓ ବନ୍ଦ କରନ୍ତୁ",
  documentsTitle: "ସଂଲଗ୍ନ କରିବାକୁ ଥିବା ଦସ୍ତାବିଜ୍ ଏବଂ ପ୍ରମାଣ",
  documentsSubtitle:
    "ପ୍ରସ୍ତୁତ ଦସ୍ତାବିଜ୍‌ରେ ଟିକ୍ କରନ୍ତୁ। ଅଧିକାଂଶ ପୋର୍ଟାଲ୍ 2 MB ରୁ କମ୍ JPG/PNG କିମ୍ବା PDF ଗ୍ରହଣ କରନ୍ତି।",
  docRequiredTag: "ସୁପାରିଶ",
  docOptionalTag: "ଯଦି ଉପଲବ୍ଧ",
  docFormatNote: "ପରାମର୍ଶ: ସ୍ପଷ୍ଟ ଫଟୋ ନିଅନ୍ତୁ କିମ୍ବା 2 MB ରୁ କମ୍ PDF ଭାବେ ସେଭ୍ କରନ୍ତୁ।",
  docsReadyLabel: "ପ୍ରସ୍ତୁତ",
  chatOpenBtn: "ଦାଖଲ ସହାୟତା",
  chatTitle: "ପୋର୍ଟାଲ୍ ଓ ଦାଖଲ ସହାୟକ",
  chatSubtitle: "ଅଭିଯୋଗ ଦାଖଲ, ଦସ୍ତାବିଜ୍ କିମ୍ବା ଟ୍ରାକିଂ ID ବିଷୟରେ ପଚାରନ୍ତୁ",
  chatRoleLabel: "ଅଭିଯୋଗ ଗାଇଡ୍",
  chatWelcome:
    "ନମସ୍କାର! ମୁଁ MakkalVoice ଦାଖଲ ଗାଇଡ୍। ସରକାରୀ ପୋର୍ଟାଲରେ ଅଭିଯୋଗ କିପରି ଦାଖଲ କରିବେ ଏବଂ କେଉଁ ଦସ୍ତାବିଜ୍ ସଂଲଗ୍ନ କରିବେ ପଚାରନ୍ତୁ।",
  chatContextActive: "ଆପଣଙ୍କ ବର୍ତ୍ତମାନର ପୋର୍ଟାଲ୍ ଓ ଅଭିଯୋଗ ବିବରଣୀ ବ୍ୟବହାର କରୁଛି",
  chatPlaceholder: "ଦାଖଲ ପଦକ୍ଷେପ କିମ୍ବା ଦସ୍ତାବିଜ୍ ବିଷୟରେ ପଚାରନ୍ତୁ...",
  chatSendBtn: "ପଠାନ୍ତୁ",
  chatSending: "ଉତ୍ତର ପ୍ରସ୍ତୁତ ହେଉଛି...",
  chatClearBtn: "ନୂଆ ଚାଟ୍",
  chatSpeakBtn: "କୁହନ୍ତୁ",
  chatStopListening: "ବନ୍ଦ କରନ୍ତୁ",
  chatListenReply: "ଶୁଣନ୍ତୁ",
  chatStopReply: "ବନ୍ଦ କରନ୍ତୁ",
  chatSuggestionsLabel: "ଶୀଘ୍ର ପ୍ରଶ୍ନ",
  chatSuggestion1: "ମୁଁ କେଉଁ ଦସ୍ତାବିଜ୍ ସଂଲଗ୍ନ କରିବା ଉଚିତ?",
  chatSuggestion2: "ଅଭିଯୋଗ ଦାଖଲ କରି ଟ୍ରାକିଂ ID କିପରି ପାଇବି?",
  chatSuggestion3: "ଉତ୍ତର ନ ମିଳିଲେ ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ କ’ଣ?",
  chatEmptyHint: "ସହାୟତା ପାଇଁ ଏକ ଶୀଘ୍ର ପ୍ରଶ୍ନ ବାଛନ୍ତୁ କିମ୍ବା ନିଜ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ।",
  chatAskInSectionBtn: "AI ଗାଇଡ୍‌କୁ ପଚାରନ୍ତୁ",
  citizenDetailsTitle: "ଆପଣଙ୍କ ନାମ ଏବଂ ଫୋନ୍ ନମ୍ବର",
  citizenDetailsNote:
    "ଆନୁଷ୍ଠାନିକ ଅଭିଯୋଗ ପତ୍ର ପାଇଁ ଆବଶ୍ୟକ। କେବଳ ଆପଣଙ୍କ ଡିଭାଇସ୍‌ରେ ଯୋଡ଼ାଯାଏ — AI କୁ ପଠାଯାଏ ନାହିଁ।",
  requiredNameLabel: "ପୂର୍ଣ୍ଣ ନାମ",
  requiredNamePlaceholder: "ଆପଣଙ୍କ ପୂର୍ଣ୍ଣ ନାମ ଲେଖନ୍ତୁ",
  requiredPhoneLabel: "ଫୋନ୍ ନମ୍ବର",
  requiredPhonePlaceholder: "ଆପଣଙ୍କ ୧୦ ଅଙ୍କ ବିଶିଷ୍ଟ ମୋବାଇଲ୍ ନମ୍ବର ଲେଖନ୍ତୁ",
  errMissingName: "ଆଗକୁ ବଢ଼ିବା ପୂର୍ବରୁ ଦୟାକରି ଆପଣଙ୍କ ପୂର୍ଣ୍ଣ ନାମ ଲେଖନ୍ତୁ।",
  errInvalidPhone: "ଆଗକୁ ବଢ଼ିବା ପୂର୍ବରୁ ଦୟାକରି ସଠିକ୍ ୧୦ ଅଙ୍କର ଫୋନ୍ ନମ୍ବର ଲେଖନ୍ତୁ।",
  privacyRequiredLocalDesc:
    "ଆପଣଙ୍କ ନାମ ଓ ଫୋନ୍ ନମ୍ବର କେବଳ ଆପଣଙ୍କ ବ୍ରାଉଜରରେ ଚିଠିରେ ଯୋଡ଼ାଯାଏ — କେବେ AI କୁ ପଠାଯାଏ ନାହିଁ।",
  step1Part1Title: "ଆପଣଙ୍କ ସମସ୍ୟା କୁହନ୍ତୁ କିମ୍ବା ଟାଇପ୍ କରନ୍ତୁ",
  pincodeLabel: "ପିନ୍‌କୋଡ୍ / Pincode (ବୈକଳ୍ପିକ)",
  pincodePlaceholder: "ଉଦାହରଣ: 751001",
  referenceNumberLabel: "ବିଲ୍ / ଗ୍ରାହକ / PNR / ଆବେଦନ ନମ୍ବର (ଯଦି ଅଛି)",
  referenceNumberPlaceholder: "ବୈକଳ୍ପିକ — ପୋର୍ଟାଲରେ ଶୀଘ୍ର ପୂରଣ କରିବା ପାଇଁ",
  portalLanguageNoticeTitle: "ପୋର୍ଟାଲ୍ ଭାଷା ସୂଚନା",
  portalLangTamilAndEnglish: "ଏହି ପୋର୍ଟାଲରେ ତାମିଲ୍ ଓ ଇଂରାଜୀ ଭାଷା ବିକଳ୍ପ ଉପଲବ୍ଧ",
  portalLangHindiAndEnglish: "ଏହି ପୋର୍ଟାଲ୍ ଇଂରାଜୀ / ହିନ୍ଦୀରେ ଅଛି — ନିମ୍ନ ଓଡ଼ିଆ ଗାଇଡ୍ ସାହାଯ୍ୟରେ ସହଜରେ ଦାଖଲ କରନ୍ତୁ",
  portalLangMultiIndian: "ଏହି ପୋର୍ଟାଲରେ ଅନେକ ଭାରତୀୟ ଭାଷା ବିକଳ୍ପ ଉପଲବ୍ଧ",
  portalLangEnglishOnly: "ଏହି ସରକାରୀ ପୋର୍ଟାଲ୍ ଇଂରାଜୀରେ ଅଛି — ନିମ୍ନ ୧-ଟ୍ୟାପ୍ କପି ବିବରଣୀ ଓ ଓଡ଼ିଆ ଗାଇଡ୍ ବ୍ୟବହାର କରନ୍ତୁ",
  portalFormSheetTitle: "ପୋର୍ଟାଲ୍ ଫର୍ମରେ ପେଷ୍ଟ କରିବାକୁ ପ୍ରସ୍ତୁତ ବିବରଣୀ",
  portalFormSheetSubtitle:
    "ସରକାରୀ ପୋର୍ଟାଲ୍ ଇଂରାଜୀ ବାକ୍ସରେ ତଥ୍ୟ ମାଗନ୍ତି। ପ୍ରତି ଧାଡ଼ି ପାଖରେ 'କପି' ଦବାଇ ପୋର୍ଟାଲରେ ପେଷ୍ଟ କରନ୍ତୁ।",
  copyFieldBtn: "କପି",
  copiedFieldBtn: "କପି ହେଲା",
  buttonGuideTitle: "ଇଂରାଜୀ ପୋର୍ଟାଲ୍ ବଟନ୍‌ଗୁଡ଼ିକର ଓଡ଼ିଆ ଅର୍ଥ",
  buttonGuideSubtitle: "ସରକାରୀ ୱେବସାଇଟରେ ଦେଖାଯାଉଥିବା ଇଂରାଜୀ ବଟନ୍ ଓ ଶୀର୍ଷକର ସରଳ ଅର୍ଥ:",
  otpSubmissionNote:
    "ପ୍ରକୃତ ସରକାରୀ ଟ୍ରାକିଂ ନମ୍ବର ପାଇବା ପାଇଁ ଆପଣଙ୍କ ମୋବାଇଲ୍ OTP ଓ CAPTCHA ଯାଞ୍ଚ ଆବଶ୍ୟକ। ସହଜ ଦାଖଲ ପାଇଁ MakkalVoice ସବୁ ବିବରଣୀ ପ୍ରସ୍ତୁତ ରଖିଛି।",
  chatYouLabel: "ଆପଣ",
};

const AS: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "পৰৱৰ্তী পদক্ষেপ · দাখিল কৰিবলৈ সাজু",
  nextStepsHeading: "চৰকাৰী পৰ্টেলত আপোনাৰ অভিযোগ কেনেকৈ দাখিল কৰিব",
  nextStepsSubheading:
    "তলত দিয়া নথি-পত্ৰ সাজু কৰি ৰাখক আৰু পৰ্যায়ক্ৰমে নিৰ্দেশিকা অনুসৰণ কৰি পোনপটীয়াকৈ চৰকাৰী পৰ্টেলত দাখিল কৰক।",
  openStepGuideBtn: "পৰ্যায়ক্ৰমে দাখিল নিৰ্দেশিকা খোলক",
  modalTitle: "পৰ্যায়ক্ৰমে অভিযোগ দাখিল নিৰ্দেশিকা",
  modalCloseLabel: "নিৰ্দেশিকা বন্ধ কৰক",
  modalStepPrefix: "পদক্ষেপ",
  modalPrevBtn: "পূৰ্বৱৰ্তী",
  modalNextBtn: "পৰৱৰ্তী",
  modalDoneBtn: "সম্পূৰ্ণ",
  modalStep1Title: "প্ৰয়োজনীয় নথি-পত্ৰ আৰু প্ৰমাণ সাজু কৰক",
  modalStep1Desc: "ফটো, বিল বা পৰিচয় পত্ৰ সাজু কৰি টিক দিয়ক যাতে আপলোড কৰিবলৈ সহজ হয়।",
  modalStep2Title: "অভিযোগ পত্ৰ কপি বা ডাউনলোড কৰক",
  modalStep2Desc: "পৰ্টেলত পোনপটীয়াকৈ পেষ্ট কৰিবলৈ বিষয় আৰু চিঠিখন কপি কৰক।",
  modalStep3Title: "পৰীক্ষিত চৰকাৰী পৰ্টেল খোলক",
  modalStep3Desc: "লগইন কৰক, সংশ্লিষ্ট বিভাগ বাছনি কৰক, চিঠি পেষ্ট কৰক আৰু নথি-পত্ৰ আপলোড কৰক।",
  modalStep4Title: "দাখিল কৰক আৰু ট্ৰেকিং নম্বৰ সংৰক্ষণ কৰক",
  modalStep4Desc: "দাখিল কৰাৰ পাছত পোৱা চৰকাৰী অভিযোগ নম্বৰ আৰু SMS সুৰক্ষিত ৰাখক।",
  modalCopyHint: "অভিযোগ পত্ৰ কপি কৰিবলৈ সাজু",
  modalPortalLaunchHint: "নতুন টেবত খোল খাব যাতে এই নিৰ্দেশিকা আপোনাৰ সন্মুখতে থাকে।",
  modalTrackingReminder:
    "বেছিভাগ চৰকাৰী পৰ্টেলে ৭–১৫ দিনৰ ভিতৰত উত্তৰ দিয়ে। আপোনাৰ ট্ৰেকিং নম্বৰ যত্ন সহকাৰে ৰাখক।",
  readStepAloud: "এই পদক্ষেপটো শুনক",
  stopStepAudio: "অডিঅ' বন্ধ কৰক",
  documentsTitle: "সংলগ্ন কৰিবলগীয়া নথি-পত্ৰ আৰু প্ৰমাণ",
  documentsSubtitle:
    "সাজু হোৱা নথি-পত্ৰত টিক দিয়ক। বেছিভাগ পৰ্টেলে 2 MB তকৈ কম JPG/PNG বা PDF গ্ৰহণ কৰে।",
  docRequiredTag: "পৰামৰ্শিত",
  docOptionalTag: "যদি উপলব্ধ",
  docFormatNote: "পৰামৰ্শ: স্পষ্ট ফটো তোলক বা 2 MB তকৈ কম PDF হিচাপে সংৰক্ষণ কৰক।",
  docsReadyLabel: "সাজু",
  chatOpenBtn: "দাখিল সহায়",
  chatTitle: "পৰ্টেল আৰু দাখিল সহায়ক",
  chatSubtitle: "অভিযোগ দাখিল, নথি-পত্ৰ বা ট্ৰেকিং ID বিষয়ে সোধক",
  chatRoleLabel: "অভিযোগ গাইড",
  chatWelcome:
    "নমস্কাৰ! মই MakkalVoice দাখিল গাইড। চৰকাৰী পৰ্টেলত অভিযোগ কেনেকৈ দাখিল কৰিব আৰু কি কি নথি সংলগ্ন কৰিব সোধক।",
  chatContextActive: "আপোনাৰ বৰ্তমানৰ পৰ্টেল আৰু অভিযোগৰ তথ্য ব্যৱহাৰ কৰিছে",
  chatPlaceholder: "দাখিল পদক্ষেপ বা নথি-পত্ৰ বিষয়ে সোধক...",
  chatSendBtn: "পঠিয়াওক",
  chatSending: "উত্তৰ প্ৰস্তুত হৈ আছে...",
  chatClearBtn: "নতুন চেট",
  chatSpeakBtn: "কওক",
  chatStopListening: "বন্ধ কৰক",
  chatListenReply: "শুনক",
  chatStopReply: "বন্ধ কৰক",
  chatSuggestionsLabel: "দ্ৰুত প্ৰশ্ন",
  chatSuggestion1: "মই কি কি নথি-পত্ৰ সংলগ্ন কৰা উচিত?",
  chatSuggestion2: "অভিযোগ দাখিল কৰি ট্ৰেকিং ID কেনেকৈ পাম?",
  chatSuggestion3: "উত্তৰ নাপালে পৰৱৰ্তী পদক্ষেপ কি?",
  chatEmptyHint: "সহায়ৰ বাবে এটা দ্ৰুত প্ৰশ্ন বাছক বা নিজৰ প্ৰশ্ন লিখক।",
  chatAskInSectionBtn: "AI গাইডক সোধক",
  citizenDetailsTitle: "আপোনাৰ নাম আৰু ফোন নম্বৰ",
  citizenDetailsNote:
    "আনুষ্ঠানিক অভিযোগ পত্ৰৰ বাবে আৱশ্যক। কেৱল আপোনাৰ ডিভাইচতেই যোগ হয় — AI লৈ পঠিওৱা নহয়।",
  requiredNameLabel: "সম্পূৰ্ণ নাম",
  requiredNamePlaceholder: "আপোনাৰ সম্পূৰ্ণ নাম লিখক",
  requiredPhoneLabel: "ফোন নম্বৰ",
  requiredPhonePlaceholder: "আপোনাৰ ১০টা সংখ্যাৰ মোবাইল নম্বৰ লিখক",
  errMissingName: "আগবঢ়াৰ আগতে অনুগ্ৰহ কৰি আপোনাৰ সম্পূৰ্ণ নাম লিখক।",
  errInvalidPhone: "আগবঢ়াৰ আগতে অনুগ্ৰহ কৰি বৈধ ১০টা সংখ্যাৰ ফোন নম্বৰ লিখক।",
  privacyRequiredLocalDesc:
    "আপোনাৰ নাম আৰু ফোন নম্বৰ কেৱল আপোনাৰ ব্ৰাউজাৰতেই পত্ৰত যোগ কৰা হয় — কেতিয়াও AI লৈ পঠিওৱা নহয়।",
  step1Part1Title: "আপোনাৰ সমস্যা কওক বা টাইপ কৰক",
  pincodeLabel: "পিনক'ড / Pincode (বৈকল্পিক)",
  pincodePlaceholder: "উদাহৰণ: 781001",
  referenceNumberLabel: "বিল / গ্ৰাহক / PNR / আবেদন নম্বৰ (যদি আছে)",
  referenceNumberPlaceholder: "বৈকল্পিক — পৰ্টেলত সোনকালে পূৰণ কৰিবলৈ",
  portalLanguageNoticeTitle: "পৰ্টেলৰ ভাষা তথ্য",
  portalLangTamilAndEnglish: "এই পৰ্টেলত তামিল আৰু ইংৰাজী ভাষাৰ বিকল্প উপলব্ধ",
  portalLangHindiAndEnglish: "এই পৰ্টেল ইংৰাজী / হিন্দীত আছে — তলৰ অসমীয়া গাইডৰ সহায়ত সহজে দাখিল কৰক",
  portalLangMultiIndian: "এই পৰ্টেলত কেইবাটাও ভাৰতীয় ভাষাৰ বিকল্প উপলব্ধ",
  portalLangEnglishOnly: "এই চৰকাৰী পৰ্টেল ইংৰাজীত আছে — তলৰ ১-টেপ কপি তথ্য আৰু অসমীয়া গাইড ব্যৱহাৰ কৰক",
  portalFormSheetTitle: "পৰ্টেল ফৰ্মত পেষ্ট কৰিবলৈ সাজু তথ্য",
  portalFormSheetSubtitle:
    "চৰকাৰী পৰ্টেলে ইংৰাজী বাকচত তথ্য বিচাৰে। প্ৰতিটো তথ্যৰ কাষত 'কপি' টিপি পৰ্টেলত পেষ্ট কৰক।",
  copyFieldBtn: "কপি",
  copiedFieldBtn: "কপি হ'ল",
  buttonGuideTitle: "ইংৰাজী পৰ্টেল বুটামসমূহৰ অসমীয়া অৰ্থ",
  buttonGuideSubtitle: "চৰকাৰী ৱেবছাইটত দেখা পোৱা ইংৰাজী বুটাম আৰু শিৰোনামৰ সহজ অৰ্থ:",
  otpSubmissionNote:
    "প্ৰকৃত চৰকাৰী ট্ৰেকিং নম্বৰ পাবলৈ আপোনাৰ মোবাইল OTP আৰু CAPTCHA পৰীক্ষণ জৰুৰী। সহজ দাখিলৰ বাবে MakkalVoice সকলো তথ্য সাজু কৰি ৰাখিছে।",
  chatYouLabel: "আপুনি",
};

const UR: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "اگلے مراحل · جمع کرانے کے لیے تیار",
  nextStepsHeading: "سرکاری پورٹل پر اپنی شکایت کیسے جمع کرائیں",
  nextStepsSubheading:
    "نیچے دیے گئے دستاویزات تیار کریں اور مرحلہ وار گائیڈ پر عمل کرتے ہوئے براہ راست سرکاری پورٹل پر شکایت درج کریں۔",
  openStepGuideBtn: "مرحلہ وار جمع کرانے کی گائیڈ کھولیں",
  modalTitle: "شکایت جمع کرانے کی مرحلہ وار گائیڈ",
  modalCloseLabel: "گائیڈ بند کریں",
  modalStepPrefix: "مرحلہ",
  modalPrevBtn: "پچھلا",
  modalNextBtn: "اگلا مرحلہ",
  modalDoneBtn: "مکمل کریں",
  modalStep1Title: "ضروری دستاویزات اور ثبوت تیار کریں",
  modalStep1Desc:
    "تصاویر، بل یا شناختی کارڈ تیار کرکے چیک مارک لگائیں تاکہ اپ لوڈ کرنا آسان ہو۔",
  modalStep2Title: "شکایت کا مسودہ کاپی یا ڈاؤن لوڈ کریں",
  modalStep2Desc:
    "عنوان اور خط کاپی کریں تاکہ آپ اسے سرکاری پورٹل کے باکس میں فوراً پیسٹ کر سکیں۔",
  modalStep3Title: "تصدیق شدہ سرکاری پورٹل کھولیں",
  modalStep3Desc:
    "لاگ ان کریں، متعلقہ محکمہ منتخب کریں، اپنا مسودہ پیسٹ کریں اور دستاویزات منسلک کریں۔",
  modalStep4Title: "جمع کرائیں اور ٹریکنگ نمبر محفوظ رکھیں",
  modalStep4Desc:
    "جمع کرانے کے بعد ملنے والا سرکاری شکایت نمبر اور SMS محفوظ کر لیں۔",
  modalCopyHint: "کاپی کرنے کے لیے مسودہ تیار ہے",
  modalPortalLaunchHint: "نئے ٹیب میں کھلے گا تاکہ یہ گائیڈ آپ کے سامنے رہے۔",
  modalTrackingReminder:
    "زیادہ تر سرکاری پورٹلز 7–15 دنوں میں جواب دیتے ہیں۔ اپنا ٹریکنگ نمبر اور رسید محفوظ رکھیں۔",
  readStepAloud: "یہ مرحلہ سنیں",
  stopStepAudio: "آڈیو روکیں",
  documentsTitle: "منسلک کرنے کے لیے ضروری دستاویزات اور ثبوت",
  documentsSubtitle:
    "تیار دستاویزات پر نشان لگائیں۔ زیادہ تر سرکاری پورٹلز 2 MB سے کم JPG/PNG یا PDF فائلیں قبول کرتے ہیں۔",
  docRequiredTag: "تجویز کردہ",
  docOptionalTag: "اگر دستیاب ہو",
  docFormatNote: "مشورہ: صاف تصاویر لیں یا 2 MB سے کم PDF کے طور پر محفوظ کریں۔",
  docsReadyLabel: "تیار",
  chatOpenBtn: "جمع کرانے کی مدد",
  chatTitle: "پورٹل اور شکایت معاون",
  chatSubtitle: "شکایت درج کرنے، دستاویزات یا ٹریکنگ نمبر کے بارے میں پوچھیں",
  chatRoleLabel: "شکایت گائیڈ",
  chatWelcome:
    "السلام علیکم! میں MakkalVoice شکایت گائیڈ ہوں۔ مجھ سے پوچھیں کہ سرکاری پورٹل پر شکایت کیسے درج کریں، کون سی دستاویزات لگائیں، یا جواب نہ ملنے پر کیا کریں۔",
  chatContextActive: "آپ کے موجودہ پورٹل اور شکایت کی تفصیلات استعمال کر رہا ہے",
  chatPlaceholder: "جمع کرانے کے مراحل یا دستاویزات کے بارے میں پوچھیں...",
  chatSendBtn: "بھیجیں",
  chatSending: "جواب تیار ہو رہا ہے...",
  chatClearBtn: "نئی گفتگو",
  chatSpeakBtn: "بولیں",
  chatStopListening: "روکیں",
  chatListenReply: "سنیں",
  chatStopReply: "روکیں",
  chatSuggestionsLabel: "فوری سوالات",
  chatSuggestion1: "مجھے کون سی دستاویزات منسلک کرنی چاہئیں؟",
  chatSuggestion2: "شکایت درج کرکے ٹریکنگ نمبر کیسے ملے گا؟",
  chatSuggestion3: "اگر وقت پر جواب نہ آئے تو کیا کریں؟",
  chatEmptyHint: "مدد کے لیے کوئی فوری سوال منتخب کریں یا اپنا سوال نیچے لکھیں۔",
  chatAskInSectionBtn: "AI گائیڈ سے پوچھیں",
  citizenDetailsTitle: "آپ کا نام اور فون نمبر",
  citizenDetailsNote:
    "باضابطہ شکایت نامہ مکمل کرنے کے لیے ضروری۔ یہ صرف آپ کے آلے پر بھرا جاتا ہے — کبھی AI کو نہیں بھیجا جاتا۔",
  requiredNameLabel: "پورا نام",
  requiredNamePlaceholder: "اپنا پورا نام درج کریں",
  requiredPhoneLabel: "فون نمبر",
  requiredPhonePlaceholder: "اپنا 10 ہندسوں کا موبائل نمبر درج کریں",
  errMissingName: "آگے بڑھنے سے پہلے براہ کرم اپنا پورا نام درج کریں۔",
  errInvalidPhone: "آگے بڑھنے سے پہلے براہ کرم درست 10 ہندسوں کا فون نمبر درج کریں۔",
  privacyRequiredLocalDesc:
    "آپ کا نام اور فون نمبر صرف آپ کے براؤزر میں خط میں شامل ہوتے ہیں اور کبھی AI کو نہیں بھیجے جاتے۔",
  step1Part1Title: "اپنا مسئلہ بول کر یا ٹائپ کرکے بتائیں",
  pincodeLabel: "پن کوڈ / Pincode (اختیاری)",
  pincodePlaceholder: "مثلاً: 110001",
  referenceNumberLabel: "بل / کنزیومر / PNR / درخواست نمبر (اگر ہو)",
  referenceNumberPlaceholder: "اختیاری — پورٹل پر تیزی سے بھرنے کے لیے",
  portalLanguageNoticeTitle: "پورٹل کی زبان کی معلومات",
  portalLangTamilAndEnglish: "اس پورٹل میں تمل اور انگریزی زبان کا انتخاب دستیاب ہے",
  portalLangHindiAndEnglish: "یہ پورٹل انگریزی / ہندی میں ہے — نیچے دی گئی اردو گائیڈ سے آسانی سے جمع کرائیں",
  portalLangMultiIndian: "اس پورٹل میں متعدد بھارتی زبانوں کا انتخاب دستیاب ہے",
  portalLangEnglishOnly: "یہ سرکاری پورٹل انگریزی میں ہے — نیچے دیے گئے 1-ٹیپ کاپی فیلڈز اور اردو گائیڈ استعمال کریں",
  portalFormSheetTitle: "پورٹل فارم میں پیسٹ کرنے کے لیے تیار تفصیلات",
  portalFormSheetSubtitle:
    "سرکاری پورٹلز انگریزی باکسز میں معلومات مانگتے ہیں۔ ہر فیلڈ کے سامنے 'کاپی' دبائیں اور پورٹل میں پیسٹ کریں۔",
  copyFieldBtn: "کاپی",
  copiedFieldBtn: "کاپی ہو گیا",
  buttonGuideTitle: "انگریزی پورٹل بٹنوں کا اردو مطلب",
  buttonGuideSubtitle: "سرکاری ویب سائٹ پر نظر آنے والے انگریزی بٹنوں اور عنوانات کا آسان اردو مطلب:",
  otpSubmissionNote:
    "اصلی سرکاری ٹریکنگ نمبر حاصل کرنے کے لیے آپ کا موبائل OTP اور CAPTCHA تصدیق ضروری ہے۔ آسان اندراج کے لیے MakkalVoice نے تمام تفصیلات تیار رکھی ہیں۔",
  chatYouLabel: "آپ",
};

const SUBMISSION_TRANSLATIONS: Record<string, SubmissionUiStrings> = {
  English: EN,
  Tamil: TA,
  Hindi: HI,
  Telugu: TE,
  Kannada: KN,
  Malayalam: ML,
  Bengali: BN,
  Marathi: MR,
  Gujarati: GU,
  Punjabi: PA,
  Odia: OR,
  Assamese: AS,
  Urdu: UR,
};

export function getSubmissionStrings(language: string): SubmissionUiStrings {
  return SUBMISSION_TRANSLATIONS[language] ?? EN;
}

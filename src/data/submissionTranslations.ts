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
  readStepAloud: "ఈ దశను వినండి",
  stopStepAudio: "ఆడియో ఆపండి",
  documentsTitle: "జత చేయవలసిన పత్రాలు & ఆధారాలు",
  documentsSubtitle:
    "సిద్ధం చేసిన పత్రాలకు టిక్ పెట్టండి. చాలా పోర్టల్‌లు 2 MB లోపు JPG/PNG లేదా PDF ఫైళ్లను అంగీకరిస్తాయి.",
  docRequiredTag: "సిఫార్సు చేయబడింది",
  docOptionalTag: "అందుబాటులో ఉంటే",
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
  chatAskInSectionBtn: "AI గైడ్‌ను అడగండి",
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
  modalStep2Title: "ದೂರು ಕರಡನ್ನು ನಕಲಿಸಿ ಅಥವಾ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
  modalStep3Title: "ಪರಿಶೀಲಿಸಿದ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ",
  modalStep4Title: "ಸಲ್ಲಿಸಿ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆಯನ್ನು ಉಳಿಸಿ",
  readStepAloud: "ಈ ಹಂತವನ್ನು ಕೇಳಿ",
  stopStepAudio: "ಆಡಿಯೊ ನಿಲ್ಲಿಸಿ",
  documentsTitle: "ಲಗತ್ತಿಸಬೇಕಾದ ದಾಖಲೆಗಳು ಮತ್ತು ಪುರಾವೆಗಳು",
  docRequiredTag: "ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
  docOptionalTag: "ಲಭ್ಯವಿದ್ದರೆ",
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
  chatAskInSectionBtn: "AI ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಕೇಳಿ",
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
  modalStep2Title: "പരാതിയുടെ കരട് പകർത്തുക",
  modalStep3Title: "ഔദ്യോഗിക പോർട്ടൽ തുറക്കുക",
  modalStep4Title: "സമർപ്പിച്ച് ട്രാക്കിംഗ് നമ്പർ സൂക്ഷിക്കുക",
  readStepAloud: "ഈ ഘട്ടം കേൾക്കുക",
  stopStepAudio: "ഓഡിയോ നിർത്തുക",
  documentsTitle: "അറ്റാച്ച് ചെയ്യേണ്ട രേഖകളും തെളിവുകളും",
  docRequiredTag: "ശുപാർശ ചെയ്യുന്നത്",
  docOptionalTag: "ലഭ്യമാണെങ്കിൽ",
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
  chatAskInSectionBtn: "AI ഗൈഡിനോട് ചോദിക്കുക",
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
  modalStep2Title: "অভিযোগের খসড়া কপি বা ডাউনলোড করুন",
  modalStep3Title: "যাচাইকৃত অফিশিয়াল পোর্টাল খুলুন",
  modalStep4Title: "জমা দিন এবং ট্র্যাকিং নম্বর সংরক্ষণ করুন",
  readStepAloud: "এই ধাপটি শুনুন",
  stopStepAudio: "অডিও বন্ধ করুন",
  documentsTitle: "সংযুক্ত করার জন্য প্রয়োজনীয় নথি ও প্রমাণ",
  docRequiredTag: "প্রস্তাবিত",
  docOptionalTag: "যদি থাকে",
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
  chatAskInSectionBtn: "AI গাইডকে জিজ্ঞাসা করুন",
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
  modalStep2Title: "तक्रारीचा मसुदा कॉपी किंवा डाउनलोड करा",
  modalStep3Title: "सत्यापित अधिकृत पोर्टल उघडा",
  modalStep4Title: "सादर करा आणि ट्रॅकिंग नंबर जतन करा",
  readStepAloud: "हा टप्पा ऐका",
  stopStepAudio: "ऑडिओ थांबवा",
  documentsTitle: "जोडण्यासाठी आवश्यक कागदपत्रे व पुरावे",
  docRequiredTag: "शिफारस केलेले",
  docOptionalTag: "उपलब्ध असल्यास",
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
  chatAskInSectionBtn: "AI मार्गदर्शकाला विचारा",
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
  modalStep2Title: "ફરિયાદનો ડ્રાફ્ટ કૉપિ કરો",
  modalStep3Title: "ચકાસાયેલ અધિકૃત પોર્ટલ ખોલો",
  modalStep4Title: "સબમિટ કરો અને ટ્રેકિંગ નંબર સાચવો",
  readStepAloud: "આ પગલું સાંભળો",
  stopStepAudio: "ઑડિયો બંધ કરો",
  documentsTitle: "જોડવા માટે જરૂરી દસ્તાવેજો અને પુરાવા",
  docRequiredTag: "ભલામણ કરેલ",
  docOptionalTag: "જો ઉપલબ્ધ હોય",
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
  chatAskInSectionBtn: "AI ગાઇડને પૂછો",
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
  modalStep2Title: "ਸ਼ਿਕਾਇਤ ਦਾ ਡਰਾਫਟ ਕਾਪੀ ਕਰੋ",
  modalStep3Title: "ਅਧਿਕਾਰਤ ਸਰਕਾਰੀ ਪੋਰਟਲ ਖੋਲ੍ਹੋ",
  modalStep4Title: "ਜਮ੍ਹਾਂ ਕਰੋ ਅਤੇ ਟਰੈਕਿੰਗ ਨੰਬਰ ਸੰਭਾਲੋ",
  readStepAloud: "ਇਹ ਕਦਮ ਸੁਣੋ",
  stopStepAudio: "ਆਡੀਓ ਬੰਦ ਕਰੋ",
  documentsTitle: "ਨੱਥੀ ਕਰਨ ਲਈ ਦਸਤਾਵੇਜ਼ ਅਤੇ ਸਬੂਤ",
  docRequiredTag: "ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਗਈ",
  docOptionalTag: "ਜੇ ਉਪਲਬਧ ਹੋਵੇ",
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
  chatAskInSectionBtn: "AI ਗਾਈਡ ਤੋਂ ਪੁੱਛੋ",
};

const OR: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ · ଦାଖଲ ପାଇଁ ପ୍ରସ୍ତୁତ",
  nextStepsHeading: "ସରକାରୀ ପୋର୍ଟାଲରେ ଆପଣଙ୍କ ଅଭିଯୋଗ କିପରି ଦାଖଲ କରିବେ",
  openStepGuideBtn: "ପଦକ୍ଷେପ-ଅନୁସାରେ ଦାଖଲ ଗାଇଡ୍ ଖୋଲନ୍ତୁ",
  modalTitle: "ପଦକ୍ଷେପ-ଅନୁସାରେ ଅଭିଯୋଗ ଦାଖଲ ଗାଇଡ୍",
  modalStepPrefix: "ପଦକ୍ଷେପ",
  modalPrevBtn: "ପୂର୍ବବର୍ତ୍ତୀ",
  modalNextBtn: "ପରବର୍ତ୍ତୀ",
  modalDoneBtn: "ସମ୍ପୂର୍ଣ୍ଣ",
  documentsTitle: "ସଂଲଗ୍ନ କରିବାକୁ ଥିବା ଦସ୍ତାବିଜ୍ ଏବଂ ପ୍ରମାଣ",
  docRequiredTag: "ସୁପାରିଶ",
  docOptionalTag: "ଯଦି ଉପଲବ୍ଧ",
  docsReadyLabel: "ପ୍ରସ୍ତୁତ",
  chatOpenBtn: "ଦାଖଲ ସହାୟତା",
  chatTitle: "ପୋର୍ଟାଲ୍ ଓ ଦାଖଲ ସହାୟକ",
  chatSendBtn: "ପଠାନ୍ତୁ",
  chatSpeakBtn: "କୁହନ୍ତୁ",
  chatAskInSectionBtn: "AI ଗାଇଡ୍‌କୁ ପଚାରନ୍ତୁ",
};

const AS: SubmissionUiStrings = {
  ...EN,
  nextStepsKicker: "পৰৱৰ্তী পদক্ষেপ · দাখিল কৰিবলৈ সাজু",
  nextStepsHeading: "চৰকাৰী পৰ্টেলত আপোনাৰ অভিযোগ কেনেকৈ দাখিল কৰিব",
  openStepGuideBtn: "পৰ্যায়ক্ৰমে দাখিল নিৰ্দেশিকা খোলক",
  modalTitle: "পৰ্যায়ক্ৰমে অভিযোগ দাখিল নিৰ্দেশিকা",
  modalStepPrefix: "পদক্ষেপ",
  modalPrevBtn: "পূৰ্বৱৰ্তী",
  modalNextBtn: "পৰৱৰ্তী",
  modalDoneBtn: "সম্পূৰ্ণ",
  documentsTitle: "সংলগ্ন কৰিবলগীয়া নথি-পত্ৰ আৰু প্ৰমাণ",
  docRequiredTag: "পৰামৰ্শিত",
  docOptionalTag: "যদি উপলব্ধ",
  docsReadyLabel: "সাজু",
  chatOpenBtn: "দাখিল সহায়",
  chatTitle: "পৰ্টেল আৰু দাখিল সহায়ক",
  chatSendBtn: "পঠিয়াওক",
  chatSpeakBtn: "কওক",
  chatAskInSectionBtn: "AI গাইডক সোধক",
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
  readStepAloud: "یہ مرحلہ سنیں",
  stopStepAudio: "آڈیو روکیں",
  documentsTitle: "منسلک کرنے کے لیے ضروری دستاویزات اور ثبوت",
  documentsSubtitle:
    "تیار دستاویزات پر نشان لگائیں۔ زیادہ تر سرکاری پورٹلز 2 MB سے کم JPG/PNG یا PDF فائلیں قبول کرتے ہیں۔",
  docRequiredTag: "تجویز کردہ",
  docOptionalTag: "اگر دستیاب ہو",
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
  chatAskInSectionBtn: "AI گائیڈ سے پوچھیں",
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

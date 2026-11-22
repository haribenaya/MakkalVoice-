export interface InnovationStrings {
  // Mandatory tag
  mandatoryTag: string;
  // 1. Photo & Bill Scanner
  scanPhotoBtn: string;
  scanningPhoto: string;
  scanPhotoHint: string;
  scanSuccessPrefix: string;
  scanErrorGeneric: string;
  // 2. GPS & Map Pinpoint (inside Section 02)
  detectLocationBtn: string;
  detectingLocation: string;
  showMapPinBtn: string;
  hideMapPinBtn: string;
  mapPinHint: string;
  locationDetectedSuccess: string;
  locationPermissionDenied: string;
  locationUnavailable: string;
  coordinatesLabel: string;
  // 3. Portal-Ready Photo Compressor & PDF Bundler
  evidenceToolsTitle: string;
  evidenceToolsSub: string;
  addProofPhotoBtn: string;
  compressingPhoto: string;
  downloadCompressedJpg: string;
  bundleEvidencePdfBtn: string;
  removePhotoBtn: string;
  noPhotosYet: string;
  portalLimitNote: string;
  // 4. Complaint Tracker & Escalation Vault
  navTracker: string;
  trackerTitle: string;
  trackerSub: string;
  trackerEmpty: string;
  saveToTrackerBtn: string;
  savedInTrackerBtn: string;
  trackingIdLabel: string;
  trackingIdPlaceholder: string;
  reminderDateLabel: string;
  statusLabel: string;
  statusDrafted: string;
  statusSubmitted: string;
  statusFollowupDue: string;
  statusResolved: string;
  generateEscalationBtn: string;
  generatingEscalation: string;
  deleteRecordBtn: string;
  overdueReminderBadge: string;
  loadIntoEditorBtn: string;
  // 5. Printable A4 PDF & Family Share
  downloadOfficialPdf: string;
  printOfficialLetter: string;
  shareWhatsApp: string;
  shareEmail: string;
  sharePacketNative: string;
  // 6. PWA Install & Offline Auto-Save
  installAppBtn: string;
  offlineBanner: string;
  autosavedBadge: string;
  iosInstallTitle: string;
  iosInstallStep1: string;
  iosInstallStep2: string;
  iosInstallClose: string;
  // 7. Hands-Free Voice Mode
  handsFreeBtn: string;
  handsFreeTitle: string;
  handsFreeSub: string;
  handsFreeTapSpeak: string;
  handsFreeListening: string;
  handsFreeDoneNext: string;
  handsFreeUseInForm: string;
  handsFreeClose: string;
  handsFreePromptDescribe: string;
  handsFreePromptLocation: string;
  handsFreePromptReady: string;
  // 8. Filing Mode (Complaint / RTI / Escalation)
  filingModeLabel: string;
  modeComplaint: string;
  modeRti: string;
  modeEscalation: string;
  modeRtiHint: string;
  modeEscalationHint: string;
  previousTicketIdLabel: string;
  previousTicketIdPlaceholder: string;
}

const EN: InnovationStrings = {
  mandatoryTag: "Required",
  scanPhotoBtn: "Scan Photo or Bill",
  scanningPhoto: "Reading photo...",
  scanPhotoHint: "Upload a photo of the problem, EB/water bill, or receipt to auto-fill details",
  scanSuccessPrefix: "Details extracted from photo",
  scanErrorGeneric: "Could not read the photo. Please try a clearer image or type directly.",
  detectLocationBtn: "Detect My Current Location",
  detectingLocation: "Detecting GPS...",
  showMapPinBtn: "Pinpoint on Map",
  hideMapPinBtn: "Hide Map",
  mapPinHint: "Tap anywhere on the map or drag the pin to auto-fill your exact street, town, district, state, and pincode.",
  locationDetectedSuccess: "Location detected and address fields updated.",
  locationPermissionDenied: "Location access was denied. You can still pinpoint on the map or select your state and district manually.",
  locationUnavailable: "Could not read GPS location on this device. Please select manually or tap on the map.",
  coordinatesLabel: "GPS Pin",
  evidenceToolsTitle: "Portal-Ready Proof Photo Compressor & PDF Bundler",
  evidenceToolsSub: "Government portals reject large photos. Add proof photos here to auto-compress them under 1 MB or bundle everything into one A4 PDF.",
  addProofPhotoBtn: "Add Proof Photo",
  compressingPhoto: "Compressing...",
  downloadCompressedJpg: "Download JPG",
  bundleEvidencePdfBtn: "Download Letter + Photos PDF",
  removePhotoBtn: "Remove",
  noPhotosYet: "No proof photos added yet. Add photos of the issue, bill, or damaged spot.",
  portalLimitNote: "Auto-compressed under 900 KB for smooth upload on Indian government portals.",
  navTracker: "My Tracker",
  trackerTitle: "My Complaint Tracker & Escalation Reminders",
  trackerSub: "Saved privately on this device. Store your official portal Tracking ID and generate a formal escalation letter if unresolved after 15 days.",
  trackerEmpty: "No saved complaints yet. Once you generate a draft in Step 3, click 'Save to My Tracker' to keep your Tracking ID and follow-up reminder here.",
  saveToTrackerBtn: "Save to My Tracker",
  savedInTrackerBtn: "Saved in Tracker",
  trackingIdLabel: "Official Portal Tracking / Ticket ID",
  trackingIdPlaceholder: "Enter Ticket ID after filing on portal",
  reminderDateLabel: "Follow-up Date",
  statusLabel: "Status",
  statusDrafted: "Draft Ready",
  statusSubmitted: "Submitted on Portal",
  statusFollowupDue: "Follow-up Due",
  statusResolved: "Resolved",
  generateEscalationBtn: "Draft Escalation Letter",
  generatingEscalation: "Drafting escalation...",
  deleteRecordBtn: "Delete",
  overdueReminderBadge: "15-day follow-up due",
  loadIntoEditorBtn: "Open Draft",
  downloadOfficialPdf: "Download A4 PDF",
  printOfficialLetter: "Print Official Letter",
  shareWhatsApp: "Share on WhatsApp",
  shareEmail: "Send by Email",
  sharePacketNative: "Share",
  installAppBtn: "Install App",
  offlineBanner: "You are offline — your complaint draft is safely auto-saved on this device.",
  autosavedBadge: "Auto-saved on device",
  iosInstallTitle: "Install MakkalVoice on iPhone / iPad",
  iosInstallStep1: "Tap the Share icon at the bottom of Safari.",
  iosInstallStep2: "Scroll down and tap 'Add to Home Screen', then tap Add.",
  iosInstallClose: "Got it",
  handsFreeBtn: "Hands-Free Voice Mode",
  handsFreeTitle: "Hands-Free Voice Assistant",
  handsFreeSub: "Speak comfortably step by step — MakkalVoice reads prompts aloud and fills your form for you.",
  handsFreeTapSpeak: "Tap & Speak Now",
  handsFreeListening: "Listening... Tap when finished speaking",
  handsFreeDoneNext: "Continue with Voice",
  handsFreeUseInForm: "Fill Form & Review",
  handsFreeClose: "Close",
  handsFreePromptDescribe: "Please speak clearly about the problem you are facing.",
  handsFreePromptLocation: "Now say your area, street, or city name (or skip if already mentioned).",
  handsFreePromptReady: "Your spoken details are ready. Please verify your Name and Phone Number in the form to generate the official letter.",
  filingModeLabel: "Document Type",
  modeComplaint: "Grievance / Complaint",
  modeRti: "RTI Status Inquiry",
  modeEscalation: "Escalation / Reminder",
  modeRtiHint: "Drafts a formal Right to Information (RTI Act 2005) status application addressed to the Public Information Officer (PIO) and routes to RTI Online.",
  modeEscalationHint: "Drafts a formal Escalation / Follow-up Notice citing your previous portal Tracking ID for higher authorities.",
  previousTicketIdLabel: "Previous Complaint / Ticket ID",
  previousTicketIdPlaceholder: "e.g., TNCMH-2025-123456 or PMOPG/E/2025/...",
};

const PARTIAL_TRANSLATIONS: Record<string, Partial<InnovationStrings>> = {
  Tamil: {
    mandatoryTag: "கட்டாயம்",
    scanPhotoBtn: "புகைப்படம் / பில் ஸ்கேன்",
    scanningPhoto: "புகைப்படத்தை படிக்கிறது...",
    scanPhotoHint: "பிரச்சனை அல்லது மின்சார/குடிநீர் பில் புகைப்படத்தை பதிவேற்றினால் விவரங்கள் தானாக நிரப்பப்படும்",
    scanSuccessPrefix: "புகைப்படத்திலிருந்து விவரங்கள் பெறப்பட்டன",
    detectLocationBtn: "எனது தற்போதைய இடத்தைக் கண்டறி",
    detectingLocation: "இடத்தைக் கண்டறிகிறது...",
    showMapPinBtn: "வரைபடத்தில் குறிக்கவும்",
    hideMapPinBtn: "வரைபடத்தை மறை",
    mapPinHint: "உங்கள் தெரு, ஊர், மாவட்டம், மாநிலம் மற்றும் அஞ்சல் குறியீட்டை தானாக நிரப்ப வரைபடத்தில் தட்டவும் அல்லது பின்னை நகர்த்தவும்.",
    locationDetectedSuccess: "உங்கள் இருப்பிடம் கண்டறியப்பட்டு முகவரி நிரப்பப்பட்டது.",
    locationPermissionDenied: "இருப்பிட அனுமதி மறுக்கப்பட்டது. வரைபடத்தில் தட்டவும் அல்லது கைமுறையாகத் தேர்ந்தெடுக்கவும்.",
    coordinatesLabel: "GPS இடம்",
    evidenceToolsTitle: "புகைப்பட சுருக்கி & PDF இணைப்பான்",
    evidenceToolsSub: "அரசு தளங்களில் பெரிய புகைப்படங்கள் பதிவேற்ற முடியாது. ஆதாரப் புகைப்படங்களை 1 MB-க்குள் சுருக்கி A4 PDF ஆக பதிவிறக்கவும்.",
    addProofPhotoBtn: "ஆதாரப் புகைப்படம் சேர்",
    compressingPhoto: "சுருக்குகிறது...",
    downloadCompressedJpg: "JPG பதிவிறக்கு",
    bundleEvidencePdfBtn: "கடிதம் + புகைப்படங்கள் PDF",
    removePhotoBtn: "நீக்கு",
    noPhotosYet: "ஆதாரப் புகைப்படங்கள் இன்னும் சேர்க்கப்படவில்லை.",
    portalLimitNote: "அரசு இணையதளங்களில் எளிதாக பதிவேற்ற 900 KB-க்குள் சுருக்கப்படும்.",
    navTracker: "என் புகார்கள்",
    trackerTitle: "எனது புகார் கண்காணிப்பு & மேல்முறையீடு",
    trackerSub: "உங்கள் சாதனத்திலேயே பாதுகாப்பாக சேமிக்கப்படும். அரசு தள Ticket ID-ஐ பதிந்து 15 நாட்களுக்குள் தீர்வு இல்லையென்றால் மேல்முறையீட்டு கடிதம் உருவாக்கவும்.",
    trackerEmpty: "சேமித்த புகார்கள் இல்லை. படி 3-இல் 'என் புகார்களில் சேமி' என்பதை கிளிக் செய்யவும்.",
    saveToTrackerBtn: "என் புகார்களில் சேமி",
    savedInTrackerBtn: "சேமிக்கப்பட்டது",
    trackingIdLabel: "அரசு தள Ticket / பதிவு எண்",
    trackingIdPlaceholder: "புகார் பதிந்த பின் கிடைத்த எண்ணை உள்ளிடவும்",
    reminderDateLabel: "நினைவூட்டல் தேதி",
    statusLabel: "நிலை",
    statusDrafted: "வரைவு தயார்",
    statusSubmitted: "பதிவு செய்யப்பட்டது",
    statusFollowupDue: "நினைவூட்டல் தேவை",
    statusResolved: "தீர்வு காணப்பட்டது",
    generateEscalationBtn: "மேல்முறையீட்டு கடிதம்",
    generatingEscalation: "உருவாக்குகிறது...",
    deleteRecordBtn: "நீக்கு",
    overdueReminderBadge: "15 நாள் நினைவூட்டல்",
    loadIntoEditorBtn: "வரைவைத் திற",
    downloadOfficialPdf: "A4 PDF பதிவிறக்கு",
    printOfficialLetter: "அச்சிடு (Print)",
    shareWhatsApp: "WhatsApp பகிர்",
    shareEmail: "மின்னஞ்சல்",
    sharePacketNative: "பகிர்",
    installAppBtn: "செயலி நிறுவு",
    offlineBanner: "இணைய இணைப்பு இல்லை — உங்கள் விவரங்கள் இந்த சாதனத்தில் பாதுகாப்பாக சேமிக்கப்பட்டுள்ளன.",
    autosavedBadge: "சாதனத்தில் சேமிக்கப்பட்டது",
    handsFreeBtn: "முழு குரல் உதவியாளர்",
    handsFreeTitle: "கைபேசாமல் குரல் உதவியாளர்",
    handsFreeSub: "ஒவ்வொரு படியாக பேசுங்கள் — MakkalVoice உங்களுக்கு வாசித்துக் காட்டி படிவத்தை நிரப்பும்.",
    handsFreeTapSpeak: "தட்டிப் பேசுங்கள்",
    handsFreeListening: "கேட்கிறது... முடிந்ததும் தட்டவும்",
    handsFreeDoneNext: "அடுத்த கேள்வி",
    handsFreeUseInForm: "படிவத்தில் நிரப்பு",
    handsFreeClose: "மூடு",
    handsFreePromptDescribe: "உங்களுக்கு உள்ள பிரச்சனையை தெளிவாகச் சொல்லுங்கள்.",
    handsFreePromptLocation: "இப்போது உங்கள் பகுதி, தெரு அல்லது ஊரின் பெயரைச் சொல்லுங்கள்.",
    handsFreePromptReady: "உங்கள் விவரங்கள் பதிவானது. அதிகாரப்பூர்வ கடிதம் தயாரிக்க பெயர் மற்றும் தொலைபேசி எண்ணைச் சரிபார்க்கவும்.",
    filingModeLabel: "ஆவண வகை",
    modeComplaint: "புகார் மனு",
    modeRti: "RTI தகவல் அறியும் மனு",
    modeEscalation: "மேல்முறையீடு / நினைவூட்டல்",
    modeRtiHint: "தகவல் அறியும் உரிமைச் சட்டம் 2005 (RTI) கீழ் பொதுத் தகவல் அலுவலருக்கு (PIO) முறையான மனு உருவாக்கும்.",
    modeEscalationHint: "முந்தைய புகார் பதிவு எண்ணை (Ticket ID) குறிப்பிட்டு உயர் அதிகாரிக்கு நினைவூட்டல் கடிதம் உருவாக்கும்.",
    previousTicketIdLabel: "முந்தைய புகார் / Ticket எண்",
    previousTicketIdPlaceholder: "எ.கா: TNCMH-2025-123456",
  },
  Hindi: {
    mandatoryTag: "अनिवार्य",
    scanPhotoBtn: "फ़ोटो या बिल स्कैन करें",
    scanningPhoto: "फ़ोटो पढ़ा जा रहा है...",
    scanPhotoHint: "समस्या या बिजली/पानी के बिल की फ़ोटो अपलोड करें ताकि विवरण अपने आप भर जाए",
    scanSuccessPrefix: "फ़ोटो से विवरण प्राप्त हुआ",
    detectLocationBtn: "मेरा वर्तमान स्थान पहचानें",
    detectingLocation: "स्थान खोजा जा रहा है...",
    showMapPinBtn: "मानचित्र पर चुनें",
    hideMapPinBtn: "मानचित्र छिपाएं",
    mapPinHint: "अपना गली, शहर, जिला, राज्य और पिनकोड स्वतः भरने के लिए मानचित्र पर टैप करें या पिन खींचें।",
    locationDetectedSuccess: "स्थान पहचाना गया और पता भर दिया गया है।",
    locationPermissionDenied: "लोकेशन की अनुमति नहीं मिली। आप मानचित्र पर टैप कर सकते हैं या मैन्युअल चुन सकते हैं।",
    coordinatesLabel: "GPS पिन",
    evidenceToolsTitle: "पोर्टल-रेडी फ़ोटो कंप्रेसर और PDF बंडलर",
    evidenceToolsSub: "सरकारी पोर्टल बड़ी फ़ोटो स्वीकार नहीं करते। यहाँ प्रमाण फ़ोटो को 1 MB से कम करें या एक A4 PDF बनाएं।",
    addProofPhotoBtn: "प्रमाण फ़ोटो जोड़ें",
    compressingPhoto: "कंप्रेस हो रहा है...",
    downloadCompressedJpg: "JPG डाउनलोड",
    bundleEvidencePdfBtn: "पत्र + फ़ोटो PDF डाउनलोड",
    removePhotoBtn: "हटाएं",
    noPhotosYet: "अभी कोई प्रमाण फ़ोटो नहीं जोड़ी गई है।",
    portalLimitNote: "सरकारी पोर्टल पर आसान अपलोड के लिए 900 KB से कम किया जाएगा।",
    navTracker: "मेरा ट्रैकर",
    trackerTitle: "मेरा शिकायत ट्रैकर और रिमाइंडर",
    trackerSub: "आपके डिवाइस पर निजी रूप से सुरक्षित। सरकारी पोर्टल का ट्रैकिंग नंबर सेव करें और 15 दिन में समाधान न होने पर अनुस्मारक पत्र बनाएं।",
    trackerEmpty: "अभी कोई सहेजी गई शिकायत नहीं है। चरण 3 में 'ट्रैकर में सहेजें' पर क्लिक करें।",
    saveToTrackerBtn: "ट्रैकर में सहेजें",
    savedInTrackerBtn: "ट्रैकर में सहेजा गया",
    trackingIdLabel: "सरकारी पोर्टल ट्रैकिंग / टिकट नंबर",
    trackingIdPlaceholder: "पोर्टल पर दर्ज करने के बाद मिला नंबर लिखें",
    reminderDateLabel: "फ़ॉलो-अप तारीख",
    statusLabel: "स्थिति",
    statusDrafted: "ड्राफ्ट तैयार",
    statusSubmitted: "पोर्टल पर दर्ज",
    statusFollowupDue: "फ़ॉलो-अप बाकी",
    statusResolved: "समाधान हो गया",
    generateEscalationBtn: "अनुस्मारक / अपील पत्र",
    generatingEscalation: "पत्र तैयार हो रहा है...",
    deleteRecordBtn: "हटाएं",
    overdueReminderBadge: "15 दिन फ़ॉलो-अप",
    loadIntoEditorBtn: "ड्राफ्ट खोलें",
    downloadOfficialPdf: "A4 PDF डाउनलोड",
    printOfficialLetter: "प्रिंट करें (Print)",
    shareWhatsApp: "WhatsApp शेयर",
    shareEmail: "ईमेल भेजें",
    sharePacketNative: "शेयर करें",
    installAppBtn: "ऐप इंस्टॉल करें",
    offlineBanner: "आप ऑफ़लाइन हैं — आपका शिकायत ड्राफ्ट इस डिवाइस पर सुरक्षित है।",
    autosavedBadge: "डिवाइस पर ऑटो-सेव",
    handsFreeBtn: "हैंड्स-फ़्री वॉइस मोड",
    handsFreeTitle: "हैंड्स-फ़्री वॉइस सहायक",
    handsFreeSub: "आराम से बोलकर बताएं — MakkalVoice निर्देश पढ़कर सुनाएगा और फ़ॉर्म भरेगा।",
    handsFreeTapSpeak: "टैप करें और बोलें",
    handsFreeListening: "सुन रहा है... समाप्त होने पर टैप करें",
    handsFreeDoneNext: "आगे बढ़ें",
    handsFreeUseInForm: "फ़ॉर्म में भरें",
    handsFreeClose: "बंद करें",
    handsFreePromptDescribe: "कृपया अपनी समस्या स्पष्ट रूप से बोलें।",
    handsFreePromptLocation: "अब अपना इलाका, गली या शहर का नाम बताएं।",
    handsFreePromptReady: "आपका विवरण तैयार है। कृपया फ़ॉर्म में अपना नाम और मोबाइल नंबर जांचें।",
    filingModeLabel: "दस्तावेज़ का प्रकार",
    modeComplaint: "शिकायत पत्र",
    modeRti: "RTI जानकारी आवेदन",
    modeEscalation: "अनुस्मारक / उच्च अपील",
    modeRtiHint: "सूचना का अधिकार अधिनियम 2005 (RTI) के तहत जन सूचना अधिकारी (PIO) को औपचारिक आवेदन तैयार करता है।",
    modeEscalationHint: "पिछले टिकट नंबर का हवाला देते हुए उच्च अधिकारी को अनुस्मारक / अपील पत्र तैयार करता है।",
    previousTicketIdLabel: "पिछला शिकायत / टिकट नंबर",
    previousTicketIdPlaceholder: "उदा. PMOPG/E/2025/...",
  },
  Telugu: {
    mandatoryTag: "తప్పనిసరి",
    scanPhotoBtn: "ఫోటో లేదా బిల్లు స్కాన్",
    scanningPhoto: "ఫోటో చదువుతోంది...",
    detectLocationBtn: "నా ప్రస్తుత స్థానాన్ని గుర్తించు",
    detectingLocation: "స్థానాన్ని గుర్తిస్తోంది...",
    showMapPinBtn: "మ్యాప్‌లో పిన్ చేయండి",
    hideMapPinBtn: "మ్యాప్ దాచు",
    navTracker: "నా ట్రాకర్",
    trackerTitle: "నా ఫిర్యాదు ట్రాకర్ & రిమైండర్లు",
    saveToTrackerBtn: "ట్రాకర్‌లో సేవ్ చేయి",
    savedInTrackerBtn: "సేవ్ చేయబడింది",
    downloadOfficialPdf: "A4 PDF డౌన్‌లోడ్",
    printOfficialLetter: "ప్రింట్ చేయండి",
    shareWhatsApp: "WhatsApp షేర్",
    shareEmail: "ఇమెయిల్",
    installAppBtn: "యాప్ ఇన్‌స్టాల్",
    autosavedBadge: "పరికరంలో సేవ్ అయింది",
    handsFreeBtn: "హ్యాండ్స్-ఫ్రీ వాయిస్",
    filingModeLabel: "పత్రం రకం",
    modeComplaint: "ఫిర్యాదు",
    modeRti: "RTI సమాచారం",
    modeEscalation: "అప్పీల్ / రిమైండర్",
  },
  Kannada: {
    mandatoryTag: "ಕಡ್ಡಾಯ",
    scanPhotoBtn: "ಫೋಟೋ ಅಥವಾ ಬಿಲ್ ಸ್ಕ್ಯಾನ್",
    scanningPhoto: "ಫೋಟೋ ಓದುತ್ತಿದೆ...",
    detectLocationBtn: "ನನ್ನ ಪ್ರಸ್ತುತ ಸ್ಥಳ ಪತ್ತೆಹಚ್ಚಿ",
    detectingLocation: "ಸ್ಥಳ ಹುಡುಕುತ್ತಿದೆ...",
    showMapPinBtn: "ನಕ್ಷೆಯಲ್ಲಿ ಗುರುತಿಸಿ",
    hideMapPinBtn: "ನಕ್ಷೆ ಮರೆಮಾಡಿ",
    navTracker: "ನನ್ನ ಟ್ರ್ಯಾಕರ್",
    trackerTitle: "ನನ್ನ ದೂರು ಟ್ರ್ಯಾಕರ್ & ಜ್ಞಾಪನೆಗಳು",
    saveToTrackerBtn: "ಟ್ರ್ಯಾಕರ್‌ನಲ್ಲಿ ಉಳಿಸಿ",
    savedInTrackerBtn: "ಉಳಿಸಲಾಗಿದೆ",
    downloadOfficialPdf: "A4 PDF ಡೌನ್‌ಲೋಡ್",
    printOfficialLetter: "ಪ್ರಿಂಟ್ ಮಾಡಿ",
    shareWhatsApp: "WhatsApp ಹಂಚಿಕೊಳ್ಳಿ",
    shareEmail: "ಇಮೇಲ್",
    installAppBtn: "ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್",
    autosavedBadge: "ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ",
    handsFreeBtn: "ಹ್ಯಾಂಡ್ಸ್-ಫ್ರೀ ವಾಯ್ಸ್",
    filingModeLabel: "ದಾಖಲೆ ವಿಧ",
    modeComplaint: "ದೂರು ಪತ್ರ",
    modeRti: "RTI ಮಾಹಿತಿ",
    modeEscalation: "ಮೇಲ್ಮನವಿ / ಜ್ಞಾಪನೆ",
  },
  Malayalam: {
    mandatoryTag: "നിർബന്ധം",
    scanPhotoBtn: "ഫോട്ടോ / ബിൽ സ്കാൻ",
    scanningPhoto: "ഫോട്ടോ വായിക്കുന്നു...",
    detectLocationBtn: "എന്റെ ഇപ്പോഴത്തെ സ്ഥലം കണ്ടെത്തുക",
    detectingLocation: "സ്ഥലം കണ്ടെത്തുന്നു...",
    showMapPinBtn: "മാപ്പിൽ അടയാളപ്പെടുത്തുക",
    hideMapPinBtn: "മാപ്പ് മറയ്ക്കുക",
    navTracker: "എന്റെ ട്രാക്കർ",
    trackerTitle: "എന്റെ പരാതി ട്രാക്കർ",
    saveToTrackerBtn: "ട്രാക്കറിൽ സേവ് ചെയ്യുക",
    savedInTrackerBtn: "സേവ് ചെയ്തു",
    downloadOfficialPdf: "A4 PDF ഡൗൺലോഡ്",
    printOfficialLetter: "പ്രിന്റ് ചെയ്യുക",
    shareWhatsApp: "WhatsApp പങ്കിടുക",
    shareEmail: "ഇമെയിൽ",
    installAppBtn: "ആപ്പ് ഇൻസ്റ്റാൾ",
    autosavedBadge: "ഉപകരണത്തിൽ സേവ് ചെയ്തു",
    handsFreeBtn: "ഹാൻഡ്സ്-ഫ്രീ വോയ്സ്",
    filingModeLabel: "രേഖയുടെ തരം",
    modeComplaint: "പരാതി",
    modeRti: "RTI അപേക്ഷ",
    modeEscalation: "ഓർമ്മപ്പെടുത്തൽ / അപ്പീൽ",
  },
  Bengali: {
    mandatoryTag: "আবশ্যিক",
    scanPhotoBtn: "ছবি বা বিল স্ক্যান করুন",
    scanningPhoto: "ছবি পড়া হচ্ছে...",
    detectLocationBtn: "আমার বর্তমান অবস্থান খুঁজুন",
    detectingLocation: "অবস্থান খোঁজা হচ্ছে...",
    showMapPinBtn: "মানচিত্রে চিহ্নিত করুন",
    hideMapPinBtn: "মানচিত্র লুকান",
    navTracker: "আমার ট্র্যাকার",
    trackerTitle: "আমার অভিযোগ ট্র্যাকার ও রিমাইন্ডার",
    saveToTrackerBtn: "ট্র্যাকারে সেভ করুন",
    savedInTrackerBtn: "সেভ করা হয়েছে",
    downloadOfficialPdf: "A4 PDF ডাউনলোড",
    printOfficialLetter: "প্রিন্ট করুন",
    shareWhatsApp: "WhatsApp শেয়ার",
    shareEmail: "ইমেল",
    installAppBtn: "অ্যাপ ইনস্টল",
    autosavedBadge: "ডিভাইসে সংরক্ষিত",
    handsFreeBtn: "হ্যান্ডস-ফ্রি ভয়েস",
    filingModeLabel: "নথির ধরন",
    modeComplaint: "অভিযোগ পত্র",
    modeRti: "RTI আবেদন",
    modeEscalation: "আপিল / রিমাইন্ডার",
  },
  Marathi: {
    mandatoryTag: "आवश्यक",
    scanPhotoBtn: "फोटो किंवा बिल स्कॅन करा",
    scanningPhoto: "फोटो वाचत आहे...",
    detectLocationBtn: "माझे सध्याचे स्थान शोधा",
    detectingLocation: "स्थान शोधत आहे...",
    showMapPinBtn: "नकाशावर निवडा",
    hideMapPinBtn: "नकाशा लपवा",
    navTracker: "माझा ट्रॅकर",
    trackerTitle: "माझा तक्रार ट्रॅकर आणि स्मरणपत्रे",
    saveToTrackerBtn: "ट्रॅकरमध्ये जतन करा",
    savedInTrackerBtn: "जतन केले",
    downloadOfficialPdf: "A4 PDF डाउनलोड",
    printOfficialLetter: "प्रिंट करा",
    shareWhatsApp: "WhatsApp शेअर",
    shareEmail: "ईमेल",
    installAppBtn: "अ‍ॅप इंस्टॉल",
    autosavedBadge: "डिव्हाइसवर जतन",
    handsFreeBtn: "हँड्स-फ्री व्हॉइस",
    filingModeLabel: "दस्तऐवजाचा प्रकार",
    modeComplaint: "तक्रार अर्ज",
    modeRti: "RTI माहिती अर्ज",
    modeEscalation: "अपील / स्मरणपत्र",
  },
  Gujarati: {
    mandatoryTag: "ફરજિયાત",
    scanPhotoBtn: "ફોટો અથવા બિલ સ્કેન કરો",
    scanningPhoto: "ફોટો વાંચી રહ્યું છે...",
    detectLocationBtn: "મારું વર્તમાન સ્થાન શોધો",
    detectingLocation: "સ્થાન શોધી રહ્યું છે...",
    showMapPinBtn: "નકશા પર પસંદ કરો",
    hideMapPinBtn: "નકશો છુપાવો",
    navTracker: "મારો ટ્રેકર",
    trackerTitle: "મારો ફરિયાદ ટ્રેકર",
    saveToTrackerBtn: "ટ્રેકરમાં સાચવો",
    savedInTrackerBtn: "સાચવ્યું",
    downloadOfficialPdf: "A4 PDF ડાઉનલોડ",
    printOfficialLetter: "પ્રિન્ટ કરો",
    shareWhatsApp: "WhatsApp શેર",
    shareEmail: "ઇમેઇલ",
    installAppBtn: "એપ ઇન્સ્ટોલ",
    autosavedBadge: "ઉપકરણમાં સાચવેલ",
    handsFreeBtn: "હેન્ડ્સ-ફ્રી વૉઇસ",
    filingModeLabel: "દસ્તાવેજ પ્રકાર",
    modeComplaint: "ફરિયાદ અરજી",
    modeRti: "RTI અરજી",
    modeEscalation: "અપીલ / રીમાઇન્ડર",
  },
  Punjabi: {
    mandatoryTag: "ਲਾਜ਼ਮੀ",
    scanPhotoBtn: "ਫੋਟੋ ਜਾਂ ਬਿੱਲ ਸਕੈਨ ਕਰੋ",
    scanningPhoto: "ਫੋਟੋ ਪੜ੍ਹੀ ਜਾ ਰਹੀ ਹੈ...",
    detectLocationBtn: "ਮੇਰਾ ਮੌਜੂਦਾ ਟਿਕਾਣਾ ਲੱਭੋ",
    detectingLocation: "ਟਿਕਾਣਾ ਲੱਭ ਰਿਹਾ ਹੈ...",
    showMapPinBtn: "ਨਕਸ਼ੇ 'ਤੇ ਚੁਣੋ",
    hideMapPinBtn: "ਨਕਸ਼ਾ ਲੁਕਾਓ",
    navTracker: "ਮੇਰਾ ਟਰੈਕਰ",
    trackerTitle: "ਮੇਰਾ ਸ਼ਿਕਾਇਤ ਟਰੈਕਰ",
    saveToTrackerBtn: "ਟਰੈਕਰ ਵਿੱਚ ਸੇਵ ਕਰੋ",
    savedInTrackerBtn: "ਸੇਵ ਕੀਤਾ",
    downloadOfficialPdf: "A4 PDF ਡਾਊਨਲੋਡ",
    printOfficialLetter: "ਪ੍ਰਿੰਟ ਕਰੋ",
    shareWhatsApp: "WhatsApp ਸ਼ੇਅਰ",
    shareEmail: "ਈਮੇਲ",
    installAppBtn: "ਐਪ ਇੰਸਟਾਲ",
    autosavedBadge: "ਡਿਵਾਈਸ ਤੇ ਸੇਵ",
    handsFreeBtn: "ਹੈਂਡਸ-ਫ੍ਰੀ ਵੌਇਸ",
    filingModeLabel: "ਦਸਤਾਵੇਜ਼ ਦੀ ਕਿਸਮ",
    modeComplaint: "ਸ਼ਿਕਾਇਤ",
    modeRti: "RTI ਅਰਜ਼ੀ",
    modeEscalation: "ਅਪੀਲ / ਰੀਮਾਈਂਡਰ",
  },
  Odia: {
    mandatoryTag: "ବାଧ୍ୟତାମୂଳକ",
    scanPhotoBtn: "ଫଟୋ କିମ୍ବା ବିଲ୍ ସ୍କାନ୍",
    detectLocationBtn: "ମୋର ବର୍ତ୍ତମାନ ସ୍ଥାନ ଚିହ୍ନଟ କରନ୍ତୁ",
    showMapPinBtn: "ମାନଚିତ୍ରରେ ଚୟନ କରନ୍ତୁ",
    navTracker: "ମୋର ଟ୍ରାକର୍",
    saveToTrackerBtn: "ଟ୍ରାକରରେ ସେଭ୍ କରନ୍ତୁ",
    downloadOfficialPdf: "A4 PDF ଡାଉନଲୋଡ୍",
    printOfficialLetter: "ପ୍ରିଣ୍ଟ କରନ୍ତୁ",
    shareWhatsApp: "WhatsApp ସେୟାର",
    installAppBtn: "ଆପ୍ ଇନଷ୍ଟଲ୍",
    handsFreeBtn: "ହ୍ୟାଣ୍ଡସ୍-ଫ୍ରି ଭଏସ୍",
    filingModeLabel: "ଦଲିଲ୍ ପ୍ରକାର",
    modeComplaint: "ଅଭିଯୋଗ",
    modeRti: "RTI ଆବେଦନ",
    modeEscalation: "ଅପିଲ୍ / ସ୍ମାରକ",
  },
  Assamese: {
    mandatoryTag: "বাধ্যতামূলক",
    scanPhotoBtn: "ফটো বা বিল স্কেন কৰক",
    detectLocationBtn: "মোৰ বৰ্তমান অৱস্থান চিনাক্ত কৰক",
    showMapPinBtn: "মেপত বাছনি কৰক",
    navTracker: "মোৰ ট্ৰেকাৰ",
    saveToTrackerBtn: "ট্ৰেকাৰত চেভ কৰক",
    downloadOfficialPdf: "A4 PDF ডাউনলোড",
    printOfficialLetter: "প্ৰিণ্ট কৰক",
    shareWhatsApp: "WhatsApp শ্বেয়াৰ",
    installAppBtn: "এপ্ ইনষ্টল",
    handsFreeBtn: "হেণ্ডছ-ফ্ৰী ভইচ",
    filingModeLabel: "নথিৰ প্ৰকাৰ",
    modeComplaint: "অভিযোগ",
    modeRti: "RTI আবেদন",
    modeEscalation: "আপীল / স্মাৰক",
  },
  Urdu: {
    mandatoryTag: "لازمی",
    scanPhotoBtn: "تصویر یا بل اسکین کریں",
    scanningPhoto: "تصویر پڑھی جا رہی ہے...",
    detectLocationBtn: "میرا موجودہ مقام معلوم کریں",
    detectingLocation: "مقام تلاش کیا جا رہا ہے...",
    showMapPinBtn: "نقشے پر منتخب کریں",
    hideMapPinBtn: "نقشہ چھپائیں",
    navTracker: "میرا ٹریکر",
    trackerTitle: "میری شکایات کا ٹریکر",
    saveToTrackerBtn: "ٹریکر میں محفوظ کریں",
    savedInTrackerBtn: "محفوظ ہو گیا",
    downloadOfficialPdf: "A4 PDF ڈاؤن لوڈ",
    printOfficialLetter: "پرنٹ کریں",
    shareWhatsApp: "واٹس ایپ شیئر",
    shareEmail: "ای میل",
    installAppBtn: "ایپ انسٹال کریں",
    autosavedBadge: "ڈیوائس پر محفوظ",
    handsFreeBtn: "ہینڈز فری وائس",
    filingModeLabel: "دستاویز کی قسم",
    modeComplaint: "شکایت نامہ",
    modeRti: "RTI درخواست",
    modeEscalation: "اپیل / یاددہانی",
  },
};

export function getInnovationStrings(language: string): InnovationStrings {
  const partial = PARTIAL_TRANSLATIONS[language];
  if (!partial) return EN;
  return { ...EN, ...partial };
}

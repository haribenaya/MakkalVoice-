export interface DirectSubmissionStrings {
  cardKicker: string;
  cardTitle: string;
  cardSubtitle: string;
  cardUnavailableSubtitle: string;
  availableEmailLabel: string;
  availableWhatsAppLabel: string;
  availableStatusTag: string;
  notAvailableStatusTag: string;
  notAvailableChannelNote: string;
  askPermissionEmailBtn: string;
  askPermissionWhatsAppBtn: string;
  portalStillAvailableNote: string;
  shareFormalPdfBtn: string;
  shareFormalPdfDone: string;
  modalEmailTitle: string;
  modalWhatsAppTitle: string;
  modalSubtitle: string;
  recipientLabel: string;
  subjectFieldLabel: string;
  messageFieldLabel: string;
  permissionCheckboxLabel: string;
  permissionRequiredHint: string;
  openGmailBtn: string;
  openMailAppBtn: string;
  openWhatsAppBtn: string;
  copyMessageBtn: string;
  copiedBtn: string;
  saveToTrackerHint: string;
  cancelUsePortalBtn: string;
  verifyRecipientTip: string;
}

const ENGLISH: DirectSubmissionStrings = {
  cardKicker: "Direct Department Submission Options",
  cardTitle: "Submit directly via Official Email or Official WhatsApp",
  cardSubtitle:
    "Direct submission is available for this department. With your permission, we prepare the complete complaint addressed directly to their official Email / WhatsApp so you can verify and tap Send.",
  cardUnavailableSubtitle:
    "Direct Email and Official WhatsApp submission are not available for this portal. Please use the verified Official Portal button right below to file your complaint.",
  availableEmailLabel: "Official Email",
  availableWhatsAppLabel: "Official WhatsApp",
  availableStatusTag: "Available",
  notAvailableStatusTag: "Not available for this portal",
  notAvailableChannelNote: "Use the Official Portal website below",
  askPermissionEmailBtn: "Review & Submit via Official Email",
  askPermissionWhatsAppBtn: "Review & Submit via Official WhatsApp",
  portalStillAvailableNote:
    "You can also submit directly on the verified Official Portal website below at any time.",
  shareFormalPdfBtn: "Share Complaint Paper (PDF)",
  shareFormalPdfDone: "Paper PDF ready to share",
  modalEmailTitle: "Verify & Confirm Official Email Submission",
  modalWhatsAppTitle: "Verify & Confirm Official WhatsApp Submission",
  modalSubtitle:
    "Please verify the official recipient, subject, and complaint letter below. Nothing is sent automatically — your app will open addressed to this department so you can review and tap Send.",
  recipientLabel: "Official Department Recipient (To)",
  subjectFieldLabel: "Email Subject",
  messageFieldLabel: "Complete Prepared Complaint",
  permissionCheckboxLabel:
    "I have verified my complaint details and give permission to open my Email / WhatsApp app addressed to this official department so I can tap Send.",
  permissionRequiredHint: "Please tick the permission box above to continue.",
  openGmailBtn: "Open Gmail & Tap Send",
  openMailAppBtn: "Open Default Email App",
  openWhatsAppBtn: "Open Official WhatsApp & Tap Send",
  copyMessageBtn: "Copy Ready Text",
  copiedBtn: "Copied",
  saveToTrackerHint: "Also save this complaint to My Saved Complaints",
  cancelUsePortalBtn: "No thanks, I will use the Official Portal",
  verifyRecipientTip:
    "Tip: After sending, save any reply or complaint ticket ID in Saved Complaints so you can track it easily.",
};

const BY_LANGUAGE: Record<string, Partial<DirectSubmissionStrings>> = {
  Tamil: {
    cardKicker: "நேரடி துறை சமர்ப்பிப்பு வசதிகள்",
    cardTitle: "அதிகாரப்பூர்வ மின்னஞ்சல் அல்லது வாட்ஸ்அப் வழியாக நேரடியாக சமர்ப்பிக்கவும்",
    cardSubtitle:
      "இந்த துறைக்கு நேரடி சமர்ப்பிப்பு வசதி உள்ளது. உங்கள் அனுமதியுடன் அதிகாரப்பூர்வ மின்னஞ்சல் / வாட்ஸ்அப் முகவரிக்கு முழு புகாரையும் தயாராக உருவாக்குவோம் — சரிபார்த்து அனுப்பு (Send) தட்டினால் போதும்.",
    cardUnavailableSubtitle:
      "இந்த போர்டலுக்கு நேரடி மின்னஞ்சல் மற்றும் அதிகாரப்பூர்வ வாட்ஸ்அப் சமர்ப்பிப்பு வசதி இல்லை. தயவுசெய்து கீழே உள்ள அதிகாரப்பூர்வ போர்டல் வழியாக புகாரைச் சமர்ப்பிக்கவும்.",
    availableEmailLabel: "அதிகாரப்பூர்வ மின்னஞ்சல்",
    availableWhatsAppLabel: "அதிகாரப்பூர்வ வாட்ஸ்அப்",
    availableStatusTag: "உள்ளது",
    notAvailableStatusTag: "இந்த போர்டலுக்கு கிடைக்கவில்லை",
    notAvailableChannelNote: "கீழே உள்ள அதிகாரப்பூர்வ போர்டலைப் பயன்படுத்தவும்",
    askPermissionEmailBtn: "அதிகாரப்பூர்வ மின்னஞ்சலில் சரிபார்த்து அனுப்பவும்",
    askPermissionWhatsAppBtn: "அதிகாரப்பூர்வ வாட்ஸ்அப்பில் சரிபார்த்து அனுப்பவும்",
    portalStillAvailableNote:
      "எப்போது வேண்டுமானாலும் கீழே உள்ள அதிகாரப்பூர்வ இணையதளப் போர்டலிலும் சமர்ப்பிக்கலாம்.",
    shareFormalPdfBtn: "புகார் கடிதத்தை பகிர் (PDF)",
    shareFormalPdfDone: "PDF கடிதம் பகிர தயார்",
    modalEmailTitle: "அதிகாரப்பூர்வ மின்னஞ்சலை சரிபார்த்து அனுமதிக்கவும்",
    modalWhatsAppTitle: "அதிகாரப்பூர்வ வாட்ஸ்அப் புகாரை சரிபார்த்து அனுமதிக்கவும்",
    modalSubtitle:
      "அதிகாரப்பூர்வ பெறுநர், தலைப்பு மற்றும் புகார் விவரங்களை கீழே சரிபார்க்கவும். தானாக எதுவும் அனுப்பப்படாது — இந்த துறைக்கு நேரடியாக அனுப்ப தயாராக திறக்கும், நீங்கள் அனுப்பு (Send) தட்டினால் போதும்.",
    recipientLabel: "அதிகாரப்பூர்வ துறை பெறுநர் (To)",
    subjectFieldLabel: "மின்னஞ்சல் தலைப்பு",
    messageFieldLabel: "தயாராக உள்ள முழு புகார்",
    permissionCheckboxLabel:
      "எனது புகார் விவரங்களை சரிபார்த்துவிட்டேன். இந்த அதிகாரப்பூர்வ துறைக்கு அனுப்புவதற்காக எனது மின்னஞ்சல் / வாட்ஸ்அப் செயலியைத் திறக்க அனுமதி அளிக்கிறேன்.",
    permissionRequiredHint: "தொடர மேலே உள்ள அனுமதி பெட்டியைத் தேர்ந்தெடுக்கவும்.",
    openGmailBtn: "Gmail-இல் திறந்து அனுப்பவும்",
    openMailAppBtn: "மின்னஞ்சல் செயலியைத் திற",
    openWhatsAppBtn: "அதிகாரப்பூர்வ வாட்ஸ்அப்பில் திறந்து அனுப்பவும்",
    copyMessageBtn: "உரையை நகலெடு",
    copiedBtn: "நகலெடுக்கப்பட்டது",
    saveToTrackerHint: "இதை 'சேமித்த புகார்கள்' பட்டியலிலும் சேமிக்கவும்",
    cancelUsePortalBtn: "வேண்டாம், அதிகாரப்பூர்வ போர்டலைப் பயன்படுத்துகிறேன்",
    verifyRecipientTip:
      "குறிப்பு: அனுப்பிய பிறகு கிடைக்கும் புகார் எண் அல்லது பதிலை 'சேமித்த புகார்கள்' பகுதியில் சேமித்து எளிதாக கண்காணிக்கலாம்.",
  },
  Hindi: {
    cardKicker: "सीधे विभाग में सबमिशन के विकल्प",
    cardTitle: "आधिकारिक ईमेल या आधिकारिक व्हाट्सएप से सीधे भेजें",
    cardSubtitle:
      "इस विभाग के लिए सीधा सबमिशन उपलब्ध है। आपकी अनुमति से हम सीधे आधिकारिक ईमेल / व्हाट्सएप के लिए पूरा संदेश तैयार करेंगे — बस जाँच करें और Send दबाएँ।",
    cardUnavailableSubtitle:
      "इस पोर्टल के लिए सीधा ईमेल या आधिकारिक व्हाट्सएप सबमिशन उपलब्ध नहीं है। कृपया नीचे दिए गए आधिकारिक पोर्टल बटन से शिकायत दर्ज करें।",
    availableEmailLabel: "आधिकारिक ईमेल",
    availableWhatsAppLabel: "आधिकारिक व्हाट्सएप",
    availableStatusTag: "उपलब्ध",
    notAvailableStatusTag: "इस पोर्टल के लिए उपलब्ध नहीं",
    notAvailableChannelNote: "नीचे आधिकारिक पोर्टल वेबसाइट का उपयोग करें",
    askPermissionEmailBtn: "आधिकारिक ईमेल जाँचें और भेजें",
    askPermissionWhatsAppBtn: "आधिकारिक व्हाट्सएप जाँचें और भेजें",
    portalStillAvailableNote:
      "आप नीचे दी गई आधिकारिक पोर्टल वेबसाइट पर भी कभी भी शिकायत दर्ज कर सकते हैं।",
    shareFormalPdfBtn: "शिकायत पत्र साझा करें (PDF)",
    shareFormalPdfDone: "PDF पत्र तैयार है",
    modalEmailTitle: "आधिकारिक ईमेल की पुष्टि और अनुमति दें",
    modalWhatsAppTitle: "आधिकारिक व्हाट्सएप शिकायत की पुष्टि और अनुमति दें",
    modalSubtitle:
      "कृपया नीचे आधिकारिक प्राप्तकर्ता, विषय और पूरा पत्र जाँच लें। कुछ भी अपने आप नहीं भेजा जाता — आपका ऐप तैयार खुलेगा, आपको बस Send दबाना है।",
    recipientLabel: "आधिकारिक विभाग प्राप्तकर्ता (To)",
    subjectFieldLabel: "ईमेल विषय",
    messageFieldLabel: "तैयार पूरा शिकायत पत्र",
    permissionCheckboxLabel:
      "मैंने अपनी शिकायत के विवरण जाँच लिए हैं और इस आधिकारिक विभाग को भेजने के लिए अपना ईमेल / व्हाट्सएप ऐप खोलने की अनुमति देता/देती हूँ।",
    permissionRequiredHint: "आगे बढ़ने के लिए ऊपर अनुमति बॉक्स पर टिक करें।",
    openGmailBtn: "Gmail खोलें और Send दबाएँ",
    openMailAppBtn: "डिफ़ॉल्ट ईमेल ऐप खोलें",
    openWhatsAppBtn: "आधिकारिक व्हाट्सएप खोलें और Send दबाएँ",
    copyMessageBtn: "संदेश कॉपी करें",
    copiedBtn: "कॉपी हो गया",
    saveToTrackerHint: "इसे 'मेरी सहेजी गई शिकायतें' में भी सहेजें",
    cancelUsePortalBtn: "नहीं, मैं आधिकारिक पोर्टल का उपयोग करूँगा/करूँगी",
    verifyRecipientTip:
      "सुझाव: भेजने के बाद मिलने वाला टिकट नंबर 'सहेजी गई शिकायतें' में सेव कर लें ताकि स्टेटस ट्रैक कर सकें।",
  },
  Telugu: {
    cardKicker: "నేరుగా శాఖకు పంపే ఎంపికలు",
    cardTitle: "అధికారిక ఇమెయిల్ లేదా అధికారిక వాట్సాప్ ద్వారా పంపండి",
    cardUnavailableSubtitle:
      "ఈ పోర్టల్‌కు నేరుగా ఇమెయిల్ మరియు అధికారిక వాట్సాప్ అందుబాటులో లేవు. దయచేసి క్రింది అధికారిక పోర్టల్ ద్వారా ఫిర్యాదు చేయండి.",
    availableEmailLabel: "అధికారిక ఇమెయిల్",
    availableWhatsAppLabel: "అధికారిక వాట్సాప్",
    availableStatusTag: "అందుబాటులో ఉంది",
    notAvailableStatusTag: "ఈ పోర్టల్‌కు అందుబాటులో లేదు",
    askPermissionEmailBtn: "అధికారిక ఇమెయిల్ తనిఖీ చేసి పంపండి",
    askPermissionWhatsAppBtn: "అధికారిక వాట్సాప్ తనిఖీ చేసి పంపండి",
    shareFormalPdfBtn: "ఫిర్యాదు పత్రాన్ని షేర్ చేయండి (PDF)",
  },
  Kannada: {
    cardKicker: "ನೇರ ಇಲಾಖೆ ಸಲ್ಲಿಕೆ ಆಯ್ಕೆಗಳು",
    cardTitle: "ಅಧಿಕೃತ ಇಮೇಲ್ ಅಥವಾ ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಕಳುಹಿಸಿ",
    cardUnavailableSubtitle:
      "ಈ ಪೋರ್ಟಲ್‌ಗೆ ನೇರ ಇಮೇಲ್ ಮತ್ತು ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಮೂಲಕ ದೂರು ಸಲ್ಲಿಸಿ.",
    availableEmailLabel: "ಅಧಿಕೃತ ಇಮೇಲ್",
    availableWhatsAppLabel: "ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್",
    availableStatusTag: "ಲಭ್ಯವಿದೆ",
    notAvailableStatusTag: "ಈ ಪೋರ್ಟಲ್‌ಗೆ ಲಭ್ಯವಿಲ್ಲ",
    askPermissionEmailBtn: "ಅಧಿಕೃತ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ ಕಳುಹಿಸಿ",
    askPermissionWhatsAppBtn: "ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್ ಪರಿಶೀಲಿಸಿ ಕಳುಹಿಸಿ",
    shareFormalPdfBtn: "ದೂರು ಪತ್ರ ಹಂಚಿಕೊಳ್ಳಿ (PDF)",
  },
  Malayalam: {
    cardKicker: "നേരിട്ട് വകുപ്പിലേക്ക് അയക്കാനുള്ള സൗകര്യങ്ങൾ",
    cardTitle: "ഔദ്യോഗിക ഇമെയിൽ അല്ലെങ്കിൽ ഔദ്യോഗിക വാട്സാപ്പ് വഴി അയക്കുക",
    cardUnavailableSubtitle:
      "ഈ പോർട്ടലിന് നേരിട്ടുള്ള ഇമെയിൽ / ഔദ്യോഗിക വാട്സാപ്പ് സൗകര്യം ലഭ്യമല്ല. താഴെയുള്ള ഔദ്യോഗിക പോർട്ടൽ വഴി പരാതി സമർപ്പിക്കുക.",
    availableEmailLabel: "ഔദ്യോഗിക ഇമെയിൽ",
    availableWhatsAppLabel: "ഔദ്യോഗിക വാട്സാപ്പ്",
    availableStatusTag: "ലഭ്യമാണ്",
    notAvailableStatusTag: "ഈ പോർട്ടലിന് ലഭ്യമല്ല",
    askPermissionEmailBtn: "ഔദ്യോഗിക ഇമെയിൽ പരിശോധിച്ച് അയക്കുക",
    askPermissionWhatsAppBtn: "ഔദ്യോഗിക വാട്സാപ്പ് പരിശോധിച്ച് അയക്കുക",
    shareFormalPdfBtn: "പരാതി പത്രം പങ്കിടുക (PDF)",
  },
  Bengali: {
    cardKicker: "সরাসরি দপ্তরে জমা দেওয়ার বিকল্প",
    availableEmailLabel: "অফিশিয়াল ইমেইল",
    availableWhatsAppLabel: "অফিশিয়াল হোয়াটসঅ্যাপ",
    availableStatusTag: "উপলব্ধ",
    notAvailableStatusTag: "এই পোর্টালের জন্য উপলব্ধ নয়",
    shareFormalPdfBtn: "অভিযোগ পত্র শেয়ার করুন (PDF)",
  },
  Marathi: {
    cardKicker: "थेट विभागात सादर करण्याचे पर्याय",
    availableEmailLabel: "अधिकृत ईमेल",
    availableWhatsAppLabel: "अधिकृत व्हॉट्सअॅप",
    availableStatusTag: "उपलब्ध",
    notAvailableStatusTag: "या पोर्टलसाठी उपलब्ध नाही",
    shareFormalPdfBtn: "तक्रार पत्र शेअर करा (PDF)",
  },
  Gujarati: {
    cardKicker: "સીધા વિભાગમાં સબમિટ કરવાના વિકલ્પો",
    availableEmailLabel: "સત્તાવાર ઈમેલ",
    availableWhatsAppLabel: "સત્તાવાર વોટ્સએપ",
    availableStatusTag: "ઉપલબ્ધ",
    notAvailableStatusTag: "આ પોર્ટલ માટે ઉપલબ્ધ નથી",
    shareFormalPdfBtn: "ફરિયાદ પત્ર શેર કરો (PDF)",
  },
};

export function getDirectSubmissionStrings(language: string): DirectSubmissionStrings {
  const override = BY_LANGUAGE[language];
  return override ? { ...ENGLISH, ...override } : ENGLISH;
}

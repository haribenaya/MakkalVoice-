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
  modalCloseLabel: string;
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
  modalCloseLabel: "Close verification dialog",
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

const BY_LANGUAGE: Record<string, DirectSubmissionStrings> = {
  English: ENGLISH,
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
    modalCloseLabel: "சரிபார்ப்பு சாளரத்தை மூடு",
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
    saveToTrackerHint: "இதை 'என் புகார்கள்' பட்டியலிலும் சேமிக்கவும்",
    cancelUsePortalBtn: "வேண்டாம், அதிகாரப்பூர்வ போர்டலைப் பயன்படுத்துகிறேன்",
    verifyRecipientTip:
      "குறிப்பு: அனுப்பிய பிறகு கிடைக்கும் புகார் எண் அல்லது பதிலை 'என் புகார்கள்' பகுதியில் சேமித்து எளிதாக கண்காணிக்கலாம்.",
  },
  Hindi: {
    cardKicker: "सीधे विभाग में सबमिशन के विकल्प",
    cardTitle: "आधिकारिक ईमेल या आधिकारिक व्हाट्सएप से सीधे भेजें",
    cardSubtitle:
      "इस विभाग के लिए सीधा सबमिशन उपलब्ध है। आपकी अनुमति से हम सीधे आधिकारिक ईमेल / व्हाट्सएप के लिए पूरा संदेश तैयार करेंगे — बस जाँच करें और भेजें (Send) दबाएँ।",
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
    shareFormalPdfDone: "PDF पत्र साझा करने के लिए तैयार",
    modalEmailTitle: "आधिकारिक ईमेल की पुष्टि और अनुमति दें",
    modalWhatsAppTitle: "आधिकारिक व्हाट्सएप शिकायत की पुष्टि और अनुमति दें",
    modalSubtitle:
      "कृपया नीचे आधिकारिक प्राप्तकर्ता, विषय और पूरा पत्र जाँच लें। कुछ भी अपने आप नहीं भेजा जाता — आपका ऐप तैयार खुलेगा, आपको बस भेजें (Send) दबाना है।",
    modalCloseLabel: "पुष्टि विंडो बंद करें",
    recipientLabel: "आधिकारिक विभाग प्राप्तकर्ता (To)",
    subjectFieldLabel: "ईमेल विषय",
    messageFieldLabel: "तैयार पूरा शिकायत पत्र",
    permissionCheckboxLabel:
      "मैंने अपनी शिकायत के विवरण जाँच लिए हैं और इस आधिकारिक विभाग को भेजने के लिए अपना ईमेल / व्हाट्सएप ऐप खोलने की अनुमति देता/देती हूँ।",
    permissionRequiredHint: "आगे बढ़ने के लिए ऊपर अनुमति बॉक्स पर टिक करें।",
    openGmailBtn: "Gmail खोलें और भेजें",
    openMailAppBtn: "डिफ़ॉल्ट ईमेल ऐप खोलें",
    openWhatsAppBtn: "आधिकारिक व्हाट्सएप खोलें और भेजें",
    copyMessageBtn: "संदेश कॉपी करें",
    copiedBtn: "कॉपी हो गया",
    saveToTrackerHint: "इसे 'मेरी शिकायतें' में भी सहेजें",
    cancelUsePortalBtn: "नहीं, मैं आधिकारिक पोर्टल का उपयोग करूँगा/करूँगी",
    verifyRecipientTip:
      "सुझाव: भेजने के बाद मिलने वाला टिकट नंबर 'मेरी शिकायतें' में सहेज लें ताकि स्थिति ट्रैक कर सकें।",
  },
  Telugu: {
    cardKicker: "నేరుగా శాఖకు పంపే ఎంపికలు",
    cardTitle: "అధికారిక ఇమెయిల్ లేదా అధికారిక వాట్సాప్ ద్వారా నేరుగా పంపండి",
    cardSubtitle:
      "ఈ శాఖకు నేరుగా పంపే సదుపాయం ఉంది. మీ అనుమతితో అధికారిక ఇమెయిల్ / వాట్సాప్‌కు పూర్తి ఫిర్యాదును సిద్ధం చేస్తాము — మీరు సరిచూసి Send నొక్కితే చాలు.",
    cardUnavailableSubtitle:
      "ఈ పోర్టల్‌కు నేరుగా ఇమెయిల్ మరియు అధికారిక వాట్సాప్ అందుబాటులో లేవు. దయచేసి క్రింది అధికారిక పోర్టల్ బటన్ ద్వారా ఫిర్యాదు చేయండి.",
    availableEmailLabel: "అధికారిక ఇమెయిల్",
    availableWhatsAppLabel: "అధికారిక వాట్సాప్",
    availableStatusTag: "అందుబాటులో ఉంది",
    notAvailableStatusTag: "ఈ పోర్టల్‌కు అందుబాటులో లేదు",
    notAvailableChannelNote: "క్రింది అధికారిక పోర్టల్ వెబ్‌సైట్‌ను ఉపయోగించండి",
    askPermissionEmailBtn: "అధికారిక ఇమెయిల్ తనిఖీ చేసి పంపండి",
    askPermissionWhatsAppBtn: "అధికారిక వాట్సాప్ తనిఖీ చేసి పంపండి",
    portalStillAvailableNote:
      "మీరు ఎప్పుడైనా క్రింది అధికారిక పోర్టల్ వెబ్‌సైట్‌లో కూడా ఫిర్యాదు నమోదు చేయవచ్చు.",
    shareFormalPdfBtn: "ఫిర్యాదు పత్రాన్ని షేర్ చేయండి (PDF)",
    shareFormalPdfDone: "PDF పత్రం షేర్ చేయడానికి సిద్ధం",
    modalEmailTitle: "అధికారిక ఇమెయిల్ తనిఖీ & అనుమతి",
    modalWhatsAppTitle: "అధికారిక వాట్సాప్ ఫిర్యాదు తనిఖీ & అనుమతి",
    modalSubtitle:
      "క్రింది అధికారిక గ్రహీత, విషయం మరియు ఫిర్యాదు లేఖను సరిచూడండి. ఏదీ స్వయంగా పంపబడదు — మీ యాప్ సిద్ధంగా తెరుచుకుంటుంది, మీరు Send నొక్కితే సరిపోతుంది.",
    modalCloseLabel: "తనిఖీ విండో మూసివేయండి",
    recipientLabel: "అధికారిక శాఖ గ్రహీత (To)",
    subjectFieldLabel: "ఇమెయిల్ విషయం",
    messageFieldLabel: "సిద్ధం చేసిన పూర్తి ఫిర్యాదు",
    permissionCheckboxLabel:
      "నా ఫిర్యాదు వివరాలను సరిచూశాను. ఈ అధికారిక శాఖకు పంపడానికి నా ఇమెయిల్ / వాట్సాప్ యాప్ తెరవడానికి అనుమతి ఇస్తున్నాను.",
    permissionRequiredHint: "ముందుకు వెళ్ళడానికి పై అనుమతి బాక్స్‌లో టిక్ చేయండి.",
    openGmailBtn: "Gmail తెరిచి పంపండి",
    openMailAppBtn: "డిఫాల్ట్ ఇమెయిల్ యాప్ తెరవండి",
    openWhatsAppBtn: "అధికారిక వాట్సాప్ తెరిచి పంపండి",
    copyMessageBtn: "సిద్ధమైన టెక్స్ట్ కాపీ చేయండి",
    copiedBtn: "కాపీ అయింది",
    saveToTrackerHint: "దీనిని 'నా ఫిర్యాదులు' లో కూడా సేవ్ చేయండి",
    cancelUsePortalBtn: "వద్దు, నేను అధికారిక పోర్టల్ ఉపయోగిస్తాను",
    verifyRecipientTip:
      "సూచన: పంపిన తర్వాత వచ్చిన ఫిర్యాదు సంఖ్యను 'నా ఫిర్యాదులు' లో సేవ్ చేసుకుంటే సులభంగా ట్రాక్ చేయవచ్చు.",
  },
  Kannada: {
    cardKicker: "ನೇರ ಇಲಾಖೆ ಸಲ್ಲಿಕೆ ಆಯ್ಕೆಗಳು",
    cardTitle: "ಅಧಿಕೃತ ಇಮೇಲ್ ಅಥವಾ ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ನೇರವಾಗಿ ಕಳುಹಿಸಿ",
    cardSubtitle:
      "ಈ ಇಲಾಖೆಗೆ ನೇರ ಸಲ್ಲಿಕೆ ಲಭ್ಯವಿದೆ. ನಿಮ್ಮ ಅನುಮತಿಯೊಂದಿಗೆ ಅಧಿಕೃತ ಇಮೇಲ್ / ವಾಟ್ಸಾಪ್‌ಗೆ ಸಂಪೂರ್ಣ ದೂರನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತೇವೆ — ಪರಿಶೀಲಿಸಿ Send ಒತ್ತಿದರೆ ಸಾಕು.",
    cardUnavailableSubtitle:
      "ಈ ಪೋರ್ಟಲ್‌ಗೆ ನೇರ ಇಮೇಲ್ ಮತ್ತು ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಬಟನ್ ಮೂಲಕ ದೂರು ಸಲ್ಲಿಸಿ.",
    availableEmailLabel: "ಅಧಿಕೃತ ಇಮೇಲ್",
    availableWhatsAppLabel: "ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್",
    availableStatusTag: "ಲಭ್ಯವಿದೆ",
    notAvailableStatusTag: "ಈ ಪೋರ್ಟಲ್‌ಗೆ ಲಭ್ಯವಿಲ್ಲ",
    notAvailableChannelNote: "ಕೆಳಗಿನ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ವೆಬ್‌ಸೈಟ್ ಬಳಸಿ",
    askPermissionEmailBtn: "ಅಧಿಕೃತ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ ಕಳುಹಿಸಿ",
    askPermissionWhatsAppBtn: "ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್ ಪರಿಶೀಲಿಸಿ ಕಳುಹಿಸಿ",
    portalStillAvailableNote:
      "ನೀವು ಯಾವಾಗ ಬೇಕಾದರೂ ಕೆಳಗಿನ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲೂ ದೂರು ಸಲ್ಲಿಸಬಹುದು.",
    shareFormalPdfBtn: "ದೂರು ಪತ್ರ ಹಂಚಿಕೊಳ್ಳಿ (PDF)",
    shareFormalPdfDone: "PDF ಪತ್ರ ಹಂಚಿಕೊಳ್ಳಲು ಸಿದ್ಧ",
    modalEmailTitle: "ಅಧಿಕೃತ ಇಮೇಲ್ ಪರಿಶೀಲನೆ ಮತ್ತು ಅನುಮತಿ",
    modalWhatsAppTitle: "ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್ ದೂರು ಪರಿಶೀಲನೆ ಮತ್ತು ಅನುಮತಿ",
    modalSubtitle:
      "ಕೆಳಗಿನ ಅಧಿಕೃತ ಸ್ವೀಕರಿಸುವವರು, ವಿಷಯ ಮತ್ತು ದೂರು ಪತ್ರವನ್ನು ಪರಿಶೀಲಿಸಿ. ಏನೂ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ — ನಿಮ್ಮ ಆ್ಯಪ್ ಸಿದ್ಧವಾಗಿ ತೆರೆಯುತ್ತದೆ, ನೀವು Send ಒತ್ತಿದರೆ ಸಾಕು.",
    modalCloseLabel: "ಪರಿಶೀಲನಾ ವಿಂಡೋ ಮುಚ್ಚಿ",
    recipientLabel: "ಅಧಿಕೃತ ಇಲಾಖೆ ಸ್ವೀಕರಿಸುವವರು (To)",
    subjectFieldLabel: "ಇಮೇಲ್ ವಿಷಯ",
    messageFieldLabel: "ಸಿದ್ಧಪಡಿಸಿದ ಸಂಪೂರ್ಣ ದೂರು",
    permissionCheckboxLabel:
      "ನನ್ನ ದೂರಿನ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿದ್ದೇನೆ. ಈ ಅಧಿಕೃತ ಇಲಾಖೆಗೆ ಕಳುಹಿಸಲು ನನ್ನ ಇಮೇಲ್ / ವಾಟ್ಸಾಪ್ ಆ್ಯಪ್ ತೆರೆಯಲು ಅನುಮತಿ ನೀಡುತ್ತೇನೆ.",
    permissionRequiredHint: "ಮುಂದುವರಿಯಲು ಮೇಲಿನ ಅನುಮತಿ ಬಾಕ್ಸ್ ಟಿಕ್ ಮಾಡಿ.",
    openGmailBtn: "Gmail ತೆರೆಯಿರಿ ಮತ್ತು ಕಳುಹಿಸಿ",
    openMailAppBtn: "ಡೀಫಾಲ್ಟ್ ಇಮೇಲ್ ಆ್ಯಪ್ ತೆರೆಯಿರಿ",
    openWhatsAppBtn: "ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್ ತೆರೆಯಿರಿ ಮತ್ತು ಕಳುಹಿಸಿ",
    copyMessageBtn: "ಸಿದ್ಧ ಪಠ್ಯ ಕಾಪಿ ಮಾಡಿ",
    copiedBtn: "ಕಾಪಿ ಆಗಿದೆ",
    saveToTrackerHint: "ಇದನ್ನು 'ನನ್ನ ದೂರುಗಳು' ನಲ್ಲಿಯೂ ಉಳಿಸಿ",
    cancelUsePortalBtn: "ಬೇಡ, ನಾನು ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಬಳಸುತ್ತೇನೆ",
    verifyRecipientTip:
      "ಸಲಹೆ: ಕಳುಹಿಸಿದ ನಂತರ ಬಂದ ಟಿಕೆಟ್ ಸಂಖ್ಯೆಯನ್ನು 'ನನ್ನ ದೂರುಗಳು' ನಲ್ಲಿ ಉಳಿಸಿಕೊಳ್ಳಿ.",
  },
  Malayalam: {
    cardKicker: "നേരിട്ട് വകുപ്പിലേക്ക് അയക്കാനുള്ള സൗകര്യങ്ങൾ",
    cardTitle: "ഔദ്യോഗിക ഇമെയിൽ അല്ലെങ്കിൽ ഔദ്യോഗിക വാട്സാപ്പ് വഴി നേരിട്ട് അയക്കുക",
    cardSubtitle:
      "ഈ വകുപ്പിന് നേരിട്ട് അയക്കാനുള്ള സൗകര്യമുണ്ട്. നിങ്ങളുടെ അനുമതിയോടെ ഔദ്യോഗിക ഇമെയിൽ / വാട്സാപ്പിലേക്ക് പൂർണ്ണ പരാതി തയ്യാറാക്കും — പരിശോധിച്ച് Send അമർത്തുക മാത്രം മതി.",
    cardUnavailableSubtitle:
      "ഈ പോർട്ടലിന് നേരിട്ടുള്ള ഇമെയിൽ / ഔദ്യോഗിക വാട്സാപ്പ് സൗകര്യം ലഭ്യമല്ല. താഴെയുള്ള ഔദ്യോഗിക പോർട്ടൽ ബട്ടൺ വഴി പരാതി സമർപ്പിക്കുക.",
    availableEmailLabel: "ഔദ്യോഗിക ഇമെയിൽ",
    availableWhatsAppLabel: "ഔദ്യോഗിക വാട്സാപ്പ്",
    availableStatusTag: "ലഭ്യമാണ്",
    notAvailableStatusTag: "ഈ പോർട്ടലിന് ലഭ്യമല്ല",
    notAvailableChannelNote: "താഴെയുള്ള ഔദ്യോഗിക പോർട്ടൽ വെബ്‌സൈറ്റ് ഉപയോഗിക്കുക",
    askPermissionEmailBtn: "ഔദ്യോഗിക ഇമെയിൽ പരിശോധിച്ച് അയക്കുക",
    askPermissionWhatsAppBtn: "ഔദ്യോഗിക വാട്സാപ്പ് പരിശോധിച്ച് അയക്കുക",
    portalStillAvailableNote:
      "താഴെയുള്ള ഔദ്യോഗിക പോർട്ടൽ വെബ്‌സൈറ്റ് വഴിയും എപ്പോൾ വേണമെങ്കിലും പരാതി സമർപ്പിക്കാം.",
    shareFormalPdfBtn: "പരാതി പത്രം പങ്കിടുക (PDF)",
    shareFormalPdfDone: "PDF പത്രം പങ്കിടാൻ തയ്യാർ",
    modalEmailTitle: "ഔദ്യോഗിക ഇമെയിൽ പരിശോധിച്ച് അനുമതി നൽകുക",
    modalWhatsAppTitle: "ഔദ്യോഗിക വാട്സാപ്പ് പരാതി പരിശോധിച്ച് അനുമതി നൽകുക",
    modalSubtitle:
      "താഴെയുള്ള ഔദ്യോഗിക വിലാസം, വിഷയം, പരാതി എന്നിവ പരിശോധിക്കുക. ഒന്നും സ്വയമേവ അയക്കില്ല — നിങ്ങളുടെ ആപ്പ് തുറക്കുമ്പോൾ Send അമർത്തുക.",
    modalCloseLabel: "പരിശോധനാ വിൻഡോ അടയ്ക്കുക",
    recipientLabel: "ഔദ്യോഗിക വകുപ്പ് സ്വീകർത്താവ് (To)",
    subjectFieldLabel: "ഇമെയിൽ വിഷയം",
    messageFieldLabel: "തയ്യാറാക്കിയ പൂർണ്ണ പരാതി",
    permissionCheckboxLabel:
      "എന്റെ പരാതി വിവരങ്ങൾ പരിശോധിച്ചു. ഈ ഔദ്യോഗിക വകുപ്പിലേക്ക് അയക്കാൻ എന്റെ ഇമെയിൽ / വാട്സാപ്പ് ആപ്പ് തുറക്കാൻ അനുമതി നൽകുന്നു.",
    permissionRequiredHint: "തുടരാൻ മുകളിലെ അനുമതി ബോക്സ് ടിക്ക് ചെയ്യുക.",
    openGmailBtn: "Gmail തുറന്ന് അയക്കുക",
    openMailAppBtn: "ഇമെയിൽ ആപ്പ് തുറക്കുക",
    openWhatsAppBtn: "ഔദ്യോഗിക വാട്സാപ്പ് തുറന്ന് അയക്കുക",
    copyMessageBtn: "തയ്യാറാക്കിയ സന്ദേശം കോപ്പി ചെയ്യുക",
    copiedBtn: "കോപ്പി ചെയ്തു",
    saveToTrackerHint: "ഇത് 'എന്റെ പരാതികൾ' എന്നതിലും സേവ് ചെയ്യുക",
    cancelUsePortalBtn: "വേണ്ട, ഞാൻ ഔദ്യോഗിക പോർട്ടൽ ഉപയോഗിക്കാം",
    verifyRecipientTip:
      "കുറിപ്പ്: അയച്ചതിനു ശേഷം ലഭിക്കുന്ന ടിക്കറ്റ് നമ്പർ 'എന്റെ പരാതികൾ' എന്നതിൽ സൂക്ഷിച്ചാൽ എളുപ്പത്തിൽ ട്രാക്ക് ചെയ്യാം.",
  },
  Bengali: {
    cardKicker: "সরাসরি দপ্তরে জমা দেওয়ার বিকল্প",
    cardTitle: "অফিশিয়াল ইমেইল বা অফিশিয়াল হোয়াটসঅ্যাপের মাধ্যমে সরাসরি পাঠান",
    cardSubtitle:
      "এই দপ্তরের জন্য সরাসরি জমা দেওয়ার সুবিধা রয়েছে। আপনার অনুমতিতে আমরা সরাসরি তাদের অফিশিয়াল ইমেইল / হোয়াটসঅ্যাপের জন্য সম্পূর্ণ অভিযোগ প্রস্তুত করে দেব — আপনি যাচাই করে Send চাপলেই হবে।",
    cardUnavailableSubtitle:
      "এই পোর্টালের জন্য সরাসরি ইমেইল বা অফিশিয়াল হোয়াটসঅ্যাপ সুবিধা উপলব্ধ নয়। অনুগ্রহ করে নিচের অফিশিয়াল পোর্টাল বোতামে ক্লিক করে অভিযোগ জমা দিন।",
    availableEmailLabel: "অফিশিয়াল ইমেইল",
    availableWhatsAppLabel: "অফিশিয়াল হোয়াটসঅ্যাপ",
    availableStatusTag: "উপলব্ধ",
    notAvailableStatusTag: "এই পোর্টালের জন্য উপলব্ধ নয়",
    notAvailableChannelNote: "নিচের অফিশিয়াল পোর্টাল ওয়েবসাইট ব্যবহার করুন",
    askPermissionEmailBtn: "অফিশিয়াল ইমেইল যাচাই করে পাঠান",
    askPermissionWhatsAppBtn: "অফিশিয়াল হোয়াটসঅ্যাপ যাচাই করে পাঠান",
    portalStillAvailableNote:
      "আপনি যেকোনো সময় নিচের অফিশিয়াল পোর্টাল ওয়েবসাইটেও অভিযোগ জমা দিতে পারেন।",
    shareFormalPdfBtn: "অভিযোগ পত্র শেয়ার করুন (PDF)",
    shareFormalPdfDone: "PDF পত্র শেয়ার করার জন্য প্রস্তুত",
    modalEmailTitle: "অফিশিয়াল ইমেইল যাচাই ও অনুমতি দিন",
    modalWhatsAppTitle: "অফিশিয়াল হোয়াটসঅ্যাপ অভিযোগ যাচাই ও অনুমতি দিন",
    modalSubtitle:
      "নিচে অফিশিয়াল প্রাপক, বিষয় এবং সম্পূর্ণ অভিযোগপত্র যাচাই করুন। কিছু স্বয়ংক্রিয়ভাবে পাঠানো হবে না — আপনার অ্যাপ খুলবে, আপনি যাচাই করে Send চাপবেন।",
    modalCloseLabel: "যাচাইকরণ উইন্ডো বন্ধ করুন",
    recipientLabel: "অফিশিয়াল দপ্তর প্রাপক (To)",
    subjectFieldLabel: "ইমেইল বিষয়",
    messageFieldLabel: "সম্পূর্ণ প্রস্তুত অভিযোগ",
    permissionCheckboxLabel:
      "আমি আমার অভিযোগের বিবরণ যাচাই করেছি এবং এই অফিশিয়াল দপ্তরে পাঠানোর জন্য আমার ইমেইল / হোয়াটসঅ্যাপ অ্যাপ খোলার অনুমতি দিচ্ছি।",
    permissionRequiredHint: "এগিয়ে যেতে উপরের অনুমতির বাক্সে টিক দিন।",
    openGmailBtn: "Gmail খুলুন ও পাঠান",
    openMailAppBtn: "ডিফল্ট ইমেইল অ্যাপ খুলুন",
    openWhatsAppBtn: "অফিশিয়াল হোয়াটসঅ্যাপ খুলুন ও পাঠান",
    copyMessageBtn: "প্রস্তুত লেখা কপি করুন",
    copiedBtn: "কপি হয়েছে",
    saveToTrackerHint: "এটি 'আমার অভিযোগ' তালিকায়ও সংরক্ষণ করুন",
    cancelUsePortalBtn: "না ধন্যবাদ, আমি অফিশিয়াল পোর্টাল ব্যবহার করব",
    verifyRecipientTip:
      "টিপস: পাঠানোর পর পাওয়া উত্তর বা টিকিট নম্বর 'আমার অভিযোগ' অংশে সংরক্ষণ করে রাখুন।",
  },
  Marathi: {
    cardKicker: "थेट विभागात सादर करण्याचे पर्याय",
    cardTitle: "अधिकृत ईमेल किंवा अधिकृत व्हॉट्सअॅपद्वारे थेट पाठवा",
    cardSubtitle:
      "या विभागासाठी थेट सादर करण्याची सुविधा उपलब्ध आहे. तुमच्या परवानगीने आम्ही अधिकृत ईमेल / व्हॉट्सअॅपसाठी संपूर्ण तक्रार तयार करू — तुम्ही तपासून Send दाबा.",
    cardUnavailableSubtitle:
      "या पोर्टलसाठी थेट ईमेल किंवा अधिकृत व्हॉट्सअॅप सुविधा उपलब्ध नाही. कृपया खालील अधिकृत पोर्टल बटणावरून तक्रार नोंदवा.",
    availableEmailLabel: "अधिकृत ईमेल",
    availableWhatsAppLabel: "अधिकृत व्हॉट्सअॅप",
    availableStatusTag: "उपलब्ध",
    notAvailableStatusTag: "या पोर्टलसाठी उपलब्ध नाही",
    notAvailableChannelNote: "खालील अधिकृत पोर्टल वेबसाइट वापरा",
    askPermissionEmailBtn: "अधिकृत ईमेल तपासा आणि पाठवा",
    askPermissionWhatsAppBtn: "अधिकृत व्हॉट्सअॅप तपासा आणि पाठवा",
    portalStillAvailableNote:
      "तुम्ही खालील अधिकृत पोर्टल वेबसाइटवरही कधीही तक्रार नोंदवू शकता.",
    shareFormalPdfBtn: "तक्रार पत्र शेअर करा (PDF)",
    shareFormalPdfDone: "PDF पत्र शेअर करण्यासाठी तयार",
    modalEmailTitle: "अधिकृत ईमेल पडताळणी आणि परवानगी",
    modalWhatsAppTitle: "अधिकृत व्हॉट्सअॅप तक्रार पडताळणी आणि परवानगी",
    modalSubtitle:
      "खालील अधिकृत प्राप्तकर्ता, विषय आणि तक्रार पत्र तपासा. काहीही आपोआप पाठवले जात नाही — तुमचे अॅप तयार उघडेल, तुम्हाला फक्त Send दाबायचे आहे.",
    modalCloseLabel: "पडताळणी विंडो बंद करा",
    recipientLabel: "अधिकृत विभाग प्राप्तकर्ता (To)",
    subjectFieldLabel: "ईमेल विषय",
    messageFieldLabel: "तयार संपूर्ण तक्रार",
    permissionCheckboxLabel:
      "मी माझ्या तक्रारीचे तपशील तपासले आहेत आणि या अधिकृत विभागाला पाठवण्यासाठी माझे ईमेल / व्हॉट्सअॅप अॅप उघडण्याची परवानगी देतो/देते.",
    permissionRequiredHint: "पुढे जाण्यासाठी वरील परवानगी बॉक्सवर टिक करा.",
    openGmailBtn: "Gmail उघडा आणि पाठवा",
    openMailAppBtn: "डीफॉल्ट ईमेल अॅप उघडा",
    openWhatsAppBtn: "अधिकृत व्हॉट्सअॅप उघडा आणि पाठवा",
    copyMessageBtn: "तयार मजकूर कॉपी करा",
    copiedBtn: "कॉपी झाले",
    saveToTrackerHint: "ही तक्रार 'माझ्या तक्रारी' मध्येही जतन करा",
    cancelUsePortalBtn: "नको, मी अधिकृत पोर्टल वापरेन",
    verifyRecipientTip:
      "टीप: पाठवल्यानंतर मिळालेला तिकीट क्रमांक 'माझ्या तक्रारी' मध्ये जतन करा म्हणजे पाठपुरावा सोपा होईल.",
  },
  Gujarati: {
    cardKicker: "સીધા વિભાગમાં સબમિટ કરવાના વિકલ્પો",
    cardTitle: "સત્તાવાર ઈમેલ અથવા સત્તાવાર વોટ્સએપ દ્વારા સીધું મોકલો",
    cardSubtitle:
      "આ વિભાગ માટે સીધું સબમિશન ઉપલબ્ધ છે. તમારી પરવાનગીથી અમે સત્તાવાર ઈમેલ / વોટ્સએપ માટે સંપૂર્ણ ફરિયાદ તૈયાર કરીશું — તમે ચકાસીને Send દબાવો.",
    cardUnavailableSubtitle:
      "આ પોર્ટલ માટે સીધો ઈમેલ કે સત્તાવાર વોટ્સએપ ઉપલબ્ધ નથી. કૃપા કરીને નીચેના સત્તાવાર પોર્ટલ બટન દ્વારા ફરિયાદ નોંધાવો.",
    availableEmailLabel: "સત્તાવાર ઈમેલ",
    availableWhatsAppLabel: "સત્તાવાર વોટ્સએપ",
    availableStatusTag: "ઉપલબ્ધ",
    notAvailableStatusTag: "આ પોર્ટલ માટે ઉપલબ્ધ નથી",
    notAvailableChannelNote: "નીચેની સત્તાવાર પોર્ટલ વેબસાઇટ વાપરો",
    askPermissionEmailBtn: "સત્તાવાર ઈમેલ ચકાસો અને મોકલો",
    askPermissionWhatsAppBtn: "સત્તાવાર વોટ્સએપ ચકાસો અને મોકલો",
    portalStillAvailableNote:
      "તમે નીચેની સત્તાવાર પોર્ટલ વેબસાઇટ પર પણ ગમે ત્યારે ફરિયાદ નોંધાવી શકો છો.",
    shareFormalPdfBtn: "ફરિયાદ પત્ર શેર કરો (PDF)",
    shareFormalPdfDone: "PDF પત્ર શેર કરવા તૈયાર",
    modalEmailTitle: "સત્તાવાર ઈમેલ ચકાસણી અને પરવાનગી",
    modalWhatsAppTitle: "સત્તાવાર વોટ્સએપ ફરિયાદ ચકાસણી અને પરવાનગી",
    modalSubtitle:
      "નીચે સત્તાવાર પ્રાપ્તકર્તા, વિષય અને સંપૂર્ણ ફરિયાદ પત્ર ચકાસો. કંઈપણ આપમેળે મોકલાશે નહીં — તમારી એપ તૈયાર ખૂલશે, તમારે માત્ર Send દબાવવાનું છે.",
    modalCloseLabel: "ચકાસણી વિન્ડો બંધ કરો",
    recipientLabel: "સત્તાવાર વિભાગ પ્રાપ્તકર્તા (To)",
    subjectFieldLabel: "ઈમેલ વિષય",
    messageFieldLabel: "તૈયાર સંપૂર્ણ ફરિયાદ",
    permissionCheckboxLabel:
      "મેં મારી ફરિયાદની વિગતો ચકાસી લીધી છે અને આ સત્તાવાર વિભાગને મોકલવા માટે મારી ઈમેલ / વોટ્સએપ એપ ખોલવાની પરવાનગી આપું છું.",
    permissionRequiredHint: "આગળ વધવા માટે ઉપરના પરવાનગી બોક્સમાં ટિક કરો.",
    openGmailBtn: "Gmail ખોલો અને મોકલો",
    openMailAppBtn: "ડિફોલ્ટ ઈમેલ એપ ખોલો",
    openWhatsAppBtn: "સત્તાવાર વોટ્સએપ ખોલો અને મોકલો",
    copyMessageBtn: "તૈયાર લખાણ કોપી કરો",
    copiedBtn: "કોપી થઈ ગયું",
    saveToTrackerHint: "આને 'મારી ફરિયાદો' માં પણ સાચવો",
    cancelUsePortalBtn: "ના આભાર, હું સત્તાવાર પોર્ટલ વાપરીશ",
    verifyRecipientTip:
      "ટિપ: મોકલ્યા પછી મળેલો ટિકિટ નંબર 'મારી ફરિયાદો' માં સાચવી લો જેથી સ્ટેટસ સરળતાથી ટ્રેક કરી શકાય.",
  },
  Punjabi: {
    cardKicker: "ਸਿੱਧੇ ਵਿਭਾਗ ਵਿੱਚ ਜਮ੍ਹਾਂ ਕਰਨ ਦੇ ਵਿਕਲਪ",
    cardTitle: "ਅਧਿਕਾਰਤ ਈਮੇਲ ਜਾਂ ਅਧਿਕਾਰਤ ਵਟਸਐਪ ਰਾਹੀਂ ਸਿੱਧਾ ਭੇਜੋ",
    cardSubtitle:
      "ਇਸ ਵਿਭਾਗ ਲਈ ਸਿੱਧਾ ਭੇਜਣ ਦੀ ਸਹੂਲਤ ਉਪਲਬਧ ਹੈ। ਤੁਹਾਡੀ ਇਜਾਜ਼ਤ ਨਾਲ ਅਸੀਂ ਅਧਿਕਾਰਤ ਈਮੇਲ / ਵਟਸਐਪ ਲਈ ਪੂਰੀ ਸ਼ਿਕਾਇਤ ਤਿਆਰ ਕਰਾਂਗੇ — ਤੁਸੀਂ ਜਾਂਚ ਕਰਕੇ Send ਦਬਾਓ।",
    cardUnavailableSubtitle:
      "ਇਸ ਪੋਰਟਲ ਲਈ ਸਿੱਧੀ ਈਮੇਲ ਜਾਂ ਅਧਿਕਾਰਤ ਵਟਸਐਪ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਦਿੱਤੇ ਅਧਿਕਾਰਤ ਪੋਰਟਲ ਬਟਨ ਰਾਹੀਂ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ।",
    availableEmailLabel: "ਅਧਿਕਾਰਤ ਈਮੇਲ",
    availableWhatsAppLabel: "ਅਧਿਕਾਰਤ ਵਟਸਐਪ",
    availableStatusTag: "ਉਪਲਬਧ",
    notAvailableStatusTag: "ਇਸ ਪੋਰਟਲ ਲਈ ਉਪਲਬਧ ਨਹੀਂ",
    notAvailableChannelNote: "ਹੇਠਾਂ ਦਿੱਤੀ ਅਧਿਕਾਰਤ ਪੋਰਟਲ ਵੈੱਬਸਾਈਟ ਵਰਤੋ",
    askPermissionEmailBtn: "ਅਧਿਕਾਰਤ ਈਮੇਲ ਜਾਂਚੋ ਅਤੇ ਭੇਜੋ",
    askPermissionWhatsAppBtn: "ਅਧਿਕਾਰਤ ਵਟਸਐਪ ਜਾਂਚੋ ਅਤੇ ਭੇਜੋ",
    portalStillAvailableNote:
      "ਤੁਸੀਂ ਹੇਠਾਂ ਦਿੱਤੀ ਅਧਿਕਾਰਤ ਪੋਰਟਲ ਵੈੱਬਸਾਈਟ 'ਤੇ ਵੀ ਕਿਸੇ ਵੀ ਸਮੇਂ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰ ਸਕਦੇ ਹੋ।",
    shareFormalPdfBtn: "ਸ਼ਿਕਾਇਤ ਪੱਤਰ ਸਾਂਝਾ ਕਰੋ (PDF)",
    shareFormalPdfDone: "PDF ਪੱਤਰ ਸਾਂਝਾ ਕਰਨ ਲਈ ਤਿਆਰ",
    modalEmailTitle: "ਅਧਿਕਾਰਤ ਈਮੇਲ ਦੀ ਪੁਸ਼ਟੀ ਅਤੇ ਇਜਾਜ਼ਤ",
    modalWhatsAppTitle: "ਅਧਿਕਾਰਤ ਵਟਸਐਪ ਸ਼ਿਕਾਇਤ ਦੀ ਪੁਸ਼ਟੀ ਅਤੇ ਇਜਾਜ਼ਤ",
    modalSubtitle:
      "ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਅਧਿਕਾਰਤ ਪ੍ਰਾਪਤਕਰਤਾ, ਵਿਸ਼ਾ ਅਤੇ ਪੂਰਾ ਸ਼ਿਕਾਇਤ ਪੱਤਰ ਜਾਂਚ ਲਓ। ਕੁਝ ਵੀ ਆਪਣੇ ਆਪ ਨਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ — ਤੁਹਾਡੀ ਐਪ ਤਿਆਰ ਖੁੱਲ੍ਹੇਗੀ, ਤੁਸੀਂ ਸਿਰਫ਼ Send ਦਬਾਉਣਾ ਹੈ।",
    modalCloseLabel: "ਪੁਸ਼ਟੀ ਵਿੰਡੋ ਬੰਦ ਕਰੋ",
    recipientLabel: "ਅਧਿਕਾਰਤ ਵਿਭਾਗ ਪ੍ਰਾਪਤਕਰਤਾ (To)",
    subjectFieldLabel: "ਈਮੇਲ ਵਿਸ਼ਾ",
    messageFieldLabel: "ਤਿਆਰ ਪੂਰੀ ਸ਼ਿਕਾਇਤ",
    permissionCheckboxLabel:
      "ਮੈਂ ਆਪਣੀ ਸ਼ਿਕਾਇਤ ਦੇ ਵੇਰਵੇ ਜਾਂਚ ਲਏ ਹਨ ਅਤੇ ਇਸ ਅਧਿਕਾਰਤ ਵਿਭਾਗ ਨੂੰ ਭੇਜਣ ਲਈ ਆਪਣੀ ਈਮੇਲ / ਵਟਸਐਪ ਐਪ ਖੋਲ੍ਹਣ ਦੀ ਇਜਾਜ਼ਤ ਦਿੰਦਾ/ਦਿੰਦੀ ਹਾਂ।",
    permissionRequiredHint: "ਅੱਗੇ ਵਧਣ ਲਈ ਉੱਪਰ ਇਜਾਜ਼ਤ ਵਾਲੇ ਡੱਬੇ 'ਤੇ ਟਿੱਕ ਕਰੋ।",
    openGmailBtn: "Gmail ਖੋਲ੍ਹੋ ਅਤੇ ਭੇਜੋ",
    openMailAppBtn: "ਡਿਫਾਲਟ ਈਮੇਲ ਐਪ ਖੋਲ੍ਹੋ",
    openWhatsAppBtn: "ਅਧਿਕਾਰਤ ਵਟਸਐਪ ਖੋਲ੍ਹੋ ਅਤੇ ਭੇਜੋ",
    copyMessageBtn: "ਤਿਆਰ ਲਿਖਤ ਕਾਪੀ ਕਰੋ",
    copiedBtn: "ਕਾਪੀ ਹੋ ਗਿਆ",
    saveToTrackerHint: "ਇਸਨੂੰ 'ਮੇਰੀਆਂ ਸ਼ਿਕਾਇਤਾਂ' ਵਿੱਚ ਵੀ ਸੰਭਾਲੋ",
    cancelUsePortalBtn: "ਨਹੀਂ ਧੰਨਵਾਦ, ਮੈਂ ਅਧਿਕਾਰਤ ਪੋਰਟਲ ਵਰਤਾਂਗਾ/ਵਰਤਾਂਗੀ",
    verifyRecipientTip:
      "ਸੁਝਾਅ: ਭੇਜਣ ਤੋਂ ਬਾਅਦ ਮਿਲਣ ਵਾਲਾ ਟਿਕਟ ਨੰਬਰ 'ਮੇਰੀਆਂ ਸ਼ਿਕਾਇਤਾਂ' ਵਿੱਚ ਸੰਭਾਲ ਲਓ ਤਾਂ ਜੋ ਟਰੈਕ ਕਰਨਾ ਸੌਖਾ ਰਹੇ।",
  },
  Odia: {
    cardKicker: "ସିଧାସଳଖ ବିଭାଗକୁ ପଠାଇବା ବିକଳ୍ପ",
    cardTitle: "ସରକାରୀ ଇମେଲ୍ କିମ୍ବା ସରକାରୀ ହ୍ୱାଟସ୍ଆପ୍ ମାଧ୍ୟମରେ ସିଧା ପଠାନ୍ତୁ",
    cardSubtitle:
      "ଏହି ବିଭାଗ ପାଇଁ ସିଧାସଳଖ ପଠାଇବା ସୁବିଧା ଉପଲବ୍ଧ ଅଛି। ଆପଣଙ୍କ ଅନୁମତି ସହିତ ଆମେ ସରକାରୀ ଇମେଲ୍ / ହ୍ୱାଟସ୍ଆପ୍ ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ଅଭିଯୋଗ ପ୍ରସ୍ତୁତ କରିବୁ — ଆପଣ ଯାଞ୍ଚ କରି Send ଦବାନ୍ତୁ।",
    cardUnavailableSubtitle:
      "ଏହି ପୋର୍ଟାଲ୍ ପାଇଁ ସିଧାସଳଖ ଇମେଲ୍ କିମ୍ବା ସରକାରୀ ହ୍ୱାଟସ୍ଆପ୍ ଉପଲବ୍ଧ ନାହିଁ। ଦୟାକରି ତଳେ ଥିବା ସରକାରୀ ପୋର୍ଟାଲ୍ ବଟନ୍ ମାଧ୍ୟମରେ ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ।",
    availableEmailLabel: "ସରକାରୀ ଇମେଲ୍",
    availableWhatsAppLabel: "ସରକାରୀ ହ୍ୱାଟସ୍ଆପ୍",
    availableStatusTag: "ଉପଲବ୍ଧ",
    notAvailableStatusTag: "ଏହି ପୋର୍ଟାଲ୍ ପାଇଁ ଉପଲବ୍ଧ ନାହିଁ",
    notAvailableChannelNote: "ତଳେ ଥିବା ସରକାରୀ ପୋର୍ଟାଲ୍ ୱେବସାଇଟ୍ ବ୍ୟବହାର କରନ୍ତୁ",
    askPermissionEmailBtn: "ସରକାରୀ ଇମେଲ୍ ଯାଞ୍ଚ କରି ପଠାନ୍ତୁ",
    askPermissionWhatsAppBtn: "ସରକାରୀ ହ୍ୱାଟସ୍ଆପ୍ ଯାଞ୍ଚ କରି ପଠାନ୍ତୁ",
    portalStillAvailableNote:
      "ଆପଣ ଯେକୌଣସି ସମୟରେ ତଳେ ଥିବା ସରକାରୀ ପୋର୍ଟାଲ୍ ୱେବସାଇଟ୍‌ରେ ମଧ୍ୟ ଅଭିଯୋଗ ଦାଖଲ କରିପାରିବେ।",
    shareFormalPdfBtn: "ଅଭିଯୋଗ ପତ୍ର ସେୟାର୍ କରନ୍ତୁ (PDF)",
    shareFormalPdfDone: "PDF ପତ୍ର ସେୟାର୍ ପାଇଁ ପ୍ରସ୍ତୁତ",
    modalEmailTitle: "ସରକାରୀ ଇମେଲ୍ ଯାଞ୍ଚ ଏବଂ ଅନୁମତି ଦିଅନ୍ତୁ",
    modalWhatsAppTitle: "ସରକାରୀ ହ୍ୱାଟସ୍ଆପ୍ ଅଭିଯୋଗ ଯାଞ୍ଚ ଏବଂ ଅନୁମତି ଦିଅନ୍ତୁ",
    modalSubtitle:
      "ଦୟାକରି ତଳେ ସରକାରୀ ପ୍ରାପକ, ବିଷୟ ଏବଂ ସମ୍ପୂର୍ଣ୍ଣ ଅଭିଯୋଗ ପତ୍ର ଯାଞ୍ଚ କରନ୍ତୁ। କିଛି ଆପେ ପଠାଯିବ ନାହିଁ — ଆପଣଙ୍କ ଆପ୍ ଖୋଲିବ, ଆପଣ କେବଳ Send ଦବାନ୍ତୁ।",
    modalCloseLabel: "ଯାଞ୍ଚ ୱିଣ୍ଡୋ ବନ୍ଦ କରନ୍ତୁ",
    recipientLabel: "ସରକାରୀ ବିଭାଗ ପ୍ରାପକ (To)",
    subjectFieldLabel: "ଇମେଲ୍ ବିଷୟ",
    messageFieldLabel: "ପ୍ରସ୍ତୁତ ସମ୍ପୂର୍ଣ୍ଣ ଅଭିଯୋଗ",
    permissionCheckboxLabel:
      "ମୁଁ ମୋର ଅଭିଯୋଗ ବିବରଣୀ ଯାଞ୍ଚ କରିଛି ଏବଂ ଏହି ସରକାରୀ ବିଭାଗକୁ ପଠାଇବା ପାଇଁ ମୋର ଇମେଲ୍ / ହ୍ୱାଟସ୍ଆପ୍ ଆପ୍ ଖୋଲିବାକୁ ଅନୁମତି ଦେଉଛି।",
    permissionRequiredHint: "ଆଗକୁ ବଢ଼ିବାକୁ ଉପରେ ଥିବା ଅନୁମତି ବକ୍ସରେ ଟିକ୍ କରନ୍ତୁ।",
    openGmailBtn: "Gmail ଖୋଲନ୍ତୁ ଏବଂ ପଠାନ୍ତୁ",
    openMailAppBtn: "ଡିଫଲ୍ଟ ଇମେଲ୍ ଆପ୍ ଖୋଲନ୍ତୁ",
    openWhatsAppBtn: "ସରକାରୀ ହ୍ୱାଟସ୍ଆପ୍ ଖୋଲନ୍ତୁ ଏବଂ ପଠାନ୍ତୁ",
    copyMessageBtn: "ପ୍ରସ୍ତୁତ ଲେଖା କପି କରନ୍ତୁ",
    copiedBtn: "କପି ହୋଇଗଲା",
    saveToTrackerHint: "ଏହାକୁ 'ମୋର ଅଭିଯୋଗ' ତାଲିକାରେ ମଧ୍ୟ ସେଭ୍ କରନ୍ତୁ",
    cancelUsePortalBtn: "ନାହିଁ ଧନ୍ୟବାଦ, ମୁଁ ସରକାରୀ ପୋର୍ଟାଲ୍ ବ୍ୟବହାର କରିବି",
    verifyRecipientTip:
      "ଟିପ୍: ପଠାଇବା ପରେ ମିଳିଥିବା ଟିକେଟ୍ ନମ୍ବର 'ମୋର ଅଭିଯୋଗ' ରେ ସେଭ୍ କରି ରଖନ୍ତୁ।",
  },
  Assamese: {
    cardKicker: "পোনপটীয়াকৈ বিভাগত দাখিল কৰাৰ বিকল্প",
    cardTitle: "চৰকাৰী ইমেইল বা চৰকাৰী হোৱাটছএপৰ জৰিয়তে পোনপটীয়াকৈ পঠিয়াওক",
    cardSubtitle:
      "এই বিভাগৰ বাবে পোনপটীয়াকৈ পঠিওৱাৰ সুবিধা উপলব্ধ আছে। আপোনাৰ অনুমতিৰে আমি চৰকাৰী ইমেইল / হোৱাটছএপৰ বাবে সম্পূৰ্ণ অভিযোগ প্ৰস্তুত কৰিম — আপুনি পৰীক্ষা কৰি Send টিপিলেই হ'ব।",
    cardUnavailableSubtitle:
      "এই পৰ্টেলৰ বাবে পোনপটীয়া ইমেইল বা চৰকাৰী হোৱাটছএপ উপলব্ধ নহয়। অনুগ্ৰহ কৰি তলত থকা চৰকাৰী পৰ্টেল বুটামৰ জৰিয়তে অভিযোগ দাখিল কৰক।",
    availableEmailLabel: "চৰকাৰী ইমেইল",
    availableWhatsAppLabel: "চৰকাৰী হোৱাটছএপ",
    availableStatusTag: "উপলব্ধ",
    notAvailableStatusTag: "এই পৰ্টেলৰ বাবে উপলব্ধ নহয়",
    notAvailableChannelNote: "তলত থকা চৰকাৰী পৰ্টেল ৱেবছাইট ব্যৱহাৰ কৰক",
    askPermissionEmailBtn: "চৰকাৰী ইমেইল পৰীক্ষা কৰি পঠিয়াওক",
    askPermissionWhatsAppBtn: "চৰকাৰী হোৱাটছএপ পৰীক্ষা কৰি পঠিয়াওক",
    portalStillAvailableNote:
      "আপুনি যিকোনো সময়তে তলত থকা চৰকাৰী পৰ্টেল ৱেবছাইটতো অভিযোগ দাখিল কৰিব পাৰে।",
    shareFormalPdfBtn: "অভিযোগ পত্ৰ শ্বেয়াৰ কৰক (PDF)",
    shareFormalPdfDone: "PDF পত্ৰ শ্বেয়াৰ কৰিবলৈ সাজু",
    modalEmailTitle: "চৰকাৰী ইমেইল পৰীক্ষা আৰু অনুমতি দিয়ক",
    modalWhatsAppTitle: "চৰকাৰী হোৱাটছএপ অভিযোগ পৰীক্ষা আৰু অনুমতি দিয়ক",
    modalSubtitle:
      "অনুগ্ৰহ কৰি তলত চৰকাৰী প্ৰাপক, বিষয় আৰু সম্পূৰ্ণ অভিযোগ পত্ৰ পৰীক্ষা কৰক। একো স্বয়ংক্ৰিয়ভাৱে পঠিওৱা নহয় — আপোনাৰ এপ খোল খাব, আপুনি মাথোঁ Send টিপিব।",
    modalCloseLabel: "পৰীক্ষণ উইণ্ডো বন্ধ কৰক",
    recipientLabel: "চৰকাৰী বিভাগ প্ৰাপক (To)",
    subjectFieldLabel: "ইমেইলৰ বিষয়",
    messageFieldLabel: "প্ৰস্তুত সম্পূৰ্ণ অভিযোগ",
    permissionCheckboxLabel:
      "মই মোৰ অভিযোগৰ বিৱৰণ পৰীক্ষা কৰিছোঁ আৰু এই চৰকাৰী বিভাগলৈ পঠিয়াবলৈ মোৰ ইমেইল / হোৱাটছএপ এপ খোলাৰ অনুমতি দিছোঁ।",
    permissionRequiredHint: "আগবাঢ়িবলৈ ওপৰৰ অনুমতি বাকচত টিক দিয়ক।",
    openGmailBtn: "Gmail খোলক আৰু পঠিয়াওক",
    openMailAppBtn: "ডিফল্ট ইমেইল এপ খোলক",
    openWhatsAppBtn: "চৰকাৰী হোৱাটছএপ খোলক আৰু পঠিয়াওক",
    copyMessageBtn: "প্ৰস্তুত লিখা কপি কৰক",
    copiedBtn: "কপি হ'ল",
    saveToTrackerHint: "ইয়াক 'মোৰ অভিযোগ' তালিকাতো সংৰক্ষণ কৰক",
    cancelUsePortalBtn: "নালাগে, মই চৰকাৰী পৰ্টেল ব্যৱহাৰ কৰিম",
    verifyRecipientTip:
      "পৰামৰ্শ: পঠিওৱাৰ পাছত পোৱা টিকট নম্বৰ 'মোৰ অভিযোগ' অংশত সংৰক্ষণ কৰি ৰাখক।",
  },
  Urdu: {
    cardKicker: "براہِ راست محکمہ کو جمع کرانے کے اختیارات",
    cardTitle: "سرکاری ای میل یا سرکاری واٹس ایپ کے ذریعے براہِ راست بھیجیں",
    cardSubtitle:
      "اس محکمہ کے لیے براہِ راست جمع کرانے کی سہولت دستیاب ہے۔ آپ کی اجازت سے ہم سرکاری ای میل / واٹس ایپ کے لیے مکمل شکایت تیار کریں گے — بس تصدیق کریں اور Send دبائیں۔",
    cardUnavailableSubtitle:
      "اس پورٹل کے لیے براہِ راست ای میل یا سرکاری واٹس ایپ دستیاب نہیں ہے۔ براہِ کرم نیچے دیے گئے سرکاری پورٹل بٹن سے شکایت درج کریں۔",
    availableEmailLabel: "سرکاری ای میل",
    availableWhatsAppLabel: "سرکاری واٹس ایپ",
    availableStatusTag: "دستیاب ہے",
    notAvailableStatusTag: "اس پورٹل کے لیے دستیاب نہیں",
    notAvailableChannelNote: "نیچے دی گئی سرکاری پورٹل ویب سائٹ استعمال کریں",
    askPermissionEmailBtn: "سرکاری ای میل چیک کریں اور بھیجیں",
    askPermissionWhatsAppBtn: "سرکاری واٹس ایپ چیک کریں اور بھیجیں",
    portalStillAvailableNote:
      "آپ کسی بھی وقت نیچے دی گئی سرکاری پورٹل ویب سائٹ پر بھی شکایت درج کر سکتے ہیں۔",
    shareFormalPdfBtn: "شکایت نامہ شیئر کریں (PDF)",
    shareFormalPdfDone: "PDF شکایت نامہ شیئر کے لیے تیار ہے",
    modalEmailTitle: "سرکاری ای میل کی تصدیق اور اجازت دیں",
    modalWhatsAppTitle: "سرکاری واٹس ایپ شکایت کی تصدیق اور اجازت دیں",
    modalSubtitle:
      "براہِ کرم نیچے سرکاری وصول کنندہ، موضوع اور مکمل شکایت چیک کریں۔ کچھ بھی خودکار طور پر نہیں بھیجا جاتا — آپ کی ایپ تیار کھلے گی، بس Send دبائیں۔",
    modalCloseLabel: "تصدیقی ونڈو بند کریں",
    recipientLabel: "سرکاری محکمہ وصول کنندہ (To)",
    subjectFieldLabel: "ای میل کا موضوع",
    messageFieldLabel: "تیار شدہ مکمل شکایت",
    permissionCheckboxLabel:
      "میں نے اپنی شکایت کی تفصیلات چیک کر لی ہیں اور اس سرکاری محکمہ کو بھیجنے کے لیے اپنی ای میل / واٹس ایپ ایپ کھولنے کی اجازت دیتا/دیتی ہوں۔",
    permissionRequiredHint: "آگے بڑھنے کے لیے اوپر اجازت کے خانے پر نشان لگائیں۔",
    openGmailBtn: "Gmail کھولیں اور بھیجیں",
    openMailAppBtn: "ڈیفالٹ ای میل ایپ کھولیں",
    openWhatsAppBtn: "سرکاری واٹس ایپ کھولیں اور بھیجیں",
    copyMessageBtn: "تیار متن کاپی کریں",
    copiedBtn: "کاپی ہو گیا",
    saveToTrackerHint: "اسے 'میری شکایات' میں بھی محفوظ کریں",
    cancelUsePortalBtn: "نہیں شکریہ، میں سرکاری پورٹل استعمال کروں گا/گی",
    verifyRecipientTip:
      "مشورہ: بھیجنے کے بعد ملنے والا ٹکٹ نمبر 'میری شکایات' میں محفوظ کر لیں تاکہ آسانی سے ٹریک کر سکیں۔",
  },
};

export function getDirectSubmissionStrings(language: string): DirectSubmissionStrings {
  return BY_LANGUAGE[language] ?? ENGLISH;
}

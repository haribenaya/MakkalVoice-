export interface CivicShowcaseStrings {
  slide1Title: string;
  slide1Caption: string;
  slide2Title: string;
  slide2Caption: string;
  slide3Title: string;
  slide3Caption: string;
  stripHeading: string;
  stripSub: string;
  liveGmailConfirmTitle: string;
  liveGmailConfirmDesc: string;
  liveWhatsAppConfirmTitle: string;
  liveWhatsAppConfirmDesc: string;
  recipientEmailLabel: string;
  recipientWhatsAppLabel: string;
  openGmailPrefilledBtn: string;
  openWhatsAppPrefilledBtn: string;
  cancelBtn: string;
  liveActionsTitle: string;
  actionGmail: string;
  actionWhatsApp: string;
  actionPdf: string;
  actionPrint: string;
  actionTracker: string;
  actionPortal: string;
  toastGmailOpened: string;
  toastWhatsAppOpened: string;
}

const EN: CivicShowcaseStrings = {
  slide1Title: "Constitution & Equal Justice",
  slide1Caption: "Every citizen has the constitutional right to be heard clearly and respectfully.",
  slide2Title: "Law, Order & Accountability",
  slide2Caption: "Structured formal letters routed directly to verified national and state portals.",
  slide3Title: "Citizen Voice & Seva",
  slide3Caption: "Speak naturally in your own mother tongue — zero typing or English forms required.",
  stripHeading: "Built on Constitutional Rights & Public Accountability",
  stripSub: "Dignified civic grievance redressal, RTI access, and verified Indian governance channels.",
  liveGmailConfirmTitle: "Permission to Open Gmail (Pre-filled)",
  liveGmailConfirmDesc: "Review or edit the email address below, then open Gmail with To, Subject, and Letter already typed for you.",
  liveWhatsAppConfirmTitle: "Permission to Open Official WhatsApp",
  liveWhatsAppConfirmDesc: "Review the official WhatsApp number and message below, then open WhatsApp ready to tap Send.",
  recipientEmailLabel: "Official / Recipient Email ID",
  recipientWhatsAppLabel: "Verified Official WhatsApp Number",
  openGmailPrefilledBtn: "Allow & Open Gmail",
  openWhatsAppPrefilledBtn: "Allow & Open WhatsApp",
  cancelBtn: "Cancel",
  liveActionsTitle: "Full Dashboard Actions (Say or Tap)",
  actionGmail: "Gmail",
  actionWhatsApp: "WhatsApp",
  actionPdf: "PDF",
  actionPrint: "Print",
  actionTracker: "Track",
  actionPortal: "Portal",
  toastGmailOpened: "Opened Gmail with recipient, subject, and complaint letter pre-filled.",
  toastWhatsAppOpened: "Opened Official WhatsApp with your complaint ready to send.",
};

const LOCALIZED: Record<string, Partial<CivicShowcaseStrings>> = {
  Tamil: {
    slide1Title: "அரசியலமைப்பு மற்றும் சமநீதி",
    slide1Caption: "ஒவ்வொரு குடிமகனின் குரலும் மரியாதையுடன் கேட்கப்படும் உரிமை.",
    slide2Title: "சட்டம், ஒழுங்கு மற்றும் பொறுப்புணர்வு",
    slide2Caption: "சரிபார்க்கப்பட்ட அரசு இணையதளங்களுக்கு முறையான புகார் கடிதங்கள்.",
    slide3Title: "மக்கள் குரல் மற்றும் சேவை",
    slide3Caption: "உங்கள் தாய்மொழியில் இயல்பாகப் பேசுங்கள் — தட்டச்சு தேவையில்லை.",
    stripHeading: "அரசியலமைப்பு உரிமைகள் மற்றும் பொதுப் பொறுப்புணர்வு",
    stripSub: "குடிமக்கள் குறைதீர்ப்பு, தகவல் அறியும் உரிமை மற்றும் சரிபார்க்கப்பட்ட அரசு சேவைகள்.",
    liveGmailConfirmTitle: "Gmail திறக்க அனுமதி (நிரப்பப்பட்ட கடிதம்)",
    liveGmailConfirmDesc: "கீழே உள்ள மின்னஞ்சலை சரிபார்த்து, Gmail-ஐத் திறந்து Send அழுத்தவும்.",
    liveWhatsAppConfirmTitle: "அதிகாரப்பூர்வ WhatsApp திறக்க அனுமதி",
    liveWhatsAppConfirmDesc: "கீழே உள்ள எண்ணை சரிபார்த்து WhatsApp-ஐத் திறந்து Send அழுத்தவும்.",
    recipientEmailLabel: "அதிகாரப்பூர்வ மின்னஞ்சல் முகவரி",
    recipientWhatsAppLabel: "அதிகாரப்பூர்வ WhatsApp எண்",
    openGmailPrefilledBtn: "அனுமதித்து Gmail திற",
    openWhatsAppPrefilledBtn: "அனுமதித்து WhatsApp திற",
    cancelBtn: "ரத்து செய்",
    liveActionsTitle: "முழு டாஷ்போர்டு செயல்கள் (பேசவும் / தொடவும்)",
    toastGmailOpened: "மின்னஞ்சல், தலைப்பு மற்றும் புகார் கடிதத்துடன் Gmail திறக்கப்பட்டது.",
    toastWhatsAppOpened: "புகார் செய்தியுடன் அதிகாரப்பூர்வ WhatsApp திறக்கப்பட்டது.",
  },
  Hindi: {
    slide1Title: "संविधान और समान न्याय",
    slide1Caption: "हर नागरिक को सम्मान के साथ अपनी बात रखने का संवैधानिक अधिकार है।",
    slide2Title: "कानून, व्यवस्था और जवाबदेही",
    slide2Caption: "सत्यापित राष्ट्रीय और राज्य पोर्टलों के लिए औपचारिक शिकायत पत्र।",
    slide3Title: "नागरिक आवाज़ और जनसेवा",
    slide3Caption: "अपनी मातृभाषा में सहजता से बोलें — टाइपिंग की आवश्यकता नहीं।",
    stripHeading: "संवैधानिक अधिकार और जन-जवाबदेही पर आधारित",
    stripSub: "नागरिक शिकायत निवारण, आरटीआई और सत्यापित सरकारी पोर्टल मार्गदर्शन।",
    liveGmailConfirmTitle: "Gmail खोलने की अनुमति (पहले से भरा पत्र)",
    liveGmailConfirmDesc: "नीचे ईमेल आईडी जांचें, फिर To, Subject और पत्र के साथ Gmail खोलकर Send दबाएं।",
    liveWhatsAppConfirmTitle: "आधिकारिक WhatsApp खोलने की अनुमति",
    liveWhatsAppConfirmDesc: "आधिकारिक WhatsApp नंबर जांचें और तैयार शिकायत संदेश के साथ खोलें।",
    recipientEmailLabel: "आधिकारिक / प्राप्तकर्ता ईमेल आईडी",
    recipientWhatsAppLabel: "सत्यापित आधिकारिक WhatsApp नंबर",
    openGmailPrefilledBtn: "अनुमति दें और Gmail खोलें",
    openWhatsAppPrefilledBtn: "अनुमति दें और WhatsApp खोलें",
    cancelBtn: "रद्द करें",
    liveActionsTitle: "संपूर्ण डैशबोर्ड कार्य (बोलें या टैप करें)",
    toastGmailOpened: "ईमेल, विषय और शिकायत पत्र के साथ Gmail खुल गया।",
    toastWhatsAppOpened: "तैयार शिकायत के साथ आधिकारिक WhatsApp खुल गया।",
  },
  Telugu: {
    slide1Title: "రాజ్యాంగం మరియు సమాన న్యాయం",
    slide1Caption: "ప్రతి పౌరుడి సమస్య గౌరవంగా వినబడే రాజ్యాంగ హక్కు.",
    slide2Title: "చట్టం, క్రమశిక్షణ మరియు జవాబుదారీతనం",
    slide2Caption: "ధృవీకరించబడిన ప్రభుత్వ పోర్టల్‌లకు అధికారిక ఫిర్యాదు లేఖలు.",
    slide3Title: "పౌర గళం మరియు సేవ",
    slide3Caption: "మీ మాతృభాషలో సహజంగా మాట్లాడండి — టైపింగ్ అవసరం లేదు.",
    stripHeading: "రాజ్యాంగ హక్కులు మరియు ప్రజా జవాబుదారీతనం",
    stripSub: "పౌర ఫిర్యాదుల పరిష్కారం, ఆర్టీఐ మరియు ధృవీకరించబడిన ప్రభుత్వ పోర్టల్స్.",
    liveGmailConfirmTitle: "Gmail తెరవడానికి అనుమతి",
    liveWhatsAppConfirmTitle: "అధికారిక WhatsApp తెరవడానికి అనుమతి",
    openGmailPrefilledBtn: "అనుమతించి Gmail తెరవండి",
    openWhatsAppPrefilledBtn: "అనుమతించి WhatsApp తెరవండి",
    cancelBtn: "రద్దు చేయండి",
  },
  Kannada: {
    slide1Title: "ಸಂವಿಧಾನ ಮತ್ತು ಸಮಾನ ನ್ಯಾಯ",
    slide1Caption: "ಪ್ರತಿ ನಾಗರಿಕರ ಧ್ವನಿ ಗೌರವದಿಂದ ಕೇಳಲ್ಪಡುವ ಸಂವಿಧಾನಾತ್ಮಕ ಹಕ್ಕು.",
    slide2Title: "ಕಾನೂನು, ಸುವ್ಯವಸ್ಥೆ ಮತ್ತು ಹೊಣೆಗಾರಿಕೆ",
    slide2Caption: "ಪರಿಶೀಲಿಸಿದ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗಳಿಗೆ ಅಧಿಕೃತ ದೂರು ಪತ್ರಗಳು.",
    slide3Title: "ನಾಗರಿಕ ಧ್ವನಿ ಮತ್ತು ಸೇವೆ",
    slide3Caption: "ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಸಹಜವಾಗಿ ಮಾತನಾಡಿ — ಟೈಪಿಂಗ್ ಅಗತ್ಯವಿಲ್ಲ.",
    stripHeading: "ಸಂವಿಧಾನಾತ್ಮಕ ಹಕ್ಕುಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಹೊಣೆಗಾರಿಕೆ",
    openGmailPrefilledBtn: "ಅನುಮತಿಸಿ Gmail ತೆರೆಯಿರಿ",
    openWhatsAppPrefilledBtn: "ಅನುಮತಿಸಿ WhatsApp ತೆರೆಯಿರಿ",
    cancelBtn: "ರದ್ದುಮಾಡಿ",
  },
  Malayalam: {
    slide1Title: "ഭരണഘടനയും തുല്യനീതിയും",
    slide1Caption: "ഓരോ പൗരന്റെയും ശബ്ദം ആദരവോടെ കേൾക്കപ്പെടാനുള്ള ഭരണഘടനാ അവകാശം.",
    slide2Title: "നിയമവും ക്രമസമാധാനവും ഉത്തരവാദിത്തവും",
    slide2Caption: "അംഗീകൃത സർക്കാർ പോർട്ടലുകളിലേക്ക് ഔദ്യോഗിക പരാതി കത്തുകൾ.",
    slide3Title: "പൗര ശബ്ദവും സേവനവും",
    slide3Caption: "നിങ്ങളുടെ മാതൃഭാഷയിൽ സ്വാഭാവികമായി സംസാരിക്കൂ — ടൈപ്പിംഗ് ആവശ്യമില്ല.",
    stripHeading: "ഭരണഘടനാ അവകാശങ്ങളും പൊതു ഉത്തരവാദിത്തവും",
    openGmailPrefilledBtn: "അനുമതി നൽകി Gmail തുറക്കുക",
    openWhatsAppPrefilledBtn: "അനുമതി നൽകി WhatsApp തുറക്കുക",
    cancelBtn: "റദ്ദാക്കുക",
  },
  Bengali: {
    slide1Title: "সংবিধান ও সমান ন্যায়বিচার",
    slide1Caption: "প্রতিটি নাগরিকের কথা সম্মানের সাথে শোনার সাংবিধানিক অধিকার।",
    slide2Title: "আইন, শৃঙ্খলা ও জবাবদিহিতা",
    slide2Caption: "যাচাইকৃত সরকারি পোর্টালের জন্য আনুষ্ঠানিক অভিযোগপত্র।",
    slide3Title: "নাগরিক কণ্ঠ ও জনসেবা",
    slide3Caption: "নিজের মাতৃভাষায় স্বাভাবিকভাবে কথা বলুন — টাইপিংয়ের প্রয়োজন নেই।",
    openGmailPrefilledBtn: "অনুমতি দিন ও Gmail খুলুন",
    openWhatsAppPrefilledBtn: "অনুমতি দিন ও WhatsApp খুলুন",
  },
  Marathi: {
    slide1Title: "संविधान आणि समान न्याय",
    slide1Caption: "प्रत्येक नागरिकाचा आवाज आदराने ऐकला जाण्याचा घटनात्मक अधिकार.",
    slide2Title: "कायदा, सुव्यवस्था आणि जबाबदारी",
    slide2Caption: "सत्यापित सरकारी पोर्टलसाठी औपचारिक तक्रार पत्रे.",
    slide3Title: "नागरिक आवाज आणि जनसेवा",
    slide3Caption: "तुमच्या मातृभाषेत सहज बोला — टायपिंगची गरज नाही.",
    openGmailPrefilledBtn: "परवानगी द्या आणि Gmail उघडा",
    openWhatsAppPrefilledBtn: "परवानगी द्या आणि WhatsApp उघडा",
  },
  Gujarati: {
    slide1Title: "બંધારણ અને સમાન ન્યાય",
    slide1Caption: "દરેક નાગરિકનો અવાજ સન્માનપૂર્વક સાંભળવાનો બંધારણીય અધિકાર.",
    slide2Title: "કાયદો, વ્યવસ્થા અને જવાબદારી",
    slide2Caption: "ચકાસાયેલ સરકારી પોર્ટલ માટે ઔપचारिक ફરિયાદ પત્રો.",
    slide3Title: "નાગરિક અવાજ અને સેવા",
    slide3Caption: "તમારી માતૃભાષામાં સરળતાથી બોલો — ટાઇપિંગની જરૂર નથી.",
    openGmailPrefilledBtn: "પરવાનગી આપો અને Gmail ખોલો",
    openWhatsAppPrefilledBtn: "પરવાનગી આપો અને WhatsApp ખોલો",
  },
  Punjabi: {
    slide1Title: "ਸੰਵਿਧਾਨ ਅਤੇ ਬਰਾਬਰ ਨਿਆਂ",
    slide1Caption: "ਹਰ ਨਾਗਰਿਕ ਦੀ ਆਵਾਜ਼ ਸਤਿਕਾਰ ਨਾਲ ਸੁਣੇ ਜਾਣ ਦਾ ਸੰਵਿਧਾਨਕ ਅਧਿਕਾਰ।",
    slide2Title: "ਕਾਨੂੰਨ, ਵਿਵਸਥਾ ਅਤੇ ਜਵਾਬਦੇਹੀ",
    slide2Caption: "ਪ੍ਰਮਾਣਿਤ ਸਰਕਾਰੀ ਪੋਰਟਲਾਂ ਲਈ ਰਸਮੀ ਸ਼ਿਕਾਇਤ ਪੱਤਰ।",
    slide3Title: "ਨਾਗਰਿਕ ਆਵਾਜ਼ ਅਤੇ ਸੇਵਾ",
    slide3Caption: "ਆਪਣੀ ਮਾਂ-ਬੋਲੀ ਵਿੱਚ ਕੁਦਰਤੀ ਤੌਰ 'ਤੇ ਬੋਲੋ — ਟਾਈਪਿੰਗ ਦੀ ਲੋੜ ਨਹੀਂ।",
    openGmailPrefilledBtn: "ਇਜਾਜ਼ਤ ਦਿਓ ਅਤੇ Gmail ਖੋਲ੍ਹੋ",
    openWhatsAppPrefilledBtn: "ਇਜਾਜ਼ਤ ਦਿਓ ਅਤੇ WhatsApp ਖੋਲ੍ਹੋ",
  },
  Odia: {
    slide1Title: "ସମ୍ବିଧାନ ଏବଂ ସମାନ ନ୍ୟାୟ",
    slide2Title: "ଆଇନ, ଶୃଙ୍ଖଳା ଏବଂ ଉତ୍ତରଦାୟିତ୍ୱ",
    slide3Title: "ନାଗରିକ ସ୍ୱର ଏବଂ ସେବା",
    openGmailPrefilledBtn: "ଅନୁମତି ଦିଅନ୍ତୁ ଓ Gmail ଖୋଲନ୍ତୁ",
    openWhatsAppPrefilledBtn: "ଅନୁମତି ଦିଅନ୍ତୁ ଓ WhatsApp ଖୋଲନ୍ତୁ",
  },
  Assamese: {
    slide1Title: "সংবিধান আৰু সমান ন্যায়",
    slide2Title: "আইন, শৃংখলা আৰু দায়বদ্ধতা",
    slide3Title: "নাগৰিক কণ্ঠ আৰু সেৱা",
    openGmailPrefilledBtn: "অনুমতি দিয়ক আৰু Gmail খোলক",
    openWhatsAppPrefilledBtn: "অনুমতি দিয়ক আৰু WhatsApp খোলক",
  },
  Urdu: {
    slide1Title: "آئین اور مساوی انصاف",
    slide1Caption: "ہر شہری کی آواز احترام کے ساتھ سنے جانے کا آئینی حق۔",
    slide2Title: "قانون، نظم و نسق اور جوابدہی",
    slide2Caption: "تصدیق شدہ سرکاری پورٹلز کے لیے رسمی شکایت نامے۔",
    slide3Title: "عوامی آواز اور خدمت",
    slide3Caption: "اپنی مادری زبان میں قدرتی طور پر بولیں — ٹائپنگ کی ضرورت نہیں۔",
    openGmailPrefilledBtn: "اجازت دیں اور Gmail کھولیں",
    openWhatsAppPrefilledBtn: "اجازت دیں اور WhatsApp کھولیں",
  },
};

export function getCivicShowcaseStrings(language: string): CivicShowcaseStrings {
  return {
    ...EN,
    ...(LOCALIZED[language] ?? {}),
  };
}

// Localized Official Portal directory cards, Portal Language Support notices,
// and Localized Sample Scenarios across MakkalVoice languages.

import type { ComplaintCategory, DocumentChecklistItem, PortalEntry } from "../types";

export interface LocalizedPortalCopy {
  name: string;
  authorityScope: string;
  description: string;
}

// Which official portals natively offer regional/multi-language toggles vs English-only
export const PORTAL_LANGUAGE_SUPPORT: Record<
  string,
  { hasToggle: boolean; supportedNoteKey: "tamilAndEnglish" | "hindiAndEnglish" | "multiIndian" | "englishOnly" }
> = {
  tn_cm_helpline: { hasToggle: true, supportedNoteKey: "tamilAndEnglish" },
  gcc_chennai: { hasToggle: true, supportedNoteKey: "tamilAndEnglish" },
  cmwssb_chennai: { hasToggle: true, supportedNoteKey: "tamilAndEnglish" },
  tangedco_tn: { hasToggle: true, supportedNoteKey: "tamilAndEnglish" },
  cpgrams: { hasToggle: true, supportedNoteKey: "hindiAndEnglish" },
  national_consumer: { hasToggle: true, supportedNoteKey: "hindiAndEnglish" },
  railmadad: { hasToggle: true, supportedNoteKey: "multiIndian" },
  rbi_cms: { hasToggle: true, supportedNoteKey: "hindiAndEnglish" },
  cybercrime_india: { hasToggle: true, supportedNoteKey: "hindiAndEnglish" },
  nalsa_legal: { hasToggle: true, supportedNoteKey: "hindiAndEnglish" },
  rti_online: { hasToggle: true, supportedNoteKey: "hindiAndEnglish" },
};

const PORTAL_TRANSLATIONS: Record<string, Record<string, LocalizedPortalCopy>> = {
  Tamil: {
    cpgrams: {
      name: "CPGRAMS — மத்திய அரசின் பொதுமக்கள் குறைதீர் போர்ட்டல்",
      authorityScope: "இந்திய அரசு — மத்திய மற்றும் மாநில மேல்முறையீடு",
      description:
        "மத்திய அமைச்சகங்கள், பொதுத்துறை சேவைகள், அஞ்சல், தொலைத்தொடர்பு மற்றும் தீர்க்கப்படாத மாநில புகார்களுக்கான அதிகாரப்பூர்வ தளம்.",
    },
    national_consumer: {
      name: "தேசிய நுகர்வோர் உதவி மையம் (NCH)",
      authorityScope: "நுகர்வோர் விவகாரத் துறை, இந்திய அரசு",
      description:
        "அதிக கட்டணம், பழுதான பொருட்கள், ஆன்லைன் பணம் திரும்பப் பெறுதல் மற்றும் சேவை குறைபாடு புகார்களுக்கான தளம்.",
    },
    railmadad: {
      name: "ரயில் மதாத் — இந்திய ரயில்வே புகார் தளம்",
      authorityScope: "ரயில்வே அமைச்சகம், இந்திய அரசு",
      description:
        "ரயில் தாமதம், நிலைய வசதிகள், பெட்டி தூய்மை, டிக்கெட் பணம் திரும்பப் பெறுதல் மற்றும் பயணிகள் பாதுகாப்பு புகார்கள்.",
    },
    rbi_cms: {
      name: "RBI வங்கி புகார் மேலாண்மை அமைப்பு (CMS)",
      authorityScope: "இந்திய ரிசர்வ் வங்கி — வங்கி குறைதீர்ப்பாளர்",
      description:
        "தீர்க்கப்படாத வங்கி, ஏடிஎம், UPI பரிவர்த்தனை தோல்வி மற்றும் கடன் அட்டை புகார்களுக்கான அதிகாரப்பூர்வ தளம்.",
    },
    cybercrime_india: {
      name: "தேசிய சைபர் குற்றப் புகார் தளம்",
      authorityScope: "உள்துறை அமைச்சகம், இந்திய அரசு",
      description:
        "ஆன்லைன் நிதி மோசடி, UPI ஏமாற்று, இணையத் தொல்லை மற்றும் டிஜிட்டல் குற்றங்களுக்கான அதிகாரப்பூர்வ புகார் தளம்.",
    },
    nalsa_legal: {
      name: "NALSA — தேசிய சட்டப் பணிகள் ஆணையம்",
      authorityScope: "இலவச சட்ட உதவி & மாவட்ட சட்டப் பணிகள் ஆணையம்",
      description:
        "தகுதியான குடிமக்களுக்கு இலவச சட்ட உதவி, லோக் அதாலத் சமரசம் மற்றும் சட்ட ஆதரவு பெற விண்ணப்பிக்கும் தளம்.",
    },
    tn_cm_helpline: {
      name: "தமிழ்நாடு முதலமைச்சரின் முகவரி (CM Helpline)",
      authorityScope: "தமிழ்நாடு அரசு — ஒருங்கிணைந்த குறைதீர் தளம்",
      description:
        "மாநகராட்சி, வருவாய், ரேஷன் கார்டு, ஓய்வூதியம், குடிநீர், மின்சாரம் மற்றும் மாவட்ட புகார்களுக்கான தமிழ்நாடு அரசின் அதிகாரப்பூர்வ தளம்.",
    },
    gcc_chennai: {
      name: "பெருநகர சென்னை மாநகராட்சி (நம்ம சென்னை)",
      authorityScope: "பெருநகர சென்னை மாநகராட்சி — குடிமைச் சேவைகள்",
      description:
        "சென்னை தெருவிளக்குகள், சாலைகள், குழிகள், மழைநீர் வடிகால், குப்பை சேகரிப்பு மற்றும் பொது சுகாதார புகார்கள்.",
    },
    cmwssb_chennai: {
      name: "சென்னை குடிநீர் & கழிவுநீர் வாரியம் (CMWSSB)",
      authorityScope: "சென்னை பெருநகர குடிநீர் வழங்கல் மற்றும் கழிவுநீரகற்று வாரியம்",
      description:
        "சென்னையில் குடிநீர் விநியோகம், குழாய் கசிவு, கழிவுநீர் வழிதல் மற்றும் வடிகால் அடைப்புக்கான நேரடி அரசு தளம்.",
    },
    tangedco_tn: {
      name: "தமிழ்நாடு மின்சார வாரியம் (TANGEDCO / மின்னகம்)",
      authorityScope: "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மான கழகம்",
      description:
        "தமிழ்நாடு முழுவதும் மின்தடை, சேதமடைந்த மின்கம்பம், தொங்கும் மின்கம்பி மற்றும் மின் கட்டண புகார்கள்.",
    },
    karnataka_janaspandana: {
      name: "ஜனஸ்பந்தனா — கர்நாடகா ஒருங்கிணைந்த குறைதீர் தளம்",
      authorityScope: "கர்நாடக அரசு",
      description: "கர்நாடகாவில் உள்ள மாவட்ட, நகராட்சி மற்றும் அரசு சேவை புகார்களுக்கான அதிகாரப்பூர்வ தளம்.",
    },
    bbmp_bengaluru: {
      name: "BBMP சஹாயா 2.0 — பெங்களூரு மாநகராட்சி புகார் தளம்",
      authorityScope: "பெங்களூரு மாநகராட்சி (BBMP)",
      description: "பெங்களூரு தெருவிளக்குகள், சாலைகள், குப்பை மற்றும் வடிகால் புகார்களுக்கான நேரடி தளம்.",
    },
    bescom_karnataka: {
      name: "BESCOM — பெங்களூரு மின்சார விநியோக நிறுவனம்",
      authorityScope: "கர்நாடக அரசு — மின்சாரத் துறை",
      description: "பெங்களூரு மின்தடை, மீட்டர் கட்டணம் மற்றும் மின்கம்பி பாதுகாப்பு புகார்கள்.",
    },
    maharashtra_aaple_sarkar: {
      name: "ஆப்லே சர்க்கார் — மகாராஷ்டிரா குறைதீர் தளம்",
      authorityScope: "மகாராஷ்டிரா அரசு",
      description: "மகாராஷ்டிரா முழுவதும் மாவட்ட, நகராட்சி மற்றும் அரசு திட்ட புகார்களுக்கான அதிகாரப்பூர்வ தளம்.",
    },
    mahavitaran_mh: {
      name: "மஹாவிதரண் (MSEDCL) — மகாராஷ்டிரா மின்சார தளம்",
      authorityScope: "மகாராஷ்டிரா மாநில மின்சார விநியோக நிறுவனம்",
      description: "மகாராஷ்டிராவில் மின்தடை, அதிக மின் கட்டணம் மற்றும் மீட்டர் புகார்கள்.",
    },
  },
  Hindi: {
    cpgrams: {
      name: "CPGRAMS — केंद्रीय लोक शिकायत पोर्टल (DARPG)",
      authorityScope: "भारत सरकार — केंद्रीय और राज्य स्तरीय शिकायत",
      description:
        "केंद्रीय मंत्रालयों, सार्वजनिक सेवाओं, डाक, दूरसंचार और अनसुलझी राज्य शिकायतों के लिए भारत सरकार का आधिकारिक पोर्टल।",
    },
    national_consumer: {
      name: "राष्ट्रीय उपभोक्ता हेल्पलाइन (NCH)",
      authorityScope: "उपभोक्ता मामले विभाग, भारत सरकार",
      description:
        "अधिक बिलिंग, खराब उत्पाद, ई-कॉमर्स रिफंड और सेवा में कमी की शिकायतों के लिए आधिकारिक पोर्टल।",
    },
    railmadad: {
      name: "रेल मदद — भारतीय रेलवे शिकायत पोर्टल",
      authorityScope: "रेल मंत्रालय, भारत सरकार",
      description:
        "ट्रेन देरी, स्टेशन सुविधा, कोच सफाई, टिकट रिफंड और यात्री सुरक्षा शिकायतों के लिए आधिकारिक पोर्टल।",
    },
    rbi_cms: {
      name: "RBI शिकायत प्रबंधन प्रणाली (CMS)",
      authorityScope: "भारतीय रिज़र्व बैंक — बैंकिंग लोकपाल",
      description:
        "अनसुलझे बैंक, एटीएम, यूपीआई लेनदेन विफलता और क्रेडिट कार्ड शिकायतों के लिए आधिकारिक पोर्टल।",
    },
    cybercrime_india: {
      name: "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल",
      authorityScope: "गृह मंत्रालय, भारत सरकार",
      description:
        "ऑनलाइन वित्तीय धोखाधड़ी, यूपीआई स्कैम, साइबर उत्पीड़न और डिजिटल अपराधों की रिपोर्ट के लिए आधिकारिक पोर्टल।",
    },
    nalsa_legal: {
      name: "NALSA — राष्ट्रीय विधिक सेवा प्राधिकरण",
      authorityScope: "मुफ्त कानूनी सहायता और जिला विधिक सेवा प्राधिकरण",
      description:
        "पात्र नागरिकों के लिए मुफ्त कानूनी सहायता, लोक अदालत मध्यस्थता और कानूनी मदद का आधिकारिक पोर्टल।",
    },
    tn_cm_helpline: {
      name: "तमिलनाडु मुख्यमंत्री हेल्पलाइन (CM Helpline)",
      authorityScope: "तमिलनाडु सरकार — एकीकृत शिकायत पोर्टल",
      description:
        "नगरपालिका, राजस्व, राशन कार्ड, पेंशन, पानी, बिजली और जिला शिकायतों के लिए तमिलनाडु का आधिकारिक पोर्टल।",
    },
    mahavitaran_mh: {
      name: "महावितरण (MSEDCL) — महाराष्ट्र बिजली पोर्टल",
      authorityScope: "महाराष्ट्र राज्य विद्युत वितरण कंपनी",
      description:
        "महाराष्ट्र में बिजली कटौती, अधिक बिल, मीटर विवाद और लाइन सुरक्षा की शिकायतों के लिए आधिकारिक पोर्टल।",
    },
  },
  Telugu: {
    cpgrams: {
      name: "CPGRAMS — కేంద్ర ప్రజా ఫిర్యాదుల పోర్టల్",
      authorityScope: "భారత ప్రభుత్వం — కేంద్ర & రాష్ట్ర స్థాయి",
      description: "కేంద్ర మంత్రిత్వ శాఖలు, ప్రభుత్వ సేవలు మరియు పరిష్కారం కాని ఫిర్యాదుల అధికారిక పోర్టల్.",
    },
    national_consumer: {
      name: "జాతీయ వినియోగదారుల హెల్ప్‌లైన్ (NCH)",
      authorityScope: "వినియోగదారుల వ్యవహారాల శాఖ, భారత ప్రభుత్వం",
      description: "అధిక బిల్లులు, లోపభూయిష్ట ఉత్పత్తులు మరియు రీఫండ్ సమస్యల కోసం అధికారిక పోర్టల్.",
    },
    tn_cm_helpline: {
      name: "తమిళనాడు సీఎం హెల్ప్‌లైన్ పోర్టల్",
      authorityScope: "తమిళనాడు ప్రభుత్వం",
      description: "మున్సిపల్, రెవెన్యూ, రేషన్ కార్డ్, నీరు మరియు విద్యుత్ ఫిర్యాదుల అధికారిక పోర్టల్.",
    },
    railmadad: {
      name: "రైల్ మదద్ — భారతీయ రైల్వే ఫిర్యాదు పోర్టల్",
      authorityScope: "రైల్వే మంత్రిత్వ శాఖ, భారత ప్రభుత్వం",
      description: "రైలు ఆలస్యం, స్టేషన్ సౌకర్యాలు, శుభ్రత మరియు ప్రయాణికుల భద్రత ఫిర్యాదులు.",
    },
    cybercrime_india: {
      name: "జాతీయ సైబర్ క్రైమ్ రిపోర్టింగ్ పోర్టల్",
      authorityScope: "హోం వ్యవహారాల మంత్రిత్వ శాఖ, భారత ప్రభుత్వం",
      description: "ఆన్‌లైన్ ఆర్థిక మోసాలు, UPI స్కామ్ మరియు సైబర్ నేరాల ఫిర్యాదుల పోర్టల్.",
    },
    nalsa_legal: {
      name: "NALSA — జాతీయ న్యాయ సేవాధికార సంస్థ",
      authorityScope: "ఉచిత న్యాయ సహాయం",
      description: "అర్హులైన పౌరులకు ఉచిత న్యాయ సహాయం మరియు లోక్ అదాలత్ కోసం అధికారిక పోర్టల్.",
    },
  },
  Kannada: {
    cpgrams: {
      name: "CPGRAMS — ಕೇಂದ್ರ ಸಾರ್ವಜನಿಕ ಕುಂದುಕೊರತೆ ಪೋರ್ಟಲ್",
      authorityScope: "ಭಾರತ ಸರ್ಕಾರ",
      description: "ಕೇಂದ್ರ ಸಚಿವಾಲಯಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳ ದೂರುಗಳಿಗಾಗಿ ಅಧಿಕೃತ ಪೋರ್ಟಲ್.",
    },
    national_consumer: {
      name: "ರಾಷ್ಟ್ರೀಯ ಗ್ರಾಹಕ ಸಹಾಯವಾಣಿ (NCH)",
      authorityScope: "ಗ್ರಾಹಕ ವ್ಯವಹಾರಗಳ ಇಲಾಖೆ, ಭಾರತ ಸರ್ಕಾರ",
      description: "ಅಧಿಕ ಬಿಲ್, ದೋಷಪೂರಿತ ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಸೇವಾ ನ್ಯೂನತೆಗಳ ದೂರುಗಳಿಗೆ ಅಧಿಕೃತ ಪೋರ್ಟಲ್.",
    },
    tn_cm_helpline: {
      name: "ತಮಿಳುನಾಡು ಮುಖ್ಯಮಂತ್ರಿ ಸಹಾಯವಾಣಿ",
      authorityScope: "ತಮಿಳುನಾಡು ಸರ್ಕಾರ",
      description: "ಪುರಸಭೆ, ರೇಷನ್ ಕಾರ್ಡ್, ನೀರು ಮತ್ತು ವಿದ್ಯುತ್ ದೂರುಗಳಿಗೆ ಅಧಿಕೃತ ರಾಜ್ಯ ಪೋರ್ಟಲ್.",
    },
    railmadad: {
      name: "ರೈಲ್ ಮದದ್ — ಭಾರತೀಯ ರೈಲ್ವೆ ದೂರು ಪೋರ್ಟಲ್",
      authorityScope: "ರೈಲ್ವೆ ಸಚಿವಾಲಯ, ಭಾರತ ಸರ್ಕಾರ",
      description: "ರೈಲು ವಿಳಂಬ, ಸ್ವಚ್ಛತೆ, ಟಿಕೆಟ್ ಮರುಪಾವತಿ ಮತ್ತು ಪ್ರಯಾಣಿಕರ ಸುರಕ್ಷತೆ ದೂರುಗಳು.",
    },
    cybercrime_india: {
      name: "ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಅಪರಾಧ ವರದಿ ಪೋರ್ಟಲ್",
      authorityScope: "ಗೃಹ ಸಚಿವಾಲಯ, ಭಾರತ ಸರ್ಕಾರ",
      description: "ಆನ್‌ಲೈನ್ ವಂಚನೆ, UPI ಮೋಸ ಮತ್ತು ಸೈಬರ್ ಅಪರಾಧಗಳ ದೂರುಗಳಿಗೆ ಅಧಿಕೃತ ಪೋರ್ಟಲ್.",
    },
    nalsa_legal: {
      name: "NALSA — ರಾಷ್ಟ್ರೀಯ ಕಾನೂನು ಸೇವಾ ಪ್ರಾಧಿಕಾರ",
      authorityScope: "ಉಚಿತ ಕಾನೂನು ನೆರವು",
      description: "ಅರ್ಹ ನಾಗರಿಕರಿಗೆ ಉಚಿತ ಕಾನೂನು ನೆರವು ಮತ್ತು ಲೋಕ್ ಅದಾಲತ್ ಮಧ್ಯಸ್ಥಿಕೆ ಪೋರ್ಟಲ್.",
    },
  },
  Malayalam: {
    cpgrams: {
      name: "CPGRAMS — കേന്ദ്ര പൊതുജന പരാതി പരിഹാര പോർട്ടൽ",
      authorityScope: "ഭാരത സർക്കാർ",
      description: "കേന്ദ്ര മന്ത്രാലയങ്ങളും പൊതുസേവനങ്ങളുമായി ബന്ധപ്പെട്ട പരാതികൾക്കുള്ള ഔദ്യോഗിക പോർട്ടൽ.",
    },
    national_consumer: {
      name: "ദേശീയ ഉപഭോക്തൃ ഹെൽപ്പ്‌ലൈൻ (NCH)",
      authorityScope: "ഉപഭോക്തൃകാര്യ വകുപ്പ്, ഭാരത സർക്കാർ",
      description: "അമിത ബിൽ, തകരാറുള്ള ഉൽപ്പന്നങ്ങൾ, റീഫണ്ട് പ്രശ്നങ്ങൾ എന്നിവയ്ക്കുള്ള ഔദ്യോഗിക പോർട്ടൽ.",
    },
    tn_cm_helpline: {
      name: "തമിഴ്നാട് മുഖ്യമന്ത്രിയുടെ ഹെൽപ്പ്‌ലൈൻ",
      authorityScope: "തമിഴ്നാട് സർക്കാർ",
      description: "മുനിസിപ്പൽ, റേഷൻ കാർഡ്, കുടിവെള്ളം, വൈദ്യുതി പരാതികൾക്കുള്ള ഔദ്യോഗിക സംസ്ഥാന പോർട്ടൽ.",
    },
    railmadad: {
      name: "റെയിൽ മദദ് — ഇന്ത്യൻ റെയിൽവേ പരാതി പോർട്ടൽ",
      authorityScope: "റെയിൽവേ മന്ത്രാലയം, ഭാരത സർക്കാർ",
      description: "ട്രെയിൻ വൈകൽ, ശുചിത്വം, ടിക്കറ്റ് റീഫണ്ട്, യാത്രക്കാരുടെ സുരക്ഷാ പരാതികൾ.",
    },
    cybercrime_india: {
      name: "ദേശീയ സൈബർ ക്രൈം റിപ്പോർട്ടിംഗ് പോർട്ടൽ",
      authorityScope: "ആഭ്യന്തര മന്ത്രാലയം, ഭാരത സർക്കാർ",
      description: "ഓൺലൈൻ സാമ്പത്തിക തട്ടിപ്പുകൾ, UPI തട്ടിപ്പ്, സൈബർ കുറ്റകൃത്യങ്ങൾ എന്നിവയ്ക്കുള്ള പോർട്ടൽ.",
    },
    nalsa_legal: {
      name: "NALSA — ദേശീയ നിയമ സേവന അതോറിറ്റി",
      authorityScope: "സൗജന്യ നിയമ സഹായം",
      description: "അർഹരായ പൗരന്മാർക്ക് സൗജന്യ നിയമ സഹായത്തിനും ലോക് അദാലത്തിനുമുള്ള ഔദ്യോഗിക പോർട്ടൽ.",
    },
  },
  Bengali: {
    cpgrams: {
      name: "CPGRAMS — কেন্দ্রীয় জন-অভিযোগ পোর্টাল",
      authorityScope: "ভারত সরকার",
      description: "কেন্দ্রীয় মন্ত্রক, সরকারি পরিষেবা এবং অমীমাংসিত অভিযোগের জন্য সরকারি পোর্টাল।",
    },
    national_consumer: {
      name: "জাতীয় উপভোক্তা হেল্পলাইন (NCH)",
      authorityScope: "উপভোক্তা বিষয়ক দপ্তর, ভারত সরকার",
      description: "অতিরিক্ত বিল, ত্রুটিপূর্ণ পণ্য ও রিফান্ড সংক্রান্ত অভিযোগের সরকারি পোর্টাল।",
    },
    tn_cm_helpline: {
      name: "তামিলনাড়ু মুখ্যমন্ত্রী হেল্পলাইন",
      authorityScope: "তামিলনাড়ু সরকার",
      description: "পৌরসভা, রেশন কার্ড, জল ও বিদ্যুৎ সংক্রান্ত অভিযোগের সরকারি পোর্টাল।",
    },
    railmadad: {
      name: "রেল মদদ — ভারতীয় রেল অভিযোগ পোর্টাল",
      authorityScope: "রেল মন্ত্রক, ভারত সরকার",
      description: "ট্রেন বিলম্ব, পরিচ্ছন্নতা, টিকিট রিফান্ড এবং যাত্রী সুরক্ষা সংক্রান্ত অভিযোগ।",
    },
    cybercrime_india: {
      name: "জাতীয় সাইবার ক্রাইম রিপোর্টিং পোর্টাল",
      authorityScope: "স্বরাষ্ট্র মন্ত্রক, ভারত সরকার",
      description: "অনলাইন আর্থিক প্রতারণা, UPI স্ক্যাম এবং সাইবার অপরাধের অভিযোগের সরকারি পোর্টাল।",
    },
    nalsa_legal: {
      name: "NALSA — জাতীয় আইনি পরিষেবা কর্তৃপক্ষ",
      authorityScope: "বিনামূল্যে আইনি সহায়তা",
      description: "যোগ্য নাগরিকদের জন্য বিনামূল্যে আইনি সহায়তা ও লোক আদালতের সরকারি পোর্টাল।",
    },
  },
  Marathi: {
    cpgrams: {
      name: "CPGRAMS — केंद्रीय लोक तक्रार निवारण पोर्टल",
      authorityScope: "भारत सरकार",
      description: "केंद्रीय मंत्रालये आणि सार्वजनिक सेवांच्या तक्रारींसाठी अधिकृत पोर्टल.",
    },
    national_consumer: {
      name: "राष्ट्रीय ग्राहक हेल्पलाइन (NCH)",
      authorityScope: "ग्राहक व्यवहार विभाग, भारत सरकार",
      description: "जास्त बिल, सदोष वस्तू आणि परतावा तक्रारींसाठी अधिकृत पोर्टल.",
    },
    tn_cm_helpline: {
      name: "तामिळनाडू मुख्यमंत्री हेल्पलाइन",
      authorityScope: "तामिळनाडू सरकार",
      description: "महापालिका, रेशन कार्ड, पाणी आणि वीज तक्रारींसाठी अधिकृत राज्य पोर्टल.",
    },
    railmadad: {
      name: "रेल मदत — भारतीय रेल्वे तक्रार पोर्टल",
      authorityScope: "रेल्वे मंत्रालय, भारत सरकार",
      description: "गाडी विलंब, स्वच्छता, तिकीट परतावा आणि प्रवासी सुरक्षेसाठी तक्रार पोर्टल.",
    },
    cybercrime_india: {
      name: "राष्ट्रीय सायबर गुन्हे नोंदणी पोर्टल",
      authorityScope: "गृह मंत्रालय, भारत सरकार",
      description: "ऑनलाइन आर्थिक फसवणूक, UPI फसवणूक आणि सायबर गुन्ह्यांसाठी अधिकृत पोर्टल.",
    },
    nalsa_legal: {
      name: "NALSA — राष्ट्रीय विधी सेवा प्राधिकरण",
      authorityScope: "मोफत कायदेशीर मदत",
      description: "पात्र नागरिकांसाठी मोफत कायदेशीर मदत व लोक अदालतीसाठी अधिकृत पोर्टल.",
    },
  },
  Gujarati: {
    cpgrams: {
      name: "CPGRAMS — કેન્દ્રીય જાહેર ફરિયાદ પોર્ટલ",
      authorityScope: "ભારત સરકાર",
      description: "કેન્દ્રીય મંત્રાલયો અને જાહેર સેવાઓની ફરિયાદો માટે અધિકૃત પોર્ટલ.",
    },
    national_consumer: {
      name: "રાષ્ટ્રીય ગ્રાહક હેલ્પલાઇન (NCH)",
      authorityScope: "ગ્રાહક બાબતોનો વિભાગ, ભારત સરકાર",
      description: "વધુ બિલ, ખામીયુક્ત વસ્તુઓ અને રિફંડ ફરિયાદો માટે અધિકૃત પોર્ટલ.",
    },
    tn_cm_helpline: {
      name: "તમિલનાડુ મુખ્યમંત્રી હેલ્પલાઇન",
      authorityScope: "તમિલનાડુ સરકાર",
      description: "મ્યુનિસિપલ, રેશનકાર્ડ, પાણી અને વીજળીની ફરિયાદો માટેનું રાજ્ય પોર્ટલ.",
    },
    railmadad: {
      name: "રેલ મદદ — ભારતીય રેલવે ફરિયાદ પોર્ટલ",
      authorityScope: "રેલવે મંત્રાલય, ભારત સરકાર",
      description: "ટ્રેન વિલંબ, સ્વચ્છતા, ટિકિટ રિફંડ અને મુસાફર સુરક્ષા ફરિયાદો.",
    },
    cybercrime_india: {
      name: "રાષ્ટ્રીય સાયબર ક્રાઇમ રિપોર્ટિંગ પોર્ટલ",
      authorityScope: "ગૃહ મંત્રાલય, ભારત સરકાર",
      description: "ઓનલાઇન નાણાકીય છેતરપિંડી અને સાયબર ગુનાઓ માટે અધિકૃત પોર્ટલ.",
    },
    nalsa_legal: {
      name: "NALSA — રાષ્ટ્રીય કાનૂની સેવા સત્તામંડળ",
      authorityScope: "મફત કાનૂની સહાય",
      description: "પાત્ર નાગરિકો માટે મફત કાનૂની સહાય અને લોક અદાલતનું અધિકૃત પોર્ટલ.",
    },
  },
  Punjabi: {
    cpgrams: {
      name: "CPGRAMS — ਕੇਂਦਰੀ ਲੋਕ ਸ਼ਿਕਾਇਤ ਪੋਰਟਲ",
      authorityScope: "ਭਾਰਤ ਸਰਕਾਰ",
      description: "ਕੇਂਦਰੀ ਮੰਤਰਾਲਿਆਂ ਅਤੇ ਜਨਤਕ ਸੇਵਾਵਾਂ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਲਈ ਅਧਿਕਾਰਤ ਪੋਰਟਲ।",
    },
    national_consumer: {
      name: "ਰਾਸ਼ਟਰੀ ਖਪਤਕਾਰ ਹੈਲਪਲਾਈਨ (NCH)",
      authorityScope: "ਖਪਤਕਾਰ ਮਾਮਲੇ ਵਿਭਾਗ, ਭਾਰਤ ਸਰਕਾਰ",
      description: "ਵੱਧ ਬਿੱਲ, ਖਰਾਬ ਸਾਮਾਨ ਅਤੇ ਰਿਫੰਡ ਸ਼ਿਕਾਇਤਾਂ ਲਈ ਅਧਿਕਾਰਤ ਪੋਰਟਲ।",
    },
    tn_cm_helpline: {
      name: "ਤਾਮਿਲਨਾਡੂ ਮੁੱਖ ਮੰਤਰੀ ਹੈਲਪਲਾਈਨ",
      authorityScope: "ਤਾਮਿਲਨਾਡੂ ਸਰਕਾਰ",
      description: "ਨਗਰ ਨਿਗਮ, ਰਾਸ਼ਨ ਕਾਰਡ, ਪਾਣੀ ਅਤੇ ਬਿਜਲੀ ਸ਼ਿਕਾਇਤਾਂ ਲਈ ਰਾਜ ਪੋਰਟਲ।",
    },
    railmadad: {
      name: "ਰੇਲ ਮਦਦ — ਭਾਰਤੀ ਰੇਲਵੇ ਸ਼ਿਕਾਇਤ ਪੋਰਟਲ",
      authorityScope: "ਰੇਲਵੇ ਮੰਤਰਾਲਾ, ਭਾਰਤ ਸਰਕਾਰ",
      description: "ਟਰੇਨ ਦੇਰੀ, ਸਫ਼ਾਈ, ਟਿਕਟ ਰਿਫੰਡ ਅਤੇ ਯਾਤਰੀ ਸੁਰੱਖਿਆ ਸ਼ਿਕਾਇਤਾਂ।",
    },
    cybercrime_india: {
      name: "ਰਾਸ਼ਟਰੀ ਸਾਈਬਰ ਕ੍ਰਾਈਮ ਰਿਪੋਰਟਿੰਗ ਪੋਰਟਲ",
      authorityScope: "ਗ੍ਰਹਿ ਮੰਤਰਾਲਾ, ਭਾਰਤ ਸਰਕਾਰ",
      description: "ਆਨਲਾਈਨ ਧੋਖਾਧੜੀ, UPI ਠੱਗੀ ਅਤੇ ਸਾਈਬਰ ਅਪਰਾਧਾਂ ਲਈ ਅਧਿਕਾਰਤ ਪੋਰਟਲ।",
    },
    nalsa_legal: {
      name: "NALSA — ਰਾਸ਼ਟਰੀ ਕਾਨੂੰਨੀ ਸੇਵਾਵਾਂ ਅਥਾਰਟੀ",
      authorityScope: "ਮੁਫ਼ਤ ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ",
      description: "ਯੋਗ ਨਾਗਰਿਕਾਂ ਲਈ ਮੁਫ਼ਤ ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ ਅਤੇ ਲੋਕ ਅਦਾਲਤ ਪੋਰਟਲ।",
    },
  },
  Odia: {
    cpgrams: {
      name: "CPGRAMS — କେନ୍ଦ୍ରୀୟ ଜନ ଅଭିଯୋଗ ପୋର୍ଟାଲ୍",
      authorityScope: "ଭାରତ ସରକାର",
      description: "କେନ୍ଦ୍ରୀୟ ମନ୍ତ୍ରଣାଳୟ ଏବଂ ସରକାରୀ ସେବା ଅଭିଯୋଗ ପାଇଁ ସରକାରୀ ପୋର୍ଟାଲ୍।",
    },
    national_consumer: {
      name: "ଜାତୀୟ ଖାଉଟି ହେଲ୍ପଲାଇନ୍ (NCH)",
      authorityScope: "ଖାଉଟି ବ୍ୟାପାର ବିଭାଗ, ଭାରତ ସରକାର",
      description: "ଅଧିକ ବିଲ୍, ତ୍ରୁଟିପୂର୍ଣ୍ଣ ସାମଗ୍ରୀ ଏବଂ ରିଫଣ୍ଡ ଅଭିଯୋଗ ପାଇଁ ପୋର୍ଟାଲ୍।",
    },
    tn_cm_helpline: {
      name: "ତାମିଲନାଡୁ ମୁଖ୍ୟମନ୍ତ୍ରୀ ହେଲ୍ପଲାଇନ୍",
      authorityScope: "ତାମିଲନାଡୁ ସରକାର",
      description: "ପୌରସଂସ୍ଥା, ରାସନ କାର୍ଡ, ପାଣି ଓ ବିଦ୍ୟୁତ୍ ଅଭିଯୋଗ ପାଇଁ ରାଜ୍ୟ ପୋର୍ଟାଲ୍।",
    },
    railmadad: {
      name: "ରେଳ ମଦଦ — ଭାରତୀୟ ରେଳ ଅଭିଯୋଗ ପୋର୍ଟାଲ୍",
      authorityScope: "ରେଳ ମନ୍ତ୍ରଣାଳୟ, ଭାରତ ସରକାର",
      description: "ଟ୍ରେନ୍ ବିଳମ୍ବ, ପରିଚ୍ଛନ୍ନତା ଏବଂ ଯାତ୍ରୀ ସୁରକ୍ଷା ଅଭିଯୋଗ ପାଇଁ ପୋର୍ଟାଲ୍।",
    },
    cybercrime_india: {
      name: "ଜାତୀୟ ସାଇବର ଅପରାଧ ପୋର୍ଟାଲ୍",
      authorityScope: "ଗୃହ ମନ୍ତ୍ରଣାଳୟ, ଭାରତ ସରକାର",
      description: "ଅନଲାଇନ୍ ଠକେଇ ଏବଂ ସାଇବର ଅପରାଧ ଅଭିଯୋଗ ପାଇଁ ସରକାରୀ ପୋର୍ଟାଲ୍।",
    },
    nalsa_legal: {
      name: "NALSA — ଜାତୀୟ ଆଇନ ସେବା ପ୍ରାଧିକରଣ",
      authorityScope: "ମାଗଣା ଆଇନ ସହାୟତା",
      description: "ଯୋଗ୍ୟ ନାଗରିକଙ୍କ ପାଇଁ ମାଗଣା ଆଇନ ସହାୟତା ପୋର୍ଟାଲ୍।",
    },
  },
  Assamese: {
    cpgrams: {
      name: "CPGRAMS — কেন্দ্ৰীয় ৰাজহুৱা অভিযোগ পৰ্টেল",
      authorityScope: "ভাৰত চৰকাৰ",
      description: "কেন্দ্ৰীয় মন্ত্ৰালয় আৰু চৰকাৰী সেৱাৰ অভিযোগৰ বাবে চৰকাৰী পৰ্টেল।",
    },
    national_consumer: {
      name: "ৰাষ্ট্ৰীয় গ্ৰাহক হেল্পলাইন (NCH)",
      authorityScope: "গ্ৰাহক পৰিক্ৰমা বিভাগ, ভাৰত চৰকাৰ",
      description: "অধিক বিল, ত্ৰুটিপূৰ্ণ সামগ্ৰী আৰু ৰিফাণ্ড অভিযোগৰ চৰকাৰী পৰ্টেল।",
    },
    tn_cm_helpline: {
      name: "তামিলনাডু মুখ্যমন্ত্ৰী হেল্পলাইন",
      authorityScope: "তামিলনাডু চৰকাৰ",
      description: "পৌৰসভা, ৰেচন কাৰ্ড, পানী আৰু বিদ্যুৎ অভিযোগৰ ৰাজ্যিক পৰ্টেল।",
    },
    railmadad: {
      name: "ৰেল মদদ — ভাৰতীয় ৰেল অভিযোগ পৰ্টেল",
      authorityScope: "ৰেল মন্ত্ৰালয়, ভাৰত চৰকাৰ",
      description: "ট্ৰেইন পলম, পৰিচ্ছন্নতা আৰু যাত্ৰী সুৰক্ষা অভিযোগৰ পৰ্টেল।",
    },
    cybercrime_india: {
      name: "ৰাষ্ট্ৰীয় চাইবাৰ অপৰাধ পৰ্টেল",
      authorityScope: "গৃহ মন্ত্ৰালয়, ভাৰত চৰকাৰ",
      description: "অনলাইন বিত্তীয় প্ৰতাৰণা আৰু চাইবাৰ অপৰাধৰ অভিযোগৰ পৰ্টেল।",
    },
    nalsa_legal: {
      name: "NALSA — ৰাষ্ট্ৰীয় আইনী সেৱা কৰ্তৃপক্ষ",
      authorityScope: "বিনামূলীয়া আইনী সহায়",
      description: "যোগ্য নাগৰিকৰ বাবে বিনামূলীয়া আইনী সহায় আৰু লোক আদালতৰ পৰ্টেল।",
    },
  },
  Urdu: {
    cpgrams: {
      name: "CPGRAMS — مرکزی عوامی شکایات پورٹل",
      authorityScope: "حکومتِ ہند",
      description: "مرکزی وزارتوں اور عوامی خدمات کی شکایات کے لیے سرکاری پورٹل۔",
    },
    national_consumer: {
      name: "نیشنل کنزیومر ہیلپ لائن (NCH)",
      authorityScope: "محکمہ امور صارفین، حکومتِ ہند",
      description: "زیادہ بل، خراب اشیاء اور ریفنڈ کی شکایات کے لیے سرکاری پورٹل۔",
    },
    tn_cm_helpline: {
      name: "تمل ناڈو سی ایم ہیلپ لائن",
      authorityScope: "حکومتِ تمل ناڈو",
      description: "میونسپل، راشن کارڈ، پانی اور بجلی کی شکایات کے لیے ریاستی پورٹل۔",
    },
    railmadad: {
      name: "ریل مدد — انڈین ریلوے شکایت پورٹل",
      authorityScope: "وزارت ریلوے، حکومتِ ہند",
      description: "ٹرین میں تاخیر، صفائی، ٹکٹ ریفنڈ اور مسافروں کی حفاظت کی شکایات۔",
    },
    cybercrime_india: {
      name: "نیشنل سائبر کرائم رپورٹنگ پورٹل",
      authorityScope: "وزارت داخلہ، حکومتِ ہند",
      description: "آن لائن مالی دھوکہ دہی، UPI فراڈ اور سائبر جرائم کی رپورٹنگ کا سرکاری پورٹل۔",
    },
    nalsa_legal: {
      name: "NALSA — نیشنل لیگل سروسز اتھارٹی",
      authorityScope: "مفت قانونی امداد",
      description: "مستحق شہریوں کے لیے مفت قانونی امداد اور لوک عدالت کا سرکاری پورٹل۔",
    },
  },
};

export function localizePortalEntry(portal: PortalEntry, language: string): PortalEntry {
  if (language === "English" || !portal.id) return portal;
  const localized = PORTAL_TRANSLATIONS[language]?.[portal.id];
  if (!localized) return portal;
  return {
    ...portal,
    name: localized.name,
    authorityScope: localized.authorityScope,
    description: localized.description,
  };
}

// Localized Sample Scenario display labels (matching the 3 samples in languages.ts)
const SAMPLE_LABELS_BY_LANG: Record<string, [string, string, string]> = {
  English: [
    "Drainage overflow (Chennai)",
    "Street lights not working (Bengaluru)",
    "Excessive electricity bill (Pune)",
  ],
  Tamil: [
    "கழிவுநீர் வழிதல் (சென்னை)",
    "தெருவிளக்குகள் எரியவில்லை (பெங்களூரு)",
    "அதிக மின் கட்டணம் (புனே)",
  ],
  Hindi: [
    "नाली ओवरफ्लो (चेन्नई)",
    "स्ट्रीट लाइट बंद है (बेंगलुरु)",
    "अधिक बिजली बिल (पुणे)",
  ],
  Telugu: [
    "డ్రైనేజీ పొంగిపొర్లుతోంది (చెన్నై)",
    "వీధి దీపాలు పనిచేయడం లేదు (బెంగళూరు)",
    "అధిక విద్యుత్ బిల్లు (పుణె)",
  ],
  Kannada: [
    "ಚರಂಡಿ ನೀರು ಹರಿಯುತ್ತಿದೆ (ಚೆನ್ನೈ)",
    "ಬೀದಿ ದೀಪಗಳು ಉರಿಯುತ್ತಿಲ್ಲ (ಬೆಂಗಳೂರು)",
    "ಹೆಚ್ಚಿನ ವಿದ್ಯುತ್ ಬಿಲ್ (ಪುಣೆ)",
  ],
  Malayalam: [
    "ഓട നിറഞ്ഞൊഴുകുന്നു (ചെന്നൈ)",
    "തെരുവുവിളക്കുകൾ പ്രവർത്തിക്കുന്നില്ല (ബെംഗളൂരു)",
    "അമിത വൈദ്യുതി ബിൽ (പൂനെ)",
  ],
  Bengali: [
    "নর্দমা উপচে পড়ছে (চেন্নাই)",
    "রাস্তার আলো জ্বলছে না (বেঙ্গালুরু)",
    "অতিরিক্ত বিদ্যুৎ বিল (পুনে)",
  ],
  Marathi: [
    "गटार तुंबून पाणी वाहत आहे (चेन्नई)",
    "रस्त्यावरील दिवे बंद आहेत (बेंगळुरू)",
    "जास्त वीज बिल (पुणे)",
  ],
  Gujarati: [
    "ગટરનું પાણી ઉભરાય છે (ચેન્નઈ)",
    "સ્ટ્રીટ લાઇટ બંધ છે (બેંગલુરુ)",
    "વધુ વીજળી બિલ (પુણે)",
  ],
  Punjabi: [
    "ਨਾਲੀ ਦਾ ਪਾਣੀ ਭਰ ਰਿਹਾ ਹੈ (ਚੇਨਈ)",
    "ਸਟ੍ਰੀਟ ਲਾਈਟ ਬੰਦ ਹੈ (ਬੈਂਗਲੁਰੂ)",
    "ਵੱਧ ਬਿਜਲੀ ਬਿੱਲ (ਪੁਣੇ)",
  ],
  Odia: [
    "ଡ୍ରେନ୍ ପାଣି ଉଛୁଳିବା (ଚେନ୍ନାଇ)",
    "ଷ୍ଟ୍ରିଟ୍ ଲାଇଟ୍ ବନ୍ଦ (ବେଙ୍ଗାଲୁରୁ)",
    "ଅଧିକ ବିଦ୍ୟୁତ୍ ବିଲ୍ (ପୁଣେ)",
  ],
  Assamese: [
    "নলাৰ পানী ওফন্দি উঠিছে (চেন্নাই)",
    "ৰাস্তাৰ লাইট জ্বলা নাই (বেংগালুৰু)",
    "অধিক বিদ্যুৎ বিল (পুনে)",
  ],
  Urdu: [
    "نالی کا پانی بہہ رہا ہے (چنئی)",
    "اسٹریٹ لائٹس بند ہیں (بنگلورو)",
    "زیادہ بجلی کا بل (پونے)",
  ],
};

export function getLocalizedSampleLabel(index: number, language: string, fallback: string): string {
  return SAMPLE_LABELS_BY_LANG[language]?.[index] ?? fallback;
}

// Localized fallback document checklist when AI docs aren't returned yet
export function getLocalizedFallbackDocs(
  category: ComplaintCategory,
  language: string,
): DocumentChecklistItem[] | null {
  if (language === "Tamil") {
    return [
      {
        id: "doc-ta-1",
        title: "பிரச்சனை உள்ள இடத்தின் தெளிவான புகைப்படம் (1–2 படங்கள்)",
        detail: "அருகிலுள்ள அடையாளத்துடன் கூடிய JPG/PNG புகைப்படம் (2 MB-க்குள்).",
        mandatory: true,
      },
      {
        id: "doc-ta-2",
        title:
          category === "Consumer Complaints"
            ? "கொள்முதல் ரசீது / பில் நகல்"
            : "சம்பந்தப்பட்ட பில், நுகர்வோர் எண் அல்லது விண்ணப்ப எண்",
        detail: "அதிகாரிகள் உங்கள் புகாரை உடனடியாகக் கண்டறிய உதவும்.",
        mandatory: true,
      },
      {
        id: "doc-ta-3",
        title: "OTP பெறுவதற்கான மொபைல் எண் & அடிப்படை அடையாள அட்டை",
        detail: "அரசு போர்ட்டலில் உள்நுழைய மொபைல் OTP தேவைப்படும்.",
        mandatory: true,
      },
      {
        id: "doc-ta-4",
        title: "முந்தைய புகார் எண் (ஏற்கனவே புகார் செய்திருந்தால்)",
        detail: "இருந்தால் மட்டும் இணைக்கவும்.",
        mandatory: false,
      },
    ];
  }
  if (language === "Hindi") {
    return [
      {
        id: "doc-hi-1",
        title: "समस्या वाले स्थान की स्पष्ट फ़ोटो (1–2 फ़ोटो)",
        detail: "आसपास की पहचान के साथ JPG/PNG फ़ोटो (2 MB से कम)।",
        mandatory: true,
      },
      {
        id: "doc-hi-2",
        title:
          category === "Consumer Complaints"
            ? "खरीद का बिल या रसीद"
            : "संबंधित बिल, उपभोक्ता संख्या या आवेदन संख्या",
        detail: "अधिकारी आपकी शिकायत तुरंत ट्रैक कर सकेंगे।",
        mandatory: true,
      },
      {
        id: "doc-hi-3",
        title: "OTP के लिए सक्रिय मोबाइल नंबर और पहचान पत्र",
        detail: "सरकारी पोर्टल पर लॉगिन के लिए मोबाइल OTP आवश्यक होता है।",
        mandatory: true,
      },
      {
        id: "doc-hi-4",
        title: "पिछली शिकायत संख्या (यदि पहले दर्ज की हो)",
        detail: "केवल उपलब्ध होने पर जोड़ें।",
        mandatory: false,
      },
    ];
  }
  return null;
}

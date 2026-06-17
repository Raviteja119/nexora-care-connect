import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type LangCode = "en" | "hi" | "ta" | "te" | "kn" | "ml" | "es" | "fr" | "ar";

type Dict = Record<string, Partial<Record<LangCode, string>>>;

// Demo dictionary — extend as needed. Falls back to English if a key is missing.
const DICT: Dict = {
  "nav.home": { en: "Home", hi: "होम", ta: "முகப்பு", te: "హోమ్", es: "Inicio", fr: "Accueil", ar: "الرئيسية" },
  "nav.beds": { en: "Beds", hi: "बेड", ta: "படுக்கைகள்", te: "పడకలు", es: "Camas", fr: "Lits", ar: "الأسرّة" },
  "nav.appointments": { en: "Appointments", hi: "अपॉइंटमेंट", ta: "சந்திப்புகள்", te: "నియామకాలు", es: "Citas", fr: "RDV", ar: "المواعيد" },
  "nav.emergency": { en: "Emergency", hi: "आपातकाल", ta: "அவசரம்", te: "అత్యవసరం", es: "Emergencia", fr: "Urgence", ar: "طوارئ" },
  "nav.track": { en: "Track", hi: "ट्रैक", ta: "கண்காணி", te: "ట్రాక్", es: "Rastrear", fr: "Suivre", ar: "تتبع" },
  "nav.prescriptions": { en: "Prescriptions", hi: "नुस्खे", ta: "மருந்து சீட்டுகள்", te: "ప్రిస్క్రిప్షన్లు", es: "Recetas", fr: "Ordonnances", ar: "وصفات" },
  "nav.videoCall": { en: "Video Call", hi: "वीडियो कॉल", ta: "வீடியோ அழைப்பு", te: "వీడియో కాల్", es: "Videollamada", fr: "Appel vidéo", ar: "مكالمة فيديو" },
  "nav.labTests": { en: "Lab Tests", hi: "लैब टेस्ट", ta: "ஆய்வக சோதனைகள்", te: "ల్యాబ్ పరీక్షలు", es: "Laboratorio", fr: "Labo", ar: "اختبارات" },
  "nav.chat": { en: "Chat", hi: "चैट", ta: "அரட்டை", te: "చాట్", es: "Chat", fr: "Chat", ar: "محادثة" },
  "nav.education": { en: "Education", hi: "शिक्षा", ta: "கல்வி", te: "విద్య", es: "Educación", fr: "Éducation", ar: "تعليم" },
  "nav.feedback": { en: "Feedback", hi: "प्रतिक्रिया", ta: "கருத்து", te: "అభిప్రాయం", es: "Opinión", fr: "Avis", ar: "ملاحظات" },
  "nav.profile": { en: "Profile", hi: "प्रोफ़ाइल", ta: "சுயவிவரம்", te: "ప్రొఫైల్", es: "Perfil", fr: "Profil", ar: "ملف" },
  "nav.logout": { en: "Logout", hi: "लॉग आउट", ta: "வெளியேறு", te: "లాగ్ అవుట్", es: "Salir", fr: "Déconnexion", ar: "خروج" },
  "common.welcome": { en: "Welcome to Your Health Dashboard", hi: "आपके स्वास्थ्य डैशबोर्ड में आपका स्वागत है", ta: "உங்கள் சுகாதார டாஷ்போர்டுக்கு வரவேற்கிறோம்", te: "మీ ఆరోగ్య డాష్‌బోర్డ్‌కు స్వాగతం", es: "Bienvenido a tu Panel de Salud", fr: "Bienvenue sur votre tableau de bord santé", ar: "مرحبا بك في لوحة الصحة" },
};

// Extra keys used across pages — anything missing falls back to English.
const EXTRA: Dict = {
  "common.tagline": { en: "Managing your healthcare journey with ease and precision", hi: "आपकी स्वास्थ्य यात्रा को आसानी और सटीकता से प्रबंधित करना", ta: "உங்கள் சுகாதார பயணத்தை எளிதாக நிர்வகிக்கிறது", te: "మీ ఆరోగ్య ప్రయాణాన్ని సులభంగా నిర్వహించడం", es: "Gestionando tu salud con facilidad y precisión", fr: "Gérer votre santé avec facilité", ar: "إدارة رحلتك الصحية بسهولة" },
  "common.emergencyAccess": { en: "Emergency Access", hi: "आपातकालीन पहुंच", ta: "அவசர அணுகல்", te: "అత్యవసర యాక్సెస్", es: "Acceso de Emergencia", fr: "Accès d'urgence", ar: "وصول الطوارئ" },
  "beds.title": { en: "Bed Availability", hi: "बेड उपलब्धता", ta: "படுக்கை கிடைக்கும் தன்மை", te: "పడక లభ్యత", es: "Disponibilidad de Camas", fr: "Disponibilité des lits", ar: "توافر الأسرّة" },
  "beds.book": { en: "Book Bed", hi: "बेड बुक करें", ta: "படுக்கை முன்பதிவு", te: "పడక బుక్ చేయండి", es: "Reservar cama", fr: "Réserver un lit", ar: "احجز سريرا" },
  "beds.discharge": { en: "Discharge", hi: "डिस्चार्ज", ta: "வெளியேற்று", te: "డిశ్చార్జ్", es: "Alta", fr: "Sortie", ar: "خروج" },
  "beds.available": { en: "Available", hi: "उपलब्ध", ta: "கிடைக்கிறது", te: "అందుబాటులో", es: "Disponible", fr: "Disponible", ar: "متوفر" },
  "edu.title": { en: "Health Education", hi: "स्वास्थ्य शिक्षा", ta: "சுகாதார கல்வி", te: "ఆరోగ్య విద్య", es: "Educación de Salud", fr: "Éducation à la santé", ar: "التثقيف الصحي" },
  "chat.title": { en: "Chat Support", hi: "चैट सहायता", ta: "அரட்டை ஆதரவு", te: "చాట్ మద్దతు", es: "Soporte de Chat", fr: "Support Chat", ar: "دعم الدردشة" },
  "chat.placeholder": { en: "Type your message...", hi: "अपना संदेश लिखें...", ta: "உங்கள் செய்தியை தட்டச்சு செய்க...", te: "మీ సందేశం టైప్ చేయండి...", es: "Escribe tu mensaje...", fr: "Tapez votre message...", ar: "اكتب رسالتك..." },
  "video.title": { en: "Video Consultations", hi: "वीडियो परामर्श", ta: "வீடியோ ஆலோசனைகள்", te: "వీడియో సంప్రదింపులు", es: "Videoconsultas", fr: "Consultations vidéo", ar: "استشارات فيديو" },
  "emergency.title": { en: "Emergency Services", hi: "आपातकालीन सेवाएं", ta: "அவசர சேவைகள்", te: "అత్యవసర సేవలు", es: "Servicios de Emergencia", fr: "Services d'urgence", ar: "خدمات الطوارئ" },
  "emergency.callDoctor": { en: "Call Doctor Now", hi: "अभी डॉक्टर को कॉल करें", ta: "இப்போது மருத்துவரை அழைக்கவும்", te: "ఇప్పుడే వైద్యుడిని కాల్ చేయండి", es: "Llamar al doctor ahora", fr: "Appeler le médecin", ar: "اتصل بالطبيب الآن" },
  "profile.title": { en: "Profile & Medical Information", hi: "प्रोफ़ाइल और चिकित्सा जानकारी", ta: "சுயவிவரம் & மருத்துவ தகவல்", te: "ప్రొఫైల్ & వైద్య సమాచారం", es: "Perfil e Información Médica", fr: "Profil et infos médicales", ar: "الملف الشخصي والمعلومات الطبية" },
};
Object.assign(DICT, EXTRA);

interface LanguageContextType {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => (localStorage.getItem("nexora_lang") as LangCode) || "en");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("nexora_lang", l);
  };

  const t = (key: string) => DICT[key]?.[lang] ?? DICT[key]?.en ?? key;

  // also expose BCP-47 codes for browser APIs like SpeechSynthesis
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function ttsLangCode(l: LangCode): string {
  switch (l) {
    case "hi": return "hi-IN";
    case "ta": return "ta-IN";
    case "te": return "te-IN";
    case "kn": return "kn-IN";
    case "ml": return "ml-IN";
    case "es": return "es-ES";
    case "fr": return "fr-FR";
    case "ar": return "ar-SA";
    default: return "en-US";
  }
}

function _unused_close_marker() {

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
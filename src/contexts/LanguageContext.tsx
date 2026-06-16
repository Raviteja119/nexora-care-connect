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

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
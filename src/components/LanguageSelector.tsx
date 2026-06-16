import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useLanguage, LangCode } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const languages = [
  { code: "en" as LangCode, name: "English", flag: "🇺🇸" },
  { code: "hi" as LangCode, name: "हिन्दी", flag: "🇮🇳" },
  { code: "ta" as LangCode, name: "தமிழ்", flag: "🇮🇳" },
  { code: "te" as LangCode, name: "తెలుగు", flag: "🇮🇳" },
  { code: "kn" as LangCode, name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml" as LangCode, name: "മലയാളം", flag: "🇮🇳" },
  { code: "es" as LangCode, name: "Español", flag: "🇪🇸" },
  { code: "fr" as LangCode, name: "Français", flag: "🇫🇷" },
  { code: "ar" as LangCode, name: "العربية", flag: "🇸🇦" },
];

export function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  const handleLanguageChange = (code: string) => {
    const c = code as LangCode;
    setLang(c);
    const selected = languages.find((l) => l.code === c);
    if (selected) toast.success(`Language changed to ${selected.name}`);
  };

  const currentLanguage = languages.find((l) => l.code === lang);

  return (
    <Select value={lang} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[150px]">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentLanguage?.flag}</span>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
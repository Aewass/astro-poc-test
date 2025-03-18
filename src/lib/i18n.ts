import { derived } from "svelte/store";
import { language } from "./stores/language";

// Default translations
const defaultTranslations = {
  en: {
    welcome: "Welcome",
    services: "Services",
    solutions: "Solutions",
    about: "About",
    blog: "Blog",
    contact: "Contact",
    readMore: "Read More",
    learnMore: "Learn More",
    // Add more default translations
  },
  de: {
    welcome: "Willkommen",
    services: "Dienstleistungen",
    solutions: "Lösungen",
    about: "Über uns",
    blog: "Blog",
    contact: "Kontakt",
    readMore: "Mehr lesen",
    learnMore: "Mehr erfahren",
    // Add more default translations
  },
  fr: {
    welcome: "Bienvenue",
    services: "Services",
    solutions: "Solutions",
    about: "À propos",
    blog: "Blog",
    contact: "Contact",
    readMore: "Lire plus",
    learnMore: "En savoir plus",
    // Add more default translations
  },
};

// Create a derived store for the current translations
export const t = derived(language, ($language) => {
  // Return a function that gets the translation for a key
  return (key: string, params = {}) => {
    // Get the translations for the current language
    const translations =
      defaultTranslations[$language] || defaultTranslations.en;

    // Get the translation for the key
    let translation = translations[key] || key;

    // Replace parameters in the translation
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(`{${param}}`, String(value));
    });

    return translation;
  };
});

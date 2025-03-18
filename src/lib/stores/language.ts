import { writable } from "svelte/store";

// Get the initial language from localStorage or default to 'en'
const getBrowserLanguage = () => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("language") ||
      navigator.language.split("-")[0] ||
      "en"
    );
  }
  return "en";
};

// Create a writable store
export const language = writable(getBrowserLanguage());

// Update localStorage when language changes
if (typeof window !== "undefined") {
  language.subscribe((value) => {
    localStorage.setItem("language", value);
  });
}

// Helper function to change language
export function setLanguage(lang: string) {
  language.set(lang);
}

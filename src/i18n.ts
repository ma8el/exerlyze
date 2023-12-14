import { createI18n } from 'vue-i18n';
import { messages } from '@/locale'
import { useUserSettingsStore } from './store/userSettingsStore';

export function installI18n(app: any) {
    const userSettingsStore = useUserSettingsStore()
    const setLocale = userSettingsStore.locale
    let lang = navigator.language
    if (setLocale === undefined || setLocale === "undefined") {
      if (lang !== 'en' && lang !== 'de' && lang !== 'fr') {
         lang = 'en' 
      }
    } else {
      lang = setLocale
    }
    userSettingsStore.setLocale(lang)
    const i18n = createI18n({
      locale: lang,
      fallbackLocale: lang,
      legacy: false,
      messages,
    });
    app.use(i18n);
    return i18n;
}
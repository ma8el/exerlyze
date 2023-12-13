import { createI18n } from 'vue-i18n';
import { messages } from '@/locale'

export function installI18n(app: any) {
    let lang = navigator.language
    if (lang !== 'en' && lang !== 'de' && lang !== 'fr') {
       lang = 'en' 
    }
    console.log('lang', lang)
    const i18n = createI18n({
      locale: lang,
      fallbackLocale: lang,
      legacy: false,
      messages,
    });
    app.use(i18n);
    return i18n;
}
import { createI18n } from 'vue-i18n';
import { messages } from '@/locale'
import { useUserSettingsStore } from '@/store/userSettingsStore';

//const userSettingsStore = useUserSettingsStore();

export function installI18n(app: any) {
    const i18n = createI18n({
//      locale: userSettingsStore.locale,
      locale: 'en',
      fallbackLocale: 'en',
      legacy: false,
      messages,
    });
    app.use(i18n);
    return i18n;
}
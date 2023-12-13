import { defineStore } from "pinia";
import { set, useStorage } from "@vueuse/core";
import { ref } from 'vue'

export const useUserSettingsStore = defineStore('userSettings', () => {
    const locale = useStorage('selectedLocale', ref<string | undefined>(navigator.language === 'en' || navigator.language ==='de' || navigator.language === 'fr' ? navigator.language : 'en'))
    const getLocale = (): string | undefined => {
        if (locale.value === undefined) {
            const lang = navigator.language
            if (lang !== 'en' && lang !== 'de' && lang !== 'fr') {
                setLocale('en')
            }
        }
        return locale.value
    }
    const setLocale = (newLang: string) => {
        locale.value = newLang
    }
    return {
        locale,
        getLocale,
        setLocale,
    }
})
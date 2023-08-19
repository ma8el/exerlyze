import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ref } from 'vue'

export const useUserSettingsStore = defineStore('userSettings', () => {
    const lang = useStorage('selectedLang', ref<string | undefined>())
    const getLang = (): string | undefined => {
        if (lang.value === undefined) {
            setLang('en')
        }
        return lang.value
    }
    const setLang = (newLang: string) => {
        lang.value = newLang
    }
    return {
        lang,
        getLang,
        setLang
    }
})
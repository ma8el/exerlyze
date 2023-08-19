import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ref } from 'vue'

export const useUserSettingsStore = defineStore('userSettings', () => {
    const locale = useStorage('selectedLocale', ref<string | undefined>())
    const getLocale = (): string | undefined => {
        if (locale.value === undefined) {
            setLocale('en')
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
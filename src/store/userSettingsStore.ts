import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref } from 'vue';
import { FitnessLevel } from '@/types/workout.enums';

export const useUserSettingsStore = defineStore('userSettings', () => {
    const locale = useStorage('selectedLocale', ref<string | undefined>())
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

export const useUserFitnessLevelStore = defineStore('userFitnessLevel', () => {
    const fitnessLevel = useStorage('fitnessLevel', ref<FitnessLevel>(FitnessLevel.Beginner))
    const deadliftMax = useStorage('deadliftMax', ref<number>(0))
    const squatMax = useStorage('squatMax', ref<number>(0))
    const benchMax = useStorage('benchMax', ref<number>(0))
    const getFitnessLevel = (): string => {
        return fitnessLevel.value
    }
    const setFitnessLevel = (newFitnessLevel: FitnessLevel) => {
        fitnessLevel.value = newFitnessLevel
    }
    const getDeadliftMax = (): number => {
        return deadliftMax.value
    }
    const setDeadliftMax = (newDeadliftMax: number) => {
        deadliftMax.value = newDeadliftMax
    }
    const getSquatMax = (): number => {
        return squatMax.value
    }
    const setSquatMax = (newSquatMax: number) => {
        squatMax.value = newSquatMax
    }
    const getBenchMax = (): number => {
        return benchMax.value
    }
    const setBenchMax = (newBenchMax: number) => {
        benchMax.value = newBenchMax
    }
    return {
        fitnessLevel,
        getFitnessLevel,
        setFitnessLevel,
        getDeadliftMax,
        setDeadliftMax,
        getSquatMax,
        setSquatMax,
        getBenchMax,
        setBenchMax,
    }
})
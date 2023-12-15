import { supabase } from '@/supabase';
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref } from 'vue';
import { UserFitnessLevel } from '@/types';

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
    const userFitnessLevel = useStorage('userFitnessLevel', ref<UserFitnessLevel[]>([]))
    const setUserFitnessLevel = (newUserFitnessLevel: UserFitnessLevel) => {
        userFitnessLevel.value.push(newUserFitnessLevel)
        pushUserFitnessLevels([newUserFitnessLevel])
    }
    const hasExistingFitnessLevel = (): boolean => {
        return userFitnessLevel.value.length > 0
    }
    const getUserFitnessLevel = (): UserFitnessLevel[] => {
        return userFitnessLevel.value
    }
    const getLatestFitnessLevel = (): UserFitnessLevel | undefined => {
        if (userFitnessLevel.value.length > 0) {
            return userFitnessLevel.value[userFitnessLevel.value.length - 1]
        }
        return undefined
    }
    const fetchUserFitnessLevel = async () => {
        const session = await supabase.auth.getSession()
        if (session.data.session === null) {
            return
        }
        const { data, error } = await supabase
            .from('user_fitness_level')
            .select('*')
            .returns<UserFitnessLevel[]>()
        if (error) {
            console.error(error)
        } else {

            const mergedData: UserFitnessLevel[] = [...getUserFitnessLevel()];
            for (const fitnessLevel of data) {
                const existingIndex = mergedData.findIndex((item) => item.id === fitnessLevel.id);

                if (existingIndex !== -1) {
                    const existingItem = mergedData[existingIndex];

                    if (fitnessLevel.created_at > existingItem.created_at) {
                        mergedData[existingIndex] = fitnessLevel;
                    }
                } else {
                    mergedData.push(fitnessLevel);
                }
            }
            userFitnessLevel.value = mergedData;
        }
    };
    const pushUserFitnessLevels = async (fitnessLevels: UserFitnessLevel[]) => {
        const session = await supabase.auth.getSession()
        if (session.data.session === null) {
            return
        }
        const { data, error } = await supabase
            .from('user_fitness_level')
            .upsert(fitnessLevels)
        if (error) {
            console.error(error)
        }
    }

    const syncUserFitnessLevel = async () => {
        const session = await supabase.auth.getSession()
        if (session.data.session === null) {
            return
        }
        await fetchUserFitnessLevel()
        await pushUserFitnessLevels(userFitnessLevel.value)
    }
    return {
        getUserFitnessLevel,
        hasExistingFitnessLevel,
        setUserFitnessLevel,
        getLatestFitnessLevel,
        fetchUserFitnessLevel,
        syncUserFitnessLevel
    }
})
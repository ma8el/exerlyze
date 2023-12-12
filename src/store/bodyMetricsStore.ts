import { supabase } from "@/supabase";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { Weight } from "@/types";
import { computed, ref } from "vue";
import { v4 as uuidv4 } from 'uuid';

export const useWeightStore = defineStore({
    id: "weight",
    state: () => ({
        currentWeight: useStorage('currentWeight', {} as Weight),
        weights: useStorage('weights', [] as Weight[]),
    }),
    getters: {
       getWeights(): Weight[] {
            return this.weights;
        },
        getCurrentWeight(): Weight {
            const currentWeight = this.weights.reduce((prev, current) => {
                return prev.created_at > current.created_at ? prev : current;
            });
            return currentWeight;
        },
        getWeightsOfWeek(): Weight[] {
            const today = new Date();
            const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            const weightsOfWeek = this.weights.filter((weight) => {
                return new Date(weight.created_at) >= weekAgo;
            });
            return weightsOfWeek;
        },
        async fetchWeights(): Promise<void> {
            const session = await supabase.auth.getSession()
            if (session.data.session !== null) {
                const { data, error } = await supabase.from('weights').select()
                if (error) {
                    throw error
                }
                // Merge data and this.weights
                const mergedWeights = [...this.weights];
                for (const weight of data) {
                    const existingWeightIndex = mergedWeights.findIndex((w) => w.id === weight.id);
                    if (existingWeightIndex !== -1) {
                        const existingWeight = mergedWeights[existingWeightIndex];
                        if (existingWeight.updated_at < weight.updated_at) {
                            mergedWeights[existingWeightIndex] = weight;
                        }
                    } else {
                        mergedWeights.push(weight);
                    }
                }

                // Update this.weights with mergedWeights
                this.weights = mergedWeights;
            }
        },
        async syncWeights(): Promise<void> {
            const session = await supabase.auth.getSession()
            if (session.data.session !== null) {
                for (const weight of this.weights) {
                  const { error } = await supabase.from('weights')
                  .upsert(weight)
                }
            }
        }
    },
    actions: {
        getNewId(): string {
            return uuidv4();
        },
        async addWeight (weight: Weight) {
            this.weights.push(weight);
            const session = await supabase.auth.getSession()
            if (session.data.session !== null) {
                const { error } = await supabase.from('weights').upsert(weight)
            }
        }
    }
})

export const useUserStore = defineStore('userStore', () => {
    const userName = useStorage('userName', ref<string | undefined>());
    const gender = useStorage('gender', ref<string | undefined>());
    const dateOfBirth = useStorage('dateOfBirth', ref<Date>(new Date()));
    const height = useStorage('height', ref<number | undefined>());
    const isComplete = computed(() => {
        if (userName.value === "undefined"
            || userName.value === undefined) {
            return false
        }
        if (gender.value === "undefined"
            || gender.value === undefined) {
            return false
        }
        if (dateOfBirth.value === undefined) {
            return false
        }
        if (height.value === undefined) {
            return false
        }
        return true
    })
    const getUserName = (): string => {
        if (userName.value === undefined
            || userName.value === "undefined") {
            return 'Anonymous'
        }
        return userName.value
    }
    const getGender = (): string | undefined => {
        return gender.value
    }
    const getDateOfBirth = (): Date => {
        return new Date(dateOfBirth.value)
    }
    const getAge = (): number | undefined => {
        if (dateOfBirth.value === undefined) {
            return undefined
        }
        const today = new Date()
        const birthDate = new Date(dateOfBirth.value)
        let age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }
    const getHeight = (): number | undefined => {
        return height.value
    }
    const setUserName = (name: string) => {
        userName.value = name
    }
    const setGender = (selectedGender: string) => {
        gender.value = selectedGender
    }
    const setDateOfBirth = (selectedDateOfBirth: Date) => {
        dateOfBirth.value = new Date(selectedDateOfBirth)
    }
    const setHeight = (selectedHeight: number) => {
        height.value = selectedHeight
    }
    const fetchUser = async () => {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
          const { data, error } = await supabase.from('profiles').select().single()
          if (error) {
            throw error
          }
          userName.value = data.username
          gender.value = data.gender
          dateOfBirth.value = new Date(data.date_of_birth)
          height.value = data.height
        }
    }
    const syncUser = async () => {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            const { error } = await supabase.from('profiles')
            .upsert({
                username: getUserName(),
                height: getHeight(),
                gender: getGender(),
                date_of_birth: getDateOfBirth(),
            })
        }
    }
    return {
        userName,
        gender,
        dateOfBirth,
        height,
        isComplete,
        getUserName,
        getGender,
        getDateOfBirth,
        getAge,
        getHeight,
        setUserName,
        setGender,
        setDateOfBirth,
        setHeight,
        fetchUser,
        syncUser,
    }
})
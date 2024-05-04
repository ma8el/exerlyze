import { supabase } from "@/supabase";
import { defineStore } from "pinia";
import { UserDB } from "@/db";
import { User, Weight } from "@/types";
import { computed, ref } from "vue";
import { v4 as uuidv4 } from 'uuid';

export const useWeightStore = defineStore('weight', () => {
    const weights = ref<Weight[]>([])
    const getWeights = computed(() => weights.value)
    const currentWeight = computed(() => {
        return weights.value.reduce((prev, current) => {
            return prev.created_at > current.created_at ? prev : current
        }, {} as Weight) // TODO: Provide an initial value for reduce
    })
    const getWeightsOfWeek = computed(() => {
        const today = new Date()
        const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
        return weights.value.filter(weight => new Date(weight.created_at) >= weekAgo)
    })

    function saveWeightsToIndexDB() {
        const db = new UserDB()
        const plainWeights = JSON.parse(JSON.stringify(weights.value))
        db.weights.bulkPut(plainWeights)
    }

    function loadWeightsFromIndexDB() {
        const db = new UserDB()
        db.weights.toArray().then((weightData) => {
            weights.value = weightData
        })
    }

    async function fetchWeights() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            const { data, error } = await supabase.from('weights').select()
            if (error) {
                throw error
            }
            // Merge data and this.weights
            const mergedWeights = [...weights.value];
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
            weights.value = mergedWeights;
        }
    }

    async function syncWeights() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await fetchWeights()
            for (const weight of weights.value) {
                const { error } = await supabase.from('weights').upsert(weight)
                // TODO: Handle the error if needed
            }
        }
    }

    function getNewId() {
        return uuidv4()
    }

    async function addWeight(weight: Weight) {
        weights.value.push(weight)
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            const { error } = await supabase.from('weights').upsert(weight)
            // TODO: Handle the error if needed
        }
    }

    return {
        currentWeight,
        weights,
        getWeights,
        getWeightsOfWeek,
        saveWeightsToIndexDB,
        loadWeightsFromIndexDB,
        fetchWeights,
        syncWeights,
        getNewId,
        addWeight
    }
})

export const useUserStore = defineStore('userStore', () => {
    const user = ref<User>({
        created_at: new Date(),
        updated_at: new Date(),
        userName: 'Anonymous',
        height: 0,
        gender: 'male',
        dateOfBirth: new Date(),
    })
    const userName = computed(() => user.value?.userName)
    const gender = computed(() => user.value?.gender)
    const dateOfBirth = computed(() => user.value?.dateOfBirth)
    const height = computed(() => user.value?.height)
    const updated_at = computed(() => user.value?.updated_at)
    const created_at = computed(() => user.value?.created_at)

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
//            || height.value === "undefined") {
            return false
        }
        return true
    })

    const saveUserToIndexDB = () => {
        const db = new UserDB()
        const plainUser = JSON.parse(JSON.stringify(user.value))
        db.user.put(plainUser)
    }

    const loadUserFromIndexDB = () => {
        const db = new UserDB()
        db.user.toArray().then((userData) => {
            if (userData.length === 0) {
                return
            }
            user.value = userData[0]
        })
    }

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
        if (dateOfBirth.value === undefined) {
            return new Date()
        }
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
    const getHeight = (): number => {
        if (height.value === undefined) {
//            || height.value === "undefined") {
            return 0
        }
        return Number(height.value)
    }
    const setUserName = (name: string) => {
        console.log(user)
        user.value.userName = name
        user.value.updated_at = new Date()
    }
    const setGender = (selectedGender: string) => {
        user.value.gender = selectedGender
        user.value.updated_at = new Date()
    }
    const setDateOfBirth = (selectedDateOfBirth: Date) => {
        user.value.dateOfBirth = new Date(selectedDateOfBirth)
        user.value.updated_at = new Date()
    }
    const setHeight = (selectedHeight: number) => {
        user.value.height = selectedHeight
        user.value.updated_at = new Date()
    }
    const fetchUser = async () => {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
          const { data, error } = await supabase.from('profiles').select().single()
          if (error) {
            console.log(error)
            return
          }
          if (user.value && user.value.updated_at < data.updated_at) {
            user.value.userName = data.username
            user.value.gender = data.gender
            user.value.dateOfBirth = new Date(data.date_of_birth)
            user.value.height = data.height
          }
        }
    }
    const syncUser = async () => {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await fetchUser()
            const { error } = await supabase.from('profiles')
            .upsert({
                created_at: created_at.value,
                updated_at: new Date(),
                username: getUserName(),
                height: getHeight(),
                gender: getGender(),
                date_of_birth: getDateOfBirth(),
            })
        }
    }
    return {
        user,
        userName,
        gender,
        dateOfBirth,
        height,
        isComplete,
        saveUserToIndexDB,
        loadUserFromIndexDB,
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
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/supabase";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { FoodDiaryEntry } from "@/types/nutrition";
import { ref, computed } from "vue";

export const useFoodDiaryStore = defineStore('nutriment', () => {
    const foodDiaryEntries = ref(useStorage('foodDiaryEntries', [] as FoodDiaryEntry[]))
    const dailyCalories = ref(useStorage('dailyCalories', 2500))
    const dailyCarbs = ref(useStorage('daylyCarbs', 300))
    const dailyProtein = ref(useStorage('dailyProtein', 100))
    const dailyFat = ref(useStorage('dailyFat', 100))

    const getFoodDiaryEntries = computed(() => foodDiaryEntries.value)

    function getUniqueId() {
        return uuidv4()
    }

    function addFoodDiaryEntry(foodDiaryEntry: FoodDiaryEntry) {
        foodDiaryEntries.value.push(foodDiaryEntry)
    }

    function deleteFoodDiaryEntry(foodDiaryEntryId: string) {
        foodDiaryEntries.value = foodDiaryEntries.value.filter(entry => entry.id !== foodDiaryEntryId)
    }

    function getFoodDiaryEntriesOfDate(date: Date): FoodDiaryEntry[] {
        return foodDiaryEntries.value.filter(entry => {
            const entryDate = new Date(entry.created_at)
            return entryDate.toDateString() === date.toDateString()
        })
    }

    function getCaloriesOfDate(date: Date): number {
        return getFoodDiaryEntriesOfDate(date).reduce((total, entry) => total + entry.calories, 0)
    }

    function getCarbohydratesOfDate(date: Date): number {
        return getFoodDiaryEntriesOfDate(date).reduce((total, entry) => total + entry.carbohydrates, 0)
    }

    function getProteinOfDate(date: Date): number {
        return getFoodDiaryEntriesOfDate(date).reduce((total, entry) => total + entry.protein, 0)
    }

    function getFatOfDate(date: Date): number {
        return getFoodDiaryEntriesOfDate(date).reduce((total, entry) => total + entry.fat, 0)
    }

    function getMissingProteinsOfToday(): number {
        const proteinsToday = getProteinOfDate(new Date())
        return Math.max(dailyProtein.value - proteinsToday, 0)
    }

    function getMealEntriesOfDate(date: Date, mealTime: 'breakfast' | 'lunch' | 'dinner'): FoodDiaryEntry[] {
        return getFoodDiaryEntriesOfDate(date).filter(entry => {
            const createdAtHours = new Date(entry.created_at).getHours()
            if (mealTime === 'breakfast') return createdAtHours < 12
            if (mealTime === 'lunch') return createdAtHours >= 12 && createdAtHours < 18
            return createdAtHours >= 18
        })
    }

    async function syncFoodDiary() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            for (const foodDiaryEntry of foodDiaryEntries.value) {
                await supabase.from('food_diary_entries').upsert(foodDiaryEntry)
                // Add error handling as needed
            }
        }
    }

    return {
        foodDiaryEntries,
        dailyCalories,
        dailyCarbs,
        dailyProtein,
        dailyFat,
        getFoodDiaryEntries,
        getUniqueId,
        addFoodDiaryEntry,
        deleteFoodDiaryEntry,
        getFoodDiaryEntriesOfDate,
        getCaloriesOfDate,
        getCarbohydratesOfDate,
        getProteinOfDate,
        getFatOfDate,
        getMissingProteinsOfToday,
        getMealEntriesOfDate,
        syncFoodDiary
    }
})
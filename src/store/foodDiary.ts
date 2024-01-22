import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/supabase";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { FoodDiaryEntry } from "@/types/nutrition";
import { ref, computed } from "vue";
import { useUserStore, useWeightStore } from "@/store/bodyMetricsStore";
import { NutritionGoal } from '@/types/nutrition.enums';

interface DailyNutritionGoal {
    id: string;
    created_at: Date;
    nutrition_goal: NutritionGoal;
    daily_calories: number;
    daily_carbs: number;
    daily_protein: number;
    daily_fat: number;
}

export const useFoodDiaryStore = defineStore('nutriment', () => {
    const foodDiaryEntries = ref(useStorage('foodDiaryEntries', [] as FoodDiaryEntry[]))
    const dailyNutritionGoals = ref(useStorage('dailyNutritionGoals', [] as DailyNutritionGoal[]))
    const latestDailyNutritionGoal = computed(() => {
        const defaultCalories = calculateBaseCalories()
        const defaultMacros = calculateBaseMacros(defaultCalories)
        return dailyNutritionGoals.value.reduce((prev, current) => {
            return prev.created_at > current.created_at ? prev : current
        }, {
            id: getUniqueId(),
            created_at: new Date("1900-01-01"),
            nutrition_goal: NutritionGoal.StayFit,
            daily_calories: defaultCalories,
            daily_carbs: defaultMacros.carbs,
            daily_protein: defaultMacros.protein,
            daily_fat: defaultMacros.fat
        } as DailyNutritionGoal)
    })
    const selectedNutritionGoal = computed(() => latestDailyNutritionGoal.value.nutrition_goal)
    const dailyCalories = computed(() => latestDailyNutritionGoal.value.daily_calories)
    const dailyCarbs = computed(() => latestDailyNutritionGoal.value.daily_carbs)
    const dailyProtein = computed(() => latestDailyNutritionGoal.value.daily_protein)
    const dailyFat = computed(() => latestDailyNutritionGoal.value.daily_fat)
    const getFoodDiaryEntries = computed(() => foodDiaryEntries.value)

    const dailyNutritionGoalComplete = computed(() => {
        return new Date(latestDailyNutritionGoal.value.created_at).toDateString() !== new Date("1900-01-01").toDateString()
    })

    function getUniqueId() {
        return uuidv4()
    }

    function calculateBaseCalories() {
      const userStore = useUserStore() 
      const weightStore = useWeightStore()
      if (!userStore.isComplete) {
        return 2000
      }
      const userHeight = userStore.getHeight()
      const userGender = userStore.getGender()
      const userAge = userStore.getAge()
      const userWeight = weightStore.currentWeight.weight
      const activityModifier = 1.2
      if (userHeight === undefined || userGender === undefined || userAge === undefined || userWeight === undefined) {
        return 2000
      }
      if (userGender === 'male') {
        return Math.round(activityModifier * (88.363 + (13.397 * userWeight) + (4.799 * userHeight) - (5.677 * userAge)))
      } else {
        return Math.round(activityModifier * (447.593 + (9.247 * userWeight) + (3.098 * userHeight) - (4.330 * userAge)))
      }
    }

    function calculateCalories(carbs: number, protein: number, fat: number): number {
        return carbs * 4 + protein * 4 + fat * 9
    }

    function calculateBaseMacros(calories: number) {
        return {
            carbs: Math.round(calories * 0.5 / 4),
            protein: Math.round(calories * 0.3 / 4),
            fat: Math.round(calories * 0.2 / 9)
        }
    }

    function getFoodDiaryEntryById(id: string): FoodDiaryEntry | undefined {
        return foodDiaryEntries.value.find(entry => entry.id === id)
    }

    async function addDailyNutritionGoal(dailyNutritionGoal: DailyNutritionGoal) {
        dailyNutritionGoals.value.push(dailyNutritionGoal)
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
          const { error } = await supabase.from('daily_nutrition_goals').upsert(dailyNutritionGoal)
          if (error) {
              console.error(error)
          }
        }
    }

    async function getNutritionGoalOfDate(date: Date | null): Promise<DailyNutritionGoal> {
        let selectedDate = new Date(new Date().setHours(0, 0, 0, 0))
        if (date !== null) {
            selectedDate = new Date(date.setHours(0, 0, 0, 0))
        }
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            const { data, error } = await supabase.from('daily_nutrition_goals').select('*').lte('created_at', selectedDate.toISOString()).order('created_at', { ascending: false }).limit(1).single()
            if (error) {
                console.error(error)
            } else {
                return data
            }
        }
        const sortedNutritionGoals = dailyNutritionGoals.value.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        let nutritionGoalOfDate = sortedNutritionGoals[0];

        for (const nutritionGoal of sortedNutritionGoals) {
            if (new Date(new Date(nutritionGoal.created_at).setHours(0, 0, 0, 0)) <= selectedDate) {
              nutritionGoalOfDate = nutritionGoal;
            } else {
              break;
            }
        }
        return {
            id: nutritionGoalOfDate.id,
            created_at: nutritionGoalOfDate.created_at,
            nutrition_goal: nutritionGoalOfDate.nutrition_goal,
            daily_calories: nutritionGoalOfDate.daily_calories,
            daily_carbs: nutritionGoalOfDate.daily_carbs,
            daily_protein: nutritionGoalOfDate.daily_protein,
            daily_fat: nutritionGoalOfDate.daily_fat
        } as DailyNutritionGoal
    }

    async function addFoodDiaryEntry(foodDiaryEntry: FoodDiaryEntry) {
        foodDiaryEntries.value.push(foodDiaryEntry)
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
          const { error } = await supabase.from('food_diary_entries').upsert(foodDiaryEntry)
          if (error) {
              console.error(error)
          }
        }
    }

    async function updateFoodDiaryEntry(foodDiaryEntry: FoodDiaryEntry) {
        const foodDiaryEntryIndex = foodDiaryEntries.value.findIndex((w) => w.id === foodDiaryEntry.id);
        if (foodDiaryEntryIndex !== -1) {
            foodDiaryEntries.value[foodDiaryEntryIndex] = foodDiaryEntry;
        } else {
            foodDiaryEntries.value.push(foodDiaryEntry);
        }
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
          const { error } = await supabase.from('food_diary_entries').upsert(foodDiaryEntry)
          if (error) {
              console.error(error)
          }
        }
    }

    async function deleteFoodDiaryEntry(foodDiaryEntryId: string) {
        foodDiaryEntries.value = foodDiaryEntries.value.filter(entry => entry.id !== foodDiaryEntryId)
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
          const {data, error} = await supabase.from('food_diary_entries').update({ deleted: true }).eq('id', foodDiaryEntryId ).select()
          console.log(data, error)
        }
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

    async function fetchDailyNutritionGoals() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            const { data, error } = await supabase.from('daily_nutrition_goals').select('*').returns<DailyNutritionGoal[]>()
            if (error) {
                console.error(error)
            } else {
                const mergedDailyNutritionGoals = [...dailyNutritionGoals.value]
                for (const dailyNutritionGoal of data) {
                    const existingDailyNutritionGoalIndex = mergedDailyNutritionGoals.findIndex((w) => w.id === dailyNutritionGoal.id);
                    if (existingDailyNutritionGoalIndex !== -1) {
                        const existingDailyNutritionGoal = mergedDailyNutritionGoals[existingDailyNutritionGoalIndex];
                        if (existingDailyNutritionGoal.created_at < dailyNutritionGoal.created_at) {
                            mergedDailyNutritionGoals[existingDailyNutritionGoalIndex] = dailyNutritionGoal;
                        }
                    } else {
                        mergedDailyNutritionGoals.push(dailyNutritionGoal);
                    }
                }
                dailyNutritionGoals.value = mergedDailyNutritionGoals;
            }
        }
    }

    async function fetchFoodDiaryEntries() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            const { data, error } = await supabase.from('food_diary_entries').select('*').eq('deleted', false).returns<FoodDiaryEntry[]>()
            if (error) {
                console.error(error)
            } else {
                const mergedFoodDiaryEntries = [...foodDiaryEntries.value]
                for (const foodDiaryEntry of data) {
                    const existingFoodDiaryEntryIndex = mergedFoodDiaryEntries.findIndex((w) => w.id === foodDiaryEntry.id);
                    if (existingFoodDiaryEntryIndex !== -1) {
                        const existingFoodDiaryEntry = mergedFoodDiaryEntries[existingFoodDiaryEntryIndex];
                        // TODO: Uncomment when nutrition update is implemented
                        //if (existingFoodDiaryEntry.updated_at < foodDiaryEntry.updated_at) {
                        //    mergedFoodDiaryEntries[existingFoodDiaryEntryIndex] = foodDiaryEntry;
                        //}
                    } else {
                        mergedFoodDiaryEntries.push(foodDiaryEntry);
                    }
                }
                foodDiaryEntries.value = mergedFoodDiaryEntries;
            }
        }
    }

    async function syncDailyNutritionGoals() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await fetchDailyNutritionGoals()
            for (const dailyNutritionGoal of dailyNutritionGoals.value) {
                await supabase.from('daily_nutrition_goals').upsert(dailyNutritionGoal)
                // Add error handling as needed
            }
        }
    }

    async function syncFoodDiary() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await fetchFoodDiaryEntries()
            for (const foodDiaryEntry of foodDiaryEntries.value) {
                await supabase.from('food_diary_entries').upsert(foodDiaryEntry)
                // Add error handling as needed
            }
        }
    }

    return {
        foodDiaryEntries,
        selectedNutritionGoal,
        dailyCalories,
        dailyCarbs,
        dailyProtein,
        dailyFat,
        getFoodDiaryEntries,
        latestDailyNutritionGoal,
        dailyNutritionGoalComplete,
        addDailyNutritionGoal,
        calculateBaseCalories,
        calculateBaseMacros,
        getFoodDiaryEntryById,
        calculateCalories,
        getUniqueId,
        addFoodDiaryEntry,
        getNutritionGoalOfDate,
        updateFoodDiaryEntry,
        deleteFoodDiaryEntry,
        getFoodDiaryEntriesOfDate,
        getCaloriesOfDate,
        getCarbohydratesOfDate,
        getProteinOfDate,
        getFatOfDate,
        getMissingProteinsOfToday,
        getMealEntriesOfDate,
        fetchFoodDiaryEntries,
        syncDailyNutritionGoals,
        syncFoodDiary
    }
})
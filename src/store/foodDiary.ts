import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/supabase";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { FoodDiary, FoodDiaryEntry } from "@/types/nutrition";
import { useUserStore } from "@/store/bodyMetricsStore";

export const useFoodDiaryStore = defineStore({
    id: "nutriment",
    state: () => ({
        // TODO: Maybe remove foodDiary
        foodDiary: useStorage('foodDiary', {} as FoodDiary),
        foodDiaryEntries: useStorage('foodDiaryEntries', [] as FoodDiaryEntry[]),
        dailyCalories: useStorage('dailyCalories', 2500),
        dailyCarbs: useStorage('daylyCarbs', 300),
        dailyProtein: useStorage('dailyProtein', 100),
        dailyFat: useStorage('dailyFat', 100),
    }),
    getters: {
       getFoodDiary(): FoodDiary {
           return this.foodDiary;
       },
       getFoodDiaryEntries(): FoodDiaryEntry[] {
           return this.foodDiaryEntries;
       },
    },
    actions: {
        getUniqueId(): string {
            return uuidv4();
        },
        async createFoodDiary() {
            const userStore = useUserStore();
            const foodDiary: FoodDiary = {
                id: this.getUniqueId(),
                user_id: await userStore.getUserId(),
                created_at: new Date(),
            };
            this.foodDiary = foodDiary;
        },
        addFoodDiaryEntry(foodDiaryEntry: FoodDiaryEntry) {
            this.foodDiaryEntries.push(foodDiaryEntry);
        },
        deleteFoodDiaryEntry(foodDiaryEntryId: string) {
            this.foodDiaryEntries = this.foodDiaryEntries.filter((foodDiaryEntry) => {
                return foodDiaryEntry.id !== foodDiaryEntryId;
            });
        },
        getFoodDiaryEntriesOfDate(date: Date): FoodDiaryEntry[] {
            const foodDiaryEntries = this.foodDiaryEntries.filter((foodDiaryEntry) => {
                return new Date(foodDiaryEntry.created_at).getDate() === date.getDate();
            });
            return foodDiaryEntries;
        },
        getCaloriesOfDate(date: Date): number {
            const foodDiaryEntries = this.getFoodDiaryEntriesOfDate(date);
            const calories = foodDiaryEntries.reduce((prev, current) => {
                return prev + current.calories;
            }, 0);
            return calories;
        },
        getCarbohydratesOfDate(date: Date): number {
            const foodDiaryEntries = this.getFoodDiaryEntriesOfDate(date);
            const carbohydrates = foodDiaryEntries.reduce((prev, current) => {
                return prev + current.carbohydrates;
            }, 0);
            return carbohydrates;
        },
        getProteinOfDate(date: Date): number {
            const foodDiaryEntries = this.getFoodDiaryEntriesOfDate(date);
            const proteins = foodDiaryEntries.reduce((prev, current) => {
                return prev + current.protein;
            }, 0);
            return proteins;
        },
        getFatOfDate(date: Date): number {
            const foodDiaryEntries = this.getFoodDiaryEntriesOfDate(date);
            const fats = foodDiaryEntries.reduce((prev, current) => {
                return prev + current.fat;
            }, 0);
            return fats;
        },
        getMissingProteinsOfToday(): number {
            const proteins = this.getProteinOfDate(new Date());
            const missingProteins = this.dailyProtein - proteins;
            return missingProteins;
        },
        getBreakfastEntriesOfDate(date: Date): FoodDiaryEntry[] {
            const foodDiaryEntries = this.getFoodDiaryEntriesOfDate(date);
            const breakfastEntries = foodDiaryEntries.filter((foodDiaryEntry) => {
                const createdAt = new Date(foodDiaryEntry.created_at);
                return createdAt.getHours() < 12;
            });
            return breakfastEntries;
        },
        getLunchEntriesOfDate(date: Date): FoodDiaryEntry[] {
            const foodDiaryEntries = this.getFoodDiaryEntriesOfDate(date);
            const lunchEntries = foodDiaryEntries.filter((foodDiaryEntry) => {
                const createdAt = new Date(foodDiaryEntry.created_at);
                return createdAt.getHours() >= 12 && createdAt.getHours() < 18;
            });
            return lunchEntries;
        },
        getDinnerEntriesOfDate(date: Date): FoodDiaryEntry[] {
            const foodDiaryEntries = this.getFoodDiaryEntriesOfDate(date);
            const dinnerEntries = foodDiaryEntries.filter((foodDiaryEntry) => {
                const createdAt = new Date(foodDiaryEntry.created_at);
                return createdAt.getHours() >= 18;
            });
            return dinnerEntries;
        },
        async syncFoodDiary(): Promise<void> {
            const session = await supabase.auth.getSession()
            if (session.data.session !== null) {
                const { error } = await supabase.from('food_diaries')
                .upsert(this.foodDiary)
                for (const foodDiaryEntry of this.foodDiaryEntries) {
                    const { error } = await supabase.from('food_diary_entries')
                    .upsert(foodDiaryEntry)
                }
            }
        },
    }
})

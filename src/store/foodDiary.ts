import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { FoodDiary, FoodDiaryEntry } from "@/types/nutrition";

export const useFoodDiaryStore = defineStore({
    id: "nutriment",
    state: () => ({
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
       getNewFoodDiaryEntryId(): number {
           return this.foodDiaryEntries.length + 1;
       },
    },
    actions: {
        createFoodDiary(userId: string) {
            const foodDiary: FoodDiary = {
                //TODO: generate id
                id: 1,
                userId: userId,
                createdAt: new Date(),
            };
            this.foodDiary = foodDiary;
        },
        addFoodDiaryEntry(foodDiaryEntry: FoodDiaryEntry) {
            this.foodDiaryEntries.push(foodDiaryEntry);
        },
        deleteFoodDiaryEntry(foodDiaryEntryId: number) {
            this.foodDiaryEntries = this.foodDiaryEntries.filter((foodDiaryEntry) => {
                return foodDiaryEntry.id !== foodDiaryEntryId;
            });
        },
        getFoodDiaryEntriesOfDate(date: Date): FoodDiaryEntry[] {
            const foodDiaryEntries = this.foodDiaryEntries.filter((foodDiaryEntry) => {
                return new Date(foodDiaryEntry.createdAt).getDate() === date.getDate();
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
                const createdAt = new Date(foodDiaryEntry.createdAt);
                return createdAt.getHours() < 12;
            });
            return breakfastEntries;
        },
        getLunchEntriesOfDate(date: Date): FoodDiaryEntry[] {
            const foodDiaryEntries = this.getFoodDiaryEntriesOfDate(date);
            const lunchEntries = foodDiaryEntries.filter((foodDiaryEntry) => {
                const createdAt = new Date(foodDiaryEntry.createdAt);
                return createdAt.getHours() >= 12 && createdAt.getHours() < 18;
            });
            return lunchEntries;
        },
        getDinnerEntriesOfDate(date: Date): FoodDiaryEntry[] {
            const foodDiaryEntries = this.getFoodDiaryEntriesOfDate(date);
            const dinnerEntries = foodDiaryEntries.filter((foodDiaryEntry) => {
                const createdAt = new Date(foodDiaryEntry.createdAt);
                return createdAt.getHours() >= 18;
            });
            return dinnerEntries;
        }
    }
})

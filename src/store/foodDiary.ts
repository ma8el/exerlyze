import { defineStore } from "pinia";
import { FoodDiary, FoodDiaryEntry } from "@/types/nutrition";

export const useFoodDiaryStore = defineStore({
    id: "nutriment",
    state: () => ({
        foodDiary: {} as FoodDiary,
        foodDiaryEntries: [] as FoodDiaryEntry[],
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
        }
    }
})

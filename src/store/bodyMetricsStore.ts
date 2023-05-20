import { defineStore } from "pinia";
import { Weight } from "@/types";

export const useWeightStore = defineStore({
    id: "weight",
    state: () => ({
        currentWeight: {} as Weight,
        weights: [] as Weight[],
    }),
    getters: {
        getWeights(): Weight[] {
            return this.weights;
        },
        getCurrentWeight(): Weight {
            const currentWeight = this.weights.reduce((prev, current) => {
                return prev.createdAt > current.createdAt ? prev : current;
            });
            return currentWeight;
        }
    },
    actions: {
        addWeight(weight: Weight) {
            this.weights.push(weight);
        }
    }
})
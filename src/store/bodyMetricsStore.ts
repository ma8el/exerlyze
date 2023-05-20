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
        },
        getWeightsOfWeek(): Weight[] {
            const today = new Date();
            const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            const weightsOfWeek = this.weights.filter((weight) => {
                return new Date(weight.createdAt) >= weekAgo;
            });
            return weightsOfWeek;
        }
    },
    actions: {
        addWeight(weight: Weight) {
            this.weights.push(weight);
        }
    }
})
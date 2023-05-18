import { defineStore } from 'pinia'
import { Workout } from '@/types';

export const useWorkoutStore = defineStore({
    id: 'workout',
    state: () => ({
        workouts: [] as Workout[]
    }),
    getters: {
        getWorkouts(): Workout[] {
            return this.workouts;
        },
        getNewId(): number {
             return this.workouts.length + 1;
        },

    },
    actions: {
        getWorkoutById(id: number): Workout | undefined {
            const workout = this.workouts.find(w => w.id === id);
            if (workout) {
                return workout;
            }
            return undefined;
        },
        addWorkout(workout: Workout) {
            this.workouts.push(workout);
        },
         updateWorkout(workout: Workout) {
            const index = this.workouts.findIndex(w => w.id === workout.id);
            this.workouts[index] = workout;
        },
    }
});
import { defineStore } from 'pinia'
import { Workout, Exercise } from '@/types';

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
        }
    },
    actions: {
        addWorkout(workout: Workout) {
            this.workouts.push(workout);
        },
         updateWorkout(workout: Workout) {
            const index = this.workouts.findIndex(w => w.name === workout.name);
            this.workouts[index] = workout;
        },
    }
});
import { defineStore } from 'pinia'

interface Exercise {
    name: string,
    sets: number,
    reps: number,
    weight: number
};

interface Workout {
    id: number,
    name: string,
    exercises: Exercise[]
}

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
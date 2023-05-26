import { defineStore } from 'pinia'
import { Workout, PlannedWorkout, WorkoutPlan, DayOfWeek, FullWorkoutPlan } from '@/types';

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

export const useWorkoutPlanStore = defineStore({
    id: 'workoutPlan',
    state: () => ({
        workoutPlans: [] as WorkoutPlan[],
    }),
    getters: {
        getWorkoutPlans(): WorkoutPlan[] {
            return this.workoutPlans;
        },
        getNewId(): number {
            return this.workoutPlans.length + 1;
        },
        getFullWorkoutPlans(): FullWorkoutPlan[] {
            const dayOfWeekStore = useDayOfWeekStore();
            const workoutStore = useWorkoutStore();
            const plannedWorkoutStore = usePlannedWorkoutStore();
            const fullWorkoutPlan = plannedWorkoutStore.getPlannedWorkouts.map(w => {
                const dayOfWeek = dayOfWeekStore.getDayOfWeekById(w.dayOfWeekId);
                const workout = workoutStore.getWorkoutById(w.workoutId);
                const workoutPlanName = this.workoutPlans.find(wp => wp.id === w.workoutPlanId)?.name;
                const workoutPlanDescription = this.workoutPlans.find(wp => wp.id === w.workoutPlanId)?.description;
                if (dayOfWeek && workout) {
                    return {
                        name: workoutPlanName,
                        description: workoutPlanDescription,
                        ...w,
                        dayOfWeek: dayOfWeek.name,
                        workout: workout
                    } as FullWorkoutPlan;
                }
                return undefined;
            }).filter(w => w !== undefined) as FullWorkoutPlan[];
            return fullWorkoutPlan;
        }
    },
    actions: {
        getWorkoutPlanById(id: number): WorkoutPlan | undefined {
            const workoutPlan = this.workoutPlans.find(w => w.id === id);
            if (workoutPlan) {
                return workoutPlan;
            }
            return undefined;
        },
        addWorkoutPlan(workoutPlan: WorkoutPlan) {
            this.workoutPlans.push(workoutPlan);
        },
        updateWorkoutPlan(workoutPlan: WorkoutPlan) {
            const index = this.workoutPlans.findIndex(w => w.id === workoutPlan.id);
            this.workoutPlans[index] = workoutPlan;
        }
    }
});

export const usePlannedWorkoutStore = defineStore({
    id: 'plannedWorkouts',
    state: () => ({
        plannedWorkouts: [] as PlannedWorkout[],
    }),
    getters: {
        getPlannedWorkouts(): PlannedWorkout[] {
            return this.plannedWorkouts;
        },
        getNewId(): number {
            return this.plannedWorkouts.length + 1;
        }
    },
    actions: {
        getPlannedWorkoutById(id: number): PlannedWorkout | undefined {
            const plannedWorkout = this.plannedWorkouts.find(w => w.id === id);
            if (plannedWorkout) {
                return plannedWorkout;
            }
            return undefined;
        },
        addPlannedWorkout(plannedWorkout: PlannedWorkout) {
            this.plannedWorkouts.push(plannedWorkout);
        },
        getPlannedWorkoutsByWorkoutPlanId(workoutPlanId: number): PlannedWorkout[] {
            return this.plannedWorkouts.filter(w => w.workoutPlanId === workoutPlanId);
        },
        updatePlannedWorkout(plannedWorkout: PlannedWorkout) {
            const index = this.plannedWorkouts.findIndex(w => w.id === plannedWorkout.id);
            this.plannedWorkouts[index] = plannedWorkout;
        },
        updatePlannedWorkoutsOfWorkoutPlan(workoutPlanId: number, plannedWorkouts: PlannedWorkout[]) {
            const index = this.plannedWorkouts.findIndex(w => w.workoutPlanId === workoutPlanId);
            this.plannedWorkouts.splice(index, 1, ...plannedWorkouts);
        }
    }
});

export const useDayOfWeekStore = defineStore({
    id: 'dayOfWeek',
    state: () => ({
        daysOfWeek: [{
            id: 0,
            name: 'Sunday'
        },
        {
            id: 1,
            name: 'Monday'
        },
        {
            id: 2,
            name: 'Tuesday'
        },
        {
            id: 3,
            name: 'Wednesday'
        },
        {
            id: 4,
            name: 'Thursday'
        },
        {
            id: 5,
            name: 'Friday'
        },
        {
            id: 6,
            name: 'Saturday'
        }] as DayOfWeek[]
    }),
    getters: {
        getDaysOfWeek(): DayOfWeek[] {
            return this.daysOfWeek;
        },
    },
    actions: {
        getDayOfWeekById(id: number): DayOfWeek | undefined {
            const dayOfWeek = this.daysOfWeek.find(w => w.id === id);
            if (dayOfWeek) {
                return dayOfWeek;
            }
            return undefined;
        },
    }
});
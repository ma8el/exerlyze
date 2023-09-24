import { defineStore } from 'pinia'
import { Workout,
         PlannedWorkout,
         WorkoutPlan,
         DayOfWeek,
         FullWorkoutPlan,
         WorkoutSchedule,
         WorkoutSession,
         WorkoutSessionPerformance,
         FullWorkoutSession } from '@/types';
import { useStorage } from '@vueuse/core';

export const useWorkoutStore = defineStore({
    id: 'workout',
    state: () => ({
        workouts: useStorage('workouts', [] as Workout[])
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
        workoutPlans: useStorage('workoutPlans', [] as WorkoutPlan[]),
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
        plannedWorkouts: useStorage('plannedWorkouts', [] as PlannedWorkout[]),
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
            name: 'Monday'
        },
        {
            id: 1,
            name: 'Tuesday'
        },
        {
            id: 2,
            name: 'Wednesday'
        },
        {
            id: 3,
            name: 'Thursday'
        },
        {
            id: 4,
            name: 'Friday'
        },
        {
            id: 5,
            name: 'Saturday'
        },
        {
            id: 6,
            name: 'Sunday'
        },
    ] as DayOfWeek[]
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

export const useWorkoutScheduleStore = defineStore({
    id: 'workoutSchedule',
    state: () => ({
        workoutSchedule: useStorage('workoutSchedule', [] as WorkoutSchedule[]),
    }),
    getters: {
        getWorkoutSchedule(): WorkoutSchedule[] {
            return this.workoutSchedule;
        },
        getNewId(): number {
            return this.workoutSchedule.length + 1;
        }
    },
    actions: {
        getWorkoutScheduleById(id: number): WorkoutSchedule | undefined {
            const workoutSchedule = this.workoutSchedule.find(w => w.id === id);
            if (workoutSchedule) {
                return workoutSchedule;
            }
            return undefined;
        },
        addWorkoutSchedule(workoutSchedule: WorkoutSchedule) {
            this.workoutSchedule.push(workoutSchedule);
        },
        updateWorkoutSchedule(workoutSchedule: WorkoutSchedule) {
            const index = this.workoutSchedule.findIndex(w => w.id === workoutSchedule.id);
            this.workoutSchedule[index] = workoutSchedule;
        }
    }
});

export const useWorkoutSessionStore = defineStore({
    id: 'workoutSession',
    state: () => ({
        workoutSessions: useStorage('workoutSessions', [] as WorkoutSession[]),
        workoutSessionPerformances: useStorage('workoutSessionPerformance', [] as WorkoutSessionPerformance[])
    }),
    getters: {
        getWorkoutSessions(): WorkoutSession[] {
            return this.workoutSessions;
        },
        getWorkoutSessionPerformances(): WorkoutSessionPerformance[] {
            return this.workoutSessionPerformances;
        },
        getNewWorkoutSessionId(): number {
            return this.workoutSessions.length + 1;
        },
        getNewWorkoutSessionPerformanceId(): number {
            return this.workoutSessionPerformances.length + 1;
        },
        getFullWorkoutSessions(): FullWorkoutSession[] {
            const workoutStore = useWorkoutStore();
            const fullWorkoutSessions = this.workoutSessions.map(w => {
                const workout = workoutStore.getWorkoutById(w.workoutId);
                if (workout) {
                    return {
                        ...w,
                        workout: workout,
                        workoutPerformance: this.workoutSessionPerformances.filter(p => p.workoutSessionId === w.id)
                    } as FullWorkoutSession;
                }
                return undefined;
            }).filter(w => w !== undefined) as FullWorkoutSession[];
            return fullWorkoutSessions;
        }
    },
    actions: {
        getWorkoutSessionById(id: number): WorkoutSession | undefined {
            const workoutSession = this.workoutSessions.find(w => w.id === id);
            if (workoutSession) {
                return workoutSession;
            }
            return undefined;
        },
        updateWorkoutSessionById(id: number, workoutSessionPerformances: WorkoutSessionPerformance[]) {
            const index = this.workoutSessions.findIndex(w => w.id === id);
            this.workoutSessions[index].updatedAt = new Date();
            this.workoutSessionPerformances = this.workoutSessionPerformances.filter(w => w.workoutSessionId !== id);
            this.workoutSessionPerformances.push(...workoutSessionPerformances);
        },
        getFullWorkoutSessionById(id: number): FullWorkoutSession | undefined {
            const fullWorkoutSession = this.getFullWorkoutSessions.find(w => w.id === id);
            if (fullWorkoutSession) {
                return fullWorkoutSession;
            }
            return undefined;
        },
        getWorkoutSessionsByDate(date: Date): WorkoutSession[] | undefined {
            const workoutSessions = this.workoutSessions.filter(w => new Date(w.finishedAt).toDateString() === date.toDateString());
            if (workoutSessions) {
                return workoutSessions;
            }
            return undefined;
        },
        getFullWorkoutSessionsByDate(date: Date): FullWorkoutSession[] | undefined {
            const fullWorkoutSessions = this.getFullWorkoutSessions;
            if (fullWorkoutSessions) {
                return fullWorkoutSessions.filter(w => new Date(w.finishedAt).toDateString() === date.toDateString());
            }
            return undefined;
        },
        getWorkoutSessionPerformanceByDate(date: Date): WorkoutSessionPerformance[] | undefined {
            const workoutSessionPerformances = this.workoutSessionPerformances.filter(w => new Date(w.createdAt).toDateString() === date.toDateString());
            if (workoutSessionPerformances) {
                return workoutSessionPerformances;
            }
            return undefined;
        },
        getWorkoutSessionPerformanceByDateRange(startDate: Date, endDate: Date): WorkoutSessionPerformance[] | undefined {
            const workoutSessionPerformances = this.workoutSessionPerformances.filter(w => new Date(w.createdAt) >= startDate && new Date(w.createdAt) <= endDate);
            if (workoutSessionPerformances) {
                return workoutSessionPerformances;
            }
            return undefined;
        },
        addWorkoutSession(workoutSession: WorkoutSession) {
            this.workoutSessions.push(workoutSession);
        },
        addWorkoutSessionPerformances(workoutSessionPerformances: WorkoutSessionPerformance[]) {
            this.workoutSessionPerformances.push(...workoutSessionPerformances);
        },
        createFullWorkoutSessionSets(workoutId: number) {
            const workoutStore = useWorkoutStore();
            const workout = workoutStore.getWorkoutById(workoutId);
            let uniqueId = -1;
            if (workout) {
                const sets = workout.exercises.flatMap(exercise => {
                    return Array.from({ length: exercise.sets }, (_, i) => {
                      uniqueId++;
                      return {
                        id: uniqueId,
                        exerciseId: exercise.id,
                        name: exercise.name,
                        sets: exercise.sets,
                        currentSet: i + 1,
                        plannedReps: exercise.reps,
                        reps: exercise.reps,
                        plannedWeight: exercise.weight,
                        weight: exercise.weight
                      };
                    });
                  });
                return sets;
            }
            return [];
        },
    }
});
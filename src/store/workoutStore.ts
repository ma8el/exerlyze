import { v4 as uuidv4 } from 'uuid';
import { defineStore } from 'pinia'
import { supabase } from '@/supabase';
import { Workout,
         PlannedWorkout,
         WorkoutPlan,
         DayOfWeek,
         FullWorkoutPlan,
         WorkoutSession,
         WorkoutSessionPerformance,
         FullWorkoutSession } from '@/types';
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';

export const useWorkoutStore = defineStore('workout', () => {
    const workouts = ref(useStorage('workouts', [] as Workout[]))

    const getWorkouts = computed(() => workouts.value.filter(w => !w.deleted))

    function getNewId() {
        return uuidv4()
    }

    function getWorkoutById(id: string): Workout | undefined {
        return workouts.value.find(w => w.id === id)
    }

    function addWorkout(workout: Workout) {
        workouts.value.push(workout)
    }

    function updateWorkout(workout: Workout) {
        const index = workouts.value.findIndex(w => w.id === workout.id)
        workouts.value[index] = workout
    }

    function deleteWorkout(id: string): boolean {
        const plannedWorkoutStore = usePlannedWorkoutStore()

        const plannedWorkouts = plannedWorkoutStore.getPlannedWorkouts
        const isPlanned = plannedWorkouts.some(w => w.workout_id === id)
        if (isPlanned) {
            return false
        }

        const index = workouts.value.findIndex(w => w.id === id)
        workouts.value[index].deleted = true
        return true
    }

    async function syncWorkouts() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            for (const workout of workouts.value) {
                await supabase.from('workouts').upsert({
                    id: workout.id,
                    created_at: workout.created_at,
                    updated_at: workout.updated_at,
                    name: workout.name,
                    description: workout.description,
                    deleted: workout.deleted
                })
                for (const exercise of workout.exercises) {
                    await supabase.from('workout_exercises').upsert({
                        id: exercise.id,
                        created_at: workout.created_at,
                        updated_at: workout.updated_at,
                        workout_id: workout.id,
                        exercise_id: exercise.exercise_id,
                        sets: exercise.sets,
                        reps: exercise.reps,
                        weight: exercise.weight,
                        valid: true,
                    })
                }
            }
        }
    }

    return {
        workouts,
        getWorkouts,
        getNewId,
        getWorkoutById,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        syncWorkouts
    }
})

export const useWorkoutPlanStore = defineStore('workoutPlan', () => {
    const workoutPlans = ref(useStorage('workoutPlans', [] as WorkoutPlan[]))

    const getWorkoutPlans = computed(() => workoutPlans.value.filter(w => !w.deleted))

    const getFullWorkoutPlans = computed(() => {
        const dayOfWeekStore = useDayOfWeekStore()
        const workoutStore = useWorkoutStore()
        const plannedWorkoutStore = usePlannedWorkoutStore()

        return plannedWorkoutStore.getPlannedWorkouts.map(w => {
            const dayOfWeek = dayOfWeekStore.getDayOfWeekById(w.day_of_week_id)
            const workout = workoutStore.getWorkoutById(w.workout_id)
            const workoutPlan = workoutPlans.value.find(wp => wp.id === w.workout_plan_id)

            if (dayOfWeek && workout && workoutPlan) {
                return {
                    name: workoutPlan.name,
                    description: workoutPlan.description,
                    ...w,
                    dayOfWeek: dayOfWeek.name,
                    workout: workout
                } as FullWorkoutPlan
            }
            return undefined
        }).filter(w => w !== undefined) as FullWorkoutPlan[]
    })

    function getNewId() {
        return uuidv4()
    }

    function getWorkoutPlanById(id: string): WorkoutPlan | undefined {
        return workoutPlans.value.find(w => w.id === id)
    }

    function addWorkoutPlan(workoutPlan: WorkoutPlan) {
        workoutPlans.value.push(workoutPlan)
    }

    function updateWorkoutPlan(workoutPlan: WorkoutPlan) {
        const index = workoutPlans.value.findIndex(w => w.id === workoutPlan.id)
        workoutPlans.value[index] = workoutPlan
    }

    function deleteWorkoutPlan(id: string) {
        const plannedWorkoutStore = usePlannedWorkoutStore()
        const index = workoutPlans.value.findIndex(w => w.id === id)
        const plannedWorkouts = plannedWorkoutStore.getPlannedWorkoutsByWorkoutPlanId(id)

        workoutPlans.value[index].deleted = true
        plannedWorkouts.forEach(w => {
            plannedWorkoutStore.deletePlannedWorkout(w.id)
        })
    }

    async function syncWorkoutPlans() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await supabase.from('workout_plans').upsert(workoutPlans.value)
            // TODO: Add error handling as needed
        }
    }

    return {
        workoutPlans,
        getWorkoutPlans,
        getFullWorkoutPlans,
        getNewId,
        getWorkoutPlanById,
        addWorkoutPlan,
        updateWorkoutPlan,
        deleteWorkoutPlan,
        syncWorkoutPlans
    }
})
//export const useWorkoutStore = defineStore({
//    id: 'workout',
//    state: () => ({
//        workouts: useStorage('workouts', [] as Workout[])
//    }),
//    getters: {
//        getWorkouts(): Workout[] {
//            return this.workouts.filter(w => !w.deleted);
//        },
//    },
//    actions: {
//        getNewId(): string {
//            return uuidv4();
//        },
//        getWorkoutById(id: string): Workout | undefined {
//            const workout = this.workouts.find(w => w.id === id);
//            if (workout) {
//                return workout;
//            }
//            return undefined;
//        },
//        addWorkout(workout: Workout) {
//            this.workouts.push(workout);
//        },
//        updateWorkout(workout: Workout) {
//            const index = this.workouts.findIndex(w => w.id === workout.id);
//            this.workouts[index] = workout;
//        },
//        deleteWorkout(id: string) {
//            const plannedWorkoutStore = usePlannedWorkoutStore();
//
//            const plannedWorkouts = plannedWorkoutStore.getPlannedWorkouts;
//            const isPlanned = plannedWorkouts.some(w => w.workout_id === id);
//            if (isPlanned) {
//                return false;
//            }
//
//            const index = this.workouts.findIndex(w => w.id === id);
//            this.workouts[index].deleted = true
//            return true;
//        },
//        async syncWorkouts(): Promise<void> {
//            const session = await supabase.auth.getSession()
//            if (session.data.session !== null) {
//                for (const workout of this.workouts) {
//                    const { error } = await supabase.from('workouts')
//                    .upsert({
//                        id: workout.id,
//                        created_at: workout.created_at,
//                        updated_at: workout.updated_at,
//                        name: workout.name,
//                        description: workout.description,
//                        deleted: workout.deleted
//                    })
//                    for (const exercise of workout.exercises) {
//                      await supabase.from('workout_exercises')
//                      .upsert({
//                          id: exercise.id,
//                          created_at: workout.created_at,
//                          updated_at: workout.updated_at,
//                          workout_id: workout.id,
//                          exercise_id: exercise.exercise_id,
//                          sets: exercise.sets,
//                          reps: exercise.reps,
//                          weight: exercise.weight,
//                          valid: true,
//                      })
//                    }
//                }
//            }
//        }
//    }
//});

//export const useWorkoutPlanStore = defineStore({
//    id: 'workoutPlan',
//    state: () => ({
//        workoutPlans: useStorage('workoutPlans', [] as WorkoutPlan[]),
//    }),
//    getters: {
//        getWorkoutPlans(): WorkoutPlan[] {
//            return this.workoutPlans.filter(w => !w.deleted);
//        },
//        getFullWorkoutPlans(): FullWorkoutPlan[] {
//            const dayOfWeekStore = useDayOfWeekStore();
//            const workoutStore = useWorkoutStore();
//            const plannedWorkoutStore = usePlannedWorkoutStore();
//            const fullWorkoutPlan = plannedWorkoutStore.getPlannedWorkouts.map(w => {
//                const dayOfWeek = dayOfWeekStore.getDayOfWeekById(w.day_of_week_id);
//                const workout = workoutStore.getWorkoutById(w.workout_id);
//                const workoutPlanName = this.workoutPlans.find(wp => wp.id === w.workout_plan_id)?.name;
//                const workoutPlanDescription = this.workoutPlans.find(wp => wp.id === w.workout_plan_id)?.description;
//                if (dayOfWeek && workout) {
//                    return {
//                        name: workoutPlanName,
//                        description: workoutPlanDescription,
//                        ...w,
//                        dayOfWeek: dayOfWeek.name,
//                        workout: workout
//                    } as FullWorkoutPlan;
//                }
//                return undefined;
//            }).filter(w => w !== undefined) as FullWorkoutPlan[];
//            return fullWorkoutPlan;
//        }
//    },
//    actions: {
//        getNewId(): string {
//            return uuidv4();
//        },
//        getWorkoutPlanById(id: string): WorkoutPlan | undefined {
//            const workoutPlan = this.workoutPlans.find(w => w.id === id);
//            if (workoutPlan) {
//                return workoutPlan;
//            }
//            return undefined;
//        },
//        addWorkoutPlan(workoutPlan: WorkoutPlan) {
//            this.workoutPlans.push(workoutPlan);
//        },
//        updateWorkoutPlan(workoutPlan: WorkoutPlan) {
//            const index = this.workoutPlans.findIndex(w => w.id === workoutPlan.id);
//            this.workoutPlans[index] = workoutPlan;
//        },
//        deleteWorkoutPlan(id: string) {
//            const plannedWorkoutStore = usePlannedWorkoutStore();
//            const index = this.workoutPlans.findIndex(w => w.id === id);
//            const plannedWorkouts = plannedWorkoutStore.getPlannedWorkoutsByWorkoutPlanId(id);
//            this.workoutPlans[index].deleted = true
//            plannedWorkouts.forEach(w => {
//                plannedWorkoutStore.deletePlannedWorkout(w.id);
//            })
//        },
//        async syncWorkoutPlans(): Promise<void> {
//            const session = await supabase.auth.getSession()
//            if (session.data.session !== null) {
//                    const { error } = await supabase.from('workout_plans')
//                    .upsert(this.workoutPlans)
//            }
//        }
//    }
//});

export const usePlannedWorkoutStore = defineStore({
    id: 'plannedWorkouts',
    state: () => ({
        plannedWorkouts: useStorage('plannedWorkouts', [] as PlannedWorkout[]),
    }),
    getters: {
        getPlannedWorkouts(): PlannedWorkout[] {
            return this.plannedWorkouts.filter(w => !w.deleted);
        },
    },
    actions: {
        getNewId(): string {
            return uuidv4();
        },
        getPlannedWorkoutById(id: string): PlannedWorkout | undefined {
            const plannedWorkout = this.plannedWorkouts.find(w => w.id === id);
            if (plannedWorkout) {
                return plannedWorkout;
            }
            return undefined;
        },
        addPlannedWorkout(plannedWorkout: PlannedWorkout) {
            this.plannedWorkouts.push(plannedWorkout);
        },
        getPlannedWorkoutsByWorkoutPlanId(workoutPlanId: string): PlannedWorkout[] {
            return this.plannedWorkouts.filter(w => w.workout_plan_id === workoutPlanId);
        },
        updatePlannedWorkout(plannedWorkout: PlannedWorkout) {
            const index = this.plannedWorkouts.findIndex(w => w.id === plannedWorkout.id);
            this.plannedWorkouts[index] = plannedWorkout;
        },
        updatePlannedWorkoutsOfWorkoutPlan(workoutPlanId: string, plannedWorkouts: PlannedWorkout[]) {
            const index = this.plannedWorkouts.findIndex(w => w.workout_plan_id === workoutPlanId);
            this.plannedWorkouts.splice(index, 1, ...plannedWorkouts);
        },
        deletePlannedWorkout(id: string) {
            const index = this.plannedWorkouts.findIndex(w => w.id === id);
            this.plannedWorkouts[index].deleted = true
        },
        async syncPlannedWorkouts(): Promise<void> {
            const session = await supabase.auth.getSession()
            if (session.data.session !== null) {
                for (const plannedWorkout of this.plannedWorkouts) {
                    const { error } = await supabase.from('planned_workouts')
                        .upsert(plannedWorkout)
                }
            }
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
        getFullWorkoutSessions(): FullWorkoutSession[] {
            const workoutStore = useWorkoutStore();
            const fullWorkoutSessions = this.workoutSessions.map(w => {
                const workout = workoutStore.getWorkoutById(w.workout_id);
                if (workout) {
                    return {
                        ...w,
                        workout: workout,
                        workoutPerformance: this.workoutSessionPerformances.filter(p => p.workout_session_id === w.id)
                    } as FullWorkoutSession;
                }
                return undefined;
            }).filter(w => w !== undefined) as FullWorkoutSession[];
            return fullWorkoutSessions;
        }
    },
    actions: {
        getNewWorkoutSessionId(): string {
            return uuidv4();
        },
        getNewWorkoutSessionPerformanceId(): string {
            return uuidv4();
        },
        getWorkoutSessionById(id: string): WorkoutSession | undefined {
            const workoutSession = this.workoutSessions.find(w => w.id === id);
            if (workoutSession) {
                return workoutSession;
            }
            return undefined;
        },
        updateWorkoutSessionById(id: string, workoutSessionPerformances: WorkoutSessionPerformance[]) {
            const index = this.workoutSessions.findIndex(w => w.id === id);
            this.workoutSessions[index].updated_at = new Date();
            this.workoutSessionPerformances = this.workoutSessionPerformances.filter(w => w.workout_session_id !== id);
            this.workoutSessionPerformances.push(...workoutSessionPerformances);
        },
        getFullWorkoutSessionById(id: string): FullWorkoutSession | undefined {
            const fullWorkoutSession = this.getFullWorkoutSessions.find(w => w.id === id);
            if (fullWorkoutSession) {
                return fullWorkoutSession;
            }
            return undefined;
        },
        getWorkoutSessionsByDate(date: Date): WorkoutSession[] | undefined {
            const workoutSessions = this.workoutSessions.filter(w => new Date(w.finished_at).toDateString() === date.toDateString());
            if (workoutSessions) {
                return workoutSessions;
            }
            return undefined;
        },
        getFullWorkoutSessionsByDate(date: Date): FullWorkoutSession[] | undefined {
            const fullWorkoutSessions = this.getFullWorkoutSessions;
            if (fullWorkoutSessions) {
                return fullWorkoutSessions.filter(w => new Date(w.finished_at).toDateString() === date.toDateString());
            }
            return undefined;
        },
        getWorkoutSessionPerformanceByDate(date: Date): WorkoutSessionPerformance[] | undefined {
            const workoutSessionPerformances = this.workoutSessionPerformances.filter(w => new Date(w.created_at).toDateString() === date.toDateString());
            if (workoutSessionPerformances) {
                return workoutSessionPerformances;
            }
            return undefined;
        },
        getWorkoutSessionPerformanceByDateRange(startDate: Date, endDate: Date): WorkoutSessionPerformance[] | undefined {
            const workoutSessionPerformances = this.workoutSessionPerformances.filter(w => new Date(w.created_at) >= startDate && new Date(w.created_at) <= endDate);
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
        createFullWorkoutSessionSets(workoutId: string) {
            const workoutStore = useWorkoutStore();
            const workout = workoutStore.getWorkoutById(workoutId);
            if (workout) {
                const sets = workout.exercises.flatMap(exercise => {
                    return Array.from({ length: exercise.sets }, (_, i) => {
                      return {
                        id: this.getNewWorkoutSessionPerformanceId(),
                        exerciseId: exercise.exercise_id,
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
        getPerformedWorkoutsThisWeek(): number {
            const today = new Date()
            const firstDayOfWeek = new Date(new Date(today.setDate(today.getDate() - today.getDay())).setHours(0,0,0,0));
            const lastDayOfWeek = new Date(new Date(today.setDate(today.getDate() - today.getDay() + 6)).setHours(0, 0, 0, 0));

            const performedWorkouts = this.workoutSessions.filter(w => new Date(w.finished_at) >= firstDayOfWeek && new Date(w.finished_at) <= lastDayOfWeek);
            return performedWorkouts.length;
        },
        getPerformedWorkoutVolumeOfDate(date: Date): number {
            const workoutSessions = this.workoutSessions.filter(w => new Date(w.finished_at).toDateString() === date.toDateString());
            const sessionIds = workoutSessions.map((s: WorkoutSession) => s.id)
            const sessionPerformance = this.workoutSessionPerformances.filter((w: any) => sessionIds.includes(w.workout_session_id))
            const volume = sessionPerformance.reduce(
                   (acc, curr) => acc + curr.performed_reps * curr.performed_weight, 0)
            return volume;
        },
        getPerformedWorkoutVolumeThisWeek(): number {
            const today = new Date();
            const firstDayOfWeek = new Date(new Date(today.setDate(today.getDate() - today.getDay())).setHours(0,0,0,0));
            const lastDayOfWeek = new Date(new Date(today.setDate(today.getDate() - today.getDay() + 6)).setHours(23, 59, 59, 0));
            const sessionsOfWeek = this.workoutSessions.filter(w => new Date(w.finished_at) >= firstDayOfWeek && new Date(w.finished_at) <= lastDayOfWeek);
            const sessionIdsOfWeek = sessionsOfWeek.map((s: WorkoutSession) => s.id)
 
            const sessionPerformanceOfWeek = this.workoutSessionPerformances.filter((w: any) => sessionIdsOfWeek.includes(w.workout_session_id)) 
            const volumeOfWeek = sessionPerformanceOfWeek.reduce(
                   (acc, curr) => acc + curr.performed_reps * curr.performed_weight, 0)
            return volumeOfWeek;
        },
        async syncWorkoutSessions() {
            const session = await supabase.auth.getSession()
            if (session.data.session !== null) {
                const { error } = await supabase.from('workout_sessions')
                .upsert(this.workoutSessions)
                for (const workoutSessionPerformance of this.workoutSessionPerformances) {
                    await supabase.from('workout_session_performances')
                    .upsert(workoutSessionPerformance)
                }
            }
        }
    }
});
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
import { push } from 'ionicons/icons';

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

export const useWorkoutStore = defineStore('workout', () => {
    const workouts = ref(useStorage('workouts', [] as Workout[]))

    const getWorkouts = computed(() => workouts.value.filter(w => !w.deleted))

    function getNewId() {
        return uuidv4()
    }

    function getWorkoutById(id: string): Workout | undefined {
        return workouts.value.find(w => w.id === id)
    }

    async function addWorkout(workout: Workout) {
        workouts.value.push(workout)
        const session = await supabase.auth.getSession()
        if (session !== null) {
            await pushWorkout(workout)
        }
    }

    async function updateWorkout(workout: Workout) {
        const index = workouts.value.findIndex(w => w.id === workout.id)
        workouts.value[index] = workout
        workouts.value[index].updated_at = new Date()

        const session = supabase.auth.getSession()
        if (session !== null) {
            await pushWorkout(workout)
        }
    }

    async function deleteWorkout(id: string): Promise<boolean> {
        const plannedWorkoutStore = usePlannedWorkoutStore()

        const plannedWorkouts = plannedWorkoutStore.getPlannedWorkouts
        const isPlanned = plannedWorkouts.some(w => w.workout_id === id)
        if (isPlanned) {
            return false
        }

        const index = workouts.value.findIndex(w => w.id === id)
        workouts.value[index].deleted = true
        workouts.value[index].updated_at = new Date()

        const session = await supabase.auth.getSession()
        if (session !== null) {
            await pushWorkout(workouts.value[index])
        }
        return true
    }

    async function fetchWorkouts() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            const { data, error } = await supabase.from('workouts').select('*, exercises:workout_exercises(*)')
            if (error) {
                console.error(error)
            } else {
                const mergedWorkouts = workouts.value
                for(const workout of data) {
                    const existingWorkoutIndex = mergedWorkouts.findIndex((w) => w.id === workout.id)
                    if (existingWorkoutIndex !== -1) {
                        const existingWorkout = mergedWorkouts[existingWorkoutIndex]
                        if (existingWorkout.updated_at < workout.updated_at) {
                            mergedWorkouts[existingWorkoutIndex] = workout
                        }
                    } else {
                        mergedWorkouts.push(workout)
                    }
               }
               workouts.value = mergedWorkouts
           }
        }
    }

    async function pushWorkout(workout: Workout) {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
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

    async function syncWorkouts() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await fetchWorkouts()
            for (const workout of workouts.value) {
                await pushWorkout(workout)
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
        fetchWorkouts,
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

export const usePlannedWorkoutStore = defineStore('plannedWorkouts', () => {
    const plannedWorkouts = ref(useStorage('plannedWorkouts', [] as PlannedWorkout[]))

    const getPlannedWorkouts = computed(() => plannedWorkouts.value.filter(w => !w.deleted))

    function getNewId() {
        return uuidv4()
    }

    function getPlannedWorkoutById(id: string): PlannedWorkout | undefined {
        return plannedWorkouts.value.find(w => w.id === id)
    }

    function addPlannedWorkout(plannedWorkout: PlannedWorkout) {
        plannedWorkouts.value.push(plannedWorkout)
    }

    function getPlannedWorkoutsByWorkoutPlanId(workoutPlanId: string): PlannedWorkout[] {
        return plannedWorkouts.value.filter(w => w.workout_plan_id === workoutPlanId)
    }

    function updatePlannedWorkout(plannedWorkout: PlannedWorkout) {
        const index = plannedWorkouts.value.findIndex(w => w.id === plannedWorkout.id)
        plannedWorkouts.value[index] = plannedWorkout
    }

    function updatePlannedWorkoutsOfWorkoutPlan(workoutPlanId: string, newPlannedWorkouts: PlannedWorkout[]) {
        const indexes = plannedWorkouts.value
            .map((w, i) => w.workout_plan_id === workoutPlanId ? i : -1)
            .filter(i => i !== -1)
        if (indexes.length > 0) {
            plannedWorkouts.value.splice(indexes[0], indexes.length, ...newPlannedWorkouts)
        } else {
            plannedWorkouts.value.push(...newPlannedWorkouts)
        }
    }

    function deletePlannedWorkout(id: string) {
        const index = plannedWorkouts.value.findIndex(w => w.id === id)
        if (index !== -1) {
            plannedWorkouts.value[index].deleted = true
        }
    }

    async function syncPlannedWorkouts() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            for (const plannedWorkout of plannedWorkouts.value) {
                await supabase.from('planned_workouts').upsert(plannedWorkout)
                // Add error handling as needed
            }
        }
    }

    return {
        plannedWorkouts,
        getPlannedWorkouts,
        getNewId,
        getPlannedWorkoutById,
        addPlannedWorkout,
        getPlannedWorkoutsByWorkoutPlanId,
        updatePlannedWorkout,
        updatePlannedWorkoutsOfWorkoutPlan,
        deletePlannedWorkout,
        syncPlannedWorkouts
    }
})

export const useWorkoutSessionStore = defineStore('workoutSession', () => {
    const workoutSessions = ref(useStorage('workoutSessions', [] as WorkoutSession[]))
    const workoutSessionPerformances = ref(useStorage('workoutSessionPerformance', [] as WorkoutSessionPerformance[]))

    const getWorkoutSessions = computed(() => workoutSessions.value)
    const getWorkoutSessionPerformances = computed(() => workoutSessionPerformances.value)

    const getFullWorkoutSessions = computed(() => {
        const workoutStore = useWorkoutStore()
        return workoutSessions.value.map(w => {
            const workout = workoutStore.getWorkoutById(w.workout_id)
            if (workout) {
                return {
                    ...w,
                    workout: workout,
                    workoutPerformance: workoutSessionPerformances.value.filter(p => p.workout_session_id === w.id)
                } as FullWorkoutSession
            }
            return undefined
        }).filter(w => w !== undefined) as FullWorkoutSession[]
    })

    function getNewWorkoutSessionId(): string {
        return uuidv4();
    }

    function getNewWorkoutSessionPerformanceId(): string {
        return uuidv4()
    }

    function getWorkoutSessionById(id: string): WorkoutSession | undefined {
        return workoutSessions.value.find(w => w.id === id)
    }

    function addWorkoutSession(workoutSession: WorkoutSession) {
        workoutSessions.value.push(workoutSession)
    }

    function addWorkoutSessionPerformances(workoutSessionPerformancesToAdd: WorkoutSessionPerformance[]) {
        workoutSessionPerformances.value.push(...workoutSessionPerformancesToAdd)
    }

    function updateWorkoutSessionById(id: string, workoutSessionPerformances: WorkoutSessionPerformance[]) {
        const index = workoutSessions.value.findIndex(w => w.id === id);
        workoutSessions.value[index].updated_at = new Date();
        workoutSessionPerformances = workoutSessionPerformances.filter(w => w.workout_session_id !== id);
        workoutSessionPerformances.push(...workoutSessionPerformances);
    }

    function getFullWorkoutSessionById(id: string): FullWorkoutSession | undefined {
        const fullWorkoutSession = getFullWorkoutSessions.value.find(w => w.id === id);
        if (fullWorkoutSession) {
            return fullWorkoutSession;
        }
        return undefined;
    }

    function getWorkoutSessionsByDate(date: Date): WorkoutSession[] | undefined {
        return workoutSessions.value.filter(w => new Date(w.finished_at).toDateString() === date.toDateString());
    }

    function getFullWorkoutSessionsByDate(date: Date): FullWorkoutSession[] | undefined {
        const fullWorkoutSessions = getFullWorkoutSessions.value;
        if (fullWorkoutSessions) {
            return fullWorkoutSessions.filter(w => new Date(w.finished_at).toDateString() === date.toDateString());
        }
        return undefined;
    }

    function getWorkoutSessionPerformanceByDate(date: Date): WorkoutSessionPerformance[] | undefined {
        return  workoutSessionPerformances.value.filter(w => new Date(w.created_at).toDateString() === date.toDateString());
    }

    function getWorkoutSessionPerformanceByDateRange(startDate: Date, endDate: Date): WorkoutSessionPerformance[] | undefined {
        return workoutSessionPerformances.value.filter(w => new Date(w.created_at) >= startDate && new Date(w.created_at) <= endDate);
    }

    function createFullWorkoutSessionSets(workoutId: string) {
        const workoutStore = useWorkoutStore();
        const workout = workoutStore.getWorkoutById(workoutId);
        if (workout) {
            const sets = workout.exercises.flatMap(exercise => {
                return Array.from({ length: exercise.sets }, (_, i) => {
                  return {
                    id: getNewWorkoutSessionPerformanceId(),
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
    }

    function getPerformedWorkoutsThisWeek(): number {
        const today = new Date()
        const firstDayOfWeek = new Date(new Date(today.setDate(today.getDate() - today.getDay())).setHours(0,0,0,0));
        const lastDayOfWeek = new Date(new Date(today.setDate(today.getDate() - today.getDay() + 6)).setHours(0, 0, 0, 0));

        const performedWorkouts = workoutSessions.value.filter(w => new Date(w.finished_at) >= firstDayOfWeek && new Date(w.finished_at) <= lastDayOfWeek);
        return performedWorkouts.length;
    }

    function getPerformedWorkoutVolumeOfDate(date: Date): number {
        const filteredWorkoutSessions = workoutSessions.value.filter(w => new Date(w.finished_at).toDateString() === date.toDateString());
        const sessionIds = filteredWorkoutSessions.map((s: WorkoutSession) => s.id)
        const sessionPerformance = workoutSessionPerformances.value.filter((w: any) => sessionIds.includes(w.workout_session_id))
        const volume = sessionPerformance.reduce(
               (acc, curr) => acc + curr.performed_reps * curr.performed_weight, 0)
        return volume;
    }

    function getPerformedWorkoutVolumeThisWeek(): number {
        const today = new Date();
        const firstDayOfWeek = new Date(new Date(today.setDate(today.getDate() - today.getDay())).setHours(0,0,0,0));
        const lastDayOfWeek = new Date(new Date(today.setDate(today.getDate() - today.getDay() + 6)).setHours(23, 59, 59, 0));
        const sessionsOfWeek = workoutSessions.value.filter(w => new Date(w.finished_at) >= firstDayOfWeek && new Date(w.finished_at) <= lastDayOfWeek);
        const sessionIdsOfWeek = sessionsOfWeek.map((s: WorkoutSession) => s.id)
 
        const sessionPerformanceOfWeek = workoutSessionPerformances.value.filter((w: any) => sessionIdsOfWeek.includes(w.workout_session_id)) 
        const volumeOfWeek = sessionPerformanceOfWeek.reduce(
               (acc, curr) => acc + curr.performed_reps * curr.performed_weight, 0)
        return volumeOfWeek;
    }

    async function syncWorkoutSessions() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await supabase.from('workout_sessions').upsert(workoutSessions.value)
            for (const workoutSessionPerformance of workoutSessionPerformances.value) {
                await supabase.from('workout_session_performances').upsert(workoutSessionPerformance)
            }
        }
    }

    return {
        workoutSessions,
        workoutSessionPerformances,
        getWorkoutSessions,
        getWorkoutSessionPerformances,
        getFullWorkoutSessions,
        getNewWorkoutSessionId,
        getNewWorkoutSessionPerformanceId,
        getWorkoutSessionById,
        addWorkoutSession,
        addWorkoutSessionPerformances,
        getWorkoutSessionsByDate,
        getFullWorkoutSessionById,
        getFullWorkoutSessionsByDate,
        getWorkoutSessionPerformanceByDate,
        getWorkoutSessionPerformanceByDateRange,
        createFullWorkoutSessionSets,
        getPerformedWorkoutsThisWeek,
        getPerformedWorkoutVolumeOfDate,
        getPerformedWorkoutVolumeThisWeek,
        syncWorkoutSessions
    }
})
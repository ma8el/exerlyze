import { v4 as uuidv4 } from 'uuid';
import { defineStore } from 'pinia'
import { supabase } from '@/supabase';
import { Workout,
         Muscle,
         PlannedWorkout,
         WorkoutPlan,
         DayOfWeek,
         FullWorkoutPlan,
         WorkoutSession,
         WorkoutSessionPerformance,
         FullWorkoutSession } from '@/types';
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { useUserSettingsStore } from './userSettingsStore';
import { getDayIndex } from '@/helpers/time';
import { WorkoutMediaDB } from '@/db';
import { getBucketUrlFromTable, getSignedObjectUrl, downloadObject, defaultImage } from '@/composables/supabase';

export const useDayOfWeekStore = defineStore({
    id: 'dayOfWeek',
    state: () => ({
        daysOfWeek: [{
            id: 0,
            name: 'Monday',
            name_en: 'Monday',
            name_de: 'Montag',
            name_fr: 'Lundi',
        },
        {
            id: 1,
            name: 'Tuesday',
            name_en: 'Tuesday',
            name_de: 'Dienstag',
            name_fr: 'Mardi',
        },
        {
            id: 2,
            name: 'Wednesday',
            name_en: 'Wednesday',
            name_de: 'Mittwoch',
            name_fr: 'Mercredi',
        },
        {
            id: 3,
            name: 'Thursday',
            name_en: 'Thursday',
            name_de: 'Donnerstag',
            name_fr: 'Jeudi',
        },
        {
            id: 4,
            name: 'Friday',
            name_en: 'Friday',
            name_de: 'Freitag',
            name_fr: 'Vendredi',
        },
        {
            id: 5,
            name: 'Saturday',
            name_en: 'Saturday',
            name_de: 'Samstag',
            name_fr: 'Samdi',
        },
        {
            id: 6,
            name: 'Sunday',
            name_en: 'Sunday',
            name_de: 'Sonntag',
            name_fr: 'Dimanche',
        },
    ] as DayOfWeek[]
    }),
    getters: {
        getDaysOfWeek(): DayOfWeek[] {
            const userSettingsStore = useUserSettingsStore()
            const locale = userSettingsStore.getLocale()
            const daysOfWeek = this.daysOfWeek.map((dayOfWeek: DayOfWeek) => {
                switch (locale) {
                    case 'de':
                        return {
                            ...dayOfWeek,
                            name: dayOfWeek.name_de
                        }
                    case 'fr':
                        return {
                            ...dayOfWeek,
                            name: dayOfWeek.name_fr
                        }
                    default:
                        return {
                            ...dayOfWeek,
                            name: dayOfWeek.name_en
                        }
                }
            })
            return daysOfWeek;
        },
    },
    actions: {
        getDayOfWeekById(id: number): DayOfWeek | undefined {
            const dayOfWeek = this.getDaysOfWeek.find(w => w.id === id);
            if (dayOfWeek) {
                return dayOfWeek;
            }
            return undefined;
        },
    }
});

export const useMuscleStore = defineStore('muscle', () => {
    const muscles = ref(useStorage('muscles', [] as any[]))

    const getMuscles = computed(() => muscles.value)

    async function getMuscleById(id: number): Promise<Muscle | undefined> {
        if (muscles.value.length === 0) {
            await fetchMuscles()
        }
        return muscles.value.find(w => w.id === id)
    }

    async function getMuscleNameById(id: number): Promise<string | undefined> {
        const muscle = await getMuscleById(id)
        if (muscle) {
            const userSettingsStore = useUserSettingsStore()
            const locale = userSettingsStore.getLocale()
            switch (locale) {
                case 'de':
                    return muscle.name_de
                case 'fr':
                    return muscle.name_fr
                default:
                    return muscle.name_en
            }
        }
        return undefined
    }

    async function fetchMuscles() {
        const { data, error } = await supabase.from('muscles').select('id, created_at, updated_at, name_en, name_de, name_fr')
        if (error) {
            console.error(error)
        } else {
            muscles.value = data
        }
    }
    return {
        muscles,
        getMuscles,
        getMuscleNameById,
        getMuscleById,
        fetchMuscles,
    }
})

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
        if (session.data.session !== null) {
            await pushWorkout(workout)
        }
    }

    async function cacheWorkoutImage(exercise_id: number) {
        const workoutMediaDB = new WorkoutMediaDB()
        const { data } = await getBucketUrlFromTable('exercises', exercise_id)
        if (!data) return
        const image = await downloadObject('exercise_images', `${data.ressource_name}.jpg`) 
        const imageBlob = image.data
        if (imageBlob == null) {
            return
        }
        await workoutMediaDB.workoutImages.put({ exercise_id: exercise_id, image: imageBlob });
    }

    async function cacheWorkoutVideo(exercise_id: number) {
        const workoutMediaDB = new WorkoutMediaDB()
        const { data } = await getBucketUrlFromTable('exercises', exercise_id)
        if (!data) return
        const video = await downloadObject('exercise_videos', `${data.ressource_name}.mp4`) 
        const videoBlob = video.data
        if (videoBlob == null) {
            return
        }
        await workoutMediaDB.workoutVideos.put({ exercise_id: exercise_id, video: videoBlob });
    };

    async function fetchImageUrlFromIndexDB(exercise_id: number): Promise<string | undefined> {
        const workoutMediaDB = new WorkoutMediaDB()
        const image = await workoutMediaDB.workoutImages.get(exercise_id);
        if (image) {
            const imageUrl = URL.createObjectURL(image.image);
            if (imageUrl) {
                return imageUrl;
            }
        }
        return undefined;
    };

    async function fetchImageUrlFromSupabase(exercise_id: number): Promise<string | undefined> {
        const response = await getBucketUrlFromTable('exercises', exercise_id)
        const ressource_name = response.data?.ressource_name
        if (!ressource_name) return undefined
        const imageResponse = await getSignedObjectUrl('exercise_images', `${ressource_name}.jpg`)
        const imageUrl = imageResponse.data?.signedUrl
        return imageUrl
    }

    async function getWorkoutImageUrl(exercise_id: number): Promise<string> {
        try {
            const imageUrl = await fetchImageUrlFromIndexDB(exercise_id)
            if (imageUrl) {
                return imageUrl
            }
        } catch (error) {
            console.error(error)
        }
        try {
            const imageUrlFromSupabase = await fetchImageUrlFromSupabase(exercise_id)
            if (imageUrlFromSupabase) {
                return imageUrlFromSupabase
            }
            return defaultImage
        } catch (error) {
            console.error(error)
            return defaultImage
        }
    }

    async function fetchVideoUrlFromIndexDB(exercise_id: number): Promise<string | undefined> {
        const workoutMediaDB = new WorkoutMediaDB()
        const video = await workoutMediaDB.workoutVideos.get(exercise_id);
        if (video) {
            const videoUrl = URL.createObjectURL(video.video);
            if (videoUrl) {
                return videoUrl;
            }
        }
        return undefined;
    };

    async function fetchVideoUrlFromSupabase(exercise_id: number): Promise<string | undefined> {
        const response = await getBucketUrlFromTable('exercises', exercise_id)
        const ressource_name = response.data?.ressource_name
        if (!ressource_name) return undefined
        const videoResponse = await getSignedObjectUrl('exercise_videos', `${ressource_name}.mp4`)
        const videoUrl = videoResponse.data?.signedUrl
        return videoUrl
    }

    async function getWorkoutVideoUrl(exercise_id: number): Promise<string | undefined> {
        try {
            const videoUrl = await fetchVideoUrlFromIndexDB(exercise_id)
            if (videoUrl) {
                return videoUrl
            }
        } catch (error) {
            console.error(error)
        }
        try {
            const videoUrlFromSupabase = await fetchVideoUrlFromSupabase(exercise_id)
            if (videoUrlFromSupabase) {
                return videoUrlFromSupabase
            }
            return undefined
        } catch (error) {
            console.error(error)
            return undefined
        }
    }

    async function updateWorkout(workout: Workout) {
        const index = workouts.value.findIndex(w => w.id === workout.id)
        workouts.value[index] = workout
        workouts.value[index].updated_at = new Date()

        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await pushWorkout(workout)
        }
    }

    async function deleteWorkout(id: string): Promise<boolean> {
        const workoutPlanStore = useWorkoutPlanStore()

        const plannedWorkouts = workoutPlanStore.getPlannedWorkouts
        const isPlanned = plannedWorkouts.some((w: PlannedWorkout) => w.workout_id === id)
        if (isPlanned) {
            return false
        }

        const index = workouts.value.findIndex(w => w.id === id)
        workouts.value[index].deleted = true
        workouts.value[index].updated_at = new Date()

        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await pushWorkout(workouts.value[index])
        }
        return true
    }

    async function fetchWorkouts() {
        const locale = useUserSettingsStore().getLocale()
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            const { data, error } = await supabase.from('workouts').
                                                   select(`*, exercises:workout_exercises(*, name:exercises(name_${locale}))`).
                                                   eq('deleted', false).
                                                   returns<Workout[]>()
            if (error) {
                console.error(error)
            } else {
                const cleanedData = data.map((w: Workout) => {
                    return {
                        ...w,
                        exercises: w.exercises.map((e: any) => {
                            return {
                                ...e,
                                name: e.name[`name_${locale}`]
                            }
                        })
                    }
                })
                const mergedWorkouts = workouts.value
                for(const workout of cleanedData) {
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
                    set_index: exercise.set_index,
                    sets: exercise.sets,
                    reps: exercise.reps,
                    weight: exercise.weight,
                    resttime: exercise.resttime,
                    rir: exercise.rir,
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
        cacheWorkoutImage,
        cacheWorkoutVideo,
        getWorkoutImageUrl,
        getWorkoutVideoUrl,
        updateWorkout,
        deleteWorkout,
        fetchWorkouts,
        syncWorkouts
    }
})

export const useWorkoutPlanStore = defineStore('workoutPlan', () => {
    const workoutPlans = ref(useStorage('workoutPlans', [] as WorkoutPlan[]))
    const plannedWorkouts = ref(useStorage('plannedWorkouts', [] as PlannedWorkout[]))

    const getPlannedWorkouts = computed(() => plannedWorkouts.value.filter(w => !w.deleted))
    const getWorkoutPlans = computed(() => workoutPlans.value.filter(w => !w.deleted))

    function getNewId() {
        return uuidv4()
    }

    const getFullWorkoutPlans = computed(() => {
        const dayOfWeekStore = useDayOfWeekStore()
        const workoutStore = useWorkoutStore()

        return getPlannedWorkouts.value.map((w: PlannedWorkout) => {
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
        }).filter((w: FullWorkoutPlan | undefined) => w !== undefined) as FullWorkoutPlan[]
    })

    const getFullWorkoutPlansOfToday = computed(() => {
        const dayOfWeekStore = useDayOfWeekStore()
        const workoutStore = useWorkoutStore()

        const today = getDayIndex(undefined)
        const dayOfWeek = dayOfWeekStore.getDaysOfWeek.find(w => w.id === today)
        const plannedWorkoutsOfToday = getPlannedWorkouts.value.filter(w => w.day_of_week_id === today)
        const fullWorkoutPlansOfToday = plannedWorkoutsOfToday.map((w: PlannedWorkout) => {
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
        }).filter((w: FullWorkoutPlan | undefined) => w !== undefined) as FullWorkoutPlan[]

        return fullWorkoutPlansOfToday
    })

    function getPlannedWorkoutVolumeOfDate(date: Date): number {
        const dateIndex = getDayIndex(date)
        const fullWorkoutPlanOfDate = getFullWorkoutPlans.value.filter(w => w.day_of_week_id === dateIndex)
        const workoutExercises = fullWorkoutPlanOfDate.map(w => w.workout.exercises)
        const workoutVolume = workoutExercises.reduce((acc, curr) => {
            const exerciseVolume = curr.reduce((acc, curr) => {
                return acc + curr.sets * curr.reps * curr.weight
            }, 0)
            return acc + exerciseVolume
        }, 0)
        return workoutVolume
   }

    function getWorkoutPlanById(id: string): WorkoutPlan | undefined {
        return getWorkoutPlans.value.find(w => w.id === id)
    }

    function getPlannedWorkoutsByWorkoutId(workoutId: string): PlannedWorkout[] {
        return getPlannedWorkouts.value.filter(w => w.workout_id === workoutId)
    }

    async function addWorkoutPlan(workoutPlan: WorkoutPlan) {
        workoutPlans.value.push(workoutPlan)
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await pushWorkoutPlan(workoutPlan)
        }
    }

    async function updateWorkoutPlan(workoutPlan: WorkoutPlan) {
        const index = workoutPlans.value.findIndex(w => w.id === workoutPlan.id)
        workoutPlans.value[index] = workoutPlan
        workoutPlans.value[index].updated_at = new Date()

        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await pushWorkoutPlan(workoutPlan)
        }
    }

    async function deleteWorkoutPlan(id: string) {
        const index = workoutPlans.value.findIndex(w => w.id === id)
        workoutPlans.value[index].deleted = true
        workoutPlans.value[index].updated_at = new Date()
        const plannedWorkouts = getPlannedWorkoutsByWorkoutPlanId(id)
        plannedWorkouts.forEach(async (w: PlannedWorkout) => {
            await deletePlannedWorkout(w.id)
        })

        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await pushWorkoutPlan(workoutPlans.value[index])
        }
    }

    function getPlannedWorkoutById(id: string): PlannedWorkout | undefined {
        return getPlannedWorkouts.value.find(w => w.id === id)
    }

    async function addPlannedWorkout(plannedWorkout: PlannedWorkout) {
        plannedWorkouts.value.push(plannedWorkout)
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await pushPlannedWorkout(plannedWorkout)
        }
    }

    function getPlannedWorkoutsByWorkoutPlanId(workoutPlanId: string): PlannedWorkout[] {
        return getPlannedWorkouts.value.filter(w => w.workout_plan_id === workoutPlanId)
    }

    async function updatePlannedWorkout(plannedWorkout: PlannedWorkout) {
        const index = plannedWorkouts.value.findIndex(w => w.id === plannedWorkout.id)
        plannedWorkouts.value[index] = plannedWorkout
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await pushPlannedWorkout(plannedWorkout)
        }
    }

    async function deletePlannedWorkout(id: string) {
        const index = plannedWorkouts.value.findIndex(w => w.id === id)
        if (index !== -1) {
            plannedWorkouts.value[index].deleted = true
        }

        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await pushPlannedWorkout(plannedWorkouts.value[index])
        }
    }

    async function pushWorkoutPlan(workoutPlan: WorkoutPlan) {
        await supabase.from('workout_plans').upsert(workoutPlan)
    }

    async function fetchWorkoutPlans() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            const { data, error } = await supabase.from('workout_plans').select('*').eq('deleted', false)
            if (error) {
                console.error(error)
            } else {
                const mergedWorkoutPlans = workoutPlans.value
                for(const workoutPlan of data) {
                    const existingWorkoutPlanIndex = mergedWorkoutPlans.findIndex((w) => w.id === workoutPlan.id)
                    if (existingWorkoutPlanIndex !== -1) {
                        const existingWorkoutPlan = mergedWorkoutPlans[existingWorkoutPlanIndex]
                        if (existingWorkoutPlan.updated_at < workoutPlan.updated_at) {
                            mergedWorkoutPlans[existingWorkoutPlanIndex] = workoutPlan
                        }
                    } else {
                        mergedWorkoutPlans.push(workoutPlan)
                    }
                }
                workoutPlans.value = mergedWorkoutPlans
            }
        }
    }

    async function syncWorkoutPlans() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await fetchWorkoutPlans()
            for (const workoutPlan of workoutPlans.value){
              await pushWorkoutPlan(workoutPlan)
            }
            // TODO: Add error handling as needed
        }
    }

    async function fetchPlannedWorkouts() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            const { data, error } = await supabase.from('planned_workouts').select('*').eq('deleted', false)
            if (error) {
                console.error(error)
            } else {
                const mergedPlannedWorkouts = plannedWorkouts.value
                for(const plannedWorkout of data) {
                    const existingPlannedWorkoutIndex = mergedPlannedWorkouts.findIndex((w) => w.id === plannedWorkout.id)
                    if (existingPlannedWorkoutIndex !== -1) {
                        const existingPlannedWorkout = mergedPlannedWorkouts[existingPlannedWorkoutIndex]
                        // TODO: Add logic to merge planned workouts
//                        if (existingPlannedWorkout.updated_at < plannedWorkout.updated_at) {
//                            mergedPlannedWorkouts[existingPlannedWorkoutIndex] = plannedWorkout
//                        }
                    } else {
                        mergedPlannedWorkouts.push(plannedWorkout)
                    }
                }
            plannedWorkouts.value = mergedPlannedWorkouts
            }
        }
    }

    async function pushPlannedWorkout(plannedWorkout: PlannedWorkout) {
        await supabase.from('planned_workouts').upsert(plannedWorkout)
    }

    async function syncPlannedWorkouts() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await fetchPlannedWorkouts()
            for (const plannedWorkout of plannedWorkouts.value) {
                await pushPlannedWorkout(plannedWorkout)
                // Add error handling as needed
            }
        }
    }

    return {
        workoutPlans,
        getWorkoutPlans,
        getFullWorkoutPlansOfToday,
        getFullWorkoutPlans,
        getNewId,
        getWorkoutPlanById,
        getPlannedWorkoutsByWorkoutId,
        getPlannedWorkoutVolumeOfDate,
        addWorkoutPlan,
        updateWorkoutPlan,
        deleteWorkoutPlan,
        syncWorkoutPlans,
        plannedWorkouts,
        getPlannedWorkouts,
        getPlannedWorkoutById,
        addPlannedWorkout,
        getPlannedWorkoutsByWorkoutPlanId,
        updatePlannedWorkout,
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

    const getFullWorkoutSessionsOfToday = computed(() => {
        const workoutStore = useWorkoutStore()
        const today = new Date().toDateString()
        return workoutSessions.value.map(w => {
            const workout = workoutStore.getWorkoutById(w.workout_id)
            if (workout && new Date(w.finished_at).toDateString() === today) {
                return {
                    ...w,
                    workout: workout,
                    workoutPerformance: workoutSessionPerformances.value.filter(p => p.workout_session_id === w.id)
                } as FullWorkoutSession
            }
            return undefined
        }).filter(w => w !== undefined) as FullWorkoutSession[]
    })

    const getFullWorkoutSessionsOfThisWeek = computed(() => {
        const workoutStore = useWorkoutStore()
        const today = new Date()
        const firstDayOfWeek = new Date(new Date(today.setDate(today.getDate() - today.getDay())).setHours(0,0,0,0));
        const lastDayOfWeek = new Date(new Date(today.setDate(today.getDate() - today.getDay() + 6)).setHours(23, 59, 59, 0));
        return workoutSessions.value.map(w => {
            const workout = workoutStore.getWorkoutById(w.workout_id)
            if (workout && new Date(w.finished_at) >= firstDayOfWeek && new Date(w.finished_at) <= lastDayOfWeek) {
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

    async function addWorkoutSession(workoutSession: WorkoutSession) {
        workoutSessions.value.push(workoutSession)

        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await pushWorkoutSession(workoutSession)
        }
    }

    async function addWorkoutSessionPerformances(workoutSessionPerformancesToAdd: WorkoutSessionPerformance[]) {
        workoutSessionPerformances.value.push(...workoutSessionPerformancesToAdd)
        
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            for (const workoutSessionPerformance of workoutSessionPerformancesToAdd) {
                await pushWorkoutSessionPerformance(workoutSessionPerformance)
            }
        }
    }

    async function updateWorkoutSessionById(id: string, changedWorkoutSessionPerformances: WorkoutSessionPerformance[]) {
        const index = workoutSessions.value.findIndex(w => w.id === id);
        workoutSessions.value[index].updated_at = new Date();
        for (const changedWorkoutSessionPerformance of changedWorkoutSessionPerformances) {
            changedWorkoutSessionPerformance.updated_at = new Date();
            const index = workoutSessionPerformances.value.findIndex(w => w.id === changedWorkoutSessionPerformance.id)
            if (index !== -1) {
                workoutSessionPerformances.value[index] = changedWorkoutSessionPerformance
            }
        }

        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await pushWorkoutSession(workoutSessions.value[index])
            for (const workoutSessionPerformance of changedWorkoutSessionPerformances) {
                workoutSessionPerformance.updated_at = new Date();
                await pushWorkoutSessionPerformance(workoutSessionPerformance)
            }
        }
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
                    weight: exercise.weight,
                    plannedResttime: exercise.resttime,
                    resttime: exercise.resttime,
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

    function getPlannedWorkoutVolumeOfDate(date: Date): number {
        const filteredWorkoutSessions = workoutSessions.value.filter(w => new Date(w.finished_at).toDateString() === date.toDateString());
        const sessionIds = filteredWorkoutSessions.map((s: WorkoutSession) => s.id)
        const sessionPerformance = workoutSessionPerformances.value.filter((w: any) => sessionIds.includes(w.workout_session_id))
        const volume = sessionPerformance.reduce(
               (acc, curr) => acc + curr.planned_reps * curr.planned_weight, 0)
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

    async function pushWorkoutSession(workoutSession: WorkoutSession) {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await supabase.from('workout_sessions').upsert(workoutSession)
        }
    }

    async function pushWorkoutSessionPerformance(workoutSessionPerformance: WorkoutSessionPerformance) {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await supabase.from('workout_session_performances').upsert(workoutSessionPerformance)
        }
    }

    async function fetchWorkoutSessions() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            const { data, error } = await supabase.from('workout_sessions').select('*')
            if (error) {
                console.error(error)
            } else {
                const mergedWorkoutSessions = workoutSessions.value
                for(const workoutSession of data) {
                    const existingWorkoutSessionIndex = mergedWorkoutSessions.findIndex((w) => w.id === workoutSession.id)
                    if (existingWorkoutSessionIndex !== -1) {
                        const existingWorkoutSession = mergedWorkoutSessions[existingWorkoutSessionIndex]
                        if (existingWorkoutSession.updated_at < workoutSession.updated_at) {
                            mergedWorkoutSessions[existingWorkoutSessionIndex] = workoutSession
                        }
                    } else {
                        mergedWorkoutSessions.push(workoutSession)
                    }
                }
                workoutSessions.value = mergedWorkoutSessions
            }
        }
    }

    async function fetchWorkoutSessionPerformances() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            const { data, error } = await supabase.from('workout_session_performances').select('*')
            if (error) {
                console.error(error)
            } else {
                const mergedWorkoutSessionPerformances = workoutSessionPerformances.value
                for(const workoutSessionPerformance of data) {
                    const existingWorkoutSessionPerformanceIndex = mergedWorkoutSessionPerformances.findIndex((w) => w.id === workoutSessionPerformance.id)
                    if (existingWorkoutSessionPerformanceIndex !== -1) {
                        const existingWorkoutSessionPerformance = mergedWorkoutSessionPerformances[existingWorkoutSessionPerformanceIndex]
                        if (existingWorkoutSessionPerformance.updated_at < workoutSessionPerformance.updated_at) {
                            mergedWorkoutSessionPerformances[existingWorkoutSessionPerformanceIndex] = workoutSessionPerformance
                        }
                    } else {
                        mergedWorkoutSessionPerformances.push(workoutSessionPerformance)
                    }
                }
                workoutSessionPerformances.value = mergedWorkoutSessionPerformances
            }
        }
    }

    async function syncWorkoutSessions() {
        const session = await supabase.auth.getSession()
        if (session.data.session !== null) {
            await fetchWorkoutSessions()
            await fetchWorkoutSessionPerformances()
            for (const workoutSession of workoutSessions.value) {
                await pushWorkoutSession(workoutSession)
            }
            for (const workoutSessionPerformance of workoutSessionPerformances.value) {
                await pushWorkoutSessionPerformance(workoutSessionPerformance)
            }
        }
    }

    return {
        workoutSessions,
        workoutSessionPerformances,
        getWorkoutSessions,
        getWorkoutSessionPerformances,
        getFullWorkoutSessions,
        getFullWorkoutSessionsOfToday,
        getFullWorkoutSessionsOfThisWeek,
        getNewWorkoutSessionId,
        getNewWorkoutSessionPerformanceId,
        getWorkoutSessionById,
        addWorkoutSession,
        addWorkoutSessionPerformances,
        updateWorkoutSessionById,
        getWorkoutSessionsByDate,
        getFullWorkoutSessionById,
        getFullWorkoutSessionsByDate,
        getWorkoutSessionPerformanceByDate,
        getWorkoutSessionPerformanceByDateRange,
        createFullWorkoutSessionSets,
        getPerformedWorkoutsThisWeek,
        getPerformedWorkoutVolumeOfDate,
        getPlannedWorkoutVolumeOfDate,
        getPerformedWorkoutVolumeThisWeek,
        syncWorkoutSessions
    }
})
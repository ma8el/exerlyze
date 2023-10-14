export interface Exercise {
    id: number,
    name: string,
    sets: number,
    reps: number,
    weight: number
};

export interface ExerciseSelection extends Exercise {
    isSelected: boolean
};

export interface ActiveExercise extends Exercise {
    plannedReps: number,
    plannedWeight: number,
    currentSet: number,
}

export interface Workout {
    id: number,
    name: string,
    description: string,
    exercises: Exercise[],
    deleted: boolean
}

export interface WorkoutSelection extends Workout {
    isSelected: boolean
};

export interface PlannedWorkout {
    id: number,
    workoutId: number,
    workoutPlanId: number,
    dayOfWeekId: number,
    timeOfDay: time,
}

export interface WorkoutPlan {
    id: number,
    name: string,
    description: string,
    deleted: boolean
}

export interface DayOfWeek {
    id: number,
    name: string
}

export interface FullWorkoutPlan extends WorkoutPlan, PlannedWorkout {
    workout: Workout,
    dayOfWeek: string
}

export interface WorkoutSchedule {
    id: number,
    workoutPlanId: number,
    createdAt: Date,
    startsAt: Date,
    endsAt: Date,
}

export interface Weight {
    id: number,
    weight: number,
    createdAt: Date,
    unit: string
}

export interface WorkoutSession {
    id: number,
    userId: string,
    workoutId: number,
    createdAt: Date,
    updatedAt: Date,
    scheduledAt: Date,
    startedAt: Date,
    finishedAt: Date,
    notes: string,
}

export interface WorkoutSessionPerformance {
    id: number,
    userId: string,
    workoutSessionId: number,
    exerciseId: number,
    set: number,
    plannedReps: number,
    performedReps: number,
    plannedWeight: number,
    performedWeight: number,
    plannedRir?: number,
    performedRir?: number,
    restTime: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface FullWorkoutSession extends WorkoutSession {
    workout: Workout,
    workoutPerformance: WorkoutSessionPerformance[]
}
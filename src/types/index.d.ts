export interface Exercise {
    id: string,
    created_at: Date,
    updated_at: Date,
    workout_id: string,
    exercise_id: number,
    name: string,
    sets: number,
    reps: number,
    weight: number,
    user_id: string,
};

export interface ExerciseSelection {
    id: string,
    exercise_id: number,
    name: string,
    sets: number,
    reps: number,
    weight: number,
    isSelected: boolean
};

export interface ActiveExercise extends Exercise {
    plannedReps: number,
    plannedWeight: number,
    currentSet: number,
}

export interface Workout {
    id: string,
    created_at: Date,
    updated_at: Date,
    user_id: string,
    name: string,
    description: string,
    exercises: Exercise[],
    deleted: boolean
}

export interface WorkoutSelection extends Workout {
    isSelected: boolean
};

export interface PlannedWorkout {
    id: string,
    workout_id: string,
    workout_plan_id: string,
    day_of_week_id: number,
    time_of_day: time,
    deleted: boolean,
    user_id: string
}

export interface WorkoutPlan {
    id: string,
    created_at: Date,
    updated_at: Date,
    user_id: string,
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
    id: string,
    user_id: string,
    weight: number,
    created_at: Date,
    updated_at: Date,
    unit: string
}

export interface WorkoutSession {
    id: number,
    userId: string,
    workoutId: string,
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
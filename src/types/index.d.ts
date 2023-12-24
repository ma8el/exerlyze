import { FitnessLevel } from "@/types/workout.enums";
export interface UserFitnessLevel {
    id: string;
    created_at: Date;
    fitness_level: FitnessLevel;
    deadlift_max: number;
    squat_max: number;
    bench_max: number;
    overhead_press_max: number | undefined;
    other: Object | undefined;
}

export interface Exercise {
    id: string,
    created_at: Date,
    updated_at: Date,
    workout_id: string,
    exercise_id: number,
    name: string,
    set_index: number,
    sets: number,
    reps: number,
    weight: number,
    resttime?: number,
    rir?: number,
    valid?: boolean,
};

export interface ExerciseSelection {
    id: string,
    exercise_id: number,
    name: string,
    set_index: number,
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
}

export interface WorkoutPlan {
    id: string,
    created_at: Date,
    updated_at: Date,
    name: string,
    description: string,
    deleted: boolean
}

export interface DayOfWeek {
    id: number,
    name: string,
    name_en: string,
    name_de: string,
    name_fr: string,
}

export interface FullWorkoutPlan extends WorkoutPlan, PlannedWorkout {
    workout: Workout,
    dayOfWeek: string
}

export interface Weight {
    id: string,
    weight: number,
    created_at: Date,
    updated_at: Date,
    unit: string
}

export interface WorkoutSession {
    id: string,
    workout_id: string,
    created_at: Date,
    updated_at: Date,
    scheduled_at: Date,
    started_at: Date,
    finished_at: Date,
    notes: string,
}

export interface WorkoutSessionPerformance {
    id: string,
    workout_session_id: string,
    exercise_id: number,
    set: number,
    planned_reps: number,
    performed_reps: number,
    planned_weight: number,
    performed_weight: number,
    planned_rir?: number,
    performed_rir?: number,
    resttime: number,
    created_at: Date,
    updated_at: Date,
}

export interface FullWorkoutSession extends WorkoutSession {
    workout: Workout,
    workoutPerformance: WorkoutSessionPerformance[]
}
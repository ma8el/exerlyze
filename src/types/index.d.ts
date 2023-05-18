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

export interface Workout {
    id: number,
    name: string,
    description: string,
    exercises: Exercise[]
}

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
    description: string
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
    startsAt: Date,
    endsAt: Date,
}
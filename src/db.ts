import Dexie from 'dexie';
import { Muscle,
         Workout,
         WorkoutPlan,
         PlannedWorkout,
         WorkoutSession,
         WorkoutSessionPerformance
         } from '@/types';
import { FoodDiaryEntry, DailyNutritionGoal } from '@/types/nutrition';

interface WorkoutImage {
    exercise_id: number;
    image: Blob;
}

interface WorkoutVideo {
    exercise_id: number;
    video: Blob;
}

export class WorkoutMediaDB extends Dexie {
    workoutImages!: Dexie.Table<WorkoutImage, number>;
    workoutVideos!: Dexie.Table<WorkoutVideo, number>;
    constructor() {
        super('WorkoutMediaDB');
        this.version(1).stores({
            workoutImages: 'exercise_id, image',
            workoutVideos: 'exercise_id, video',
        });
    }
};

export class MuscleDB extends Dexie {
    muscles!: Dexie.Table<Muscle, number>;
    constructor() {
        super('MuscleDB');
        this.version(1).stores({
            muscles: '++id, created_at, updated_at, name_en, name_de, name_fr',
        });
    }
};

export class WorkoutDB extends Dexie {
    workouts!: Dexie.Table<Workout, string>;
    workoutPlans!: Dexie.Table<WorkoutPlan, string>;
    plannedWorkouts!: Dexie.Table<PlannedWorkout, string>;
    workoutSessions!: Dexie.Table<WorkoutSession, string>;
    workoutSessionPerformances!: Dexie.Table<WorkoutSessionPerformance, string>;
    constructor() {
        super('WorkoutDB');
        this.version(1).stores({
            workouts: '++id, created_at, updated_at, name, description, exercises, deleted',
            workoutPlans: '++id, created_at, updated_at, name, description, deleted',
            plannedWorkouts: '++id, workout_id, workout_plan_id, day_of_week_id, time_of_day, deleted',
            workoutSessions: '++id, workout_id, created_at, updated_at, scheduled_at, started_at, finished_at, notes',
            workoutSessionPerformances: '++id, workout_session_id, exercise_id, sets, reps, weight, unit, duration, distance, deleted',
        });
    }
};

export class NutritionDB extends Dexie {
    foodDiaryEntries!: Dexie.Table<FoodDiaryEntry, string>;
    dailyNutritionGoals!: Dexie.Table<DailyNutritionGoal, string>;
    constructor() {
        super('NutritionDB');
        this.version(1).stores({
            foodDiaryEntries: '++id, created_at, food_id, food_name, quantity, unit, calories, carbohydrates, protein, fat, fiber, sugar, salt, sodium, image_front_thumb_url, deleted',
            dailyNutritionGoals: '++id, created_at, nutrition_goal, daily_calories, daily_carbs, daily_protein, daily_fat',
        });
    }
}
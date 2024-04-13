import Dexie from 'dexie';
import { Muscle, Workout } from '@/types';

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
    constructor() {
        super('WorkoutDB');
        this.version(1).stores({
            workouts: '++id, created_at, updated_at, name, description, exercises, deleted',
            workoutPlan: '++id, created_at, updated_at, name, description, deleted',
            plannedWorkout: '++id, workout_id, workout_plan_id, day_of_week_id, time_of_day, deleted',
        });
    }
};
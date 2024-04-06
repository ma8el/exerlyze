import Dexie from 'dexie';
import { Muscle } from '@/types';

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
}

export class MuscleDB extends Dexie {
    muscles!: Dexie.Table<Muscle, number>;
    constructor() {
        super('MuscleDB');
        this.version(1).stores({
            muscles: '++id, created_at, updated_at, name_en, name_de, name_fr',
        });
    }
}
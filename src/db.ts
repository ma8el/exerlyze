import Dexie from 'dexie';

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
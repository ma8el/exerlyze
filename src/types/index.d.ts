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
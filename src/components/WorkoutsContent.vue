<script setup lang="ts">
  import WorkoutCard from './Cards/WorkoutCard.vue';
  import { useWorkoutStore } from '../store/workoutStore';
  import { onMounted } from 'vue';

  const workoutStore = useWorkoutStore();

  onMounted(() => {
    workoutStore.addWorkout({
    id: 1,
    name: 'Workout 1',
    exercises: [
      {
        name: 'Bench Press',
        sets: 5,
        reps: 5,
        weight: 100
      },
      {
        name: 'Deadlift',
        sets: 5,
        reps: 5,
        weight: 220
      },
    ]
    })
    workoutStore.addWorkout({
    id: 2,
    name: 'Workout 2',
    exercises: [
      {
        name: 'Bench Press',
        sets: 5,
        reps: 5,
        weight: 100
      },
      {
        name: 'Deadlift',
        sets: 5,
        reps: 5,
        weight: 220
      },
    ]
    })
})
</script>

<template>
  <WorkoutCard 
    v-for="workout in workoutStore.workouts"
    :key="workout.id"
    :workout-id="workout.id"
    :workout-name="workout.name"
    :exercises="workout.exercises"
  />
</template>
<script setup lang="ts">
  import WorkoutCard from './Cards/WorkoutCard.vue';
  import { useWorkoutStore } from '../store/workoutStore';
  import AddWorkoutButton from '@/components/Buttons/AddWorkoutButton.vue'

  const workoutStore = useWorkoutStore();
</script>

<template>
  <WorkoutCard 
    v-for="workout in workoutStore.getWorkouts"
    :key="workout.id"
    :workout-id="workout.id"
    :workout-name="workout.name"
    :exercises="workout.exercises"
  />
  <AddWorkoutButton />
</template>
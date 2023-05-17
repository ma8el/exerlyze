<script setup lang="ts">
  import WorkoutCard from './Cards/WorkoutCard.vue';
  import { useWorkoutStore } from '../store/workoutStore';
  import AddWorkoutButton from '@/components/Buttons/AddWorkoutButton.vue'
  import { onMounted } from 'vue';

  const workoutStore = useWorkoutStore();

  onMounted(() => {
    console.log(workoutStore.getWorkouts)
  })
</script>

<template>
  <WorkoutCard 
    v-for="(workout, index) in workoutStore.getWorkouts"
    :key="index"
    :id="workout.id"
    :name="workout.name"
    :description="workout.description"
    :exercises="workout.exercises"
  />
  <AddWorkoutButton />
</template>
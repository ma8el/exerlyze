<script setup lang="ts">
  import WorkoutCard from './Cards/WorkoutCard.vue';

  const workouts = [{
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
        name: 'Squat',
        sets: 5,
        reps: 5,
        weight: 140
      },
      {
        name: 'Deadlift',
        sets: 5,
        reps: 5,
        weight: 220
      },
      {
        name: 'Overhead Press',
        sets: 5,
        reps: 5,
        weight: 50
      },
    ]
  },
{
    id: 2,
    name: 'Workout 2',
    exercises: [
     {
        name: 'Squat',
        sets: 5,
        reps: 5,
        weight: 140
      },
      {
        name: 'Deadlift',
        sets: 5,
        reps: 5,
        weight: 220
      },
      {
        name: 'Overhead Press',
        sets: 5,
        reps: 5,
        weight: 50
      },
    ]
  }]
</script>

<template>
  <WorkoutCard 
    v-for="workout in workouts"
    :key="workout.id"
    :workout-id="workout.id"
    :workout-name="workout.name"
    :exercises="workout.exercises"
  />
</template>
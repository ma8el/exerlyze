<script setup lang="ts">
  import WorkoutCard from './Cards/WorkoutCard.vue';
  import { useWorkoutStore } from '../store/workoutStore';
  import BaseCard from './Cards/BaseCard.vue';

  const workoutStore = useWorkoutStore();

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
  <BaseCard
    v-if="workoutStore.getWorkouts.length == 0"
    :title="$t('workouts.noWorkoutsYet')"
    :subTitle="$t('workouts.noWorkoutsYetSubtitle')"
  ></BaseCard>
</template>
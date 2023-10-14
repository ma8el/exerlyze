<script setup lang="ts">
  import WorkoutCard from '@/components/Cards/WorkoutCard.vue';
  import { useWorkoutStore } from '@/store/workoutStore';
  import BaseCard from '@/components/Cards/BaseCard.vue';

  const workoutStore = useWorkoutStore();
</script>

<template>
  <template
    v-for="(workout, index) in workoutStore.getWorkouts"
    :key="index"
  >
    <WorkoutCard 
      v-if="!workout.deleted"
      :id="workout.id"
      :name="workout.name"
      :description="workout.description"
      :exercises="workout.exercises"
      :deleted="workout.deleted"
    />
  </template>
  <BaseCard
    v-if="workoutStore.getWorkouts.length == 0"
    :title="$t('workouts.noWorkoutsYet')"
    :subTitle="$t('workouts.noWorkoutsYetSubtitle')"
  ></BaseCard>
</template>
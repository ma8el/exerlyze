<script setup lang="ts">
  import WorkoutPlanCard from './Cards/WorkoutPlanCard.vue';
  import { useWorkoutPlanStore } from '../store/workoutStore';
  import BaseCard from './Cards/BaseCard.vue';

  const workoutPlanStore = useWorkoutPlanStore();
</script>

<template>
  <WorkoutPlanCard
    v-for="(workoutPlan, index) in workoutPlanStore.getWorkoutPlans"
    :key="index"
    :workoutPlanId="workoutPlan.id"
  />
  <BaseCard
    v-if="workoutPlanStore.getWorkoutPlans.length == 0"
    :title="$t('workouts.noWorkoutPlansYet')"
    :subTitle="$t('workouts.noWorkoutsYetSubtitle')"
  ></BaseCard>
</template>
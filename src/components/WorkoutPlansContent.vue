<script setup lang="ts">
  import WorkoutPlanCard from './Cards/WorkoutPlanCard.vue';
  import { useWorkoutPlanStore } from '../store/workoutStore';
  import BaseCard from './Cards/BaseCard.vue';

  const workoutPlanStore = useWorkoutPlanStore();
</script>

<template>
  <template
    v-for="(workoutPlan, index) in workoutPlanStore.getWorkoutPlans"
    :key="index"
  >
    <WorkoutPlanCard
      v-if="!workoutPlan.deleted"
      :workoutPlanId="workoutPlan.id"
    />
  </template>
  <BaseCard
    v-if="workoutPlanStore.getWorkoutPlans.length == 0"
    :title="$t('workouts.noWorkoutPlansYet')"
    :subTitle="$t('workouts.noWorkoutsYetSubtitle')"
  ></BaseCard>
</template>
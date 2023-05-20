<script setup lang="ts">
  import WorkoutPlanCard from './Cards/WorkoutPlanCard.vue';
  import { useWorkoutPlanStore, usePlannedWorkoutStore } from '../store/workoutStore';
  import { onMounted } from 'vue';

  const workoutPlanStore = useWorkoutPlanStore();

  onMounted(() => {
    console.log(workoutPlanStore.getFullWorkoutPlans);
    console.log(workoutPlanStore.getWorkoutPlans);
  });
</script>

<template>
  <WorkoutPlanCard
    v-for="(workoutPlan, index) in workoutPlanStore.getWorkoutPlans"
    :key="index"
    :workoutPlanId="workoutPlan.id"
  />
</template>
<script setup lang="ts">
  import WorkoutPlanCard from './Cards/WorkoutPlanCard.vue';
  import { useWorkoutPlanStore } from '../store/workoutStore';
  import AddFloatingActionButton from './Buttons/AddFloatingActionButton.vue';
  import AddWorkoutPlanModal from './Modals/AddWorkoutPlanModal.vue';

  const workoutPlanStore = useWorkoutPlanStore();
</script>

<template>
  <WorkoutPlanCard
    v-for="(workoutPlan, index) in workoutPlanStore.getWorkoutPlans"
    :key="index"
    :workoutPlanId="workoutPlan.id"
  />
  <AddFloatingActionButton :modalComponent="AddWorkoutPlanModal" />
</template>
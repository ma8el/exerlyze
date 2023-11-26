<script setup lang="ts">
  import AppLayout from '@/layouts/AppLayout.vue';
  import Calendar from '@/components/Calendar.vue';
  import { useWorkoutPlanStore } from '@/store/workoutStore';
  import { reactive } from 'vue';
  import { getCurrentWeekDates } from '@/helpers/time'

  const props = defineProps({
    title: {
      type: String,
      required: true
    }
  });

  const workoutPlanStore = useWorkoutPlanStore();

  let workoutEventDates = reactive<Date[]>([])
  workoutEventDates = getCurrentWeekDates().filter(
    date => workoutPlanStore.getFullWorkoutPlans.some(workout => workout.day_of_week_id === date.getDay()))

  workoutPlanStore.$subscribe((mutation, state) => {
    workoutEventDates = getCurrentWeekDates().filter(
      date => workoutPlanStore.getFullWorkoutPlans.some(workout => workout.day_of_week_id === date.getDay()));
  });
</script>

<template>
  <AppLayout :title="title">
    <template #toolbarContent>
      <slot name="toolbarContent"></slot>
    </template>
    <Calendar
      :workout-event-dates="workoutEventDates"
    />
    <slot></slot>
    <div class="bottom-margin"></div>
  </AppLayout>
</template>

<style scoped>
  .bottom-margin {
    margin-bottom: 5rem;
  }
</style>
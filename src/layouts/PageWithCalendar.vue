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
    date => workoutPlanStore.getFullWorkoutPlans.some(workout => workout.dayOfWeekId === date.getDay()))

  workoutPlanStore.$subscribe((mutation, state) => {
    console.log('mutation', mutation);
    workoutEventDates = getCurrentWeekDates().filter(
      date => workoutPlanStore.getFullWorkoutPlans.some(workout => workout.dayOfWeekId === date.getDay()))
  }, );
</script>

<template>
  <AppLayout :title="title">
    <Calendar
      :workout-event-dates="workoutEventDates"
    />
    <slot></slot>
  </AppLayout>
</template>
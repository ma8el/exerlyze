<script setup lang="ts">
  import AppLayout from '@/layouts/AppLayout.vue';
  import Calendar from '@/components/Calendar.vue';
  import { useWorkoutPlanStore } from '@/store/workoutStore';

  const props = defineProps({
    title: {
      type: String,
      required: true
    }
  });

  const workoutPlanStore = useWorkoutPlanStore();

  const getCurrentWeekDates = () => {
    var now = new Date();
    var dayOfWeek = now.getDay();
    var numDay = dayOfWeek !== 0 ? dayOfWeek - 1 : 6;

    now.setDate(now.getDate() - numDay);

    var dates = [];

    for(var i = 0; i < 7; i++) {
        dates.push(new Date(now));
        now.setDate(now.getDate() + 1);
    }

    return dates;
  }

  const plannedWorkouts = workoutPlanStore.getFullWorkoutPlans;
  const workoutEventDates = getCurrentWeekDates().filter(
    date => plannedWorkouts.some(workout => workout.dayOfWeekId === date.getDay()))
</script>

<template>
  <AppLayout :title="title">
    <Calendar
      :workout-event-dates="workoutEventDates"
    />
    <slot></slot>
  </AppLayout>
</template>
<script setup lang="ts">
  import AppLayout from '@/layouts/AppLayout.vue';
  import Calendar from '@/components/Calendar.vue';
  import { useWorkoutPlanStore } from '@/store/workoutStore';
  import { ref } from 'vue';
  import { getCurrentWeekDates } from '@/helpers/time'
  import { getDayIndex } from '@/helpers/time';

  const props = defineProps({
    title: {
      type: String,
      required: true
    }
  });

  const workoutPlanStore = useWorkoutPlanStore();

  const workoutEventDates = ref<Date[]>([])

  const getWorkoutEvents = () => {
    const workoutEvents = getCurrentWeekDates().filter(
      date => workoutPlanStore.getFullWorkoutPlans.some(workout => workout.day_of_week_id === getDayIndex(date))
    )
    return workoutEvents;
  }

  workoutEventDates.value = getWorkoutEvents();

  workoutPlanStore.$subscribe((mutation, state) => {
    workoutEventDates.value = getWorkoutEvents();
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
  </AppLayout>
</template>
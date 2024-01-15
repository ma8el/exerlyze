<script setup lang="ts">
  import { useWorkoutPlanStore, useWorkoutSessionStore } from '../store/workoutStore';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import BaseCard from './Cards/BaseCard.vue';
  import Slider from './Slider.vue';
  import PlannedWorkoutCard from './Cards/PlannedWorkoutCard.vue';
  import breakImage from '../../assets/illustrations/break.png';
  import { ref } from 'vue';
  import { Exercise } from '@/types';

  const workoutPlanStore = useWorkoutPlanStore();
  const workoutSessionStore = useWorkoutSessionStore();
  const userSettingsStore = useUserSettingsStore();

  const plannedWorkouts = ref(workoutPlanStore.getFullWorkoutPlansOfToday)
  const workoutSessions = ref(workoutSessionStore.getFullWorkoutSessionsOfToday);

  workoutPlanStore.$subscribe((mutation, state) => {
    plannedWorkouts.value = workoutPlanStore.getFullWorkoutPlansOfToday;
    workoutSessions.value = workoutSessionStore.getFullWorkoutSessionsOfToday;
  });

  userSettingsStore.$subscribe((mutation, state) => {
    plannedWorkouts.value = workoutPlanStore.getFullWorkoutPlansOfToday;
    workoutSessions.value = workoutSessionStore.getFullWorkoutSessionsOfToday;
  });

  workoutSessionStore.$subscribe((mutation, state) => {
    workoutSessions.value = workoutSessionStore.getFullWorkoutSessionsOfToday;
  });
</script>

<template>
  <Slider
    v-show="plannedWorkouts.length > 0"
    :items="plannedWorkouts"
    :slide-width="'100%'"
    :min-width="'200px'"
    :max-width="'500px'"
    :pagination="true"
    :has-last-slide="false"
  >
    <template v-slot:default="slotProps">
     <PlannedWorkoutCard
        :workoutId="slotProps.item.workout_id"
        :workoutName="slotProps.item.workout.name"
        :scheduledOn="$t('today')"
        :exercise-ids="slotProps.item.workout.exercises.map((exercise: Exercise) => exercise.exercise_id)"
      />
    </template>
 </Slider>
 <BaseCard
   v-if="plannedWorkouts.length == 0"
   :img_src="breakImage"
   :title="$t('home.todayIsYourRestDay')"
 ></BaseCard>
</template>
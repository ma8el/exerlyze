<script setup lang="ts">
  import { useWorkoutPlanStore, useWorkoutSessionStore } from '../store/workoutStore';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import BaseCard from './Cards/BaseCard.vue';
  import Slider from './Slider.vue';
  import PlannedWorkoutCard from './Cards/PlannedWorkoutCard.vue';
  import ResultsCard from './Cards/ResultsCard.vue';
  import breakImage from '../../assets/illustrations/break.png';
  import { ref } from 'vue';
  import { Exercise } from '@/types';
  import { FullWorkoutSession } from '@/types';

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

  const getWorkoutSession = (workoutId: string): FullWorkoutSession => {
    const workoutSession = workoutSessions.value.find((workoutSession) => workoutSession.workout_id == workoutId);
    if (workoutSession) {
      return workoutSession;
    } else {
      return {} as FullWorkoutSession;
    }
  }

  const isPerformed = (workoutId: string) => {
    return workoutSessions.value.some((workoutSession) => workoutSession.workout_id == workoutId);
  }
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
        v-if="!isPerformed(slotProps.item.workout_id)"
        :workoutId="slotProps.item.workout_id"
        :workoutName="slotProps.item.workout.name"
        :scheduledOn="$t('today')"
        :exercise-ids="slotProps.item.workout.exercises.map((exercise: Exercise) => exercise.exercise_id)"
      />
      <ResultsCard
        v-if="Object.keys(getWorkoutSession(slotProps.item.workout_id)).length !== 0"
        :workoutSession="getWorkoutSession(slotProps.item.workout_id)"
      />
    </template>
 </Slider>
 <BaseCard
   v-if="plannedWorkouts.length == 0"
   :img_src="breakImage"
   :title="$t('home.todayIsYourRestDay')"
 ></BaseCard>
</template>
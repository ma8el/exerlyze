<script setup lang="ts">
  import { useWorkoutPlanStore, useWorkoutSessionStore } from '../store/workoutStore';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import StartWorkoutButton from './Buttons/StartWorkoutButton.vue';
  import BaseCard from './Cards/BaseCard.vue';
  import ResultsCard from './Cards/ResultsCard.vue';
  import Slider from './Slider.vue';
  import breakImage from '../../assets/illustrations/break.png';
  import { ref } from 'vue';
  import { FullWorkoutSession } from '@/types/index';

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

  const isPerformed = (workoutId: string) => {
    return workoutSessions.value.some((workoutSession) => workoutSession.workout_id == workoutId);
  }

  const getWorkoutSession = (workoutId: string): FullWorkoutSession => {
    const workoutSession = workoutSessions.value.find((workoutSession) => workoutSession.workout_id == workoutId);
    if (workoutSession) {
      return workoutSession;
    } else {
      return {} as FullWorkoutSession;
    }
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
      <BaseCard
        v-if="!isPerformed(slotProps.item.workout_id)"
        img_src="https://ionicframework.com/docs/img/demos/card-media.png"
        :title="slotProps.item.workout.name"
        :content="true"
        :sub-title="true"
      >
        <template #subtitle>
          {{ $t('scheduledOn') }} {{ $t('today') }}
        </template>
        <StartWorkoutButton :workoutId="slotProps.item.workout_id" />
      </BaseCard>
      <ResultsCard
        v-if="getWorkoutSession(slotProps.item.workout_id)"
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
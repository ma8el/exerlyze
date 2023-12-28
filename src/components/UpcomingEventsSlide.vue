<script setup lang="ts">
  import { onIonViewDidEnter } from '@ionic/vue';
  import { useWorkoutPlanStore, useWorkoutSessionStore } from '../store/workoutStore';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import StartWorkoutButton from './Buttons/StartWorkoutButton.vue';
  import BaseCard from './Cards/BaseCard.vue';
  import NoWorkoutPlannedCard from './Cards/NoWorkoutPlannedCard.vue';
  import Slider from './Slider.vue';
  import { onMounted, ref, watch } from 'vue';
  import NoMoreWorkoutsThisWeekCard from './Cards/NoMoreWorkoutsThisWeekCard.vue';
  import { getDayIndex } from '@/helpers/time';

  const workoutPlanStore = useWorkoutPlanStore();
  const workoutSessionStore = useWorkoutSessionStore();
  const userSettingsStore = useUserSettingsStore();

  const plannedWorkouts = ref(workoutPlanStore.getFullWorkoutPlans)
  const sortedPlannedWorkouts = ref(plannedWorkouts.value.sort((a, b) => a.day_of_week_id - b.day_of_week_id));
  const workoutSessions = ref(workoutSessionStore.getFullWorkoutSessionsOfThisWeek);
  const nextWorkout = ref();

  const getNextEventIndex = (currentDay: number, events: number[]) => {
    events.sort((a, b) => a - b);
    let nextEventIndex = events.findIndex(event => event >= currentDay);
    if (currentDay > events[events.length - 1]) {
        return events.length + 1;
    }
    return nextEventIndex;
  }

//  const isPerformed = (workoutId: string) => {
//    const filteredWorkoutSessions = workoutSessions.value.filter((workoutSession) => workoutSession.workout_id == workoutId);
//    if (filteredWorkoutSessions.length == 0) {
//      return false;
//    } else if (filteredWorkoutSessions.length == 1) {
//      return true;
//    } else {
//      return false
//    } 
//  }

//  const getWorkoutSession = (workoutId: string): FullWorkoutSession => {
//    const filteredWorkoutSessions = workoutSessions.value.filter((workoutSession) => workoutSession.workout_id == workoutId);
//    if (filteredWorkoutSessions.length == 0) {
//      return {} as FullWorkoutSession;
//    } else if (filteredWorkoutSessions.length == 1) {
//      return filteredWorkoutSessions[0];
//    } else {
//      return {} as FullWorkoutSession;
//    }
//  }

  const setNextWorkout = () => {
    const today = getDayIndex(undefined) + 1;
    const workoutDays = sortedPlannedWorkouts.value.map((workoutPlan) => workoutPlan.day_of_week_id);
    nextWorkout.value = getNextEventIndex(today, workoutDays);
  }

  workoutPlanStore.$subscribe((mutation, state) => {
    plannedWorkouts.value = workoutPlanStore.getFullWorkoutPlans;
    sortedPlannedWorkouts.value = plannedWorkouts.value.sort((a, b) => a.day_of_week_id - b.day_of_week_id);
    setNextWorkout();
  });

  userSettingsStore.$subscribe((mutation, state) => {
    plannedWorkouts.value = workoutPlanStore.getFullWorkoutPlans;
    sortedPlannedWorkouts.value = plannedWorkouts.value.sort((a, b) => a.day_of_week_id - b.day_of_week_id);
    setNextWorkout();
  });

  watch(sortedPlannedWorkouts, () => {
    setNextWorkout();
  })
 
  onIonViewDidEnter(() => {
    setNextWorkout();
  })

 onMounted(() => {
    setNextWorkout();
  })
</script>

<template>
  <Slider
    v-show="sortedPlannedWorkouts.length > 0"
    :items="sortedPlannedWorkouts"
    :move-to-slide="nextWorkout"
    :slide-width="'80%'"
    :min-width="'200px'"
    :max-width="'300px'"
    :pagination="true"
    :has-last-slide="true"
  >
    <template v-slot:default="slotProps">
      <BaseCard
        img_src="https://ionicframework.com/docs/img/demos/card-media.png"
        :title="slotProps.item.workout.name"
        :content="true"
        :sub-title="true"
      >
        <template #subtitle>
          {{ $t('scheduledOn') }} {{ slotProps.item.dayOfWeek }}
        </template>
        <StartWorkoutButton :workoutId="slotProps.item.workout_id" />
      </BaseCard>
    </template>
    <template #lastSlide>
      <NoMoreWorkoutsThisWeekCard />
    </template>
  </Slider>

  <NoWorkoutPlannedCard
    v-if="sortedPlannedWorkouts.length == 0"
  />
</template>
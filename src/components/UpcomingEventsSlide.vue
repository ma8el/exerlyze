<script setup lang="ts">
  import { onIonViewDidEnter } from '@ionic/vue';
  import { useWorkoutPlanStore } from '../store/workoutStore';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import NoWorkoutPlannedCard from './Cards/NoWorkoutPlannedCard.vue';
  import PlannedWorkoutCard from './Cards/PlannedWorkoutCard.vue';
  import Slider from './Slider.vue';
  import { onMounted, ref, watch } from 'vue';
  import NoMoreWorkoutsThisWeekCard from './Cards/NoMoreWorkoutsThisWeekCard.vue';
  import { getDayIndex } from '@/helpers/time';
import { computed } from 'vue';
import { Exercise } from '@/types';

  const workoutPlanStore = useWorkoutPlanStore();
  const userSettingsStore = useUserSettingsStore();

  const plannedWorkouts = ref(workoutPlanStore.getFullWorkoutPlans)
  const sortedPlannedWorkouts = ref(plannedWorkouts.value.sort((a, b) => a.day_of_week_id - b.day_of_week_id));
  const nextWorkout = ref();

  const getNextEventIndex = (currentDay: number, events: number[]) => {
    events.sort((a, b) => a - b);
    let nextEventIndex = events.findIndex(event => event >= currentDay);
    if (currentDay > events[events.length - 1]) {
        return events.length + 1;
    }
    return nextEventIndex;
  }

  const setNextWorkout = () => {
    const today = getDayIndex(undefined);
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
     <PlannedWorkoutCard
        :workoutId="slotProps.item.workout_id"
        :workoutName="slotProps.item.workout.name"
        :scheduledOn="slotProps.item.dayOfWeek"
        :exercise-ids="slotProps.item.workout.exercises.map((exercise: Exercise) => exercise.exercise_id)"
      />
    </template>
    <template #lastSlide>
      <NoMoreWorkoutsThisWeekCard />
    </template>
  </Slider>

  <NoWorkoutPlannedCard
    v-if="sortedPlannedWorkouts.length == 0"
  />
</template>
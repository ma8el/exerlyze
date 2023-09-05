<script setup lang="ts">
  import { addCircleOutline } from 'ionicons/icons';
  import { IonButton, IonIcon } from '@ionic/vue';
  import { useRouter } from 'vue-router';
  import { useWorkoutPlanStore } from '../store/workoutStore';
  import UpcomingEventCard from './Cards/UpcomingEventCard.vue';
  import StartWorkoutButton from './Buttons/StartWorkoutButton.vue';
  import BaseCard from './Cards/BaseCard.vue';
  import Slider from './Slider.vue';
  import { onMounted, ref } from 'vue';

  const router = useRouter()

  const workoutPlanStore = useWorkoutPlanStore();
  const plannedWorkouts = workoutPlanStore.getFullWorkoutPlans
  const sortedPlannedWorkouts = plannedWorkouts.sort((a, b) => a.dayOfWeekId - b.dayOfWeekId);
  const nextWorkout = ref();

  const getNextEventIndex = (currentDay: number, events: number[]) => {
    events.sort((a, b) => a - b);
    let nextEventIndex = events.findIndex(event => event >= currentDay);
    if (currentDay > events[events.length - 1]) {
        return 0;
    }
    return nextEventIndex;
  }

  const setNextWorkout = () => {
    const today = new Date().getDay();
    const workoutDays = sortedPlannedWorkouts.map((workoutPlan) => workoutPlan.dayOfWeekId);
    nextWorkout.value = getNextEventIndex(today, workoutDays);
  }

  const redirect = () => {
    router.push('/tabs/workouts');
  }

  onMounted(() => {
    setNextWorkout();
  })
</script>

<template>
  <Slider :items="sortedPlannedWorkouts">
    <template v-slot:default="slotProps">
      <UpcomingEventCard
        :workoutPlanName="slotProps.item.name"
        :workoutName="slotProps.item.workout.name"
        :plannedDay="slotProps.item.dayOfWeek"
      >
        <StartWorkoutButton :workoutId="slotProps.item.workoutId" />
      </UpcomingEventCard>
    </template>
  </Slider>

  <BaseCard
    v-if="nextWorkout == -1"
    :title="$t('noUpcomingEvent')"
    :content="true"
  >
    <ion-button
      fill="clear"
      @click="redirect()"
      expand="block" 
      class="ion-margin-top"
    >
      <ion-icon :icon="addCircleOutline"></ion-icon>
      {{  $t('workouts.addWorkout') }}
    </ion-button>
  </BaseCard>
</template>
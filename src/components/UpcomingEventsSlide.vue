<script setup lang="ts">
  import { addCircleOutline } from 'ionicons/icons';
  import { IonButton, IonIcon, onIonViewDidEnter } from '@ionic/vue';
  import { useRouter } from 'vue-router';
  import { useWorkoutPlanStore } from '../store/workoutStore';
  import StartWorkoutButton from './Buttons/StartWorkoutButton.vue';
  import BaseCard from './Cards/BaseCard.vue';
  import Slider from './Slider.vue';
  import { onMounted, ref, watch } from 'vue';

  const router = useRouter()

  const workoutPlanStore = useWorkoutPlanStore();
  const plannedWorkouts = ref(workoutPlanStore.getFullWorkoutPlans)
  const sortedPlannedWorkouts = ref(plannedWorkouts.value.sort((a, b) => a.day_of_week_id - b.day_of_week_id));
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
    const workoutDays = sortedPlannedWorkouts.value.map((workoutPlan) => workoutPlan.day_of_week_id);
    nextWorkout.value = getNextEventIndex(today, workoutDays);
  }

  const redirect = () => {
    router.push('/tabs/workouts');
  }

  workoutPlanStore.$subscribe((mutation, state) => {
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
  <Slider :items="sortedPlannedWorkouts" min-width="300px">
    <template v-slot:default="slotProps">
      <BaseCard
        img_src="https://ionicframework.com/docs/img/demos/card-media.png"
        :sub-title="slotProps.item.name"
        :title="slotProps.item.workout.name"
        :content="true"
      >
        <template #subtitle>
          {{ $t('scheduledOn') }} {{ slotProps.item.dayOfWeek }}
        </template>
        <StartWorkoutButton :workoutId="slotProps.item.workout_id" />
      </BaseCard>
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
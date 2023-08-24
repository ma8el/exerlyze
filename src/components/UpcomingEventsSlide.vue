<script setup lang="ts">
  import { addCircleOutline } from 'ionicons/icons';
  import { IonButton, IonIcon } from '@ionic/vue';
  import { useRouter } from 'vue-router';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Pagination } from 'swiper';
  import { useWorkoutPlanStore } from '../store/workoutStore';
  import UpcomingEventCard from './Cards/UpcomingEventCard.vue';
  import StartWorkoutButton from './Buttons/StartWorkoutButton.vue';
  import BaseCard from './Cards/BaseCard.vue';

  import 'swiper/css';
  import 'swiper/css/pagination';
  import '@ionic/vue/css/ionic-swiper.css';
  import { onMounted, ref } from 'vue';

  const router = useRouter()

  const workoutPlanStore = useWorkoutPlanStore();
  const plannedWorkouts = workoutPlanStore.getFullWorkoutPlans
  const sortedPlannedWorkouts = plannedWorkouts.sort((a, b) => a.dayOfWeekId - b.dayOfWeekId);
  const modules = [ Pagination ]
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
    console.log(nextWorkout.value)
    setNextWorkout();
    console.log(nextWorkout.value)
  })
</script>

<template>
  <swiper 
    class="swiper"
    :modules="modules"
    :pagination="true"
    :loop="true"
    :initial-slide="nextWorkout"
    v-if="nextWorkout !== -1"
  >
    <swiper-slide
      v-for="workoutPlan in sortedPlannedWorkouts"
      :key="workoutPlan.id"
    >
      <UpcomingEventCard
        class="swiper ion-margin ion-padding"
        :workoutPlanName="workoutPlan.name"
        :workoutName="workoutPlan.workout.name"
        :plannedDay="workoutPlan.dayOfWeek"
      >
        <StartWorkoutButton :workoutId="workoutPlan.workoutId" />
      </UpcomingEventCard> 
    </swiper-slide>
  </swiper>
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

<style scoped lang="scss">
.swiper {
  width: 95%;
  --bullet-background: #fff;
  --bullet-background-active: #3F63C8;
}
</style>
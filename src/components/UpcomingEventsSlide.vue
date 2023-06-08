<script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Pagination } from 'swiper';
  import { useWorkoutPlanStore } from '../store/workoutStore';
  import UpcomingEventCard from './Cards/UpcomingEventCard.vue';
  import StartWorkoutButton from './Buttons/StartWorkoutButton.vue';

  import 'swiper/css';
  import 'swiper/css/pagination';
  import '@ionic/vue/css/ionic-swiper.css';
  import { onMounted, ref, watch } from 'vue';

  const workoutPlanStore = useWorkoutPlanStore();
  const plannedWorkouts = workoutPlanStore.getFullWorkoutPlans
  const sortedPlannedWorkouts = plannedWorkouts.sort((a, b) => a.dayOfWeekId - b.dayOfWeekId);
  const modules = [ Pagination ]
  const nextWorkout = ref();

  const getNextEventIndex = (currentDay: number, events: number[]) => {
    events.sort((a, b) => a - b);
    let nextEventIndex = events.findIndex(event => event >= currentDay);
    if (nextEventIndex === -1 || currentDay > events[events.length - 1]) {
        return 0;
    }
    return nextEventIndex;
  }

  const setNextWorkout = () => {
    const today = new Date().getDay();
    const workoutDays = sortedPlannedWorkouts.map((workoutPlan) => workoutPlan.dayOfWeekId);
    nextWorkout.value = getNextEventIndex(today, workoutDays);
  }

  onMounted(() => {
    setNextWorkout();
  })
</script>

<template>
  <swiper 
    class="swiper"
    :modules="modules"
    :pagination="true"
    :loop="true"
    :initial-slide="1"
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
</template>

<style scoped lang="scss">
.swiper {
  width: 95%;
  --bullet-background: #fff;
  --bullet-background-active: #3F63C8;
}
</style>
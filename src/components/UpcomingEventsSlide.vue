<script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Pagination } from 'swiper';
  import { useWorkoutPlanStore } from '../store/workoutStore';
  import UpcomingEventCard from './Cards/UpcomingEventCard.vue';
  import StartWorkoutButton from './Buttons/StartWorkoutButton.vue';

  import 'swiper/css';
  import 'swiper/css/pagination';
  import '@ionic/vue/css/ionic-swiper.css';
  import { onMounted } from 'vue';

  const workoutPlanStore = useWorkoutPlanStore();
  const plannedWorkouts = workoutPlanStore.getFullWorkoutPlans;
  const modules = [ Pagination ]

  onMounted(() => {
    console.log(plannedWorkouts);
  })
</script>

<template>
  <swiper :modules="modules" :pagination="true" class="swiper">
    <swiper-slide
      v-for="workoutPlan in plannedWorkouts"
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
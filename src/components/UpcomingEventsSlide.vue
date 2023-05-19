<script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Pagination } from 'swiper';
  import { useWorkoutPlanStore } from '../store/workoutStore';
  import UpcomingEventCard from './Cards/UpcomingEventCard.vue';
  import StartWorkoutButton from './Buttons/StartWorkoutButton.vue';

  import 'swiper/css';
  import 'swiper/css/pagination';
  import '@ionic/vue/css/ionic-swiper.css';

  const workoutPlans = useWorkoutPlanStore().getWorkoutPlans;
  const modules = [ Pagination ]
</script>

<template>
  <swiper :modules="modules" :pagination="true" class="swiper">
<!--    <swiper-slide
      v-for="workoutPlan in workoutPlans"
      :key="workoutPlan.id"
    >
      <UpcomingEventCard
        :workoutName="workoutPlan.name"
      >
        <StartWorkoutButton />
      </UpcomingEventCard> 
    </swiper-slide> -->
    <swiper-slide>
        <UpcomingEventCard
            class="swiper ion-margin ion-padding"
            workoutName="Test"
            plannedDay="Test"
        >
            <StartWorkoutButton />
        </UpcomingEventCard>
    </swiper-slide>
    <swiper-slide>
        <UpcomingEventCard
            class="swiper ion-margin ion-padding"
            workoutName="Test"
            plannedDay="Test"
        >
            <StartWorkoutButton />
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
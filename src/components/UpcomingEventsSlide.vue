<script setup lang="ts">
  import { addCircleOutline } from 'ionicons/icons';
  import { IonButton, IonIcon } from '@ionic/vue';
  import { useRouter } from 'vue-router';
  import { useWorkoutPlanStore } from '../store/workoutStore';
  import UpcomingEventCard from './Cards/UpcomingEventCard.vue';
  import StartWorkoutButton from './Buttons/StartWorkoutButton.vue';
  import BaseCard from './Cards/BaseCard.vue';
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
  <div class="main_content_div">
  <div class="content_div">
  <div class="service_slider" >
    <div class="single_slider" v-for="workoutPlan in sortedPlannedWorkouts" :key="workoutPlan.id">
      <UpcomingEventCard
        class="swiper ion-margin ion-padding"
        :workoutPlanName="workoutPlan.name"
        :workoutName="workoutPlan.workout.name"
        :plannedDay="workoutPlan.dayOfWeek"
      >
         <StartWorkoutButton :workoutId="workoutPlan.workoutId" />
      </UpcomingEventCard> 
 

    </div>
  </div>
    </div>
  </div>

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
.main_content_div {
  .content_div {
    .service_slider {
      display: flex;
      overflow: scroll;

      .single_slider {
        width: 100%;
        min-width: 300px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 5px;
        // box-shadow: 0px 3px 6px rgb(0 0 0 / 30%);
        // border-radius: 10px;

        .back_image {
          width: 100%;
          height: 100%;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
      }
    }
  }
}
</style>
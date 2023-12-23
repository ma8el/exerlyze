<script setup lang="ts">
  import { IonButton, IonIcon, onIonViewDidEnter, modalController } from '@ionic/vue';
  import { addCircleOutline } from 'ionicons/icons';
  import { useRouter } from 'vue-router';
  import { useWorkoutPlanStore } from '../store/workoutStore';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import StartWorkoutButton from './Buttons/StartWorkoutButton.vue';
  import BaseCard from './Cards/BaseCard.vue';
  import AddWorkoutModal from './Modals/AddWorkoutModal.vue';
  import Slider from './Slider.vue';
  import { onMounted, ref, watch } from 'vue';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Scrollbar } from 'swiper/modules';
  import complete from '../../assets/illustrations/complete.svg';

  import 'swiper/css';
  import 'swiper/css/pagination';

  const modules = ref([Scrollbar]);
  const swiperRef = ref();

  const router = useRouter()

  const workoutPlanStore = useWorkoutPlanStore();
  const userSettingsStore = useUserSettingsStore();

  const plannedWorkouts = ref(workoutPlanStore.getFullWorkoutPlans)
  const sortedPlannedWorkouts = ref(plannedWorkouts.value.sort((a, b) => a.day_of_week_id - b.day_of_week_id));
  const nextWorkout = ref();

  const openAddWorkoutModal = async () => {
    const modal = await modalController.create({
      component: AddWorkoutModal,
      cssClass: 'full-screen-modal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'save') {
      console.log('Save', data);
    } else {
      console.log('Close', data);
    };
  }

  const moveToSlide = (index: number) => {
    swiperRef.value.$el.swiper.slideTo(index);
  }

  const getNextEventIndex = (currentDay: number, events: number[]) => {
    events.sort((a, b) => a - b);
    let nextEventIndex = events.findIndex(event => event >= currentDay);
    if (currentDay > events[events.length - 1]) {
        return events.length + 1;
    }
    return nextEventIndex;
  }

  const setNextWorkout = () => {
    const today = new Date().getDay();
    const workoutDays = sortedPlannedWorkouts.value.map((workoutPlan) => workoutPlan.day_of_week_id);
    nextWorkout.value = getNextEventIndex(today, workoutDays);
  }

  const redirect = () => {
    router.push('/insights');
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
    moveToSlide(nextWorkout.value);
  })
 
  onIonViewDidEnter(() => {
    setNextWorkout();
    moveToSlide(nextWorkout.value);
  })

 onMounted(() => {
    setNextWorkout();
    moveToSlide(nextWorkout.value);
  })
</script>

<template>
  <Swiper
    v-show="sortedPlannedWorkouts.length > 0"
    ref="swiperRef"
    class="swiper"
    :modules="modules"
    :slides-per-view="'auto'"
    :space-between="5"
    :scrollbar="{ draggable: true }"
  >
    <SwiperSlide class="swiper-slide" v-for="(item, index) in sortedPlannedWorkouts" :key="item.id">
      <BaseCard
        img_src="https://ionicframework.com/docs/img/demos/card-media.png"
        :title="item.workout.name"
        :content="true"
        :sub-title="true"
      >
        <template #subtitle>
          {{ $t('scheduledOn') }} {{ item.dayOfWeek }}
        </template>
        <StartWorkoutButton :workoutId="item.workout_id" />
      </BaseCard>
    </SwiperSlide>
    <SwiperSlide 
    class="swiper-slide"
    >
      <BaseCard
        :title="$t('home.wellDone')"
        :img_src="complete"
        :img_height="'135px'"
        :sub-title="true"
        :content="true"
      >
      <template #subtitle>
        {{ $t('home.youAreDone') }} 
      </template>
      <ion-button
        @click="redirect()"
        expand="block" 
      >
        {{ $t('home.reviewYourPerformance') }}
      </ion-button>
      </BaseCard>
    </SwiperSlide>
  </Swiper>

  <BaseCard
    v-if="sortedPlannedWorkouts.length == 0"
    :title="$t('noUpcomingEvent')"
    :content="true"
  >
    <ion-button
      fill="clear"
      @click="openAddWorkoutModal()"
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
  width: 100%;
}

.swiper-slide {
  width: 80%;
}
</style>
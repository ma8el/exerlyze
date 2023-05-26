<script setup lang="ts">
  import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
  import { ref } from 'vue';
  import WorkoutsContent from '@/components/WorkoutsContent.vue';
  import WorkoutPlansContent from '@/components/WorkoutPlansContent.vue';
  import WorkoutScheduleContent from '@/components/WorkoutScheduleContent.vue';

  const selectedSegment = ref('workouts');
  const workoutsSelected = ref(true)
  const plansSelected = ref(false)
  const scheduleSelected = ref(false)

  const selectWorkouts = () => {
     workoutsSelected.value = true;
     plansSelected.value = false;
     scheduleSelected.value = false;
  }

  const selectPlans = () => {
     workoutsSelected.value = false;
     plansSelected.value = true;
     scheduleSelected.value = false;
  }

  const selectSchedule = () => {
     workoutsSelected.value = false;
     plansSelected.value = false;
     scheduleSelected.value = true;
  }
</script>

<template>
  <ion-segment :value="selectedSegment">
    <ion-segment-button value="workouts" @click="selectWorkouts">
      <ion-label>Workouts</ion-label>
    </ion-segment-button>
    <ion-segment-button value="plans" @click="selectPlans">
      <ion-label>Plans</ion-label>
    </ion-segment-button>
    <ion-segment-button value="schedule" @click="selectSchedule">
      <ion-label>Schedule</ion-label>
    </ion-segment-button>
  </ion-segment>
  <WorkoutsContent v-if="workoutsSelected" />
  <WorkoutPlansContent v-if="plansSelected" />
  <WorkoutScheduleContent v-if="scheduleSelected" />
</template>
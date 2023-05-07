<script setup lang="ts">
  import { IonSegment, IonSegmentButton, IonLabel, IonCard } from '@ionic/vue';
  import { ref } from 'vue';
  import WorkoutCard from './WorkoutCard.vue';

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
  <WorkoutCard v-if="workoutsSelected" />
  <ion-card v-if="plansSelected"> Your Plans </ion-card>
  <ion-card v-if="scheduleSelected"> Your Schedule </ion-card>
</template>
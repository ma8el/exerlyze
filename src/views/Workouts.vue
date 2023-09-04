<script setup lang="ts">
  import PageWithCalendar from '@/layouts/PageWithCalendar.vue';
  import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
  import { ref } from 'vue';
  import WorkoutsContent from '@/components/WorkoutsContent.vue';
  import WorkoutPlansContent from '@/components/WorkoutPlansContent.vue';

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

</script>

<template>
  <PageWithCalendar :title="$t('workouts.title')">
    <ion-segment :value="selectedSegment">
      <ion-segment-button value="workouts" @click="selectWorkouts">
        <ion-label>{{ $t('workouts.workout') }}</ion-label>
      </ion-segment-button>
      <ion-segment-button value="plans" @click="selectPlans">
        <ion-label>{{ $t('workouts.plan', 2) }}</ion-label>
      </ion-segment-button>
    </ion-segment>
    <WorkoutsContent v-if="workoutsSelected" />
    <WorkoutPlansContent v-if="plansSelected" />
  </PageWithCalendar>
</template>
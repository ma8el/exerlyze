<script setup lang="ts">
  import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';
  import WorkoutPlanItem from '@/components/WorkoutPlanItem.vue';

  const workouts = [
    {
      workoutName: 'Workout 1',
      plannedDay: 'Monday'
    },
   {
      workoutName: 'Workout 2',
      plannedDay: 'Wednesday'
    },
   {
      workoutName: 'Workout 3',
      plannedDay: 'Saturday'
    },
 ]

</script>

<template>
  <ion-card>
    <ion-card-header>
    <ion-card-title>Workout Plan Name</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <WorkoutPlanItem 
        v-for = "workout in workouts"
        :workoutName="workout.workoutName"
        :plannedDay="workout.plannedDay"
      />
    </ion-card-content>
  </ion-card>
</template>
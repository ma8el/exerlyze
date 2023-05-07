<script setup lang="ts">
  import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonDatetime } from '@ionic/vue';
  import ExerciseItem from './ExerciseItem.vue';

  const exercises = [
    {
      name: 'Bench Press',
      sets: 5,
      reps: 5,
      weight: 100
    },
    {
      name: 'Squat',
      sets: 5,
      reps: 5,
      weight: 140
    },
    {
      name: 'Deadlift',
      sets: 5,
      reps: 5,
      weight: 220
    },
    {
      name: 'Overhead Press',
      sets: 5,
      reps: 5,
      weight: 50
    },
  ]

</script>

<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Workout Name</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ExerciseItem 
        v-for = "exercise in exercises"
        :exercise-name="exercise.name"
        :exerciseSets="exercise.sets"
        :exerciseReps="exercise.reps"
        :exerciseWeight="exercise.weight"
      />
    </ion-card-content>
  </ion-card>
</template>
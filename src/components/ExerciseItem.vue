<script setup lang="ts">
  import { IonItem, IonLabel, IonNote } from '@ionic/vue';
  const props = defineProps({
      exerciseName: String,
      exerciseSets: Number,
      exerciseReps: Number,
      exerciseWeight: Number
  })
</script>

<template>
  <ion-item>
    <ion-label>{{ exerciseName }}</ion-label>
    <ion-note slot="end">{{ exerciseSets }} sets x {{ exerciseReps }} reps x {{ exerciseWeight }} kg</ion-note>
  </ion-item>
</template>
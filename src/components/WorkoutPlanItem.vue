<script setup lang="ts">
  import { IonItem, IonLabel, IonNote } from '@ionic/vue';
  const props = defineProps({
      workoutName: String,
      plannedDay: String
  })
</script>

<template>
  <ion-item>
    <ion-label>{{ workoutName }}</ion-label>
    <ion-note slot="end">{{ plannedDay }}</ion-note>
  </ion-item>
</template>
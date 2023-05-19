<script setup lang="ts">
    import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/vue';
    
    const props = defineProps({
        workoutName: String,
        plannedDay: String
    })
</script>

<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ workoutName }}</ion-card-title>
      <ion-card-subtitle>{{ plannedDay }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content class="ion-margin">
      <slot></slot>
    </ion-card-content>
  </ion-card>
</template>
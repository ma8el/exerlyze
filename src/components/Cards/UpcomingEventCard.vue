<script setup lang="ts">
    import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/vue';
    
    const props = defineProps({
        workoutName: String,
        workoutPlanName: String,
        plannedDay: String,
        plannedTime: String,
    })
</script>

<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ workoutName }}</ion-card-title>
      <ion-card-subtitle>{{ workoutPlanName }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content class="ion-margin">
      Scheduled on {{ plannedDay }}
      <slot></slot>
    </ion-card-content>
  </ion-card>
</template>
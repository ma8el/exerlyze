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
    <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
    <ion-card-header>
      <ion-card-title>{{ workoutName }}</ion-card-title>
      <ion-card-subtitle>{{ workoutPlanName }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      {{ $t('scheduledOn') }} {{ plannedDay }}
      <slot></slot>
    </ion-card-content>
  </ion-card>
</template>
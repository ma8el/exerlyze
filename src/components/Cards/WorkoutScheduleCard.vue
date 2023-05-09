<script setup lang="ts">
  import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonNote } from '@ionic/vue';
</script>

<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Scheduled Workouts</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-list>
        <ion-item>
          <ion-label>Workout Plan 1</ion-label>
          <ion-note slot="end">01.05.2023 - 31.05.2023</ion-note>
        </ion-item>
      </ion-list>
     </ion-card-content>
  </ion-card>
</template>
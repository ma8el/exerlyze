<script setup lang="ts">
import { IonButton, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, modalController } from '@ionic/vue';

const closeModal = () => {
    return modalController.dismiss(null, 'close');
};
</script>

<template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-title>Workout</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Dismiss</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
    </ion-content>
  </ion-content>
</template>
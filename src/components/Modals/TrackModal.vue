<script setup lang="ts">
import { IonButton,
         IonContent,
         IonHeader,
         IonToolbar,
         IonTitle,
         IonButtons,
         modalController } from '@ionic/vue';
import AddWeightModal from './AddWeightModal.vue';

const closeModal = () => {
    return modalController.dismiss(null, 'close');
};
</script>

<template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('track') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">{{ $t('dismiss') }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <AddWeightModal />
    </ion-content>
  </ion-content>
</template>
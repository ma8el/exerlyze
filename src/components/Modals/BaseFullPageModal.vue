<script setup lang="ts">
  import { IonButton,
           IonContent,
           IonHeader,
           IonToolbar,
           IonButtons,
           IonTitle,
           modalController } from '@ionic/vue';

  const props = defineProps({
    title: String
  })

  const closeModal = () => {
      return modalController.dismiss(null, 'close');
  };
</script>

<template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeModal">Dismiss</ion-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
            <slot name="saveButton"></slot>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
        <slot name="modalContent"></slot>
    </ion-content>
  </ion-content>
  <slot name="modalFooter"></slot>
</template>
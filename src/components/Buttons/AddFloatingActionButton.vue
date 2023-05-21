<script setup lang="ts">
  import { IonFab, IonFabButton, IonIcon, modalController } from '@ionic/vue';
  import { add } from 'ionicons/icons';

  const props = defineProps({
    modalComponent: Object
  })
  
  const openModal = async () => {
    if (!props.modalComponent) {
      console.error('modalComponent is undefined');
      return;
    }
    const modal = await modalController.create({
      component: props.modalComponent as any,
      cssClass: 'full-screen-modal',
    });
    modal.present();
  }
</script>

<template>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button color="primary" @click="openModal">
      <ion-icon :icon="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</template>
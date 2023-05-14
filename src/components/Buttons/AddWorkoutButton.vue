<script setup lang="ts">
  import { IonFab, IonFabButton, IonIcon, modalController } from '@ionic/vue';
  import { add } from 'ionicons/icons';
  import AddWorkoutModal from '@/components/Modals/AddWorkoutModal.vue';
  
  const openModal = async () => {
    const modal = await modalController.create({
      component: AddWorkoutModal,
      cssClass: 'full-screen-modal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'save') {
      console.log('Save', data);
    } else {
      console.log('Close', data);
    };
  }
</script>

<template>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button color="primary" @click="openModal">
      <ion-icon :icon="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</template>
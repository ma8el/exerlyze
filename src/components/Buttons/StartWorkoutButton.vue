<script setup lang="ts">
  import { IonButton, modalController, IonRow, IonGrid, IonCol } from '@ionic/vue';
  import WorkoutModal from '@/components/Modals/WorkoutModal.vue';
  
  const openModal = async () => {
    const modal = await modalController.create({
      component: WorkoutModal,
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
  <ion-button 
    id="start-workout-button"
    @click="openModal"
    expand="block"
  >
    Start Workout
  </ion-button>
</template>
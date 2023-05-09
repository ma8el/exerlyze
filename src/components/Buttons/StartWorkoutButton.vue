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
  <ion-grid>
    <ion-row class="button-container ion-align-items-end ion-justify-content-center">
      <ion-col size="12">
        <ion-button 
          id="start-workout-button"
          @click="openModal"
          expand="block"
          shape="round"
        >
          Start Workout
        </ion-button>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<style scoped>
  .button-container {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 90%;
    transform: translateY(-90%);
  }
</style>
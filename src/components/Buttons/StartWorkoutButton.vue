<script setup lang="ts">
  import { IonButton, modalController } from '@ionic/vue';
  import WorkoutModal from '@/components/Modals/WorkoutModal.vue';

  const props = defineProps({
    workoutId: {
      type: Number,
      required: true
    }
  });
  
  const openModal = async () => {
    const modal = await modalController.create({
      component: WorkoutModal,
      componentProps: {
        workoutId: props.workoutId
      },
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
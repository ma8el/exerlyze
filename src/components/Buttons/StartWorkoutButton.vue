<script setup lang="ts">
  import { IonButton, modalController } from '@ionic/vue';
  import WorkoutModal from '@/components/Modals/WorkoutModal.vue';
  import StartWorkoutModal from '../Modals/StartWorkoutModal.vue';

  const props = defineProps({
    workoutId: {
      type: String,
      required: true
    }
  });
  
  const openModal = async () => {
    const modal = await modalController.create({
//      component: WorkoutModal,
      component: StartWorkoutModal,
      componentProps: {
        workoutId: props.workoutId
      },
      cssClass: 'full-screen-modal',
    });
    modal.present();
 }
</script>

<template>
  <ion-button 
    id="start-workout-button"
    @click="openModal"
    expand="block"
  >
    {{ $t('workouts.startWorkout') }}
  </ion-button>
</template>
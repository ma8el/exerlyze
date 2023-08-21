<script setup lang="ts">
  import { IonButton,
          modalController } from '@ionic/vue';
  import AddPlannedWorkoutModal from '../Modals/AddPlannedWorkoutModal.vue';

  const emit = defineEmits(['saveWorkouts'])

  const openModal = async () => {
    const modal = await modalController.create({
        component: AddPlannedWorkoutModal,
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();

      if (role === 'save') {
        emit('saveWorkouts', data)
}
  };
</script>

<template>
  <ion-button
    id="open-modal"
    expand="block"
    size="small"
    @click="openModal"
  >
    {{ $t('workouts.addWorkout') }}
  </ion-button>
</template>
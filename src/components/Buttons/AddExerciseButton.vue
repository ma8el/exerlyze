<script setup lang="ts">
  import { IonButton,
          modalController } from '@ionic/vue';
  import AddExercisesModal from '../Modals/AddExercisesModal.vue';

  const emit = defineEmits(['saveExercises'])

  const openModal = async () => {
    const modal = await modalController.create({
        component: AddExercisesModal,
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();

      if (role === 'save') {
        emit('saveExercises', data)
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
    {{ $t('addExercise') }}
  </ion-button>
</template>
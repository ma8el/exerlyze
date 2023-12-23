<script setup lang="ts">
import { IonButton, IonIcon, modalController } from '@ionic/vue';
import { addCircleOutline } from 'ionicons/icons';
import AddWorkoutModal from '../Modals/AddWorkoutModal.vue';
import BaseCard from './BaseCard.vue';

const openAddWorkoutModal = async () => {
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
  <BaseCard
    :title="$t('noUpcomingEvent')"
    :content="true"
  >
    <ion-button
      fill="clear"
      @click="openAddWorkoutModal()"
      expand="block" 
      class="ion-margin-top"
    >
      <ion-icon :icon="addCircleOutline"></ion-icon>
      {{  $t('workouts.addWorkout') }}
    </ion-button>
  </BaseCard>
</template>
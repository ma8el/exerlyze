<script setup lang="ts">
  import { IonCard,
           IonCardHeader,
           IonCardTitle,
           IonCardContent,
           modalController } from '@ionic/vue';
  import { Workout } from '@/types';
  import AddWorkoutModal from '../Modals/AddWorkoutModal.vue';

  const props = defineProps<Workout>()

  const openModal = async () => {
    const modal = await modalController.create({
      component: AddWorkoutModal,
      componentProps: { workoutId: props.id },
      cssClass: 'full-screen-modal',
    });
    modal.present();
  }
</script>

<template>
  <ion-card :button="true" @click="openModal">
    <ion-card-header>
      <ion-card-title>{{ name }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      Meta data
    </ion-card-content>
  </ion-card>
</template>
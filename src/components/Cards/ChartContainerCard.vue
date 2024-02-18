<script setup lang="ts">
  import { IonCard, IonIcon, IonButton, modalController } from '@ionic/vue';
  import { filter } from 'ionicons/icons';
  import ExerciseFilterModal from '@/components/Modals/ExerciseFilterModal.vue';

  const props = defineProps({
    hasFilter: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const emits = defineEmits(['update-filter']);

  const showFilterModal = async () => {
    const modal = await modalController.create({
      component: ExerciseFilterModal,
      cssClass: 'full-screen-modal',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'save') {
      emits('update-filter', data);
    } else {
      console.log('dismissed');
    }
  };
</script>

<template>
  <ion-card>
   <ion-button 
     class="filter-button"
     v-if="hasFilter"
     @click="showFilterModal"
   >
     <ion-icon :icon="filter"></ion-icon>
   </ion-button>
 
   <div 
      class="chart-container ion-padding"
    >

      <slot></slot>
    </div>
  </ion-card>
</template>

<style scoped>
  .filter-button {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
  }
  .chart-container {
    width: 100%;
    height: 300px;
  }
</style>
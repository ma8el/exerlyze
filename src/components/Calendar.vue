<script setup lang="ts">
  import { IonGrid,
           IonRow,
           modalController } from '@ionic/vue';
  import { useDark } from '@vueuse/core'
  import { ref,
           PropType } from 'vue'
  import ActivitiesModal from './Modals/ActivitiesModal.vue';

  const props = defineProps({
    workoutEventDates: {
      type: Array as PropType<Date[]>,
      required: false,
      default: () => []
    },
 })

  const isDark = useDark()

  const attributes = ref([{
    key: 'today',
    highlight: {
      color: '#3F63C8',
      fillMode: 'light',
    },
    dates: new Date(),
  },
  {
    key: 'workoutEvent',
    dot: {
      style: {
        backgroundColor: '#3F63C8',
      },
    },
    dates: props.workoutEventDates,
  }
  ])

  const selectedDate = ref<Date>()

  const openModal = async () => {
    if ( !selectedDate.value ) {
      return
    }
    const modal = await modalController.create({
      component: ActivitiesModal,
      componentProps: {
        selectedDate: selectedDate.value
      },
    });
    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if ( role === 'close' || role === 'backdrop') {
      selectedDate.value = undefined
    }
  }
</script>

<template>
  <ion-grid>
    <ion-row class="ion-justify-content-center">
        <VDatePicker 
          expanded 
          transparent 
          borderless 
          :is-dark="isDark" 
          view="weekly"
          v-model="selectedDate"
          @click="openModal"
          :attributes="attributes"
        />
    </ion-row>
  </ion-grid>
</template>
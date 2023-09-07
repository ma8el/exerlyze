<script setup lang="ts">
  import { IonGrid,
           IonCard,
           IonRow,
           modalController } from '@ionic/vue';
  import { useDark } from '@vueuse/core'
  import { ref, watch, onMounted, PropType } from 'vue'
  import ActivitiesModal from './Modals/ActivitiesModal.vue';
  import { useUserSettingsStore } from '@/store/userSettingsStore';

  const props = defineProps({
    workoutEventDates: {
      type: Array as PropType<Date[]>,
      required: false,
      default: () => []
    },
 })

  const isDark = useDark()
  const userSettingsStore = useUserSettingsStore()
  const setLocale = ref(userSettingsStore.getLocale())

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

  onMounted(() => {
    setLocale.value = userSettingsStore.getLocale()
  })

  watch(() => userSettingsStore.setLocale, () => {
    setLocale.value = userSettingsStore.getLocale()
  })
</script>

<template>
  <ion-grid>
    <ion-row class="ion-justify-content-center">
      <ion-card class="ion-margin">
        <VDatePicker 
          class="vc-arrow-icon"
          :locale=setLocale
          title-position="left"
          expanded 
          transparent 
          borderless 
          :is-dark="isDark" 
          view="weekly"
          v-model="selectedDate"
          @click="openModal"
          :attributes="attributes"
        />
      </ion-card>
    </ion-row>
  </ion-grid>
</template>

<style scoped lang="scss">
  ion-card {
    width: 100%;
  }
</style>
<script setup lang="ts">
  import { IonCard,
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

//  const isDark = useDark()
  const isDark = true
  const userSettingsStore = useUserSettingsStore()
  const setLocale = ref(userSettingsStore.getLocale())

  const attributes = ref([{
    key: 'today',
    highlight: {
      color: '#7f93de',
      fillMode: 'light',
    },
    dates: new Date(),
  },
  {
    key: 'workoutEvent',
    dot: {
      style: {
        backgroundColor: '#7f93de',
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

  userSettingsStore.$subscribe(() => {
    setLocale.value = userSettingsStore.getLocale()
  })
</script>

<template>
  <ion-card>
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
      :first-day-of-week="2"
    />
  </ion-card>
</template>

<style scoped lang="scss">
  ion-card {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    margin: 0 0 16px 0;
    border-radius: 0;
  }

  .vc-container, :deep(.vc-title) {
    background: var(--ion-background-color);
    pointer-events: none;
  }
  .vc-container, :deep(.vc-arrow, .vc-prev, .vc-focus) {
    background: var(--ion-background-color);
  }
</style>
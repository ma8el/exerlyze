<script setup lang="ts">
  import { IonCard } from '@ionic/vue';
  import AppLayout from '@/layouts/AppLayout.vue';
  import { ref, provide, readonly, reactive } from 'vue';
  import { useDark } from '@vueuse/core'
  import { selectedDateKey } from '@/keys';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import { getCurrentWeekDates } from '@/helpers/time';

  const props = defineProps({
    title: {
      type: String,
      required: true
    }
  });
  
//  const isDark = useDark()
  const isDark = true

  const userSettingsStore = useUserSettingsStore()
  const setLocale = ref(userSettingsStore.getLocale())
  const selectedDate = ref<Date>(new Date())
  provide(selectedDateKey, readonly(selectedDate))

  const nutritionStore = useFoodDiaryStore();

  let nutritionEventDates = reactive<Date[]>([])
  nutritionEventDates = getCurrentWeekDates().filter(
    date => nutritionStore.getFoodDiaryEntries.some(foodEntry => new Date(foodEntry.created_at).getDay() === date.getDay() && 
                                                                 new Date(foodEntry.created_at).getMonth() === date.getMonth() &&
                                                                 new Date(foodEntry.created_at).getFullYear() === date.getFullYear()));

  const attributes = ref([{
    key: 'today',
    highlight: {
      color: '#7f93de',
      fillMode: 'light',
    },
    dates: new Date(),
  },
  {
    key: 'nutritionEvent',
    dot: {
      style: {
        backgroundColor: '#7f93de',
      },
    },
    dates: nutritionEventDates,
  }
  ])

  nutritionStore.$subscribe((mutation, state) => {
    nutritionEventDates = getCurrentWeekDates().filter(
      date => nutritionStore.getFoodDiaryEntries.some(foodEntry => new Date(foodEntry.created_at).getDay() === date.getDay() && 
                                                                   new Date(foodEntry.created_at).getMonth() === date.getMonth() &&
                                                                   new Date(foodEntry.created_at).getFullYear() === date.getFullYear()));
  });

  userSettingsStore.$subscribe((mutation, state) => {
    setLocale.value = userSettingsStore.getLocale()
  });
</script>

<template>
  <AppLayout :title=title>
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
          :attributes="attributes"
          :first-day-of-week="2"
        />
      </ion-card>
    <slot></slot>
  </AppLayout>
</template>

<style scoped lang="scss">
  ion-card {
    position: sticky;
    top: 0;
    margin: 0 0 16px 0;
    z-index: 100;
    width: 100%;
    border-radius: 0;
  }

  .vc-container, :deep(.vc-title) {
    background: var(--ion-card-background);
    pointer-events: none;
  }
  .vc-container, :deep(.vc-arrow, .vc-prev, .vc-focus) {
    background: var(--ion-card-background);
  }
</style>
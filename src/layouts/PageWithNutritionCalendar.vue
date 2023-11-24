<script setup lang="ts">
  import { IonGrid, IonRow } from '@ionic/vue';
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

  const userSettingsStore = useUserSettingsStore()
  const setLocale = ref(userSettingsStore.getLocale())
  const isDark = useDark()
  const selectedDate = ref<Date>(new Date())
  provide(selectedDateKey, readonly(selectedDate))

  const nutritionStore = useFoodDiaryStore();

  let nutritionEventDates = reactive<Date[]>([])
  nutritionEventDates = getCurrentWeekDates().filter(
    date => nutritionStore.getFoodDiaryEntries.some(foodEntry => new Date(foodEntry.created_at).getDay() === date.getDay()))

  const attributes = ref([{
    key: 'today',
    highlight: {
      color: '#3F63C8',
      fillMode: 'light',
    },
    dates: new Date(),
  },
  {
    key: 'nutritionEvent',
    dot: {
      style: {
        backgroundColor: '#3F63C8',
      },
    },
    dates: nutritionEventDates,
  }
  ])

  nutritionStore.$subscribe((mutation, state) => {
    nutritionEventDates = getCurrentWeekDates().filter(
      date => nutritionStore.getFoodDiaryEntries.some(foodEntry => new Date(foodEntry.created_at).getDay() === date.getDay()))
  });
</script>

<template>
  <AppLayout :title=title>
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
            :attributes="attributes"
          />
        </ion-card>
      </ion-row>
    </ion-grid>
    <slot></slot>
  </AppLayout>
</template>

<style scoped lang="scss">
  ion-card {
    width: 100%;
  }
</style>
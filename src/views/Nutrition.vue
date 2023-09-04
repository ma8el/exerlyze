<script setup lang="ts">
  import { IonGrid, IonRow, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
  import AppLayout from '@/layouts/AppLayout.vue';
  import { ref, provide, readonly, reactive } from 'vue';
  import { useDark } from '@vueuse/core'
  import { selectedDateKey } from '@/keys';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import { getCurrentWeekDates } from '@/helpers/time';

  import BaseSegments from '@/components/BaseSegments.vue';
  import NutritionFoodDiaryContent from '@/components/NutritionFoodDiaryContent.vue';
  import NutritionYourDayContent from '@/components/NutritionYourDayContent.vue';

  const selectedSegment = ref('day');
  const diarySelected = ref(false)
  const yourDaySelected = ref(true)

  const selectDiary = () => {
     diarySelected.value = true;
     yourDaySelected.value = false;
  }

  const selectYourDay = () => {
     diarySelected.value = false;
     yourDaySelected.value = true;
  }

  const isDark = useDark()
  const selectedDate = ref<Date>(new Date())
  provide(selectedDateKey, readonly(selectedDate))

  const nutritionStore = useFoodDiaryStore();
  let nutritionEventDates = reactive<Date[]>([])
  nutritionEventDates = getCurrentWeekDates().filter(
    date => nutritionStore.getFoodDiaryEntries.some(foodEntry => new Date(foodEntry.createdAt).getDay() === date.getDay()))

  console.log(nutritionEventDates)
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
    console.log('mutation', mutation);
    nutritionEventDates = getCurrentWeekDates().filter(
      date => nutritionStore.getFoodDiaryEntries.some(foodEntry => new Date(foodEntry.createdAt).getDay() === date.getDay()))
  });
</script>

<template>
  <AppLayout :title="$t('nutrition.title')">
    <ion-grid>
      <ion-row class="ion-justify-content-center">
          <VDatePicker 
            expanded 
            transparent 
            borderless 
            :is-dark="isDark" 
            view="weekly"
            v-model="selectedDate"
            :attributes="attributes"
          />
      </ion-row>
    </ion-grid>
    <BaseSegments
      :leftSegmentLabel="$t('nutrition.yourDay')"
      :rightSegmentLabel="$t('nutrition.foodDiary')"
      @leftSegmentSelected="selectYourDay"
      @rightSegmentSelected="selectDiary"
    />
    <NutritionFoodDiaryContent v-if="diarySelected" />
    <NutritionYourDayContent v-if="yourDaySelected" />
  </AppLayout>
</template>
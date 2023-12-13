<script setup lang="ts">
  import PageWithNutritionCalendar from '@/layouts/PageWithNutritionCalendar.vue';
  import { ref } from 'vue';

  import BaseSegments from '@/components/BaseSegments.vue';
  import NutritionFoodDiaryContent from '@/components/NutritionFoodDiaryContent.vue';
  import NutritionYourDayContent from '@/components/NutritionYourDayContent.vue';

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
</script>

<template>
  <PageWithNutritionCalendar :title="$t('nutrition.title')">
    <BaseSegments
      :leftSegmentLabel="$t('yourDay')"
      :rightSegmentLabel="$t('nutrition.foodDiary')"
      @leftSegmentSelected="selectYourDay"
      @rightSegmentSelected="selectDiary"
    />
    <NutritionFoodDiaryContent v-if="diarySelected" />
    <NutritionYourDayContent v-if="yourDaySelected" />
  </PageWithNutritionCalendar>
</template>
<script setup lang="ts">
  import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
  import { ref } from 'vue';
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
</script>

<template>
  <ion-segment :value="selectedSegment">
   <ion-segment-button value="day" @click="selectYourDay">
      <ion-label>{{ $t('nutrition.yourDay') }}</ion-label>
    </ion-segment-button>
    <ion-segment-button value="diary" @click="selectDiary">
      <ion-label>{{ $t('nutrition.foodDiary') }}</ion-label>
    </ion-segment-button>
  </ion-segment>
  <NutritionFoodDiaryContent v-if="diarySelected" />
  <NutritionYourDayContent v-if="yourDaySelected" />
</template>
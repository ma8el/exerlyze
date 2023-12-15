<script setup lang="ts">
  import { IonList, IonItem, IonLabel, IonNote, IonThumbnail } from '@ionic/vue';
  import BaseCard from './BaseCard.vue';
  import BurnIcon from '@/icons/burn.vue';
  import CarbsIcon from '@/icons/carbs.vue';
  import ProteinIcon from '@/icons/protein.vue';
  import FatIcon from '@/icons/fat.vue';
  import { computed, inject } from 'vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import { selectedDateKey }  from '@/keys';

  const selectedDate = inject(selectedDateKey);

  const dailyCalories = useFoodDiaryStore().dailyCalories;
  const dailyCarbs = useFoodDiaryStore().dailyCarbs;
  const dailyFat = useFoodDiaryStore().dailyFat;
  const dailyProtein = useFoodDiaryStore().dailyProtein;

  const intake = computed(() => {
    if (!selectedDate) {
      return 0;
    }
    return useFoodDiaryStore().getCaloriesOfDate(selectedDate.value);
  })

  const intakeCarbs = computed(() => {
    if (!selectedDate) {
      return 0;
    }
    return useFoodDiaryStore().getCarbohydratesOfDate(selectedDate.value);
  })

  const intakeFat = computed(() => {
    if (!selectedDate) {
      return 0;
    }
    return useFoodDiaryStore().getFatOfDate(selectedDate.value);
  })

  const intakeProtein = computed(() => {
    if (!selectedDate) {
      return 0;
    }
    return useFoodDiaryStore().getProteinOfDate(selectedDate.value);
  })
</script>

<template>
  <BaseCard
    :title="$t('nutrition.nutritionOverview')"
    :content="true"
    class="nutrition-overview-card ion-no-margin"
  >
    <ion-list class="nutrition-list" lines="none">
      <ion-item>
        <ion-thumbnail slot="start">
          <div class="nutrition-thumb">
            <!--<img :src="BurnIcon" /> -->
            <BurnIcon color="white" class="iconComponent"/>
          </div>
        </ion-thumbnail>
        <ion-label>{{ $t('nutrition.calories') }}</ion-label>
        <ion-note slot="end">{{ intake }} / {{ dailyCalories }}</ion-note>
      </ion-item>
      <ion-item>
        <ion-thumbnail slot="start">
          <div class="nutrition-thumb">
            <CarbsIcon color="white" class="iconComponent"/>
          </div>
        </ion-thumbnail>
        <ion-label>{{ $t('nutrition.carbohydrates') }}</ion-label>
        <ion-note slot="end">{{ intakeCarbs }} g / {{ dailyCarbs }} g</ion-note>
      </ion-item>
      <ion-item>
         <ion-thumbnail slot="start">
          <div class="nutrition-thumb">
            <ProteinIcon color="white" class="iconComponent" />
          </div>
        </ion-thumbnail>
        <ion-label>{{ $t('nutrition.protein') }}</ion-label>
        <ion-note slot="end">{{ intakeProtein }} g / {{ dailyProtein }} g</ion-note>
      </ion-item>
      <ion-item>
        <ion-thumbnail slot="start">
          <div class="nutrition-thumb">
            <FatIcon color="white" class="iconComponent"/>
          </div>
        </ion-thumbnail>
        <ion-label>{{ $t('nutrition.fat') }}</ion-label>
        <ion-note slot="end">{{ intakeFat }} g / {{ dailyFat }} g</ion-note>
      </ion-item>
   </ion-list>
  </BaseCard>
</template>

<style scoped lang="scss">
  .nutrition-thumb {
    background: var(--ion-color-primary-tint);
    border-radius: 20%;
    width: 80%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
  }
  .nutrition-overview-card {
    --background: none;
    margin-bottom: 100px;
  }
  .nutrition-list {
    margin: 0;
    background: none;
  }
  ion-item {
    border-radius: 10px;
    margin-top: 10px;
  }

.iconComponent {
  width: 70%;
  height: 70%;
}
</style>
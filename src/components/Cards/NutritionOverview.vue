<script setup lang="ts">
  import { IonCard, IonList, IonItem, IonLabel, IonNote, IonListHeader, IonThumbnail } from '@ionic/vue';
  import BaseCard from './BaseCard.vue';
  import { computed, inject } from 'vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import { selectedDateKey }  from '@/keys';

  const selectedDate = inject(selectedDateKey);

  const dailyCalories = 3000;
  const dailyCarbs = 150;
  const dailyFat = 50;
  const dailyProtein = 100;

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
            <img src="../../../assets/icons/burn_white.svg" />
          </div>
        </ion-thumbnail>
        <ion-label>{{ $t('nutrition.calories') }}</ion-label>
        <ion-note slot="end">{{ intake }} / {{ dailyCalories }}</ion-note>
      </ion-item>
      <ion-item>
        <ion-thumbnail slot="start">
          <div class="nutrition-thumb">
            <img src="../../../assets/icons/carbs.svg" />
          </div>
        </ion-thumbnail>
        <ion-label>{{ $t('nutrition.carbs') }}</ion-label>
        <ion-note slot="end">{{ intakeCarbs }} g / {{ dailyCarbs }} g</ion-note>
      </ion-item>
      <ion-item>
        <ion-thumbnail slot="start">
          <div class="nutrition-thumb">
            <img src="../../../assets/icons/fat.svg" />
          </div>
        </ion-thumbnail>
        <ion-label>{{ $t('nutrition.fat') }}</ion-label>
        <ion-note slot="end">{{ intakeFat }} g / {{ dailyFat }} g</ion-note>
      </ion-item>
      <ion-item>
         <ion-thumbnail slot="start">
          <div class="nutrition-thumb">
            <img src="../../../assets/icons/protein.svg" />
          </div>
        </ion-thumbnail>
        <ion-label>{{ $t('nutrition.protein') }}</ion-label>
        <ion-note slot="end">{{ intakeProtein }} g / {{ dailyProtein }} g</ion-note>
      </ion-item>
    </ion-list>
  </BaseCard>
</template>

<style scoped lang="scss">
  .nutrition-thumb {
    background: var(--ion-color-secondary);
    border-radius: 20%;
    width: 80%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    img {
      width: 70%;
      height: 70%;
    }
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
</style>
<script setup lang="ts">
  import { IonRow, IonCol, IonCard, IonCardSubtitle, IonCardContent } from '@ionic/vue';
  import NutritionOverview from './Cards/NutritionOverview.vue';
  import NutritionDoughnutChart from './Charts/NutritionDoughnutChart.vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import { computed, inject } from 'vue';
  import { selectedDateKey } from '@/keys';

  const selectedDate = inject(selectedDateKey);

  const foodDiaryStore = useFoodDiaryStore();

  const carbsOfDay = computed(() => {
    if (!selectedDate) {
      return 0;
    }
    return foodDiaryStore.getCarbohydratesOfDate(selectedDate.value);
  });

  const proteinsOfDay = computed(() => {
    if (!selectedDate) {
      return 0;
    }
    return foodDiaryStore.getProteinOfDate(selectedDate.value);
  });

  const fatsOfDay = computed(() => {
    if (!selectedDate) {
      return 0;
    }
    return foodDiaryStore.getFatOfDate(selectedDate.value);
  });

  const data = computed(() => {
    return [
        carbsOfDay.value,
        proteinsOfDay.value,
        fatsOfDay.value
    ]
  }
  )
</script>

<template>
  <ion-card>
    <ion-row >
      <ion-col size="8">
        <div :style="{width: '100%', height: '250px'}">
            <NutritionDoughnutChart 
                :chart-data="data"
            />
        </div>
      </ion-col>
      <ion-col size="4">
        <ion-card-content>
          <ion-card-subtitle class="carbs">
            <ion-row>
              {{ carbsOfDay }} g
            </ion-row>
            <ion-row>
              {{ $t('nutrition.carbs') }} 
            </ion-row>
          </ion-card-subtitle>
          <ion-card-subtitle class="protein">
            <ion-row>
              {{ proteinsOfDay }} g
            </ion-row>
            <ion-row>
              {{ $t('nutrition.protein') }}
            </ion-row>
          </ion-card-subtitle>
          <ion-card-subtitle class="fat">
            <ion-row>
              {{ fatsOfDay }} g
            </ion-row>
            <ion-row>
              {{ $t('nutrition.fat') }}
            </ion-row>
          </ion-card-subtitle>
        </ion-card-content>
      </ion-col>
    </ion-row>
  </ion-card>
  <NutritionOverview />
</template>

<style scoped lang="scss">
.carbs {
  color: var(--ion-color-primary);
  font-size: 13px;
  margin-bottom: 10px;
}

.protein {
  color: var(--ion-color-secondary);
  font-size: 13px;
  margin-bottom: 10px;
}

.fat {
  color: #FFFFFF;
  font-size: 13px;
  margin-bottom: 10px;
} 
</style>
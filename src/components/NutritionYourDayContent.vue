<script setup lang="ts">
  import { IonRow, IonCol, IonCard, IonCardSubtitle, IonCardContent } from '@ionic/vue';
  import NutritionOverview from './Cards/NutritionOverview.vue';
  import AddFloatingActionButton from './Buttons/AddFloatingActionButton.vue';
  import AddNutritionModal from './Modals/AddNutritionModal.vue';
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
      <ion-col size="6">
        <div :style="{width: '100%', height: '200px'}">
            <NutritionDoughnutChart 
                :chart-data="data"
            />
        </div>
      </ion-col>
      <ion-col size="6">
        <ion-card-content>
          <ion-card-subtitle :style="{color: '#FFFFFF'}">{{ $t('nutrition.carbs') }}: {{ carbsOfDay }} g</ion-card-subtitle>
          <ion-card-subtitle :style="{color: '#3F63C8'}">{{ $t('nutrition.protein') }}: {{ proteinsOfDay }} g</ion-card-subtitle>
          <ion-card-subtitle :style="{color: '#5598ff'}">{{ $t('nutrition.fat') }}: {{ fatsOfDay }} g</ion-card-subtitle>
        </ion-card-content>
      </ion-col>
    </ion-row>
  </ion-card>
  <NutritionOverview />
  <AddFloatingActionButton :modal-component="AddNutritionModal"/>
</template>
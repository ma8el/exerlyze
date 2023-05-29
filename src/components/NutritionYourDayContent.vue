<script setup lang="ts">
  import { IonRow, IonCol, IonCard, IonCardContent } from '@ionic/vue';
  import NutritionOverview from './Cards/NutritionOverview.vue';
  import AddFloatingActionButton from './Buttons/AddFloatingActionButton.vue';
  import AddNutritionModal from './Modals/AddNutritionModal.vue';
  import NutritionDoughnutChart from './Charts/NutritionDoughnutChart.vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';
import { computed } from 'vue';

  const foodDiaryStore = useFoodDiaryStore();

  const carbsOfDay = computed(() => {
    return foodDiaryStore.getCarbohydratesOfDate(new Date());
  });

  const proteinsOfDay = computed(() => {
    return foodDiaryStore.getProteinOfDate(new Date());
  });

  const fatsOfDay = computed(() => {
    return foodDiaryStore.getFatOfDate(new Date());
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
          <ion-card-subtitle :style="{color: '#FFFFFF'}">Carbs: {{ carbsOfDay }} g</ion-card-subtitle>
          <ion-card-subtitle :style="{color: '#3F63C8'}">Protein: {{ proteinsOfDay }} g</ion-card-subtitle>
          <ion-card-subtitle :style="{color: '#5598ff'}">Fat: {{ fatsOfDay }} g</ion-card-subtitle>
        </ion-card-content>
      </ion-col>
    </ion-row>
  </ion-card>
  <NutritionOverview />
  <AddFloatingActionButton :modal-component="AddNutritionModal"/>
</template>
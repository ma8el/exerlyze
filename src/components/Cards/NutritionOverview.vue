<script setup lang="ts">
  import { IonCard, IonList, IonItem, IonLabel, IonNote, IonListHeader } from '@ionic/vue';
  import { computed } from 'vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';

  const dailyCalories = 3000;
  const dailyCarbs = 150;
  const dailyFat = 50;
  const dailyProtein = 100;

  const intake = computed(() => {
    return useFoodDiaryStore().getCaloriesOfDate(new Date());
  })

  const intakeCarbs = computed(() => {
    return useFoodDiaryStore().getCarbohydratesOfDate(new Date());
  })

  const intakeFat = computed(() => {
    return useFoodDiaryStore().getFatOfDate(new Date());
  })

  const intakeProtein = computed(() => {
    return useFoodDiaryStore().getProteinOfDate(new Date());
  })
</script>

<template>
  <ion-card>
    <ion-list>
      <ion-list-header>
        <ion-label>Nutrition Facts</ion-label>
      </ion-list-header>
      <ion-item>
        <ion-label>Caloies</ion-label>
        <ion-note slot="end">{{ intake }} / {{ dailyCalories }}</ion-note>
      </ion-item>
      <ion-item>
        <ion-label>Carbs</ion-label>
        <ion-note slot="end">{{ intakeCarbs }} g / {{ dailyCarbs }} g</ion-note>
      </ion-item>
      <ion-item>
        <ion-label>Fat</ion-label>
        <ion-note slot="end">{{ intakeFat }} g / {{ dailyFat }} g</ion-note>
      </ion-item>
      <ion-item>
        <ion-label>Protein</ion-label>
        <ion-note slot="end">{{ intakeProtein }} g / {{ dailyProtein }} g</ion-note>
      </ion-item>
    </ion-list>
  </ion-card>
</template>
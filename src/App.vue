<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { Network } from '@capacitor/network';
import { useFoodDiaryStore } from './store/foodDiary';

onMounted(async () => {
  const foodDiaryStore = useFoodDiaryStore();
  if (Object.keys(foodDiaryStore.getFoodDiary).length == 0) {
    foodDiaryStore.createFoodDiary();
  }
  Network.addListener('networkStatusChange', status => {
    console.log('Network status changed', status);
  });
  const status = await Network.getStatus();
  console.log('Network status:', status);
});
</script>

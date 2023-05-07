<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import Toolbar from '@/components/Toolbar.vue';
  import Calendar from '@/components/Calendar.vue';
  import CaloriesOverview from '@/components/CaloriesOverview.vue';
  import TrackActionButton from '@/components/TrackActionButton.vue';
  import NutritionOverview from '@/components/NutritionOverview.vue';
</script>

<template>
  <ion-page>
    <Toolbar title="Nutrition" />

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Nutrition</ion-title>
        </ion-toolbar>
      </ion-header>
      <Calendar />
      <CaloriesOverview />
      <TrackActionButton />
      <NutritionOverview />
    </ion-content>
  </ion-page>
</template>
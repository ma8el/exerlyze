<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import Toolbar from '@/components/Toolbar.vue';
  import Calendar from '@/components/Calendar.vue';
  import CaloriesOverview from '@/components/Cards/CaloriesOverview.vue';
  import NutritionOverview from '@/components/Cards/NutritionOverview.vue';
  import AddFloatingActionButton from '@/components/Buttons/AddFloatingActionButton.vue';
  import AddNutritionModal from '@/components/Modals/AddNutritionModal.vue';
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
      <NutritionOverview />
      <AddFloatingActionButton :modal-component="AddNutritionModal"/>
    </ion-content>
  </ion-page>
</template>
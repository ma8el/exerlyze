<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import ExploreContainer from '@/components/ExploreContainer.vue';
  import Toolbar from '@/components/Toolbar.vue';
  import Calendar from '@/components/Calendar.vue';
</script>

<template>
  <ion-page>
    <Toolbar title="Workouts" />
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Workouts</ion-title>
        </ion-toolbar>
      </ion-header>
      <Calendar />
      <ExploreContainer name="Workouts page" />
    </ion-content>
  </ion-page>
</template>
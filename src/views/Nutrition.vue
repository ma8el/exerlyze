<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import ExploreContainer from '@/components/ExploreContainer.vue';
  import Toolbar from '@/components/Toolbar.vue';
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

      <ExploreContainer name="Nutrition page" />
    </ion-content>
  </ion-page>
</template>
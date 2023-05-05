<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import ExploreContainer from '@/components/ExploreContainer.vue';
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Track</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Track</ion-title>
        </ion-toolbar>
      </ion-header>

      <ExploreContainer name="Track page" />
    </ion-content>
  </ion-page>

</template>
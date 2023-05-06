<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import ExploreContainer from '@/components/ExploreContainer.vue';
  import Toolbar from '@/components/Toolbar.vue';
</script>

<template>
  <ion-page>
    <Toolbar title="Home" />
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>
      <ExploreContainer name="Home page" />
    </ion-content>
  </ion-page>
</template>
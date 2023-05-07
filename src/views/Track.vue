<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import Toolbar from '@/components/Toolbar.vue';
  import TrackActionButton from '@/components/TrackActionButton.vue';
</script>

<template>
  <ion-page>
    <Toolbar title="Track" />
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Track</ion-title>
        </ion-toolbar>
      </ion-header>
      <TrackActionButton />
    </ion-content>
  </ion-page>

</template>
<script setup lang="ts">
  import { IonList,
           IonListHeader,
           IonSkeletonText,
           IonItem,
           IonThumbnail,
           IonLabel } from '@ionic/vue';

const items = new Array(20)
</script>

<template>
  <ion-list>
    <ion-item v-for="item in items" :key="item">
      <ion-thumbnail slot="start">
        <ion-skeleton-text animated></ion-skeleton-text>
      </ion-thumbnail>
      <ion-label>
        <h3>
          <ion-skeleton-text animated></ion-skeleton-text>
        </h3>
        <p>
          <ion-skeleton-text animated></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
  </ion-list>
</template>
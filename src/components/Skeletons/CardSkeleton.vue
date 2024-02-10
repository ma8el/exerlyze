<script setup lang="ts">
import { IonCard,
         IonCardTitle,
         IonCardContent,
         IonSkeletonText } from '@ionic/vue';
</script>

<template>
  <ion-card>
    <ion-skeleton-text :animated="true" style="height: 250px;"></ion-skeleton-text>
    <ion-card-title class="ion-margin">
        <ion-skeleton-text :animated="true" style="width: 50%"></ion-skeleton-text>
    </ion-card-title>
    <ion-card-content>
       <ion-skeleton-text :animated="true" style="width: 40%"></ion-skeleton-text>
    </ion-card-content>
  </ion-card>
</template>
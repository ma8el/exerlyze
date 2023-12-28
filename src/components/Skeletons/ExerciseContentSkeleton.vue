<script setup lang="ts">
import { IonCard,
         IonImg,
         IonCardTitle,
         IonCardHeader,
         IonCardContent,
         IonList,
         IonSkeletonText } from '@ionic/vue';
</script>

<template>
  <ion-list>
    <ion-img>
        <ion-skeleton-text :animated="true"></ion-skeleton-text>
    </ion-img>
    <ion-card-title class="ion-margin">
        <ion-skeleton-text :animated="true"></ion-skeleton-text>
    </ion-card-title>
    <ion-card>
        <ion-card-header>
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </ion-card-header>
        <ion-card-content>
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </ion-card-header>
        <ion-card-content>
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </ion-card-content>
    </ion-card>
  </ion-list>
</template>
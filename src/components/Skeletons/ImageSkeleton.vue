<script setup lang="ts">
import { IonItem, IonSkeletonText } from '@ionic/vue';
</script>

<template>
  <ion-item>
    <ion-skeleton-text :animated="true" :style="{ width: '100%', height: '300px' }"></ion-skeleton-text>
  </ion-item>
</template>
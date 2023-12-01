<script setup lang="ts">
  import { IonCard } from '@ionic/vue';
</script>

<template>
  <ion-card>
    <div 
      class="chart-container ion-padding"
    >
      <slot></slot>
    </div>
  </ion-card>
</template>

<style scoped>
  .chart-container {
    width: 100%;
    height: 300px;
  }
</style>
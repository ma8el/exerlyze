<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { Network } from '@capacitor/network';

onMounted(async () => {
  Network.addListener('networkStatusChange', status => {
    console.log('Network status changed', status);
  });
  const status = await Network.getStatus();
  console.log('Network status:', status);
});
</script>

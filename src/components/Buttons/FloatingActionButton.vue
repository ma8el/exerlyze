<script setup lang="ts">
  import { IonFab, IonFabButton, IonIcon } from '@ionic/vue';

  const props = defineProps({
    icon: String,
  })
</script>

<template>
  <ion-fab horizontal="end">
    <ion-fab-button color="dark" size="small">
      <ion-icon :icon="icon"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</template>
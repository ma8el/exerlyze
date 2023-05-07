<script setup lang="ts">
  import { IonFab, IonFabButton, IonIcon } from '@ionic/vue';
  import { add } from 'ionicons/icons';
</script>

<template>
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button color="primary">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
    </ion-fab>
</template>
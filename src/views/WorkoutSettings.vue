<script setup lang="ts">
  import {
    IonItem,
    IonToggle,
    IonList,
    IonListHeader,
  } from '@ionic/vue';
  import AppLayout from '@/layouts/AppLayout.vue';
</script>

<template>
  <AppLayout 
   :title="$t('workoutSettings')"
   :back-button="true"
   :action-button="false"
  >
    <ion-list>
      <ion-list-header>{{ $t('settings.general') }}</ion-list-header>
      <ion-item>
        <ion-toggle>Darkmode</ion-toggle>
      </ion-item>
      <ion-list-header>{{ $t('settings.workout') }}</ion-list-header>
      <ion-item>
        <ion-toggle>Cycle Length</ion-toggle>
      </ion-item>
      <ion-item>
        <ion-toggle>Pause time</ion-toggle>
      </ion-item>
      <ion-list-header>{{ $t('settings.progression') }}</ion-list-header>
      <ion-item>
        <ion-toggle>Set progression</ion-toggle>
      </ion-item>
      <ion-item>
        <ion-toggle>Weight progression</ion-toggle>
      </ion-item>
    </ion-list>
  </AppLayout>
</template>
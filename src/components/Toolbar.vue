<script setup lang="ts">
  import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, modalController } from '@ionic/vue';
  import { settings } from 'ionicons/icons';
  import Settings from '@/components/Settings.vue';

  const props = defineProps(['title'])

  const openModal = async () => {
    const modal = await modalController.create({
      component: Settings,
      cssClass: 'full-screen-modal',
      componentProps: {
        setting1: true,
        setting2: false
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'save') {
      console.log('Save', data);
    } else {
      console.log('Close', data);
    };
  }
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{  title  }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="openModal">
          <ion-icon aria-hidden="true" :icon="settings"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>
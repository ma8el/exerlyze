<script setup lang="ts">
  import { IonHeader, IonPage, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, modalController } from '@ionic/vue';
  import HeaderFloatingActionButton from '@/components/Buttons/HeaderFloatingActionButton.vue';
  import Settings from '@/components/Settings.vue';

  const props = defineProps({
      title: {
        type: String,
        required: true
      }
  });

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
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title size="large">{{ title }}</ion-title>
        <ion-buttons slot="end">
          <header-floating-action-button 
            icon="../../assets/icons/setting.svg"
            @click="openModal"
          />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="app-content" :fullscreen="true">
      <slot></slot>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
ion-toolbar {
  --background: none;
  background-image: url('../../assets/header_background.jpg');
  background-position: center center;
  background-size: cover;
  padding: 20px 0 20px 0;
  box-sizing: inherit;
}
ion-content {
  --background: none;
  background-image: url('../../assets/app_background.jpg');
  background-size: cover;
}
</style>
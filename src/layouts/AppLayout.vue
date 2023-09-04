<script setup lang="ts">
  import { IonHeader, IonPage, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, modalController } from '@ionic/vue';
  import { settingsSharp } from 'ionicons/icons';
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
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ title }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="openModal">
              <ion-icon aria-hidden="true" :icon="settingsSharp"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <slot></slot>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
ion-header {
  display: block;
}
  ion-toolbar {
    --background: none;
    background-image: url('../../assets/app_background.jpg');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 0 0 50px 0;
  }
  ion-title {
    color: white;
    margin: 10px;
  }
  ion-icon {
    color: white;
    margin: 10px 10px 0 0;
  }
</style>
<script setup lang="ts">
  import { IonHeader,
           IonPage,
           IonContent,
           IonToolbar,
           IonTitle,
           IonFab,
           IonFabButton,
           IonButtons, 
           IonIcon,
           modalController } from '@ionic/vue';
  import { arrowBackOutline } from 'ionicons/icons';
  import Settings from '@/components/Settings.vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const props = defineProps({
      title: {
        type: String,
        required: true
      },
      settingsButton: {
        type: Boolean,
        default: true 
      },
      backButton: {
        type: Boolean,
        default: false
      }
  });

  const navigateBack = () => {
    router.back();
  };

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
        <ion-title 
          size="large"
          :class="{'ion-text-center': backButton}"
        >
          {{ title }}
        </ion-title>
        <ion-buttons 
          slot="end"
          v-if="settingsButton"
        >
          <ion-fab horizontal="end">
            <ion-fab-button color="dark" size="small" @click="openModal">
              <ion-icon src="../../assets/icons/setting.svg"></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </ion-buttons>
        <ion-buttons 
          slot="start"
          v-if="backButton"
        >
          <ion-fab>
            <ion-fab-button color="dark" size="small" @click="navigateBack">
              <ion-icon :icon="arrowBackOutline"></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </ion-buttons>
        <slot name="header"></slot>
      </ion-toolbar>
    </ion-header>
      <slot name="avatar"></slot>
    <ion-content :fullscreen="true">
      <slot></slot>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
* { 
  box-sizing: unset;
ion-header {
  ion-toolbar {
    --background: none;
    background-image: url('../../assets/header_background.jpg');
    background-position: center center;
    background-size: cover;
    padding: 10px 0 10px 0;
  }
  ion-buttons {
    padding-top: 10px;
  }
}
ion-content {
  border-radius: 20px 20px 0 0;
	overflow: hidden;
  --background: none;
  background-image: url('../../assets/app_background.jpg');
  background-size: cover;
}
}
</style>
<script setup lang="ts">
import { IonButton, IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonToggle, IonButtons, modalController } from '@ionic/vue';
import { ref } from 'vue';

const setting1 = ref(false);
const setting2 = ref(false);

const save = () => {
    return modalController.dismiss({ setting1: setting1.value, setting2: setting2.value }, 'save');
};

const closeModal = () => {
    return modalController.dismiss(null, 'close');
};
</script>

<template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="save">Save</ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-toggle v-model="setting1">Setting 1</ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="setting2">Setting 2</ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-content>
</template>
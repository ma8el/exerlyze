<script setup lang="ts">
  import { IonButton, IonList, IonItem, IonToggle, modalController } from '@ionic/vue';
  import { ref } from 'vue';
  import BaseFullPageModal from './Modals/BaseFullPageModal.vue';
  
  const setting1 = ref(false);
  const setting2 = ref(false);

  const save = () => {
      return modalController.dismiss({ setting1: setting1.value, setting2: setting2.value }, 'save');
  };
</script>

<template>
  <BaseFullPageModal title="Settings">
    <template #saveButton>
          <ion-button @click="save">Save</ion-button>
    </template>
    <template #modalContent>
      <ion-list>
        <ion-item>
          <ion-toggle v-model="setting1">Setting 1</ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="setting2">Setting 2</ion-toggle>
        </ion-item>
      </ion-list>
    </template>
  </BaseFullPageModal>
</template>
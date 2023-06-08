<script setup lang="ts">
    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
    import Toolbar from '@/components/Toolbar.vue';

    const props = defineProps({
      title: {
        type: String,
        required: true
      }
    });
</script>

<template>
  <ion-page>
    <Toolbar :title="title" />
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ title }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <slot></slot>
    </ion-content>
  </ion-page>
</template>
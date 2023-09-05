<script setup lang="ts">
    import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/vue';
    
    const props = defineProps({
        title: String,
        subTitle: String,
        content: Boolean,
        img_src: String
    })
</script>

<template>
  <ion-card>
    <img v-if="img_src" :src="img_src" />
    <ion-card-header>
      <ion-card-title v-if="title">{{ title }}</ion-card-title>
      <ion-card-subtitle v-if="subTitle">{{ subTitle }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content v-if="content">
      <slot></slot>
    </ion-card-content>
  </ion-card>
</template>
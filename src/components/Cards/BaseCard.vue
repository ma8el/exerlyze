<script setup lang="ts">
    import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/vue';
    
    const props = defineProps({
        title: String,
        subTitle: String,
        content: Boolean,
    })
</script>

<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title v-if="title">{{ title }}</ion-card-title>
      <ion-card-subtitle v-if="subTitle">{{ subTitle }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content class="ion-margin" v-if="content">
      <slot></slot>
    </ion-card-content>
  </ion-card>
</template>
<script setup lang="ts">
import { IonItem, IonIcon, IonLabel } from '@ionic/vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    subTitle: {
        required: true
    },
    iconSource: {
        type: String,
        required: false
    },
    icon: {
      type: String,
      required: false
    }
  })
</script>

<template>
  <ion-item
    class="exercise-item"
    color="dark"
  >
    <ion-icon
      class="ion-margin-end exercise-icon"
      :src="iconSource ? iconSource : ''"
      :icon="icon ? icon : ''"
    ></ion-icon>
    <ion-label>
      <p class="exercise-paragraph-header">{{ title }}</p>
      <p>{{ subTitle }}</p>
    </ion-label>
  </ion-item>
</template>

<style scoped>
.exercise-item {
  border-radius: 10px;
}
.exercise-icon {
  width: 25px;
  height: 25px;
  color: var(--ion-color-primary);
}
.exercise-paragraph-header {
  font-size: 0.7rem;
  font-weight: bold;
}
</style>
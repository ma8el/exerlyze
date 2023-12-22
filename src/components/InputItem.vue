<script setup lang="ts">
import { IonItem,
       IonLabel,
       IonCol,
       IonIcon} from '@ionic/vue';
import NumericInput from './NumericInput.vue';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  iconSize: {
    type: String,
    default: "20px",
  },
  iconColSize: {
    type: String,
    default: "2",
  },
  slotSize: {
    type: String,
    default: "9",
  },
  labelSize: {
    type: String,
    default: "3",
  },
})

</script>

<template>
  <ion-item lines="none" class="input-item">
    <ion-icon :icon="icon" slot="start" :style="{'width': iconSize, 'heigth': iconSize}"></ion-icon>
    <ion-col :size="slotSize">
        <slot></slot>
    </ion-col>
    <ion-col :size="labelSize">
        <slot name="label"></slot>
    </ion-col>
  </ion-item>
</template>

<style scoped>
.input-item {
  --padding-end: 0;
} 
</style>
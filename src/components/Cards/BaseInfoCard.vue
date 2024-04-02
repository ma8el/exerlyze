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
    },
    fontSize: {
      type: String,
      required: false,
      default: '0.8rem'
    },
    isDark: {
      type: Boolean,
      required: false,
      default: false
    }
  })
</script>

<template>
  <ion-item
    :style="`--background: ${isDark ? 'var(--ion-background-color)' : 'var(--ion-item-background)'};`"
  >
    <ion-icon
      class="ion-margin-end exercise-icon"
      :src="iconSource ? iconSource : ''"
      :icon="icon ? icon : ''"
    ></ion-icon>
    <ion-label>
        <p 
          class="base-info-card-title"
        >
          {{ title }}
        </p>
        <p
          :style="`font-size: ${fontSize};`"
          class="base-info-card-subtitle"
        >
          {{ subTitle }}
        </p>
    </ion-label>
  </ion-item>
</template>

<style scoped>
ion-item {
  --border-radius: 10px;
  --border-width: 0px;
  --border-color: #000;
}
.exercise-icon {
  width: 25px;
  height: 25px;
  color: var(--ion-color-primary);
}
.base-info-card-title {
  font-size: 0.7rem;
  font-weight: bold;
}
</style>
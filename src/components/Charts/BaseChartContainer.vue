<script setup lang="ts">
import { IonLabel, IonSpinner } from '@ionic/vue';

const props = defineProps({
  hasData: {
    type: Boolean,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div :class="hasData ? 'echarts' : 'echarts blurry'">
    <slot ></slot>
  </div>
  <div v-if="!hasData" class="ion-item-container">
    <ion-label class="blurry-background">{{ $t('noData') }}</ion-label>
  </div>
  <div v-if="loading" class="ion-item-container">
    <ion-spinner/>
  </div>
</template>

<style scoped>
.blurry {
  filter: blur(1px)
}
.echarts {
  width: 100%;
  height: 100%;
}
.ion-item-container {
  display: flex;
  justify-content: center;
  position: absolute;
  right: 0%;
  bottom: 40%;
  width: 100%;
}
.blurry-background {
  backdrop-filter: blur(5px);
  background-color: var(--ion-color-primary);
  padding: 10px;
  border-radius: 10px;
  color: white;
}
</style>
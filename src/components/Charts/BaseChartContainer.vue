<script setup lang="ts">
import { IonLabel } from '@ionic/vue';

const props = defineProps({
 hasData: {
    type: Boolean,
    required: true
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
</template>

<style scoped>
.blurry {
  filter: blur(5px)
}
.echarts {
  width: 100%;
  height: 100%;
}
.ion-item-container {
  display: flex;
  justify-content: center;
  position: absolute;
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
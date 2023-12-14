<script setup lang="ts">
import { IonLabel } from '@ionic/vue'
const props = defineProps({
  label: {
    type: String,
    required: true,
  }
});
</script>

<template>
  <div class="line">
    <hr>
    <ion-label class="lbl">{{ label }}</ion-label>
    <hr>
  </div>
</template>

<style scoped>
.line {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  :is(hr) {
      width: 100%;
      height: 1px;
      border-bottom: 1px solid lightgrey;
      margin-bottom: 10px;
      margin-top: 10px;
  }
  .lbl {
      margin: 10px;
  }
}
</style>
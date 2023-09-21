<script setup lang="ts">
  import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
  import { ref } from 'vue';

  const props = defineProps({
    leftSegmentLabel: {
      type: String,
      required: true,
    },
    rightSegmentLabel: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(['leftSegmentSelected', 'rightSegmentSelected'])

  const selectedSegment = ref('left');
</script>

<template>
  <ion-segment :value="selectedSegment">
    <ion-segment-button value="left" @click="emit('leftSegmentSelected')">
      <ion-label>{{ leftSegmentLabel }}</ion-label>
      </ion-segment-button>
      <ion-segment-button value="right" @click="emit('rightSegmentSelected')">
        <ion-label>{{ rightSegmentLabel }}</ion-label>
    </ion-segment-button>
  </ion-segment>
</template>

<style scoped lang="scss">
  ion-segment {
    background: none;

    ion-segment-button {
      --indicator-color: #3F63C8;
      margin: 0 16px 0 16px;
    }
  }
</style>
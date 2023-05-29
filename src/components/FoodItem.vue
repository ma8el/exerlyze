<script setup lang="ts">
  import { IonItem, IonLabel, IonNote, IonAvatar } from '@ionic/vue';

  const props = defineProps({
    foodName: {
      type: String,
      required: true
    },
    calories: {
      type: Number,
      required: true
    },
    foodImage: {
      type: String,
      default: undefined
    }
  })

</script>

<template>
  <ion-item>
    <ion-avatar v-if="foodImage" slot="start">
      <img :src="foodImage" />
    </ion-avatar>
    <ion-label>{{ foodName }}</ion-label>
    <ion-note slot="end">{{ calories }} kcal</ion-note>
  </ion-item>
</template>
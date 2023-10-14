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
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: 'g'
    }
  })
</script>

<template>
  <ion-item>
    <img :src="foodImage" class="product-img" />
    <ion-label>
      <p>{{ foodName }}</p>
      <p>{{ quantity }} {{ unit }}</p>
    </ion-label>
    <ion-note slot="end">{{ calories }} kcal</ion-note>
  </ion-item>
</template>

<style scoped>
.product-img {
  width: 35px;
  height: 35px;
  margin-right: 10px;
}
ion-item {
  border-radius: 10px;
  margin-bottom: 10px;
  p {
    color: white;
  };
  ion-note {
    color: white;
  }
}
</style>
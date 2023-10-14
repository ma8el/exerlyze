<script setup lang="ts">
  import { IonItem, IonLabel, IonNote, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';

  const foodDiaryStore = useFoodDiaryStore()

  const props = defineProps({
    id: {
      type: Number,
      required: true
    },
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

  const deleteFoodItem = () => {
    foodDiaryStore.deleteFoodDiaryEntry(props.id)
  }
</script>

<template>
<ion-item-sliding>
  <ion-item>
    <img :src="foodImage" class="product-img" />
    <ion-label>
      <p>{{ foodName }}</p>
      <p>{{ quantity }} {{ unit }}</p>
    </ion-label>
    <ion-note slot="end">{{ calories }} kcal</ion-note>
  </ion-item>
  <ion-item-options>
    <ion-item-option 
      @click="deleteFoodItem"
      color="secondary"
    >
      Delete
    </ion-item-option>
  </ion-item-options>
</ion-item-sliding>
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
ion-item-sliding {
  border-radius: 10px;
  ion-item-options {
    padding-bottom: 10px;
    border-radius: 10px;
  }
}
</style>
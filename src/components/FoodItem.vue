<script setup lang="ts">
  import { IonItem, 
           IonLabel,
           IonNote,
           IonItemSliding,
           IonItemOptions,
           IonItemOption,
           IonIcon,
           modalController } from '@ionic/vue';
  import { trashOutline, pencilOutline } from 'ionicons/icons';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import useNutritionApi from '@/composables/nutrition';
  import NutritionProductDetailsModal from './Modals/NutritionProductDetailsModal.vue';
  import { ref } from 'vue';

  const foodDiaryStore = useFoodDiaryStore()
  const itemSliderRef = ref<InstanceType<typeof IonItemSliding>>()

  const props = defineProps({
    id: {
      type: String,
      required: true
    },
    foodId: {
      type: String,
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
    if(itemSliderRef.value) {
      itemSliderRef.value.$el.close()
    }
  }

  const modifyFoodItem = async () => {
    const productQuery = await useNutritionApi().getProductById(props.foodId)
    if (productQuery.status === 1) {
      const product = productQuery.product
      const modal = await modalController.create({
        id: 'nutrition-product-details-modal',
        component: NutritionProductDetailsModal,
        componentProps: { product: product, foodDiaryEntryId: props.id },
        cssClass: 'full-screen-modal',
      });
      modal.present();
    }
    if (itemSliderRef.value) {
      itemSliderRef.value.$el.close()
    }
  }
</script>

<template>
<ion-item-sliding ref="itemSliderRef">
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
      @click="modifyFoodItem"
      color="warning"
    >
      <ion-icon slot="icon-only" :icon="pencilOutline"></ion-icon>
    </ion-item-option>
    <ion-item-option 
      @click="deleteFoodItem"
      color="secondary"
      class="last-entry"
    >
      <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
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
  margin-top: 10px;
  :is(p) {
    color: white;
  };
  :is(ion-note) {
    color: white;
  }
}
ion-item-sliding {
  border-radius: 10px;
  :is(ion-item-options) {
    margin-left: 0;
    margin-top: 10px;
  }
  :is(ion-icon) {
    margin-bottom: 10px;
    width: 25px;
    height: 25px;
  }
}

.last-entry {
  border-radius: 0 10px 10px 0;
}
</style>
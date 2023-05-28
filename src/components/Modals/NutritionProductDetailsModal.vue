<script setup lang="ts">
  import { IonImg,
           IonCard,
           IonCardHeader,
           IonCardContent,
           IonCardTitle,
           IonLabel,
           IonIcon,
           IonRow,
           IonList,
           IonItem,
           IonCol,
           modalController } from '@ionic/vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import AddNutrimentModal from './AddNutrimentModal.vue';
  import NutrimentRow from '../NutrimentRow.vue';
  import { FilteredNutritionApiProduct } from '@/types/nutrition';
  import { PropType } from 'vue';
  import { addCircleOutline } from 'ionicons/icons';
  import { nutritionDetails } from '@/helpers/nutrition';

  const props = defineProps({
    product: {
        type: Object as PropType<FilteredNutritionApiProduct>,
        required: true
    }
  })

  const openAddNutrimentModal = async (product: FilteredNutritionApiProduct) => {
    const modal = await modalController.create({
      component: AddNutrimentModal,
      componentProps: { product: product },
      breakpoints: [0, 0.3],
      initialBreakpoint: 0.3
    });
    modal.present();
  }
</script>

<template>
  <BaseFullPageModal title="Add Nutrition">
    <template #modalContent>
      <ion-img
        :src="product.image_front_url"
        alt="product image"
      >
      </ion-img>
      <ion-card
        :button="true"
        @click="openAddNutrimentModal(product)"
      >
        <ion-card-header>
          <ion-row>
            <ion-col size="10">
            <ion-card-title>{{ product.product_name }}</ion-card-title>
            </ion-col>
            <ion-col size="2">
              <ion-icon size="large" :icon="addCircleOutline"></ion-icon>
            </ion-col>
          </ion-row>
        </ion-card-header>
        <ion-card-content>
          <NutrimentRow
            :calories="product.nutriments['energy-kcal_100g']"
            :carbs="product.nutriments.carbohydrates_100g"
            :protein="product.nutriments.proteins_100g"
            :fat="product.nutriments.fat_100g"
          />
        </ion-card-content>
      </ion-card>
      <ion-card
        class="ion-padding-bottom"
      >
        <ion-item>
            <ion-label>Nutriments (per 100g)</ion-label>
        </ion-item>
        <ion-list
          v-for="(detail, index) in nutritionDetails"
          :key="index"
        >
        <ion-item>
          <ion-label>{{ detail.name }}</ion-label>
          <ion-label slot="end">{{ product.nutriments[detail.value] }} {{ product.nutriments[detail.unit] }}</ion-label>
        </ion-item>
        </ion-list>
      </ion-card>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
  ion-img {
      width: 100%;
      height: 40%;
      object-fit: cover;
      border-radius: 50px;
  }
</style>
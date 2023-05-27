<script setup lang="ts">
  import { IonButton,
           IonList,
           IonSpinner,
           IonLabel,
           IonThumbnail,
           IonInput,
           IonItem } from '@ionic/vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import useNutritionApi from '@/composables/nutrition';
  import { ref } from 'vue';
  import { NutritionApiSearchResponse, FilteredNutritionApiProduct } from '@/types/nutrition';

  const loading = ref(false);
  const products = ref<FilteredNutritionApiProduct[]>();

  const save = () => {
        console.log('save')
  }

  const queryProduct = (e: any) => {
    const searchedProduct: string = e.target.value;
    products.value = [];
    loading.value = true;
    useNutritionApi().searchProduct(searchedProduct).then((res) => {
      const data: NutritionApiSearchResponse = res;
      products.value = data.products;
      loading.value = false;
    })
  }
</script>

<template>
  <BaseFullPageModal title="Add Nutrition">
    <template #saveButton>
      <ion-button @click="save">Save</ion-button>
    </template>
    <template #modalContent>
      <ion-list>
        <ion-item>
          <ion-input 
            placeholder="Product name"
            label="Search for a product"
            labelPlacement="stacked"
            @ionBlur="queryProduct"
          >
          </ion-input>
        </ion-item>
      </ion-list>
      <ion-list
        class="ion-padding ion-text-center"
        v-if="loading"
      >
        <ion-spinner/>
      </ion-list>
      <ion-list
        v-else
      >
        <ion-item
          v-for="(product, index) in products"
          :key="index"
        >
          <ion-thumbnail slot="start">
            <img :src="product.image_front_thumb_url" />
          </ion-thumbnail>
          <ion-label>
            {{ product.product_name }}
          </ion-label>
        </ion-item>
      </ion-list>
    </template> 
  </BaseFullPageModal>
</template>
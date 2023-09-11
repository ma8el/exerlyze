<script setup lang="ts">
  import { IonList,
           IonSpinner,
           IonLabel,
           IonAvatar,
           IonSearchbar,
           IonItem,
           modalController } from '@ionic/vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import NutritionProductDetailsModal from './NutritionProductDetailsModal.vue';
  import useNutritionApi from '@/composables/nutrition';
  import { ref } from 'vue';
  import { NutritionApiSearchResponse, FilteredNutritionApiProduct } from '@/types/nutrition';
  import { useFoodDiaryStore } from '@/store/foodDiary';

  const loading = ref(false);
  const products = ref<FilteredNutritionApiProduct[]>();

  const queryProducts = (e: any) => {
    const searchedProduct: string = e.target.value;
    products.value = [];
    loading.value = true;
    useNutritionApi().searchProduct(searchedProduct).then((res) => {
      const data: NutritionApiSearchResponse = res;
      products.value = data.products;
      loading.value = false;
    })
  }

  const removeProducts = () => {
    products.value = [];
  }

  const openProductModal = async (product: FilteredNutritionApiProduct) => {
    const modal = await modalController.create({
      id: 'nutrition-product-details-modal',
      component: NutritionProductDetailsModal,
      componentProps: { product: product },
      cssClass: 'full-screen-modal',
    });
    modal.present();
  }
</script>

<template>
  <BaseFullPageModal :save-button="false">
    <template #modalHeader>
      <p class="header-title">{{ $t('nutrition.addNutrition') }}</p>
    </template>
    <template #modalContent>
      <ion-list>
        <ion-item>
          <ion-searchbar 
            :placeholder="$t('nutrition.productName')"
            @ionChange="queryProducts"
            @ionInput="queryProducts"
            @ionClear="removeProducts"
          >
          </ion-searchbar>
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
          @click="openProductModal(product)"
        >
          <ion-avatar slot="start">
            <img :src="product.image_front_thumb_url" />
          </ion-avatar>
          <ion-label>
            {{ product.product_name }}
          </ion-label>
        </ion-item>
      </ion-list>
    </template> 
  </BaseFullPageModal>
</template>

<style scoped>
  .header-title {
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
  }
</style>
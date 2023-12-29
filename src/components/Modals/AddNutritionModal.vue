<script setup lang="ts">
  import { IonList,
           IonSpinner,
           IonLabel,
           IonAvatar,
           IonSearchbar,
           IonItem,
           IonButton,
           IonIcon,
           IonRow,
           IonCol,
           IonText,
           alertController,
           isPlatform,
           modalController } from '@ionic/vue';
  import { barcodeOutline, warningOutline } from 'ionicons/icons';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import NutritionProductDetailsModal from './NutritionProductDetailsModal.vue';
  import useNutritionApi from '@/composables/nutrition';
  import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
  import { ref, onMounted, computed } from 'vue';
  import { NutritionApiSearchResponse, FilteredNutritionApiProduct } from '@/types/nutrition';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const loading = ref<boolean>(false);
  const displayedInput = ref<string>('');
  const supported = ref<boolean>(false);
  const barcode = ref<Barcode>();
  const products = ref<FilteredNutritionApiProduct[]>([]);
  const warnMessage = ref<string>('');

  const rawBarcode = computed(() => {
    const assignedBarcode = barcode.value?.rawValue;
    return assignedBarcode ? assignedBarcode : '';
  })

  const queryProducts = (e: any) => {
    displayedInput.value = e.target.value;
    const searchedProduct: string = e.target.value;

    products.value = [];
    warnMessage.value = '';
    loading.value = true;
    useNutritionApi().searchProduct(searchedProduct).then((res) => {
      if (res.error) {
        loading.value = false;
        warnMessage.value = t('nutrition.networkTimeout');
        return;
      } else if (res.count === 0) {
        loading.value = false;
        warnMessage.value = t('nutrition.noProductsFound');
        return;
      }
      const data: NutritionApiSearchResponse = res;
      products.value = data.products;
      loading.value = false;
    })
  }

  const removeProducts = () => {
    displayedInput.value = '';
    warnMessage.value = '';
    products.value = [];
  }

  const requestPermissions = async () => {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  const presentAlert = async (message: string) => {
    const alert = await alertController.create({
      header: 'Warning',
      message: message,
      buttons: ['Action'],
    });
    await alert.present();
  }

  const scanBarcode = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      presentAlert('Unsufficent permissions');
      return;
    }
    removeProducts();
    loading.value = true;

    const { barcodes } = await BarcodeScanner.scan();
    barcode.value = barcodes[0];
    displayedInput.value = rawBarcode.value;
    const queriedProduct = await useNutritionApi().getProductByBarcode(rawBarcode.value)
    if (queriedProduct.status !== 1) {
      warnMessage.value = t('nutrition.noProductsFound');
      loading.value = false;
      return;
    }
    products.value.push(queriedProduct.product);
    loading.value = false;
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

  onMounted (async () => {
    try {
      const isSupported = await BarcodeScanner.isSupported()
      if (!isSupported.supported) {
        supported.value = false;
        presentAlert('Barcode scanner is not supported on this platform');
      } else {
        supported.value = true;
      }
    } catch (error) {
      supported.value = false;
    }
    if (isPlatform('android')) {
      const barcodeScannerAvailable = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
      if (!barcodeScannerAvailable.available) {
        await BarcodeScanner.installGoogleBarcodeScannerModule();
      }
    }
  })
</script>

<template>
  <BaseFullPageModal :save-button="false">
    <template #modalHeader>
      <p class="header-title">{{ $t('nutrition.addNutrition') }}</p>
    </template>
    <template #modalContent>
      <ion-item>
        <ion-col size="10">
        <ion-searchbar 
          :placeholder="$t('nutrition.productName')"
          :debounce="500"
          :value="displayedInput"
          @ionInput="queryProducts"
          @ionClear="removeProducts"
        >
        </ion-searchbar>
        </ion-col>
        <ion-col
          size="2"
        >
        <ion-button
          class="barcode-button"
          fill="clear"
          @click="scanBarcode()"
          :disabled="!supported"
        >
          <ion-icon :icon="barcodeOutline"/>
        </ion-button>
        </ion-col>
      </ion-item>
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

      <ion-row
        v-if="warnMessage !== ''"
        class="ion-justify-content-center ion-align-items-center error-message-container"
      >
        <ion-text>
          <ion-icon :icon="warningOutline"></ion-icon>
            {{ warnMessage }}
        </ion-text>
      </ion-row>

    </template> 
  </BaseFullPageModal>
</template>

<style scoped>
  .error-message-container {
    height: 50vh;
    display: flex;
    flex-direction: column;
    :is(ion-text) {
      color: #888888;
      text-align: center;
    }
    :is(ion-icon) {
      margin-right: 1px;
    }
  }
  .barcode-button {
    --color: white;
    :is(ion-icon) {
      width: 30px;
      height: 30px;
    }
  }
  .header-title {
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
  }
</style>
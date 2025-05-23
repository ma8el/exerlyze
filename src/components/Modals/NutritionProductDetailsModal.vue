<script setup lang="ts">
  import { IonImg,
           IonButton,
           IonCardContent,
           IonLabel,
           IonList,
           IonItem,
           IonRow,
           IonCol,
           IonThumbnail,
           modalController } from '@ionic/vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import AddNutrimentModal from './AddNutrimentModal.vue';
  import BaseCard from '../Cards/BaseCard.vue';
  import BurnIcon from '@/icons/burn.vue';
  import CarbsIcon from '@/icons/carbs.vue';
  import ProteinIcon from '@/icons/protein.vue';
  import FatIcon from '@/icons/fat.vue';
  import { FilteredNutritionApiProduct } from '@/types/nutrition';
  import { ref, computed, PropType, onMounted } from 'vue';
  import { nutritionDetails, stringToFixedDigits } from '@/helpers/nutrition';
  import { defaultImage } from '@/composables/supabase';
  import { useUserSettingsStore } from '@/store/userSettingsStore';

  const props = defineProps({
    product: {
        type: Object as PropType<FilteredNutritionApiProduct>,
        required: true
    },
    foodDiaryEntryId: {
        type: String,
        required: false,
        default: undefined
    }
  })

  const userSettingsStore = useUserSettingsStore()
  const locale = ref<string | undefined>(userSettingsStore.getLocale())

  const titleColSize = computed(() => {
    if (locale.value === 'en') {
      return '9'
    } else if(locale.value === 'de') {
      return '8'
    } else if (locale.value === 'fr') {
      return '8'
    } else {
      return '8'
    }
  })

  const titleEndColSize = computed(() => {
    if (locale.value === 'en') {
      return '3'
    } else if(locale.value === 'de') {
      return '4'
    } else if (locale.value === 'fr') {
      return '4'
    } else {
      return '4'
    }
  })

  const createModal = async () => {
    const modal = await modalController.create({
      component: AddNutrimentModal,
      componentProps: { product: props.product, foodDiaryEntryId: props.foodDiaryEntryId },
      breakpoints: [0, 0.5],
      initialBreakpoint: 0.5
    });
    return modal;
  }

  const openAddNutrimentModal = async () => {
    const modal = await createModal();
    modal.present();
  }

  onMounted(async () => {
    if (props.foodDiaryEntryId) {
      const modal = await createModal();
      modal.present();
    }
  })
</script>

<template>
  <BaseFullPageModal :saveButton="false" backColor="dark">
    <template #modalHeader>
      <ion-img
        :src="product.image_front_url ? product.image_front_url : defaultImage"
        alt="product image"
      >
    </ion-img>
    </template>
    <template #modalContent>
      <BaseCard
        :title="product.product_name"
        :title-col-size="titleColSize"
        title-end-col-offset="0"
        :title-end-col-size="titleEndColSize"
        title-size="1.5rem"
        :content="true"
        class="nutrition-overview-card ion-no-margin"
      >
        <template #titleEnd>
          <ion-button fill="clear" size="small" @click="openAddNutrimentModal()">
            <ion-label v-if="foodDiaryEntryId === undefined" class="nutrition-add-item">+ {{ $t('add') }}</ion-label>
            <ion-label v-else class="nutrition-add-item">+ {{ $t('update') }}</ion-label>
          </ion-button>
        </template>
 
        <ion-card-content class="nutrition-overview-content">
          <ion-row>
            <ion-col size="6">
              <ion-item>
                <ion-thumbnail>
                  <div class="nutrition-thumb">
                    <BurnIcon color="white" class="iconComponent"/>
                  </div>
                </ion-thumbnail>
                <ion-label>
                <p>{{ $t('nutrition.calories') }}</p>
                <p class="nutrition-value">{{ stringToFixedDigits(product.nutriments['energy-kcal_100g'], 2) }} kcal</p>
                </ion-label>
              </ion-item>
            </ion-col>
 
            <ion-col size="6">
              <ion-item>
                <ion-thumbnail>
                  <div class="nutrition-thumb">
                    <CarbsIcon color="white" class="iconComponent"/>
                  </div>
                </ion-thumbnail>
                <ion-label>
                  <p>{{ $t('nutrition.carbs') }}</p>
                  <p class="nutrition-value">{{ stringToFixedDigits(product.nutriments.carbohydrates_100g, 2) }} g</p>
                </ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">
              <ion-item>
                <ion-thumbnail>
                  <div class="nutrition-thumb">
                    <ProteinIcon color="white" class="iconComponent"/>
                  </div>
                </ion-thumbnail>
                <ion-label>
                  <p>{{ $t('nutrition.protein') }}</p>
                  <p class="nutrition-value">{{ stringToFixedDigits(product.nutriments.proteins_100g, 2) }} g</p>
                </ion-label>
              </ion-item>
            </ion-col>
            <ion-col size="6">
              <ion-item>
                <ion-thumbnail>
                  <div class="nutrition-thumb">
                    <FatIcon color="white" class="iconComponent"/>
                  </div>
                </ion-thumbnail>
                <ion-label>
                  <p>{{ $t('nutrition.fat') }}</p>
                  <p class="nutrition-value">{{ stringToFixedDigits(product.nutriments.fat_100g, 2) }} g</p>
                </ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </BaseCard>

      <BaseCard
        :title="$t('nutrition.nutriments')"
        title-col-size="8"
        title-end-col-offset="1"
        title-end-col-size="3"
        :content="true"
        class="nutrition-overview-card ion-no-margin"
      >
        <template #titleEnd>
          <ion-label class="nutrition-list-title-end">{{ $t('per') }} {{ $t('weightUnitSmall', 100) }}</ion-label>
        </template>
        <ion-list
          v-for="(detail, index) in nutritionDetails"
          :key="index"
          lines="none"
          class="nutrition-list"
        >
          <ion-item class="nutrition-list-item">
            <ion-label slot="start">{{ $t(`nutrition.${detail.name.toLowerCase()}`) }}</ion-label>
            <ion-label class="nutrition-list-item-label" slot="end">{{ stringToFixedDigits(product.nutriments[detail.value], 2) }} {{ product.nutriments[detail.unit] ? product.nutriments[detail.unit]: 'g' }}</ion-label>
          </ion-item>
        </ion-list>
      </BaseCard>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
  ion-img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }
  .nutrition-overview-card {
    --background: none;
  }
  .nutrition-overview-content {
    padding: 0;
  }
  .nutrition-list {
    margin: 0;
    background: none;
  }
  .nutrition-list-item {
    border-radius: 10px;
    margin: 10px 0 0 0;
  }
  ion-item.nutrition-list-item .nutrition-list-item-label {
    flex-grow: 0 !important;
  }
  .nutrition-list-item.md {
    border-radius: 10px;
    margin: 0;
  }
  .nutrition-list-title-end {
    color: var(--ion-color-primary);
    display: flex;
    justify-content: flex-end;
  }
  .nutrition-add-item {
    font-size: 0.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    justify-content: flex-end;
  }
  .nutrition-thumb {
    background: var(--ion-color-primary-tint);
    border-radius: 20%;
    width: 80%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px 0 0 0;
    padding: 0;
    :is(img) {
      width: 70%;
      height: 70%;
    }
  }

  ion-item {
    color: none;
    border-radius: 10px;
    margin: 0;
    padding: 0;
    :is(ion-label) {
      margin: 0;
      padding: 0;
      :is(p) {
        margin: 0;
        padding: 0;
        color: white;
      }
    }
 }
 .nutrition-value {
   font-size: 1rem;
   font-weight: bold;
 }
 .iconComponent {
   width: 70%;
   height: 70%;
 }
</style>
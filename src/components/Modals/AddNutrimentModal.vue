<script setup lang="ts">
    import { IonButton, 
             IonContent,
             IonCard,
             IonDatetimeButton,
             IonDatetime,
             IonModal,
             IonIcon,
             IonItem,
             modalController } from '@ionic/vue';
    import { addOutline, calendarOutline } from 'ionicons/icons';
    import { FilteredNutritionApiProduct } from '@/types/nutrition';
    import { PropType, ref, computed, onMounted } from 'vue';
    import NutrimentRow from '../NutrimentRow.vue';
    import NumericInput from '../NumericInput.vue';
    import { calcNuritionPer100g } from '@/helpers/nutrition';
    import { useFoodDiaryStore } from '@/store/foodDiary';
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

    const amount = ref<string>("0")
    const foodDiaryStore = useFoodDiaryStore()
    const userSettingsStore = useUserSettingsStore()

    const locale = userSettingsStore.getLocale()

    const inputDate = ref<string>(new Date().toISOString())
    const amountValid = ref<boolean>(true)

    const addNutriment = async () => {
        foodDiaryStore.addFoodDiaryEntry({
            id: foodDiaryStore.getUniqueId(),
            created_at: new Date(inputDate.value),
            food_id: props.product._id,
            food_name: props.product.product_name,
            quantity: parseInt(amount.value),
            unit: "g",
            calories: Math.round(calories.value),
            carbohydrates: Math.round(carbs.value),
            protein: Math.round(protein.value),
            fat: Math.round(fat.value),
            fiber: Math.round(fiber.value),
            sugar: Math.round(sugar.value),
            salt: Math.round(salt.value),
            sodium: Math.round(sodium.value),
            image_front_thumb_url: props.product.image_front_thumb_url,
            deleted: false
        })
        modalController.dismiss()
        modalController.dismiss(null, "dismiss", "nutrition-product-details-modal")
    }

    const updateNutriment = async () => {
      if (!props.foodDiaryEntryId) {
        return
      }
        foodDiaryStore.updateFoodDiaryEntry({
            id: props.foodDiaryEntryId,
            created_at: new Date(inputDate.value),
            food_id: props.product._id,
            food_name: props.product.product_name,
            quantity: parseInt(amount.value),
            unit: "g",
            calories: Math.round(calories.value),
            carbohydrates: Math.round(carbs.value),
            protein: Math.round(protein.value),
            fat: Math.round(fat.value),
            fiber: Math.round(fiber.value),
            sugar: Math.round(sugar.value),
            salt: Math.round(salt.value),
            sodium: Math.round(sodium.value),
            image_front_thumb_url: props.product.image_front_thumb_url,
            deleted: false
        })
        modalController.dismiss()
        modalController.dismiss(null, "dismiss", "nutrition-product-details-modal")
    }

    const calories = computed(() => {
        return calcNuritionPer100g(amount.value, props.product.nutriments['energy-kcal_100g'])
    })

    const fat = computed(() => {
        return calcNuritionPer100g(amount.value, props.product.nutriments.fat_100g)
    })
    
    const carbs = computed(() => {
        return calcNuritionPer100g(amount.value, props.product.nutriments.carbohydrates_100g)
    })

    const protein = computed(() => {
        return calcNuritionPer100g(amount.value, props.product.nutriments.proteins_100g)
    })

    const salt = computed(() => {
        return calcNuritionPer100g(amount.value, props.product.nutriments.salt_100g)
    })

    const sugar = computed(() => {
        return calcNuritionPer100g(amount.value, props.product.nutriments.sugars_100g)
    })

    const fiber = computed(() => {
        return calcNuritionPer100g(amount.value, props.product.nutriments.fiber_100g)
    })
    
    const sodium = computed(() => {
        return calcNuritionPer100g(amount.value, props.product.nutriments.sodium_100g)
    })

    onMounted(() => {
        if (props.foodDiaryEntryId) {
            const foodDiaryEntry = foodDiaryStore.getFoodDiaryEntryById(props.foodDiaryEntryId)
            if (!foodDiaryEntry) {
                return
            }
            amount.value = foodDiaryEntry.quantity.toString()
            inputDate.value = new Date(foodDiaryEntry.created_at).toISOString()
        }
    })
</script>

<template>
  <ion-content>
    <ion-card>
     <NumericInput
        :label="$t('nutrition.amount') + ' (' + $t('weightUnitSmall') + '):'"
        :placeholder="$t('nutrition.amount')"
        :inputValue="Number(amount)"
        :minValue="1"
        :maxValue="1000"
        @update:input-value="amount = $event"
        @update:valid="amountValid = $event"
      />

      <ion-item class="weight-item" lines="none">
        <ion-icon :icon="calendarOutline" slot="start"></ion-icon>
        <ion-datetime-button 
          datetime="datetime"
          slot="end"
        />
        <ion-modal :keep-contents-mounted="true">
          <ion-datetime
            id="datetime"
            v-model="inputDate"
            :locale="locale"
          />
        </ion-modal>
      </ion-item>
      <NutrimentRow
        :calories="calories"
        :carbs="carbs"
        :protein="protein"
        :fat="fat"
      />
      <ion-button v-if="foodDiaryEntryId !== undefined" @click="updateNutriment" :disabled="!amountValid">
        <ion-icon :icon="addOutline"></ion-icon>
        {{ $t('update') }}
      </ion-button>
      <ion-button v-else @click="addNutriment" :disabled="!amountValid">
        <ion-icon :icon="addOutline"></ion-icon>
        {{ $t('add') }}
      </ion-button>
    </ion-card>
 </ion-content>
</template>

<style scoped lang="scss">
  ion-card {
    --background: none;
    --color: none;
  }
  ion-button {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .weight-item {
    --padding-start: 0;
    --padding-end: 0;
    --background: none;
  }

</style>
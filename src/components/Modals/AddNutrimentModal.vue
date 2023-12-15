<script setup lang="ts">
    import { IonButton, IonContent, IonCard, IonInput, IonIcon, modalController } from '@ionic/vue';
    import { addOutline } from 'ionicons/icons';
    import { FilteredNutritionApiProduct } from '@/types/nutrition';
    import { PropType, ref, computed } from 'vue';
    import NutrimentRow from '../NutrimentRow.vue';
    import NumericInput from '../NumericInput.vue';
    import { calcNuritionPer100g } from '@/helpers/nutrition';
    import { useFoodDiaryStore } from '@/store/foodDiary';

    const props = defineProps({
        product: {
            type: Object as PropType<FilteredNutritionApiProduct>,
            required: true
        }
    })

    const amount = ref<number>(0)
    const foodDiaryStore = useFoodDiaryStore()

    const amountValid = ref<boolean>(true)

    const addNutriment = async () => {
        foodDiaryStore.addFoodDiaryEntry({
            id: foodDiaryStore.getUniqueId(),
            created_at: new Date(),
            food_id: props.product._id,
            food_name: props.product.product_name,
            quantity: amount.value,
            unit: "g",
            calories: parseInt(calories.value),
            carbohydrates: parseInt(carbs.value),
            protein: parseInt(protein.value),
            fat: parseInt(fat.value),
            fiber: parseInt(fiber.value),
            sugar: parseInt(sugar.value),
            salt: parseInt(salt.value),
            sodium: parseInt(sodium.value),
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
</script>

<template>
  <ion-content>
    <ion-card>
     <NumericInput
        :label="$t('nutrition.amount') + ' (' + $t('weightUnitSmall') + '):'"
        :placeholder="$t('nutrition.amount')"
        :inputValue="amount"
        :minValue="0"
        :maxValue="1000"
        @update:input-value="amount = $event"
        @update:valid="amountValid = $event"
      />
      <NutrimentRow
        :calories="calories"
        :carbs="carbs"
        :protein="protein"
        :fat="fat"
      />
      <ion-button @click="addNutriment" :disabled="!amountValid">
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

</style>
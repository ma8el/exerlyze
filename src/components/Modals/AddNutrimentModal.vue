<script setup lang="ts">
    import { IonButton, IonContent, IonCard, IonInput, IonIcon, modalController } from '@ionic/vue';
    import { addCircleOutline, calculator } from 'ionicons/icons';
    import { FilteredNutritionApiProduct } from '@/types/nutrition';
    import { PropType, ref, computed } from 'vue';
    import NutrimentRow from '../NutrimentRow.vue';
    import { calcNuritionPer100g } from '@/helpers/nutrition';
    import { useFoodDiaryStore } from '@/store/foodDiary';

    const props = defineProps({
        product: {
            type: Object as PropType<FilteredNutritionApiProduct>,
            required: true
        }
    })

    const amount = ref(0)
    const foodDiaryStore = useFoodDiaryStore()

    const addNutriment = () => {
        const foodDiary = foodDiaryStore.getFoodDiary
        if (!foodDiary) {
            foodDiaryStore.createFoodDiary("1")
        }
        foodDiaryStore.addFoodDiaryEntry({
            id: foodDiaryStore.getNewFoodDiaryEntryId,
            foodDiaryId: foodDiary.id,
            createdAt: new Date(),
            foodId: props.product._id,
            foodName: props.product.product_name,
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
      <ion-input
        type="number"
        :placeholder="$t('nutrition.amount')"
        :clear-on-edit="true"
        v-model="amount"
      >
        {{ $t('nutrition.amount') }} ({{ $t('weightUnitSmall') }})
      </ion-input>
      <NutrimentRow
        :calories="calories"
        :carbs="carbs"
        :protein="protein"
        :fat="fat"
      />
      <ion-button
        expand="block"
        size="small"
        @click="addNutriment"
      >
        <ion-icon :icon="addCircleOutline"></ion-icon>
        {{ $t('add') }}
      </ion-button>
    </ion-card>
 </ion-content>
</template>
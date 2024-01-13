<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { IonButton, IonIcon, IonItem, IonSelect, IonSelectOption } from '@ionic/vue'
import { chevronForward, flagOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import NumericInput from '@/components/NumericInput.vue';
import Line from '@/components/Line.vue';
import { NutritionGoal } from '@/types/nutrition.enums';
import { useFoodDiaryStore } from '@/store/foodDiary';
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
    buttonLabel: {
        type: String,
        required: true,
    },
    saveRedirectPath: {
        type: String,
        required: false,
        default: '/complete-diet-profile',
    },
});

const router = useRouter();
const foodDiaryStore = useFoodDiaryStore();

const calories = ref<number>(0)
const carbs = ref<number>(0)
const protein = ref<number>(0)
const fat = ref<number>(0)

const selectedNutritionGoal = ref<NutritionGoal>(NutritionGoal.StayFit)

const caloriesValid = ref<boolean>(true)
const carbsValid = ref<boolean>(true)
const proteinValid = ref<boolean>(true)
const fatValid = ref<boolean>(true)

const deactivateButton = computed<boolean>(() => {
  return !caloriesValid.value || !carbsValid.value || !proteinValid.value || !fatValid.value
})

const setNutritionGoal = (value: NutritionGoal) => {
  if (value == NutritionGoal.LoseWeight){
    calories.value = foodDiaryStore.dailyCalories - 300
  } else if (value == NutritionGoal.GainMuscle){
    calories.value = foodDiaryStore.dailyCalories + 300
  } else if (value == NutritionGoal.StayFit){
    calories.value = foodDiaryStore.dailyCalories
  }
}

const next = () => {
    foodDiaryStore.addDailyNutritionGoal({
      id: uuidv4(),
      created_at: new Date(),
      daily_calories: calories.value,
      daily_carbs: carbs.value,
      daily_protein: protein.value,
      daily_fat: fat.value,
      nutrition_goal: selectedNutritionGoal.value,
    })
    router.push('/tabs/home');
}

const updateMacros = () => {
  const newMacros = foodDiaryStore.calculateBaseMacros(calories.value)
  carbs.value = newMacros.carbs
  protein.value = newMacros.protein
  fat.value = newMacros.fat
}

const updateCalories = () => {
  const newCalories = foodDiaryStore.calculateCalories(carbs.value, protein.value, fat.value)
  calories.value = newCalories
}

onMounted(() => {
  calories.value = foodDiaryStore.dailyCalories
  carbs.value = foodDiaryStore.dailyCarbs
  protein.value = foodDiaryStore.dailyProtein
  fat.value = foodDiaryStore.dailyFat
})
</script>

<template>
  <ion-item lines="none">
    <ion-icon :icon="flagOutline" color="primary" style="margin-right: 10px"></ion-icon>
    <ion-select 
      :label="$t('settings.goal')"
      :placeholder="$t('settings.goal')"
      v-model="selectedNutritionGoal"
      @ionChange="setNutritionGoal($event.detail.value)"
    >
      <ion-select-option :value="NutritionGoal.LoseWeight">{{ $t('settings.loseWeight') }}</ion-select-option>
      <ion-select-option :value="NutritionGoal.GainMuscle">{{ $t('settings.gainMuscle') }}</ion-select-option>
      <ion-select-option :value="NutritionGoal.StayFit">{{ $t('settings.stayFit') }}</ion-select-option>
    </ion-select>
  </ion-item>
  <Line
    :label="$t('or')"
  />
  <div class="nutrition-values">
    <ion-item>
      <NumericInput
        :label="$t('nutrition.calories')"
        :maxValue="9999"
        v-model:input-value="calories"
        @update:valid="caloriesValid = $event"
        @ion-blur="updateMacros()"
      />
      <ion-button expand="block" slot="end" shape="round" color="primary">
        {{ $t('calUnit') }} 
      </ion-button>
    </ion-item>
    <ion-item>
      <NumericInput
        :label="$t('nutrition.carbs')"
        :maxValue="999"
        v-model:input-value="carbs"
        @update:valid="carbsValid = $event"
        @ion-blur="updateCalories()"
      />
      <ion-button expand="block" slot="end" shape="round" color="primary">
        {{ $t('weightUnitSmall') }} 
      </ion-button>
    </ion-item>
    <ion-item>
      <NumericInput
        :label="$t('nutrition.protein')"
        :maxValue="999"
        v-model:input-value="protein"
        @update:valid="proteinValid = $event"
        @ion-blur="updateCalories()"
      />
       <ion-button expand="block" slot="end" shape="round" color="primary">
          {{ $t('weightUnitSmall') }} 
        </ion-button>
    </ion-item>
    <ion-item>
      <NumericInput
        :label="$t('nutrition.fat')"
        :maxValue="999"
        v-model:input-value="fat"
        @update:valid="fatValid = $event"
        @ion-blur="updateCalories()"
      />
       <ion-button expand="block" slot="end" shape="round" color="primary">
          {{ $t('weightUnitSmall') }} 
        </ion-button>
    </ion-item>
  </div>
    <ion-button
      expand="block"
      color="primary"
      @click="next()"
      :disabled="deactivateButton"
    >
      {{ buttonLabel }}
      <ion-icon :src="chevronForward" style="margin-left: 10px;"></ion-icon>
    </ion-button>
</template>

<style scoped lang="scss">
ion-item {
  border-radius: 10px;
}
.nutrition-values {
  margin-bottom: 16px;
}
.nutrition-values ion-button {
    margin: 20px 0 0 10px;
    --padding-start: 10px;
    --padding-end: 10px;
}
</style>
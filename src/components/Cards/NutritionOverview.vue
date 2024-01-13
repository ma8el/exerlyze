<script setup lang="ts">
  import { IonList, IonItem, IonLabel, IonNote, IonThumbnail } from '@ionic/vue';
  import BaseCard from './BaseCard.vue';
  import BurnIcon from '@/icons/burn.vue';
  import CarbsIcon from '@/icons/carbs.vue';
  import ProteinIcon from '@/icons/protein.vue';
  import FatIcon from '@/icons/fat.vue';
  import { ref, computed, inject, watch, onMounted, Ref } from 'vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import { selectedDateKey }  from '@/keys';

  const selectedDate = inject<Ref<Date>>(selectedDateKey, ref(new Date(new Date().setHours(0, 0, 0, 0))))

  const foodDiaryStore = useFoodDiaryStore();

  const loading = ref(true);

  const calories = ref(0);
  const carbs = ref(0);
  const protein = ref(0);
  const fat = ref(0);

  const update = async () => {
    loading.value = true;
    const nutritionGoal = await foodDiaryStore.getNutritionGoalOfDate(selectedDate.value);
    calories.value = nutritionGoal.daily_calories;
    carbs.value = nutritionGoal.daily_carbs;
    protein.value = nutritionGoal.daily_protein;
    fat.value = nutritionGoal.daily_fat;
    loading.value = false;
  }

  const intake = computed(() => {
    if (!selectedDate) {
      return 0;
    }
    return foodDiaryStore.getCaloriesOfDate(selectedDate.value);
  })

  const intakeCarbs = computed(() => {
    if (!selectedDate) {
      return 0;
    }
    return foodDiaryStore.getCarbohydratesOfDate(selectedDate.value);
  })

  const intakeFat = computed(() => {
    if (!selectedDate) {
      return 0;
    }
    return foodDiaryStore.getFatOfDate(selectedDate.value);
  })

  const intakeProtein = computed(() => {
    if (!selectedDate) {
      return 0;
    }
    return foodDiaryStore.getProteinOfDate(selectedDate.value);
  })

  watch(selectedDate, () => {
    update();
  })

  onMounted(async () => {
    await update();
  })
</script>

<template>
  <BaseCard
    :title="$t('nutrition.nutritionOverview')"
    :content="true"
    class="nutrition-overview-card ion-no-margin"
  >
    <ion-list class="nutrition-list" lines="none">
      <ion-item>
        <ion-thumbnail slot="start">
          <div class="nutrition-thumb">
            <!--<img :src="BurnIcon" /> -->
            <BurnIcon color="white" class="iconComponent"/>
          </div>
        </ion-thumbnail>
        <ion-label>{{ $t('nutrition.calories') }}</ion-label>
        <ion-note slot="end">{{ intake }} / {{ calories }}</ion-note>
      </ion-item>
      <ion-item>
        <ion-thumbnail slot="start">
          <div class="nutrition-thumb">
            <CarbsIcon color="white" class="iconComponent"/>
          </div>
        </ion-thumbnail>
        <ion-label>{{ $t('nutrition.carbohydrates') }}</ion-label>
        <ion-note slot="end">{{ intakeCarbs }} g / {{ carbs }} g</ion-note>
      </ion-item>
      <ion-item>
         <ion-thumbnail slot="start">
          <div class="nutrition-thumb">
            <ProteinIcon color="white" class="iconComponent" />
          </div>
        </ion-thumbnail>
        <ion-label>{{ $t('nutrition.protein') }}</ion-label>
        <ion-note slot="end">{{ intakeProtein }} g / {{ protein }} g</ion-note>
      </ion-item>
      <ion-item>
        <ion-thumbnail slot="start">
          <div class="nutrition-thumb">
            <FatIcon color="white" class="iconComponent"/>
          </div>
        </ion-thumbnail>
        <ion-label>{{ $t('nutrition.fat') }}</ion-label>
        <ion-note slot="end">{{ intakeFat }} g / {{ fat }} g</ion-note>
      </ion-item>
   </ion-list>
  </BaseCard>
</template>

<style scoped lang="scss">
  .nutrition-thumb {
    background: var(--ion-color-primary-tint);
    border-radius: 20%;
    width: 80%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
  }
  .nutrition-overview-card {
    --background: none;
    margin-bottom: 100px;
  }
  .nutrition-list {
    margin: 0;
    background: none;
  }
  ion-item {
    border-radius: 10px;
    margin-top: 10px;
  }

.iconComponent {
  width: 70%;
  height: 70%;
}
</style>
<script setup lang="ts">
import WelcomeSettingsLayout from '@/layouts/WelcomeSettingsLayout.vue';
import { useFoodDiaryStore } from '@/store/foodDiary';
import illustration from '../../assets/illustrations/fill_diet_goals.png';
import DietGoalInput from '@/components/DietGoalInput.vue';

const foodDiaryStore = useFoodDiaryStore();
const isComplete = foodDiaryStore.dailyNutritionGoalComplete
</script>

<template>
  <WelcomeSettingsLayout
    :image="illustration"
    :title="$t('settings.dietGoalsMessage')"
    :subtitle="$t('settings.dietGoalsSubtitle')"
    :settingComplete="isComplete"
    redirectPath="/tabs/home"
    :backButton="true"
  >
    <DietGoalInput 
      :buttonLabel="$t('next')"
      saveRedirectPath="/tabs/home"
    />
  </WelcomeSettingsLayout>
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
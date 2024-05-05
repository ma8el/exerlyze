<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useWorkoutStore, useWorkoutPlanStore, useWorkoutSessionStore } from '@/store/workoutStore';
import { useUserStore, useWeightStore } from '@/store/bodyMetricsStore';
import { useUserFitnessLevelStore } from '@/store/userSettingsStore';
import { useFoodDiaryStore } from './store/foodDiary';
import { onMounted } from 'vue';

const workoutStore = useWorkoutStore();
const workoutPlanStore = useWorkoutPlanStore();
const workoutSessionStore = useWorkoutSessionStore();
const foodDiaryStore = useFoodDiaryStore();
const userStore = useUserStore();
const weightStore = useWeightStore();
const userFitnessLevelStore = useUserFitnessLevelStore();

workoutStore.$subscribe(() => {
  workoutStore.saveWorkoutsToIndexDB();
});

workoutPlanStore.$subscribe(() => {
  workoutPlanStore.saveWorkoutPlansToIndexDB();
});

workoutSessionStore.$subscribe(() => {
  workoutSessionStore.saveWorkoutSessionsToIndexDB();
});

foodDiaryStore.$subscribe(() => {
  foodDiaryStore.saveFoodDiaryEntriesToIndexDB();
  foodDiaryStore.saveNutritionGoalToIndexDB();
});

userStore.$subscribe(() => {
  userStore.saveUserToIndexDB();
});

weightStore.$subscribe(() => {
  weightStore.saveWeightsToIndexDB();
});

userFitnessLevelStore.$subscribe(() => {
  userFitnessLevelStore.saveFitnessLevelToIndexDB();
});

onMounted(() => {
  userStore.loadUserFromIndexDB();
  userFitnessLevelStore.loadFitnessLevelFromIndexDB();
  weightStore.loadWeightsFromIndexDB();
  workoutStore.loadWorkoutsFromIndexDB();
  workoutPlanStore.loadWorkoutPlansFromIndexDB();
  workoutSessionStore.loadWorkoutSessionsFromIndexDB();
  foodDiaryStore.loadFoodDiaryEntriesFromIndexDB();
  foodDiaryStore.loadNutritionGoalFromIndexDB();
});
</script>

<template>
  <ion-app class="app-container">
    <ion-router-outlet />
  </ion-app>
</template>

<style scoped>
@media screen and (min-width: 600px){
  .app-container {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>
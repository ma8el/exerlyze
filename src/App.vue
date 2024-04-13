<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useWorkoutStore, useWorkoutPlanStore } from '@/store/workoutStore';
import { onMounted } from 'vue';

const workoutStore = useWorkoutStore();
const workoutPlanStore = useWorkoutPlanStore();

workoutStore.$subscribe(() => {
  workoutStore.saveWorkoutsToIndexDB();
});

workoutPlanStore.$subscribe(() => {
  workoutPlanStore.saveWorkoutPlansToIndexDB();
});

onMounted(() => {
  workoutStore.loadWorkoutsFromIndexDB();
  workoutPlanStore.loadWorkoutPlansFromIndexDB();
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
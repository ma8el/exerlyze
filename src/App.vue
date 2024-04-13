<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useWorkoutStore } from '@/store/workoutStore';
import { onMounted } from 'vue';

const workoutStore = useWorkoutStore();

workoutStore.$subscribe(() => {
  workoutStore.saveWorkoutsToIndexDB();
});

onMounted(() => {
  workoutStore.loadWorkoutsFromIndexDB();
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
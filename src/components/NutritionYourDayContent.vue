<script setup lang="ts">
  import CaloriesOverview from './Cards/CaloriesOverview.vue';
  import NutritionOverview from './Cards/NutritionOverview.vue';
  import AddFloatingActionButton from './Buttons/AddFloatingActionButton.vue';
  import AddNutritionModal from './Modals/AddNutritionModal.vue';
</script>

<template>
  <CaloriesOverview />
  <NutritionOverview />
  <AddFloatingActionButton :modal-component="AddNutritionModal"/>
</template>
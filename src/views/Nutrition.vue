<script setup lang="ts">
  import Calendar from '@/components/Calendar.vue';
  import NutritionSegments from '@/components/NutritionSegments.vue';
  import AppLayout from '@/layouts/AppLayout.vue';
</script>

<template>
<AppLayout title="Nutrition">
  <Calendar />
  <NutritionSegments />
</AppLayout>
</template>
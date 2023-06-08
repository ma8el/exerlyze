<script setup lang="ts">
  import Calendar from '@/components/Calendar.vue';
  import WorkoutsSegments from '@/components/WorkoutsSegments.vue';
  import AppLayout from '@/layouts/AppLayout.vue';
</script>

<template>
  <AppLayout title="Workouts">
   <Calendar />
    <WorkoutsSegments />
  </AppLayout>
</template>
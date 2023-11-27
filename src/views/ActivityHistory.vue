<script setup lang="ts">
  import AppLayout from '@/layouts/AppLayout.vue';
  import WorkoutTimeline from '@/components/TheWorkoutTimeline.vue';
</script>

<template>
  <AppLayout 
   :title="$t('activityHistory')"
   :back-button="true"
   :title-size="'1.5rem'"
   :action-button="false"
  >
    <WorkoutTimeline />
  </AppLayout>
</template>
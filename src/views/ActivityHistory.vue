<script setup lang="ts">
  import AppLayout from '@/layouts/AppLayout.vue';
  import WorkoutTimeline from '@/components/TheWorkoutTimeline.vue';
</script>

<template>
  <AppLayout 
   :title="$t('activityHistory')"
   :back-button="true"
   :action-button="false"
  >
    <WorkoutTimeline />
  </AppLayout>
</template>
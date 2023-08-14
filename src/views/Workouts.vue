<script setup lang="ts">
  import WorkoutsSegments from '@/components/WorkoutsSegments.vue';
  import PageWithCalendar from '@/layouts/PageWithCalendar.vue';
</script>

<template>
  <PageWithCalendar :title="$t('titleWorkouts')">
    <WorkoutsSegments />
  </PageWithCalendar>
</template>
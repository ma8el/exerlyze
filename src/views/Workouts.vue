<script setup lang="ts">
  import PageWithCalendar from '@/layouts/PageWithCalendar.vue';
  import WorkoutsContent from '@/components/WorkoutsContent.vue';
</script>

<template>
  <PageWithCalendar :title="$t('workouts.title')">
    <WorkoutsContent />
  </PageWithCalendar>
</template>
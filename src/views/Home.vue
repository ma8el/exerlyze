<script setup lang="ts">
  import UpcomingEventsSlide from '@/components/UpcomingEventsSlide.vue';
  import PageWithCalendar from '@/layouts/PageWithCalendar.vue';
  import WorkoutVolumeBarChart from '@/components/Charts/WorkoutVolumeBarChart.vue';
</script>

<template>
  <PageWithCalendar :title="$t('home.title')">
    <UpcomingEventsSlide />
    <WorkoutVolumeBarChart class="last-component"/>
  </PageWithCalendar>
</template>

<style scoped>
.last-component {
    margin-bottom: 100px;
}
</style>
<script setup lang="ts">
  import UpcomingEventsSlide from '@/components/UpcomingEventsSlide.vue';
  import PageWithCalendar from '@/layouts/PageWithCalendar.vue';
</script>

<template>
  <PageWithCalendar title="Home">
    <UpcomingEventsSlide />
  </PageWithCalendar>
</template>
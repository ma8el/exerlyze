<script setup lang="ts">
  import Calendar from '@/components/Calendar.vue';
  import UpcomingEventsSlide from '@/components/UpcomingEventsSlide.vue';
  import AppLayout from '@/layouts/AppLayout.vue';
</script>

<template>
  <AppLayout title="Home">
    <Calendar :workout-event-dates="[new Date(2023, 5, 6)]" />
    <UpcomingEventsSlide />
  </AppLayout>
</template>
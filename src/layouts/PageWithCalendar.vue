<script setup lang="ts">
  import AppLayout from '@/layouts/AppLayout.vue';
  import Calendar from '@/components/Calendar.vue';

  const props = defineProps({
    title: {
      type: String,
      required: true
    }
  });
</script>

<template>
  <AppLayout :title="title">
    <Calendar />
    <slot></slot>
  </AppLayout>
</template>
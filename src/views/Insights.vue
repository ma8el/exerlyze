<script setup lang="ts">
  import AppLayout from '@/layouts/AppLayout.vue';
  import BaseSegments from '@/components/BaseSegments.vue';
  import { ref } from 'vue';

  const isWorkoutSelected = ref(true);
  const isDietSelected = ref(false);

  const workoutSelected = () => {
    isWorkoutSelected.value = true;
    isDietSelected.value = false;
  };

  const dietSelected = () => {
    isWorkoutSelected.value = false;
    isDietSelected.value = true;
  };
</script>

<template>
  <AppLayout 
   :title="$t('insights')"
   :back-button="true"
   :settings-button="false"
  >
  <BaseSegments
    class="ion-padding-top"
    leftSegmentLabel="Workout"
    rightSegmentLabel="Diet"
    @leftSegmentSelected="workoutSelected()"
    @rightSegmentSelected="dietSelected()"
  />
  </AppLayout>
  <p v-if="isWorkoutSelected">Workout</p>
  <p v-if="isDietSelected">Diet</p>
</template>
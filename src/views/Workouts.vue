<script setup lang="ts">
  import PageWithCalendar from '@/layouts/PageWithCalendar.vue';
  import { ref } from 'vue';
  import WorkoutsContent from '@/components/WorkoutsContent.vue';
  import WorkoutPlansContent from '@/components/WorkoutPlansContent.vue';
  import BaseSegments from '@/components/BaseSegments.vue';

  const workoutsSelected = ref(true)
  const plansSelected = ref(false)
  const scheduleSelected = ref(false)

  const selectWorkouts = () => {
     workoutsSelected.value = true;
     plansSelected.value = false;
     scheduleSelected.value = false;
  }

  const selectPlans = () => {
     workoutsSelected.value = false;
     plansSelected.value = true;
     scheduleSelected.value = false;
  }

</script>

<template>
  <PageWithCalendar :title="$t('workouts.title')">
    
    <BaseSegments
      :leftSegmentLabel="$t('workouts.workout')"
      :rightSegmentLabel="$t('workouts.plan', 2)"
      @leftSegmentSelected="selectWorkouts"
      @rightSegmentSelected="selectPlans"
    />
   <WorkoutsContent v-if="workoutsSelected" />
    <WorkoutPlansContent v-if="plansSelected" />
  </PageWithCalendar>
</template>
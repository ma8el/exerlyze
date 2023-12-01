<script setup lang="ts">
  import { supabase } from '@/supabase';
  import ChartContainerCard from '@/components/Cards/ChartContainerCard.vue';
  import WorkoutVolumeBarChart from '@/components/Charts/WorkoutVolumeBarChart.vue';
  import { computed } from 'vue';

  const props = defineProps({
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
 });

 const authenticated = computed((): Boolean => {
   return supabase.auth.getSession() != null;
 });
</script>

<template>
  <div v-if="!authenticated">
    <ChartContainerCard>
      <WorkoutVolumeBarChart />
    </ChartContainerCard>
  </div>
  <div v-else>
    <ChartContainerCard>
    </ChartContainerCard>
  </div>
</template>
<script setup lang="ts">
  import { supabase } from '@/supabase';
  import ChartContainerCard from '@/components/Cards/ChartContainerCard.vue';
  import WorkoutVolumeBarChart from '@/components/Charts/WorkoutVolumeBarChart.vue';
  import WorkoutVolumeBarInsightChart from './Charts/WorkoutVolumeBarInsightChart.vue';
  import WeightLineInsightChart from './Charts/WeightLineInsightChart.vue';
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

 const startDate = computed(() => {
   return props.startDate;
 });

 const endDate = computed(() => {
   return props.endDate;
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
      <WorkoutVolumeBarInsightChart
        :startDate="startDate"
        :endDate="endDate"
      />
    </ChartContainerCard>

    <ChartContainerCard>
      <WeightLineInsightChart
        :startDate="startDate"
        :endDate="endDate"
      />
    </ChartContainerCard>
  </div>
</template>
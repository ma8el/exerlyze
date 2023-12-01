<script setup lang="ts">
  import { supabase } from '@/supabase';
  import ChartContainerCard from '@/components/Cards/ChartContainerCard.vue';
  import NutritionBarChart from '@/components/Charts/NutritionBarChart.vue';
  import NutritionParallelChart from '@/components/Charts/NutritionParallelChart.vue';
  import NutritionParallelInsightChart from './Charts/NutritionParallelInsightChart.vue';
  import { computed, watch } from 'vue';

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
      <NutritionBarChart />
    </ChartContainerCard>

    <ChartContainerCard>
      <NutritionParallelChart />
    </ChartContainerCard>
  </div>

  <div v-else>
    <ChartContainerCard>
    </ChartContainerCard>

    <ChartContainerCard>
    </ChartContainerCard>
  </div>
</template>
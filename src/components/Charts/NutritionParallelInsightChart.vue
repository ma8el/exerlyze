<script setup lang="ts">
import { supabase } from '@/supabase'

import { use } from 'echarts/core'
import { ParallelChart } from 'echarts/charts'
import { VisualMapComponent, ParallelComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts';

import { useI18n } from 'vue-i18n';
import BaseChartContainer from './BaseChartContainer.vue';
import { onMounted, computed, ref, watch } from 'vue';
import { onIonViewDidEnter } from '@ionic/vue'

use([VisualMapComponent, ParallelComponent, ParallelChart, CanvasRenderer])

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

const { t } = useI18n();
const loading = ref(true);
const consumedNutrition = ref();

const maxValue = 500;

const schema = ref([
  { name: 'carbs', index: 1, text: t('nutrition.carbs') },
  { name: 'protein', index: 2, text: t('nutrition.protein') },
  { name: 'fat', index: 3, text: t('nutrition.fat') },
]);

const getConsumedNutrition = async () => {
  loading.value = true;
  const { data, error } = await supabase
    .from('v_daily_aggregated_food_diary_entries')
    .select()
    .gte('date', startDate.value.toDateString())
    .lte('date', endDate.value.toISOString())
  const plotData = data?.map((entry: any) => {
    return [
      entry.carbohydrates,
      entry.proteins,
      entry.fat,
    ]
  });
  loading.value = false;
  return plotData;
};

const option = computed(() => {
  return {
  title: {
    text: t('home.macroDistribution'),
    textStyle: {
      color: 'white',
    },
  },
  backgroundColor: '#1c253a',
  parallelAxis: [
    { dim: 0, name: schema.value[0].text, min: 0, max: maxValue},
    { dim: 1, name: schema.value[1].text, min: 0, max: maxValue},
    { dim: 2, name: schema.value[2].text, min: 0, max: maxValue},
  ],
  parallel: {
    left: '10%',
    right: '15%',
    bottom: 10,
    parallelAxisDefault: {
      nameGap: 20,
      nameTextStyle: {
        color: '#fff',
        fontSize: 12
      },
   }
  },
  series: [
    {
      name: 'Nutrition Details',
      type: 'parallel',
      data: consumedNutrition.value,
      color: '#3F63C8',
    },
  ]}
})

watch([startDate, endDate], async () => {
  consumedNutrition.value = await getConsumedNutrition();
})

onMounted(async () => {
  loading.value = true;
  consumedNutrition.value = await getConsumedNutrition();
})

onIonViewDidEnter(async () => {
  loading.value = true;
  consumedNutrition.value = await getConsumedNutrition();
})
</script>

<template>
  <BaseChartContainer :loading="loading" :hasData="true">
    <div class="parallel-chart-wrapper">
      <v-chart :option="option" autoresize />
    </div>
  </BaseChartContainer>
</template>

<style scoped>
.parallel-chart-wrapper {
  height: 100%;
  width: 100%;
  pointer-events: none;
}
</style>
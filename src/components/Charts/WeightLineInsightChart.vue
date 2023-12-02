<script setup lang="ts">
import { supabase } from '@/supabase'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TitleComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts';

import { useI18n } from 'vue-i18n';
import BaseChartContainer from './BaseChartContainer.vue';
import { computed, ref, onMounted } from 'vue';
import { watch } from 'vue'

use([TitleComponent, LegendComponent, GridComponent, LineChart, CanvasRenderer])

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

const { t } = useI18n();
const option = ref({});
const loading = ref(true);

const startDate = computed(() => {
  return props.startDate;
});

const endDate = computed(() => {
  return props.endDate;
});

const weeklyWeightChange = computed(async () => {
  loading.value = true;
  const { data, error } = await supabase
    .from('v_daily_weights')
    .select()
    .gte('date', startDate.value.toDateString())
    .lt('date', endDate.value.toISOString())
  const plotData = data?.map((entry: any) => {
    return [
      entry.date,
      entry.weight,
    ]
  });
  loading.value = false;
  return plotData;
});

const xAxisData = computed(async () => {
  const data = await weeklyWeightChange.value;
  if (!data) {
    return [];
  }
  return data.map((entry: any) => entry[0])
});

const yAxisData = computed(async () => {
  const data = await weeklyWeightChange.value;
  if (!data) {
    return 0;
  }
  return Math.ceil(data.reduce((acc: any, entry: any) => {
    return Math.max(acc, entry[1]);
  }, 0) / 10) * 10 + 20;
});

const getOptions = async () => {
 return {
  title: {
    text: `${t('weight')} (${t('weightUnitBig')})`,
    textStyle: {
      color: 'white',
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: await xAxisData.value,
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: await yAxisData.value,
    axisLine: {
      lineStyle: {
        color: 'grey',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'grey', // set the color of the x-axis grid
      },
    },
  },
  grid: {
    left: 40,
    bottom: 20,
  },
  series: [
    {
      name: t('weight'),
      data: await weeklyWeightChange.value,
      type: 'line',
      areaStyle: {},
      smooth: true,
      color: '#3F63C8',
    }
  ]
 }
};

watch([startDate, endDate], async () => {
  option.value = await getOptions();
});

onMounted(async () => {
  option.value = await getOptions();
});

</script>

<template>
<BaseChartContainer :loading="loading" :hasData="true">
  <v-chart :option="option" autoresize />
</BaseChartContainer>
</template>
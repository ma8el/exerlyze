<script setup lang="ts">
import { supabase } from '@/supabase'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TitleComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts';

import { useI18n } from 'vue-i18n';
import BaseChartContainer from './BaseChartContainer.vue';
import { computed, reactive, onMounted } from 'vue';
import { watch, ref } from 'vue';

use([TitleComponent, LegendComponent, GridComponent, BarChart, CanvasRenderer])

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
const loading = ref(true);
const option = ref({});
const hasData = ref(true);

const startDate = computed(() => {
  return props.startDate;
});

const endDate = computed(() => {
  return props.endDate;
});

const weeklyWorkoutVolume = computed(async () => {
  loading.value = true;
  const { data, error } = await supabase
    .from('v_daily_aggregated_workout_volume')
    .select()
    .gte('date', startDate.value.toDateString())
    .lt('date', endDate.value.toISOString())
  const plotData = data?.map((entry: any) => {
    return [
      entry.date,
      entry.volume,
    ]
  });
  loading.value = false;
  return plotData;
});

const xAxisData = computed(async () => {
  const data = await weeklyWorkoutVolume.value;
  if (!data) {
    return [];
  }
  return data.map((entry: any) => entry[0])
});

const getOptions = async () => {
 return {
  title: {
    text: t('home.workoutVolume'),
    textStyle: {
      color: 'white',
    },
  },
  xAxis: {
    type: 'category',
    data: await xAxisData.value,
  },
  yAxis: {
    type: 'value',
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
      name: t('home.workoutVolume'),
      data: await weeklyWorkoutVolume.value,
      type: 'bar',
      color: '#3F63C8',
    }
  ]
 }
};

const reloadData = async () => {
  loading.value = true;
  option.value = await getOptions();
  const data = await weeklyWorkoutVolume.value;
  if (!data) {
    return false;
  }
  hasData.value = data.length > 0;
  loading.value = false;
};


watch([startDate, endDate], async () => {
  await reloadData();
});

onMounted(async () => {
  await reloadData();
});
</script>

<template>
<BaseChartContainer :loading="loading" :hasData="hasData">
  <v-chart :option="option" autoresize />
</BaseChartContainer>
</template>
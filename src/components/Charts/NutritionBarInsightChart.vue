<script setup lang="ts">
import { supabase } from '@/supabase'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent, VisualMapComponent, MarkLineComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts';

import { useI18n } from 'vue-i18n';
import { computed, onMounted, ref, watch } from 'vue';

import BaseChartContainer from './BaseChartContainer.vue';
import { useFoodDiaryStore } from '@/store/foodDiary'

use([TitleComponent, TooltipComponent, GridComponent, VisualMapComponent, MarkLineComponent, BarChart, CanvasRenderer])

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
const foodDiaryStore = useFoodDiaryStore();

const startDate = computed(() => {
  return props.startDate;
});

const endDate = computed(() => {
  return props.endDate;
});

const consumedCalories = computed(async () => { 
  loading.value = true;
  const { data, error } = await supabase
    .from('v_daily_aggregated_food_diary_entries')
    .select()
    .gte('date', startDate.value.toDateString())
    .lt('date', endDate.value.toISOString())
  const plotData = data?.map((entry: any) => {
    return [
      entry.date,
      entry.calories,
    ]
  });
  loading.value = false;
  return plotData;
})

const weeklyConsumedCaloriesShadow = computed(async () => {
  const data = await consumedCalories.value;
  const calorieTarget = foodDiaryStore.dailyCalories;
  if (!data) {
    return [];
  }
  const shadow = data.map((entry: any) => Math.max(calorieTarget - entry[1], 0));
  return shadow;
});

const xAxisData = computed(async () => {
  const data = await consumedCalories.value;
  if (!data) {
    return [];
  }
  return data.map((entry: any) => entry[0])
});

const getOptions = async () => {
  return {
    title: {
      text: t('home.consumedCalories'),
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
        name: t('home.consumedCalories'),
        stack: 'calories',
        data: await consumedCalories.value,
        type: 'bar',
        color: '#93CE07',
        barWidth: '50%',
        barCategoryGap: '20%',
      },
      {
        name: 'shadow',
        stack: 'calories',
        data: await weeklyConsumedCaloriesShadow.value,
        type: 'bar',
        color: 'rgba(255,255,255,0.1)',
        barWidth: '50%',
        barCategoryGap: '20%',
      }
    ]
  }
};

watch([startDate, endDate], async () => {
  option.value = await getOptions();
})

onMounted(async () => {
  option.value = await getOptions();
  loading.value = false;
});
</script>

<template>
  <BaseChartContainer :loading="loading" :hasData="true">
    <v-chart :option="option" autoresize />
  </BaseChartContainer>
</template>
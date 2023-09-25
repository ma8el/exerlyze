<script setup lang="ts">
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TitleComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart, { THEME_KEY } from 'vue-echarts';

import { useI18n } from 'vue-i18n';
import { useDayOfWeekStore, useWorkoutSessionStore } from '@/store/workoutStore';
import { getCurrentWeekDates } from '@/helpers/time';
import BaseChartContainer from './BaseChartContainer.vue';
import { computed } from 'vue';

use([TitleComponent, LegendComponent, GridComponent, LineChart, CanvasRenderer])

const { t } = useI18n();

const dayOfWeekStore = useDayOfWeekStore();
const weekDays = getCurrentWeekDates();
const workoutSessionStore = useWorkoutSessionStore();
const weeklyWorkoutVolume = weekDays.map(day => {
  const workoutSessions = workoutSessionStore.getWorkoutSessionPerformanceByDate(day)
  return workoutSessions
  ? workoutSessions.reduce(
    (acc, curr) => acc + curr.performedReps * curr.performedWeight, 0)
  : 0
});

const hasData = computed (() => {
  return weeklyWorkoutVolume.reduce((acc, curr) => acc + curr, 0) > 0;
});

const option = {
  title: {
    text: t('home.workoutVolume'),
    textStyle: {
      color: 'white',
    },
  },
  legend: {
    data: ['Workout Volume'],
    textStyle: {
      color: 'white',
    },
    right: 10,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: dayOfWeekStore.daysOfWeek.map(d => d.name.slice(0, 3)),
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
      name: 'Workout Volume',
      data: weeklyWorkoutVolume,
      type: 'line',
      areaStyle: {},
      smooth: true,
      color: '#3F63C8',
    }
  ]
};

</script>

<template>
<BaseChartContainer :hasData="hasData">
  <v-chart :option="option" autoresize />
</BaseChartContainer>
</template>
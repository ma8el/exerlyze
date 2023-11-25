<script setup lang="ts">
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TitleComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts';

import { useI18n } from 'vue-i18n';
import { useDayOfWeekStore, useWorkoutSessionStore } from '@/store/workoutStore';
import { getCurrentWeekDates } from '@/helpers/time';
import BaseChartContainer from './BaseChartContainer.vue';
import { computed, reactive, onMounted } from 'vue';

use([TitleComponent, LegendComponent, GridComponent, LineChart, CanvasRenderer])

const { t } = useI18n();

const dayOfWeekStore = useDayOfWeekStore();
const weekDays = getCurrentWeekDates();
const workoutSessionStore = useWorkoutSessionStore();
const weeklyWorkoutVolume = computed(() => {
  return weekDays.map(day => {
  const workoutSessions = workoutSessionStore.getWorkoutSessionPerformanceByDate(day)
  return workoutSessions
  ? workoutSessions.reduce(
    (acc, curr) => acc + curr.performed_reps * curr.performed_weight, 0)
  : 0
  })
});

const hasData = computed (() => {
  return weeklyWorkoutVolume.value.reduce((acc, curr) => acc + curr, 0) > 0;
});

const getOptions = () => {
 return {
  title: {
    text: t('home.workoutVolume'),
    textStyle: {
      color: 'white',
    },
  },
  legend: {
    data: [t('home.workoutVolume')],
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
      name: t('home.workoutVolume'),
      data: weeklyWorkoutVolume.value,
      type: 'line',
      areaStyle: {},
      smooth: true,
      color: '#3F63C8',
    }
  ]
 }
};

let option = reactive(getOptions());

workoutSessionStore.$subscribe((mutation, state) => {
  Object.assign(option, getOptions());
});

onMounted(() => {
  Object.assign(option, getOptions());
});
</script>

<template>
<BaseChartContainer :hasData="hasData">
  <v-chart :option="option" autoresize />
</BaseChartContainer>
</template>
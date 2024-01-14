<script setup lang="ts">
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TitleComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts';

import { useI18n } from 'vue-i18n';
import { useDayOfWeekStore, useWorkoutSessionStore, useWorkoutPlanStore } from '@/store/workoutStore';
import { useUserSettingsStore } from '@/store/userSettingsStore';
import { getCurrentWeekDates } from '@/helpers/time';
import BaseChartContainer from './BaseChartContainer.vue';
import { computed, reactive, onMounted } from 'vue';

use([TitleComponent, LegendComponent, GridComponent, BarChart, CanvasRenderer])

const { t } = useI18n();

const dayOfWeekStore = useDayOfWeekStore();
const weekDays = getCurrentWeekDates();
const workoutPlanStore = useWorkoutPlanStore();
const workoutSessionStore = useWorkoutSessionStore();
const userSettingsStore = useUserSettingsStore();

const weeklyWorkoutVolume = computed(() => {
  return weekDays.map(day => {
  const workoutSessions = workoutSessionStore.getWorkoutSessionPerformanceByDate(day)
  return workoutSessions
  ? workoutSessions.reduce(
    (acc, curr) => acc + curr.performed_reps * curr.performed_weight, 0)
  : 0
  })
});

const weeklyWorkoutVolumeShadow = computed(() => {
  const plannedWorkoutVolume = weekDays.map(day => workoutPlanStore.getPlannedWorkoutVolumeOfDate(day));
  return plannedWorkoutVolume.map((volume, index) => {
    return Math.max(volume - weeklyWorkoutVolume.value[index], 0);
  })
});

const hasData = computed (() => {
  return weeklyWorkoutVolume.value.reduce((acc, curr) => acc + curr, 0) > 0
    || weeklyWorkoutVolumeShadow.value.reduce((acc, curr) => acc + curr, 0) > 0;
});

const getOptions = () => {
 return {
  title: {
    text: t('home.workoutVolume'),
    textStyle: {
      color: 'white',
    },
  },
  xAxis: {
    type: 'category',
    data: dayOfWeekStore.getDaysOfWeek.map(d => d.name.slice(0, 3)),
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
      stack: 'volume',
      type: 'bar',
      color: '#3F63C8',
      barWidth: '50%',
      barCategoryGap: '20%',
    },
    {
      name: 'shadow',
      stack: 'volume',
      data: weeklyWorkoutVolumeShadow.value,
      type: 'bar',
      color: 'rgba(255,255,255,0.1)',
      barWidth: '50%',
      barCategoryGap: '20%',
    },
  ]
 }
};

let option = reactive(getOptions());

workoutSessionStore.$subscribe((mutation, state) => {
  Object.assign(option, getOptions());
});

workoutPlanStore.$subscribe((mutation, state) => {
  Object.assign(option, getOptions());
});

userSettingsStore.$subscribe((mutation, state) => {
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
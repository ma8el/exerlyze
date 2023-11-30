<script setup lang="ts">
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent, VisualMapComponent, MarkLineComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts';

import { useI18n } from 'vue-i18n';
import { useDayOfWeekStore } from '@/store/workoutStore';
import { useFoodDiaryStore } from '@/store/foodDiary';
import { getCurrentWeekDates } from '@/helpers/time';
import BaseChartContainer from './BaseChartContainer.vue';
import { computed, onMounted, reactive } from 'vue';

use([TitleComponent, TooltipComponent, GridComponent, VisualMapComponent, MarkLineComponent, BarChart, CanvasRenderer])

const { t } = useI18n();

const dayOfWeekStore = useDayOfWeekStore();
const weekDays = getCurrentWeekDates();
const foodDiaryStore = useFoodDiaryStore();

const weeklyConsumedCalories = computed(() => { 
  return weekDays.map(day => {
  const consumedCalories = foodDiaryStore.getCaloriesOfDate(day)
  return consumedCalories
  })
});

const weeklyConsumedCaloriesShadow = computed(() => {
  return weekDays.map(day => {
    const consumedCalories = foodDiaryStore.getCaloriesOfDate(day)
    return Math.max(foodDiaryStore.dailyCalories - consumedCalories, 0)
  })
});

const hasData = computed (() => {
  return weeklyConsumedCalories.value.reduce((acc, curr) => acc + curr, 0) > 0;
});

const getOptions = () => {
  return {
    title: {
      text: t('home.consumedCalories'),
      textStyle: {
        color: 'white',
      },
    },
    xAxis: {
      type: 'category',
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
        name: t('home.consumedCalories'),
        stack: 'calories',
        data: weeklyConsumedCalories.value,
        type: 'bar',
        color: '#93CE07',
        barWidth: '50%',
        barCategoryGap: '20%',
      },
      {
        name: 'shadow',
        stack: 'calories',
        data: weeklyConsumedCaloriesShadow.value,
        type: 'bar',
        color: 'rgba(255,255,255,0.1)',
        barWidth: '50%',
        barCategoryGap: '20%',
      }
    ]
  }
};

let option = reactive(getOptions());

foodDiaryStore.$subscribe((mutation, state) => {
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
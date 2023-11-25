<script setup lang="ts">
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent, VisualMapComponent, MarkLineComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts';

import { useI18n } from 'vue-i18n';
import { useDayOfWeekStore } from '@/store/workoutStore';
import { useFoodDiaryStore } from '@/store/foodDiary';
import { getCurrentWeekDates } from '@/helpers/time';
import BaseChartContainer from './BaseChartContainer.vue';
import { computed, onMounted, reactive } from 'vue';

use([TitleComponent, TooltipComponent, GridComponent, VisualMapComponent, MarkLineComponent, LineChart, CanvasRenderer])

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
    visualMap: {
      show: false,
      pieces: [
        {
          gt: 0,
          lte: foodDiaryStore.dailyCalories,
          color: '#8BC34A'
        },
        {
          gt: foodDiaryStore.dailyCalories,
          color: '#FC4D55'
        }
      ],
      outOfRange: {
        color: '#999'
      }
    },
    grid: {
      left: 40,
      bottom: 20,
    },
    series: [
      {
        name: t('home.consumedCalories'),
        data: weeklyConsumedCalories.value,
        type: 'line',
        areaStyle: {},
        smooth: true,
        color: '#93CE07',
        markLine: {
          silent: true,
          lineStyle: {
            color: '#FFFFFF'
          },
          label: {
            color: '#FFFFFF'
          },
          data: [
            {
              yAxis: foodDiaryStore.dailyCalories
            }
          ]
        }
      },
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
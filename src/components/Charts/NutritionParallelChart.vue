<script setup lang="ts">
import { use } from 'echarts/core'
import { ParallelChart } from 'echarts/charts'
import { VisualMapComponent, ParallelComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts';

import { useI18n } from 'vue-i18n';
import { useFoodDiaryStore } from '@/store/foodDiary';
import { getCurrentWeekDates } from '@/helpers/time';
import BaseChartContainer from './BaseChartContainer.vue';
import { computed } from 'vue';

use([VisualMapComponent, ParallelComponent, ParallelChart, CanvasRenderer])

const { t } = useI18n();

const weekDays = getCurrentWeekDates();
const foodDiaryStore = useFoodDiaryStore();

const weeklyConsumedNutrition = weekDays.map(day => {
  const consumedCarbs = foodDiaryStore.getCarbohydratesOfDate(day)
  const consumedProtein = foodDiaryStore.getProteinOfDate(day)
  const consumedFat = foodDiaryStore.getFatOfDate(day)
  return Array.of(consumedCarbs, consumedProtein, consumedFat)
});

const hasData = computed(() => {
  return weeklyConsumedNutrition.some(day => day.some(nutrition => nutrition > 0));
});

const maxValue = Math.max(...weeklyConsumedNutrition.flat());

var schema = [
  { name: 'carbs', index: 1, text: t('nutrition.carbs') },
  { name: 'protein', index: 2, text: t('nutrition.protein') },
  { name: 'fat', index: 3, text: t('nutrition.fat') },
];

const option = {
  title: {
    text: t('home.macroDistribution'),
    textStyle: {
      color: 'white',
    },
  },
  backgroundColor: '#1E1F24',
  parallelAxis: [
    { dim: 0, name: schema[0].text, min: 0, max: maxValue},
    { dim: 1, name: schema[1].text, min: 0, max: maxValue},
    { dim: 2, name: schema[2].text, min: 0, max: maxValue},
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
      data: weeklyConsumedNutrition,
      color: '#3F63C8',
    },
  ]
};
</script>

<template>
  <BaseChartContainer :hasData="hasData">
    <v-chart :option="option" autoresize />
  </BaseChartContainer>
</template>
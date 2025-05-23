<script setup lang="ts">
import { use } from 'echarts/core'
import { ParallelChart } from 'echarts/charts'
import { VisualMapComponent, ParallelComponent, BrushComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts';

import { useI18n } from 'vue-i18n';
import { useFoodDiaryStore } from '@/store/foodDiary';
import { useUserSettingsStore } from '@/store/userSettingsStore';
import { getCurrentWeekDates } from '@/helpers/time';
import BaseChartContainer from './BaseChartContainer.vue';
import { ref, computed, reactive, onMounted } from 'vue';
import { onIonViewDidEnter } from '@ionic/vue';

use([VisualMapComponent, ParallelComponent, ParallelChart, CanvasRenderer, BrushComponent])

const { t } = useI18n();

const weekDays = getCurrentWeekDates();
const foodDiaryStore = useFoodDiaryStore();
const userSettingsStore = useUserSettingsStore();

const weeklyConsumedNutrition = computed(() => {
  return weekDays.map(day => {
  const consumedCarbs = foodDiaryStore.getCarbohydratesOfDate(day)
  const consumedProtein = foodDiaryStore.getProteinOfDate(day)
  const consumedFat = foodDiaryStore.getFatOfDate(day)
  return Array.of(consumedCarbs, consumedProtein, consumedFat)
  })
});

const hasData = computed(() => {
  return weeklyConsumedNutrition.value.some(day => day.some(nutrition => nutrition > 0));
});

const maxValue = Math.max(...weeklyConsumedNutrition.value.flat());

const getOptions = () => {
  const schema = [
    { name: 'carbs', index: 1, text: t('nutrition.carbs') },
    { name: 'protein', index: 2, text: t('nutrition.protein') },
    { name: 'fat', index: 3, text: t('nutrition.fat') },
  ];
  return {
    title: {
      text: t('home.macroDistribution'),
      textStyle: {
        color: 'white',
      },
    },
    backgroundColor: '#1c253a',
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
        data: weeklyConsumedNutrition.value,
        color: '#3F63C8',
      },
    ],
    toolbox: {
      feature: {
        brush: {
          show: false
        }
      }
    },
    brush: {
      brushType: 'none'
    }
  }
}

let option = reactive(getOptions());

foodDiaryStore.$subscribe((mutation, state) => {
  Object.assign(option, getOptions());
});

userSettingsStore.$subscribe((mutation, state) => {
  Object.assign(option, getOptions());
});

onMounted(() => {
  Object.assign(option, getOptions());
});

onIonViewDidEnter(async () => {
  Object.assign(option, getOptions());
})
</script>

<template>
  <BaseChartContainer :hasData="hasData">
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
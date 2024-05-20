<script setup lang="ts">
import { supabase } from '@/supabase'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TitleComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts';

import { useI18n } from 'vue-i18n';
import BaseChartContainer from './BaseChartContainer.vue';
import { computed, onMounted, watch, watchEffect, ref } from 'vue';

interface VDailyAggregatedWorkoutVolumeByExercise {
  date: string;
  exercise_id: number;
  planned_volume: number;
  user_id: string;
  volume: number;
}

interface VDailyAggregatedWorkoutVolume {
  date: string;
  user_id: string;
  volume: number;
}

interface WeeklyWorkoutVolume {
  date: string;
  volume: number;
}

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
  selectedExercise: {
    type: Number,
    required: false,
    default: undefined,
  },
});

const { t } = useI18n();
const loading = ref<boolean>(true);
const option = ref({});
const hasData = ref<boolean>(true);

const weeklyWorkoutVolume = ref<(string | number)[][]>([]);
const xAxisData = ref<string[]>([]);

const startDate = computed(() => {
  return props.startDate;
});

const endDate = computed(() => {
  return props.endDate;
});

const getWeeklyWorkoutVolume = async () => {
  const { data, error } = await supabase
    .from('v_daily_aggregated_workout_volume')
    .select()
    .gte('date', startDate.value.toDateString())
    .lte('date', endDate.value.toISOString())
    .returns<VDailyAggregatedWorkoutVolume[]>();
  if (data === null || data === undefined) {
    return [];
  } else {
    return data.map((entry) => {
      return {
        date: entry.date,
        volume: entry.volume,
      };
    });
  }
};

const getWeeklyWorkoutVolumeByExercise = async () => {
  const { data, error } = await supabase
    .from('v_daily_aggregated_workout_volume_by_exercise')
    .select()
    .gte('date', startDate.value.toDateString())
    .lte('date', endDate.value.toISOString())
    .filter('exercise_id', 'eq', props.selectedExercise)
    .returns<VDailyAggregatedWorkoutVolumeByExercise[]>();
  if (data === null || data === undefined) {
    return [];
  } else {
    return data.map((entry) => {
      return {
        date: entry.date,
        volume: entry.volume,
      };
    });
  }
};

watchEffect(async () => {
  loading.value = true;
  let data;
  if (props.selectedExercise !== undefined) {
    data = await getWeeklyWorkoutVolumeByExercise();
  } else {
    data = await getWeeklyWorkoutVolume();
  }

  if (data === null || data === undefined) {
    weeklyWorkoutVolume.value = [];
    xAxisData.value = [];
    return;
  }

  weeklyWorkoutVolume.value = data.map((entry) => [entry.date, entry.volume]);
  xAxisData.value = data.map(entry => entry.date);

  option.value = getOptions();
  hasData.value = weeklyWorkoutVolume.value.length > 0;
  loading.value = false;
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
    data: xAxisData.value,
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
    axisLabel: {
      formatter: (value: number) => {
        if (value < 10000) return value;
        return value / 1000 + 'k';
      },
    }
  },
  grid: {
    left: 40,
    bottom: 20,
  },
  series: [
    {
      name: t('home.workoutVolume'),
      data: weeklyWorkoutVolume.value,
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
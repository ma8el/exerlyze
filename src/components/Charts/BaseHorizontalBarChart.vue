<script setup lang="ts">
  import { use } from 'echarts/core';
  import { BarChart } from 'echarts/charts';
  import { GridComponent, TooltipComponent } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';
  import VChart, { THEME_KEY } from 'vue-echarts';
  import { computed, provide } from 'vue';

  use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

  const props = defineProps({
    data: {
      type: Number,
      required: true
    },
    maxValue: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  });

  const option = computed(() => {
    let shadowBorderRadius = [0, 20, 20, 0];
    let foregroundBorderRadius = [20, 0, 0, 20];
    if (props.data >= props.maxValue) {
      shadowBorderRadius = [20, 20, 20, 20];
      foregroundBorderRadius = [20, 20, 20, 20];
    } else if (props.data === 0) {
      shadowBorderRadius = [20, 20, 20, 20];
      foregroundBorderRadius = [0, 0, 0, 0];
    }
  return ({
    backgroundColor: '#1E1F24',
    grid: { show: false, top: '0%', left: '0%', right: '0%', bottom: '0%', containerLabel: false },
    xAxis: {
      type: 'value',
      show: false, // Hides xAxis
      max: props.maxValue
    },
    yAxis: {
      type: 'category',
      show: false, // Hides yAxis
      data: ['']
    },
    series: [
      {
        // Foreground Bar
        type: 'bar',
        stack: 'total', // Enables stacking
        data: [props.data],
        barWidth: '30%',
        itemStyle: {
          color: props.color,
          borderRadius: foregroundBorderRadius // Rounded corners
        }
      },
      {
        // Shadow Bar
        type: 'bar',
        stack: 'total', // Enables stacking
        data: [Math.max(props.maxValue - props.data, 1)],
        barWidth: '30%',
        itemStyle: {
          color: 'rgba(220, 220, 220, 0.5)', // Light gray color
          borderRadius: shadowBorderRadius // Rounded corners
        },
        animation: false
      },
    ]
  })});

  provide(THEME_KEY, 'dark');
</script>

<template>
  <v-chart class="echarts" :option="option" autoresize />
</template>

<style scoped lang="scss">
  .echarts {
    width: 100%;
    height: 30px; // Set height as required
  }
</style>
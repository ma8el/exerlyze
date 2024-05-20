<script setup lang="ts">
  import { use } from 'echarts/core'
  import { BarChart } from 'echarts/charts'
  import { PolarComponent, LegendComponent } from 'echarts/components'
  import { onMounted, computed, ref, provide } from 'vue';
  import VChart, { THEME_KEY } from 'vue-echarts';
  import { CanvasRenderer } from 'echarts/renderers'

  use([PolarComponent, LegendComponent, BarChart, CanvasRenderer])

  const props = defineProps({
    chartData: {
      type: Array as () => number[],
      required: true
    },
  })

  const option = computed(() => {
    const commonOption = {
      backgroundColor: '#1c253a',
      barWidth: '15px',
      radiusAxis: {
          type: 'category',
          data: ['Fat', 'Protein', 'Carbs'],
          min: 0,
          show: false
      },
      polar: {
          radius: [120, '10%']
      },
      legend: {
          show: false,
          data: ['Carbs', 'Protein', 'Fat']
      }
    }
    const sum = props.chartData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    if(sum == 0) {
      return {
        ...commonOption,       
        angleAxis: {
            show: false,
            max: 1
        },
        series: [
        {
            type: 'bar',
            data: [1, 1, 1],  // Assuming 8 is the max value
            coordinateSystem: 'polar',
            name: 'Background',
            itemStyle: {
                color: 'rgba(220, 220, 220, 0.5)'  // Light gray background
            },
            stack: 'a',
            z: 1  // Behind the actual data
        },
        ],
      };
    } else {
      return {
        ...commonOption,
        angleAxis: {
            show: false,
            max: sum
        },
        series: [
            {
                type: 'bar',
                data: [sum, sum, sum],
                coordinateSystem: 'polar',
                name: 'Background',
                itemStyle: {
                    color: 'rgba(220, 220, 220, 0.5)'  // Light gray background
                },
                stack: 'a',
                z: 1  // Behind the actual data
            },
            {
                type: 'bar',
                data: [props.chartData[0], 0, 0],
                coordinateSystem: 'polar',
                name: 'Carbs',
                stack: 'a',
                color: '#3F63C8',
                itemStyle: {
                  borderRadius: [10, 10] // Rounded outer edge
                },
                emphasis: {
                    focus: 'series'
                }
            },
            {
                type: 'bar',
                data: [0, props.chartData[1], 0],
                coordinateSystem: 'polar',
                name: 'Protein',
                stack: 'a',
                color: '#86A0E7',
                itemStyle: {
                  borderRadius: [10, 10] // Rounded outer edge
                },
                emphasis: {
                    focus: 'series'
                }
            },
            {
                type: 'bar',
                data: [0, 0, props.chartData[2]],
                coordinateSystem: 'polar',
                name: 'Fat',
                stack: 'a',
                color: '#FFFFFF',
                itemStyle: {
                  borderRadius: [10, 10] // Rounded outer edge
                },
                emphasis: {
                    focus: 'series'
                }
            }
        ],
     }
    };
  });

  provide(THEME_KEY, 'dark');
</script>

<template>
  <v-chart class="echarts" :option="option" autoresize />
</template>

<style scoped lang="scss">
  .echarts {
    width: 100%;
    height: 100%;
  }
</style>
<script setup lang="ts">
  import { IonIcon, IonRow } from '@ionic/vue';
  import { use } from 'echarts/core'
  import { BarChart } from 'echarts/charts'
  import { PolarComponent, LegendComponent, TitleComponent } from 'echarts/components'
  import { computed, provide } from 'vue';
  import VChart, { THEME_KEY } from 'vue-echarts';
  import { SVGRenderer } from 'echarts/renderers'

  use([PolarComponent, LegendComponent, BarChart, SVGRenderer, TitleComponent])

  const props = defineProps({
    data: {
      type: Number,
      required: true
    },
    maxValue: {
      type: Number,
      required: true
    },
    radius: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false
    },
    unit: {
      type: String,
      required: false
    },
    showMaxValue: {
      type: Boolean,
      required: false,
      default: false
    }
  })

  const option = computed(() => {
    const commonOption = {
      backgroundColor: '#1c253a',
      barWidth: '8px',
      radiusAxis: {
          type: 'category',
          data: [props.name],
          min: 0,
          show: false
      },
      polar: {
          radius: [props.radius, '10%']
      },
      legend: {
          show: false,
          data: [props.name]
      },
      title: {
//        text: `${props.name}\n${props.data}`,
        textStyle: {
          fontSize: 15,
          fontWeight: 'bold',
        },
        left: 'center', 
        top: 'middle',
    }
    }
    if(props.data == 0) {
      return {
        ...commonOption,       
        angleAxis: {
            show: false,
            max: 1
        },
        series: [
        {
            type: 'bar',
            data: [1],  // Assuming 8 is the max value
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
            max: props.maxValue
        },
        series: [
            // Background series
            {
                type: 'bar',
                data: [props.maxValue],
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
                data: [props.data],
                coordinateSystem: 'polar',
                name: props.name,
                stack: 'a',
                color: props.color,
                itemStyle: {
                  borderRadius: [10, 10] // Rounded outer edge
                },
                emphasis: {
                    focus: 'series'
                }
            },
        ],
     }
    };
  });

  provide(THEME_KEY, 'dark');
</script>

<template>
  <div class="echarts-container">
    <v-chart class="echarts" :option="option" autoresize />
    <div class="chart-center-label">
      <ion-row class="ion-justify-content-center">
        <ion-icon v-if="icon" class="chart-icon" :icon="icon"/>
      </ion-row>
      <ion-row class="ion-justify-content-center">
      <span>{{ name }}</span>
      </ion-row>
        <ion-row class="ion-justify-content-center">
          <span>{{ data }}</span>
          <span v-if="showMaxValue">/{{ maxValue }}</span>
      </ion-row>
      <ion-row v-if="unit" class="ion-justify-content-center">
        <span>{{ unit }}</span>
      </ion-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .echarts {
    width: 100%;
    height: 100%;
  }
.echarts-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .echarts {
    width: 100%;
    height: 100%;
  }

  .chart-center-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .chart-icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
</style>
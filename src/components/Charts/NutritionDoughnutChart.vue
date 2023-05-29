<script setup lang="ts">
  import { Chart as ChartJS, ArcElement, Legend } from 'chart.js';
  import { Doughnut } from 'vue-chartjs';
  import { computed } from 'vue';

  ChartJS.register(ArcElement, Legend);

  const props = defineProps({
    chartData: {
      type: Array as () => number[],
      required: true
    },
  })

  const data = computed(() => {
    const sum = props.chartData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    if(sum == 0) {
      return {
        datasets: [
        {
          data: [1],
          backgroundColor: ['#DCDCDC'],
        },
        ],
      };
    } else {
      return {
        datasets: [
          {
            label: 'Nutrition',
            data: props.chartData,
            backgroundColor: ['#FFFFFF', '#3F63C8', '#5598ff'],
          },
        ],
    };
  }
  })

  const options = {
    responsive: true,
  }
</script>

<template>
  <Doughnut :data="data" :options="options" />
</template>
<script setup lang="ts">
  import UserInfoCard from '@/components/Cards/UserInfoCard.vue';
  import LineChart from '@/components/Charts/LineChart.vue';
  import AppLayout from '@/layouts/AppLayout.vue';
  import { useWeightStore } from '@/store/bodyMetricsStore';
  import { useDayOfWeekStore } from '@/store/workoutStore';

  const weightStore = useWeightStore();
  const weightsOfWeek = weightStore.getWeightsOfWeek;
  const dayOfWeekStore = useDayOfWeekStore();

  const weightChartData = {
        labels: weightsOfWeek.map((weight) => dayOfWeekStore.getDayOfWeekById(new Date(weight.createdAt).getDay())?.name),
        datasets: [
          {
            label: 'Weight',
            fill: {
              target: 'origin',
              above: 'rgba(63, 99, 200, 0.5)',
            },
            backgroundColor: '#3F63C8',
            data: weightsOfWeek.map((weight) => weight.weight)
          }
        ]
      }

  const options = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date and Time',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Weight',
          },
          min: 0,
        },
      },
    };

</script>

<template>
  <AppLayout :title="$t('you.title')">
    <UserInfoCard />
    <LineChart :chartData="weightChartData" :options="options" chartTitle="Weight" />
  </AppLayout>
</template>
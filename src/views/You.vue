<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import Toolbar from '@/components/Toolbar.vue';
  import UserInfoCard from '@/components/Cards/UserInfoCard.vue';
  import LineChart from '@/components/Charts/LineChart.vue';
  import { useWeightStore } from '@/store/bodyMetricsStore';
  import { useDayOfWeekStore } from '@/store/workoutStore';

  const weightStore = useWeightStore();
  const weightsOfWeek = weightStore.getWeightsOfWeek;
  const dayOfWeekStore = useDayOfWeekStore();

  const weightChartData = {
        labels: weightsOfWeek.map((weight) => dayOfWeekStore.getDayOfWeekById(weight.createdAt.getDay())?.name),
        datasets: [
          {
            label: 'Weight',
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
        },
      },
    };

</script>

<template>
  <ion-page>
    <Toolbar title="You" />
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">You</ion-title>
        </ion-toolbar>
      </ion-header>
      <UserInfoCard />
      <LineChart :chartData="weightChartData" :options="options" chartTitle="Weight" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue'
import {
  Chart as ChartJS,
  Title,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { useDayOfWeekStore } from '@/store/workoutStore';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend)

const dayOfWeekStore = useDayOfWeekStore();

const data = {
  labels: dayOfWeekStore.daysOfWeek.map(d => d.name),
  datasets: [
    {
      label: 'Workout Volume',
      backgroundColor: '#3F63C8',
      data: [40, 20, 12, 39, 10, 40, 39]
    }
  ]
}

const options = {
  responsive: true,
  maintainAspectRatio: true
}
</script>

<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Workout Volume</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <Bar :data="data" :options="options" />
    </ion-card-content>
  </ion-card>
</template>
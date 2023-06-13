<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue'
import {
  Chart as ChartJS,
  Title,
  Legend,
  BarElement,
  Tooltip,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { useDayOfWeekStore, useWorkoutSessionStore } from '@/store/workoutStore';
import { getCurrentWeekDates } from '@/helpers/time';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend, Tooltip)

const dayOfWeekStore = useDayOfWeekStore();
const weekDays = getCurrentWeekDates();
const workoutSessionStore = useWorkoutSessionStore();
const weeklyWorkoutVolume = weekDays.map(day => 
  workoutSessionStore.getWorkoutSessionPerformanceByDate(day)?.reduce(
    (acc, curr) => acc + curr.performedReps * curr.performedWeight, 0));

const data = {
  labels: dayOfWeekStore.daysOfWeek.map(d => d.name),
  datasets: [
    {
      label: 'Workout Volume',
      backgroundColor: '#3F63C8',
      data: weeklyWorkoutVolume
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
      <Bar 
        :data="data"
        :options="options" />
    </ion-card-content>
  </ion-card>
</template>
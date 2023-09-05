<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue'
import BaseCard from '../Cards/BaseCard.vue';
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
const weeklyWorkoutVolume = weekDays.map(day => {
  const workoutSessions = workoutSessionStore.getWorkoutSessionPerformanceByDate(day)
  return workoutSessions
  ? workoutSessions.reduce(
    (acc, curr) => acc + curr.performedReps * curr.performedWeight, 0)
  : 0
  });

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
  <BaseCard
    :title="$t('home.workoutVolume')"
    :content="true"
  >
    <Bar 
      :data="data"
      :options="options" />
  </BaseCard>
</template>
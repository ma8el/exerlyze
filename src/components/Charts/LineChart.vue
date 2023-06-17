<script setup lang="ts">
  import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue'
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  } from 'chart.js'
  import { Line } from 'vue-chartjs'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  )
 
  const props = defineProps(['chartData', 'options', 'chartTitle'])
</script>

<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        {{ chartTitle }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <Line :data="chartData" :options="options" />
    </ion-card-content>
  </ion-card>
</template>
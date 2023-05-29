<script setup lang="ts">
  import { ref, onUnmounted } from 'vue';
  import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/vue';
  
  let startTime: number | null = null;
  let elapsedTime = ref(0);
  let interval: number | null = null;
  let hours = ref(0);
  let minutes = ref(0);
  let seconds = ref(0);
  
  const calculateTime = () => {
    const totalSeconds = Math.floor(elapsedTime.value / 1000);
    hours.value = Math.floor(totalSeconds / 3600);
    minutes.value = Math.floor((totalSeconds - (hours.value * 3600)) / 60);
    seconds.value = totalSeconds - (hours.value * 3600) - (minutes.value * 60);
  };
  
  const updateTime = () => {
    elapsedTime.value = new Date().getTime() - (startTime as number);
    calculateTime();
  };
  
  const startStopwatch = () => {
    startTime = new Date().getTime() - elapsedTime.value;
    interval = window.setInterval(updateTime, 1000);
  };
  
  const stopStopwatch = () => {
    if(interval) {
      window.clearInterval(interval);
      interval = null;
    }
  };
  
  const resetStopwatch = () => {
    stopStopwatch();
    elapsedTime.value = 0;
    calculateTime();
  };
  
  onUnmounted(stopStopwatch);
</script>

<template>
  <ion-card class="ion-text-center">
    <ion-card-header>
      <ion-card-title>{{hours}} : {{minutes}} : {{seconds}}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-button @click="startStopwatch">Start</ion-button>
      <ion-button @click="stopStopwatch">Pause</ion-button>
<!--      <ion-button @click="resetStopwatch">Reset</ion-button> -->
    </ion-card-content>
  </ion-card>
</template>
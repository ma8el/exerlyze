<script setup lang="ts">
  import { IonFabButton, IonIcon, IonCol, IonRow } from '@ionic/vue';
  import { stopwatchOutline, pauseOutline, playOutline } from 'ionicons/icons';
  import { ref, onMounted } from 'vue';
  
  const time = ref('00:00:00');
  let startTime = Date.now();
  let elapsed = ref(0);
  let timer: ReturnType<typeof setInterval> | null = null;
  const isPaused = ref(false);
  
  const updateTime = () => {
    const now = Date.now();
    const diff = now - startTime + elapsed.value;
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    time.value = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const startStopwatch = () => {
    startTime = Date.now();
    timer = setInterval(updateTime, 1000);
  };
  
  const pauseStopwatch = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      elapsed.value = Date.now() - startTime + elapsed.value;
    } else {
      startTime = Date.now();
      timer = setInterval(updateTime, 1000);
    }
    isPaused.value = !isPaused.value;
  };
  
  onMounted(() => {
    startStopwatch();
  });
  
</script>

<template>
  <ion-row
    class="ion-align-items-center"
  >
    <ion-col 
      size="2"
      class="ion-text-center"
    >
    <ion-icon class="stopwatch-icon" :icon="stopwatchOutline"></ion-icon>
    </ion-col>
    <ion-col 
      size="7"
      class="ion-text-center"
    >
      <h1 class="timer">{{ time }}</h1>
    </ion-col>
    <ion-col 
      size="1"
      class="ion-text-center"
    >
      <ion-fab-button 
        @click="pauseStopwatch"
        size="small"
        class="pause-button"
      >
        <ion-icon :icon="isPaused ? playOutline : pauseOutline"></ion-icon>
      </ion-fab-button>
    </ion-col>
  </ion-row>  
</template>

<style scoped>
.stopwatch-icon {
  font-size: 2rem;
}
.pause-button { 
  padding: 0;
  margin: 0;
}

.timer {
  font-size: 1.5rem;
  padding: 0;
  margin: 0;
}
</style>
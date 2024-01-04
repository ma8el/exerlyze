<script setup lang="ts">
import { IonRow,
         IonCol,
         IonGrid,
         IonLabel } from '@ionic/vue';
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    initialTime: {
        type: Number,
        required: true
    },
    startTimer: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['update:resttime']);

const currentTime = ref(props.initialTime);
const startTime = ref<Date | null>(null);

let timer: ReturnType<typeof setInterval> | null = null;

const formattedTime = computed(() => {
  const minutes = Math.floor(currentTime.value / 60);
  const seconds = currentTime.value % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const elapsedTime = computed(() => {
    if (!startTime.value) {
        return 0;
    }
    return Math.floor((new Date().getTime() - startTime.value.getTime()) / 1000);
});

const startCountdown = () => {
  if (!timer) {
    startTime.value = new Date();
    timer = setInterval(() => {
      if (currentTime.value > 0) {
        currentTime.value--;
      } else {
        stopTimer();
      }
    }, 1000);
  }
};

const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const resetTimer = () => {
  currentTime.value = props.initialTime;
  stopTimer();
};

onMounted(() => {
  resetTimer();
  if (props.startTimer) {
    startCountdown();
  }
});

onUnmounted(() => {
  stopTimer();
  emit('update:resttime', elapsedTime.value);
});
</script>

<template>
<ion-grid class="ion-align-items-center" style="height: 100%;">
  <ion-row class="ion-justify-content-center">
    <ion-col size="auto">
      <ion-label class="label-text">{{ $t('workouts.break') }}</ion-label>
    </ion-col>
  </ion-row>
  <ion-row class="ion-justify-content-center">
    <ion-col size="auto">
      <ion-label class="label-text">{{ formattedTime }}</ion-label>
    </ion-col>
  </ion-row>
</ion-grid>
</template>

<style scoped>
.label-text {
  font-size: 2rem;
}
</style>
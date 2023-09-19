<script setup lang="ts">
import { modalController } from '@ionic/vue';
import BaseCard from './Cards/BaseCard.vue';
import ActivityDetailModal from './Modals/ActivityDetailModal.vue';
import { extractTimeFromTS, dateToIsoString } from '@/helpers/time';
import { useWorkoutSessionStore, useWorkoutStore } from '@/store/workoutStore';
import { defaultImage } from '@/composables/supabase';
import { ref } from 'vue';

const workoutSessionStore = useWorkoutSessionStore();
const workoutStore = useWorkoutStore();
const workoutSessions = ref(workoutSessionStore.getWorkoutSessions);

const getWorkoutName = (workoutId: number) => {
  const workout = workoutStore.getWorkoutById(workoutId);
  if (!workout) {
    return 'Workout';
  }
    return workout.name;
}

const openModal = async (workoutSessionId: Number) => {
  if ( !workoutSessionId ) {
    return
  }
  const modal = await modalController.create({
    component: ActivityDetailModal,
    componentProps: {
      workoutSessionId: workoutSessionId
    },
  });
  await modal.present();
}
</script>

<template>
  <div class="ion-padding">
    <div
      v-for="workoutSession in workoutSessions"
      :key="workoutSession.id"
      class="timeline-item"
    >
      <div class="timeline-header">
        <div class="timeline-dot"></div>
        <div class="timeline-title">{{ dateToIsoString(new Date(workoutSession.finishedAt)) + ` ` + extractTimeFromTS(new Date(workoutSession.finishedAt)) }}</div>
      </div>
      <div class="timeline-content">
        <BaseCard
          :img_src="defaultImage"
          :title="getWorkoutName(workoutSession.workoutId)"
          :button="true"
          @click="openModal(workoutSession.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ion-padding {
  position: relative;
  
  /* This is the vertical line */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 21px; /* Adjust this value as needed to center on the dots */
    width: 2px;
    background: var(--ion-color-primary);
    z-index: 0; 
  }
}
.timeline-item {
  display: relative;
  padding: 10px 0;
  width: 100%;
}

.timeline-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  background: var(--ion-color-primary);
  border-radius: 50%;
  z-index: 1;
  margin-right: 10px;
  position: relative;
}

.timeline-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.timeline-content {
  border-radius: 4px;
  margin: 5px 0 5px 22px;
}
</style>
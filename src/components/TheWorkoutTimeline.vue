<script setup lang="ts">
import { modalController } from '@ionic/vue';
import BaseCard from './Cards/BaseCard.vue';
import ActivityDetailModal from './Modals/ActivityDetailModal.vue';
import { dateToIsoString } from '@/helpers/time';
import { useWorkoutSessionStore, useWorkoutStore } from '@/store/workoutStore';
import { defaultImage } from '@/composables/supabase';
import { ref } from 'vue';

const workoutSessionStore = useWorkoutSessionStore();
const workoutStore = useWorkoutStore();
const workoutSessions = ref(workoutSessionStore.getWorkoutSessions);
const uniqueWorkoutSessionDates = ref(workoutSessions.value.map(workoutSession => dateToIsoString(workoutSession.finished_at))
                                                                .filter((value, index, self) => self.indexOf(value) === index)
                                                                .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()));

const getWorkoutName = (workoutId: string) => {
  const workout = workoutStore.getWorkoutById(workoutId);
  if (!workout) {
    return 'Workout';
  }
    return workout.name;
}

const openModal = async (workoutSessionId: string) => {
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

workoutSessionStore.$subscribe((mutation, state) => {
  workoutSessions.value = workoutSessionStore.getWorkoutSessions;
  uniqueWorkoutSessionDates.value = workoutSessions.value.map(workoutSession => dateToIsoString(workoutSession.finished_at))
                                                         .filter((value, index, self) => self.indexOf(value) === index)
                                                         .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
});
</script>

<template>
  <div class="ion-padding">
    <div
      v-for="date in uniqueWorkoutSessionDates"
      :key="date"
    >
      <div class="timeline-title">{{ dateToIsoString(new Date(date)) }}</div>
      <div
        v-for="workoutSession in workoutSessions.filter(workoutSession => dateToIsoString(workoutSession.finished_at) === date)"
        :key="workoutSession.id"
      >
        <BaseCard
          :img_src="defaultImage"
          :title="getWorkoutName(workoutSession.workout_id)"
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
}
.timeline-title {
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
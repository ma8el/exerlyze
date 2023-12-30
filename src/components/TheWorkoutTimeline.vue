<script setup lang="ts">
import { IonText } from '@ionic/vue';
import ActivityWorkoutList from './ActivityWorkoutList.vue';
import { dateToIsoString, dateToLocaleString } from '@/helpers/time';
import { useWorkoutSessionStore } from '@/store/workoutStore';
import { ref, onMounted } from 'vue';

const workoutSessionStore = useWorkoutSessionStore();
const uniqueWorkoutSessionDates = ref<string[]>([]);

const getUniqueWorkoutSessionDates = () => {
  return workoutSessionStore.getWorkoutSessions.map(workoutSession => dateToIsoString(workoutSession.finished_at))
                                               .filter((value, index, self) => self.indexOf(value) === index)
                                               .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
}
workoutSessionStore.$subscribe((mutation, state) => {
  uniqueWorkoutSessionDates.value = getUniqueWorkoutSessionDates();
});

onMounted(() => {
  uniqueWorkoutSessionDates.value = getUniqueWorkoutSessionDates();
});
</script>

<template>
  <div class="ion-padding">
    <div
      v-for="date in uniqueWorkoutSessionDates"
      :key="date"
    >
      <div class="timeline-title">{{ dateToLocaleString(new Date(date)) }}</div>
      <ActivityWorkoutList
        :selectedDate="new Date(date)"
      />
    </div>
    <div 
      v-if="uniqueWorkoutSessionDates.length === 0"
      class="no-workouts-container ion-justify-content-center ion-align-items-center"
    >
      <ion-text
       class="ion-text-center"
      >
        {{ $t('workouts.noWorkoutsYet') }}
      </ion-text>
    </div>
  </div>
</template>

<style scoped>
.no-workouts-container {
  height: 50vh;
  display: flex;
  flex-direction: column;
  :is(ion-text) {
    color: #888888;
    text-align: center;
  }
}
.ion-padding {
  position: relative;
}
.timeline-title {
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
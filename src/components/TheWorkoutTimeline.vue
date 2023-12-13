<script setup lang="ts">
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
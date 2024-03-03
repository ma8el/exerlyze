<script setup lang="ts">
import BaseCard from './BaseCard.vue';
import StartWorkoutButton from '../Buttons/StartWorkoutButton.vue';
import ResultsCard from './ResultsCard.vue';
import { useWorkoutStore, useWorkoutSessionStore } from '@/store/workoutStore';
import { ref, computed, onMounted, PropType } from 'vue';
import { FullWorkoutSession } from '@/types';

const props = defineProps({
    workoutId: {
        type: String,
        required: true,
    },
    workoutName: {
        type: String,
        required: true,
    },
    exerciseIds: {
        type: Array as PropType<number[]>,
        required: false,
        default: [1],
    },
    scheduledOn: {
        type: String,
        required: true,
    },
});

const workoutStore = useWorkoutStore();
const workoutSessionStore = useWorkoutSessionStore();

const loading = ref<boolean>(true)
const url = ref<string>()

const workoutSessions = computed(() => {
    return workoutSessionStore.getFullWorkoutSessionsOfToday;
});

const isPerformed = (workoutId: string) => {
  return workoutSessions.value.some((workoutSession) => workoutSession.workout_id == workoutId);
}

const getWorkoutSession = (workoutId: string): FullWorkoutSession => {
  const workoutSession = workoutSessions.value.find((workoutSession) => workoutSession.workout_id == workoutId);
  if (workoutSession) {
    return workoutSession;
  } else {
    return {} as FullWorkoutSession;
  }
}

const getRandomExerciseId = () => {
  return props.exerciseIds[Math.floor(Math.random() * props.exerciseIds.length)];
}

onMounted(async () => {
  loading.value = true
  const exerciseId = getRandomExerciseId();
  url.value = await workoutStore.getWorkoutImageUrl(exerciseId)
  loading.value = false
})
</script>


<template>
  <BaseCard
    v-if="!isPerformed(workoutId) && !loading"
    title-col-size="12"
    :img_src="url"
    :title="workoutName"
    :content="true"
    :sub-title="true"
  >
    <template #subtitle>
      {{ $t('scheduledOn') }} {{ scheduledOn }}
    </template>
    <StartWorkoutButton :workoutId="workoutId" />
  </BaseCard>
  <ResultsCard
    v-if="Object.keys(getWorkoutSession(workoutId)).length !== 0"
    :workoutSession="getWorkoutSession(workoutId)"
  />
 
</template>
<script setup lang="ts">
import BaseCard from './BaseCard.vue';
import StartWorkoutButton from '../Buttons/StartWorkoutButton.vue';
import ResultsCard from './ResultsCard.vue';
import { defaultImage, getBucketUrlFromTable, getSignedObjectUrl } from '@/composables/supabase';
import { useWorkoutSessionStore } from '@/store/workoutStore';
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

const workoutSessionStore = useWorkoutSessionStore();

const loading = ref<boolean>(true)
const ressourceName = ref<string>()
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
  await getBucketUrlFromTable('exercises', exerciseId).then((response) => {
    ressourceName.value = response.data?.ressource_name
  })
  if (!ressourceName.value) return
  await getSignedObjectUrl('exercise_images', `${ressourceName.value}.jpg`).then((response) => {
    url.value = response.data?.signedUrl
  })
  loading.value = false
})
</script>


<template>
  <BaseCard
    v-if="!isPerformed(workoutId) && !loading"
    :img_src="url ? url : defaultImage"
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
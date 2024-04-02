<script setup lang="ts">
import BaseCard from './BaseCard.vue';
import StartWorkoutButton from '../Buttons/StartWorkoutButton.vue';
import { useWorkoutStore, useWorkoutPlanStore, useWorkoutSessionStore } from '@/store/workoutStore';
import { ref, onMounted, PropType } from 'vue';

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

const loading = ref<boolean>(true)
const url = ref<string>()

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
    v-if="!loading"
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
</template>
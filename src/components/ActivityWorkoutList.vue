<script setup lang="ts">
  import { IonList,
           modalController } from '@ionic/vue';
  import { ref, onMounted } from 'vue';
  import BaseCard from '@/components/Cards/BaseCard.vue';
  import CardSkeleton from './Skeletons/CardSkeleton.vue';
  import ActivityDetailModal from '@/components/Modals/ActivityDetailModal.vue';
  import { useWorkoutStore, useWorkoutSessionStore } from '@/store/workoutStore';
  import { defaultImage } from '@/composables/supabase';

  const props = defineProps({
    selectedDate: {
      type: Date,
      required: true
    }
  })

  const loading = ref<boolean>(true)

  const workoutSessionStore = useWorkoutSessionStore();
  const workoutStore = useWorkoutStore();

  const workoutSessions = workoutSessionStore.getFullWorkoutSessionsByDate(props.selectedDate);

  const urls = ref<string[]>([])

  const openModal = async (workoutSessionId: String) => {
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

  const getRandomImageUrlFromSessions = async () => {
    if ( !workoutSessions ) {
      return defaultImage
    }
    const exerciseIds = workoutSessions.map((workoutSession) => {
      return workoutSession.workout.exercises.map((exercise) => {
        return exercise.exercise_id
      })
    })
    const randomExerciseIds = exerciseIds.map((ids) => {
      return ids[Math.floor(Math.random() * ids.length)]
    })

    const imageUrls = await Promise.all(randomExerciseIds.map(async (exerciseId) => {
      return await workoutStore.getWorkoutImageUrl(Number(exerciseId))
    }))
    urls.value = imageUrls
  }

  onMounted(async () => {
    loading.value = true
    await getRandomImageUrlFromSessions()
    loading.value = false
  })
</script>

<template>
 <ion-list 
    v-if="workoutSessions"
    class="workout-list"
  >
    <div
      v-for="(workoutSession, index) in workoutSessions"
      :key="index"
    >
      <BaseCard
        v-if="!loading"
        :img_src="urls[index]"
        :title="workoutSession.workout.name"
        :subTitle="true"
        :button="true"
        @click="openModal(workoutSession.id)"
      >
        <template #subtitle>
          {{  workoutSession.workout.exercises.length + ' exercises'  }}
        </template>
      </BaseCard>
      <CardSkeleton v-else/>
    </div>
  </ion-list>
</template>

<style scoped>
.workout-list {
  background: none;
  :is(ion-list-header) {
    margin-bottom: 15px;
  }
  :is(ion-item) {
    border-radius: 10px;
    :is(ion-icon) {
      margin-right: 5px;
      width: 15px;
      height: 15px;
    }
    :is(ion-input) {
      --background: var(--ion-color-step-100);
      border-radius: 10px;
      margin: 0 2px 0 2px;
      padding: 0;
    }
    :is(ion-item) {
      margin: 5px 0 5px 0;
      padding: 0;
    }
  }
}
</style>
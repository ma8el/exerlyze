<script setup lang="ts">
  import { IonList,
           modalController } from '@ionic/vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import BaseCard from '../Cards/BaseCard.vue';
  import ActivityDetailModal from './ActivityDetailModal.vue';
  import { dateToIsoString, extractTimeFromTS } from '@/helpers/time';
  import { useWorkoutSessionStore } from '@/store/workoutStore';
  import { defaultImage } from '@/composables/supabase';

  const props = defineProps({
    selectedDate: {
      type: Date,
      required: true
    }
  })

  const workoutSessionStore = useWorkoutSessionStore();
  const workoutSessions = workoutSessionStore.getFullWorkoutSessionsByDate(props.selectedDate);

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
  <BaseFullPageModal
    :saveButton="false"
  >
    <template #modalHeader>
      <p class="header-title">{{ $t('activities') }}</p>
    </template>
    <template #modalContent>
      <ion-list 
        v-if="workoutSessions"
        class="exercise-list"
      >
        <ion-list-header>
          {{ dateToIsoString(selectedDate) }}
        </ion-list-header>
        <div
          v-for="(workoutSession, index) in workoutSessions"
          :key="index"
        >
          <BaseCard
            :img_src="defaultImage"
            :title="workoutSession.workout.name"
            :subTitle="workoutSession.workout.exercises.length + ' exercises'"
            :button="true"
            @click="openModal(workoutSession.id)"
          />
        </div>
      </ion-list>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
.header-title {
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
}
.exercise-list {
  background: none;
  ion-list-header {
    margin-bottom: 15px;
  }
  ion-item {
    border-radius: 10px;
    ion-icon {
      margin-right: 5px;
      width: 15px;
      height: 15px;
    }
    ion-input {
      --background: var(--ion-color-step-100);
      border-radius: 10px;
      margin: 0 2px 0 2px;
      padding: 0;
    }
    ion-item {
      margin: 5px 0 5px 0;
      padding: 0;
    }
  }
}
.exercise-list-item {
  margin: 10px;
}
</style>
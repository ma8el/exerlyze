<script setup lang="ts">
  import { IonListHeader,
           IonLabel } from '@ionic/vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import ActivityWorkoutList from '../ActivityWorkoutList.vue';
  import OverviewCard from '../Cards/OverviewCard.vue';
  import { useWorkoutSessionStore } from '@/store/workoutStore';
  import { dateToLocaleString } from '@/helpers/time';

  const props = defineProps({
    selectedDate: {
      type: Date,
      required: true
    }
  })

  const workoutSessionStore = useWorkoutSessionStore();
  const workoutSessions = workoutSessionStore.getFullWorkoutSessionsByDate(props.selectedDate);
</script>

<template>
  <BaseFullPageModal
    :saveButton="false"
  >
    <template #modalHeader>
      <p class="header-title">{{ $t('activities') }}</p>
    </template>
    <template #modalContent>
      <ion-label class="ion-margin">
        {{ dateToLocaleString(selectedDate) }}
      </ion-label>
      <OverviewCard
        :date="selectedDate"
      />
      <div v-if="workoutSessions">
        <ion-list-header v-if="workoutSessions.length > 0">
          {{ $t('home.performedWorkouts') }}
        </ion-list-header>
      </div>
      <ActivityWorkoutList
        :selectedDate="selectedDate"
      />
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
</style>
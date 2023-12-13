<script setup lang="ts">
  import { IonList,
           IonListHeader,
           IonLabel,
           modalController } from '@ionic/vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import BaseCard from '../Cards/BaseCard.vue';
  import OverviewCard from '../Cards/OverviewCard.vue';
  import ActivityDetailModal from './ActivityDetailModal.vue';
  import { useWorkoutSessionStore } from '@/store/workoutStore';
  import { defaultImage } from '@/composables/supabase';
  import { useUserSettingsStore } from '@/store/userSettingsStore';

  const props = defineProps({
    selectedDate: {
      type: Date,
      required: true
    }
  })

  const userSettingsStore = useUserSettingsStore();
  const workoutSessionStore = useWorkoutSessionStore();
  const workoutSessions = workoutSessionStore.getFullWorkoutSessionsByDate(props.selectedDate);
  console.log(workoutSessions);

  const locale = userSettingsStore.locale;
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };

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
        {{ selectedDate.toLocaleDateString(locale, dateOptions) }}
      </ion-label>
      <OverviewCard
        :date="selectedDate"
      />
      <div v-if="workoutSessions">
        <ion-list-header v-if="workoutSessions.length > 0">
          {{ $t('home.performedWorkouts') }}
        </ion-list-header>
      </div>
      <ion-list 
        v-if="workoutSessions"
        class="exercise-list"
      >
        <div
          v-for="(workoutSession, index) in workoutSessions"
          :key="index"
        >
          <BaseCard
            :img_src="defaultImage"
            :title="workoutSession.workout.name"
            :subTitle="true"
            :button="true"
            @click="openModal(workoutSession.id)"
          >
            <template #subtitle>
              {{  workoutSession.workout.exercises.length + ' exercises'  }}
            </template>
          </BaseCard>
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
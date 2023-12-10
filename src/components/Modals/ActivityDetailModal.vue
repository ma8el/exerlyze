<script setup lang="ts">
  import { IonInput,
           IonIcon,
           IonRow,
           IonCol,
           IonListHeader,
           IonList,
           IonItem,
           IonLabel,
           modalController } from '@ionic/vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import BaseInfoCard from '../Cards/BaseInfoCard.vue';
  import UpdateIcon from '@/icons/update.svg';
  import SetIcon from '@/icons/set.svg';
  import RepsIcon from '@/icons/reps.svg';
  import WeightIcon from '@/icons/weight.svg';
  import TimeIcon from '@/icons/time.svg';
  import { useWorkoutSessionStore } from '@/store/workoutStore';
  import { computed } from 'vue';
  import { WorkoutSessionPerformance } from '@/types';

  const props = defineProps({
    workoutSessionId: {
      type: String,
      required: true
    }
  })

  const workoutSessionStore = useWorkoutSessionStore();
  const workoutSession = JSON.parse(JSON.stringify(workoutSessionStore.getFullWorkoutSessionById(props.workoutSessionId)));

  const totalSets = computed(() => {
    if (!workoutSession) {
      return 0;
    }
    return workoutSession.workoutPerformance.length;
  });

  const totalReps = computed(() => {
    if (!workoutSession) {
      return 0;
    }
    return workoutSession.workoutPerformance.reduce((acc: number, set: WorkoutSessionPerformance) => acc + set.performed_reps, 0);
  });

  const totalWeight = computed(() => {
    if (!workoutSession) {
      return 0;
    }
    return workoutSession.workoutPerformance.reduce((acc: number, set: WorkoutSessionPerformance) => acc + set.performed_reps * set.performed_weight, 0);
  });

  const workoutDuration = computed(() => {
    if (!workoutSession) {
      return 0;
    }
    const hours = Math.abs(new Date(workoutSession.finished_at).getHours() - new Date(workoutSession.started_at).getHours());
    const minutes = Math.abs(new Date(workoutSession.finished_at).getMinutes() - new Date(workoutSession.started_at).getMinutes());
    const seconds = Math.abs(new Date(workoutSession.finished_at).getSeconds() - new Date(workoutSession.started_at).getSeconds());
    const formattedDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedDuration;
  });

  const updatePerformedWeight = (index: number, value: any) => {
    workoutSession.workoutPerformance[index].performed_weight = parseFloat(value.detail.value)
  };

  const updatePerformedReps = (index: number, value: any) => {
    workoutSession.workoutPerformance[index].performed_reps = parseInt(value.detail.value)
  };

  const update = () => {
    if (workoutSession) {
      workoutSessionStore.updateWorkoutSessionById(props.workoutSessionId, workoutSession.workoutPerformance);
      return modalController.dismiss(null, 'save');
    }
  };
</script>

<template>
  <BaseFullPageModal title="Activities">
    <template #saveButton>
      <ion-icon :icon="UpdateIcon" @click="update"/>
    </template>
    <template #modalHeader>
      <p class="header-title">{{ workoutSession?.workout.name }}</p>
    </template>
    <template #modalContent>
      <ion-row class="ion-padding">
        <ion-col size="6">
          <BaseInfoCard
            :title="$t('workouts.set', 2)"
            :subTitle="totalSets"
            :icon="SetIcon"
          ></BaseInfoCard>
        </ion-col>
        <ion-col size="6">
          <BaseInfoCard
            :title="$t('workouts.reps')"
            :subTitle="totalReps"
            :icon="RepsIcon"
          />
        </ion-col>
      </ion-row>
      <ion-row class="ion-padding">
        <ion-col size="6">
          <BaseInfoCard
            :title="$t('workouts.volume')"
            :subTitle="totalWeight + ` ` + $t('weightUnitBig')"
            :icon="WeightIcon"
          />
        </ion-col>
        <ion-col size="6">
          <BaseInfoCard
            :title="$t('duration')"
            :subTitle="workoutDuration"
            :icon="TimeIcon"
          />
        </ion-col>
      </ion-row>
      <ion-list 
        v-if="workoutSession"
        class="exercise-list"
      >
        <div
          v-for = "(exercise, index) in workoutSession.workout.exercises"
          :key="index"
          class="exercise-list-item"
        >
          <ion-list-header
            v-if="exercise.name"
          >
            {{ exercise.name }}
          </ion-list-header>
 
          <div
            v-for = "(set, index) in workoutSession.workoutPerformance.filter((set: WorkoutSessionPerformance) => set.exercise_id === exercise.exercise_id)"
            :key="index"
            class="exercise-list-item"
          >
            <ion-item 
              lines="none"
              ref="setRefs"
            >
              <ion-item lines="none" slot="start">
                <ion-label>
                  <ion-icon :icon="SetIcon"></ion-icon>
                  {{ index + 1 }}
                </ion-label>
              </ion-item>
              <ion-item lines="none">
                <ion-icon slot="start" :icon="RepsIcon"></ion-icon>
                <ion-input 
                  :value="set.performed_reps"
                  :clear-on-edit="true"
                  @ion-input="value => updatePerformedReps(index, value)"
                  type="number"
                  inputmode="numeric"
                >
                </ion-input>
                <ion-label slot="end">{{ $t('workouts.reps') }}</ion-label>
              </ion-item>
              <ion-item lines="none">
                <ion-icon slot="start" :icon="WeightIcon"></ion-icon>
                <ion-input 
                  :value="set.performed_weight"
                  :clear-on-edit="true"
                  @ion-input="value => updatePerformedWeight(index, value)"
                  type="number"
                  inputmode="numeric"
                >
                </ion-input>
                <ion-label slot="end">{{ $t('weightUnitBig') }}</ion-label>
              </ion-item>
            </ion-item>
          </div>
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
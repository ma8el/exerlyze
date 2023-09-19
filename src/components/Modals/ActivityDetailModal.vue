<script setup lang="ts">
  import { IonInput,
           IonCardTitle,
           IonCardHeader,
           IonCardSubtitle,
           IonIcon,
           IonList,
           IonItem,
           IonLabel,
           modalController } from '@ionic/vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import BaseInfoCard from '../Cards/BaseInfoCard.vue';
  import { bookmarkOutline } from 'ionicons/icons';
  import { useWorkoutSessionStore } from '@/store/workoutStore';
  import { computed } from 'vue';

  const props = defineProps({
    workoutSessionId: {
      type: Number,
      required: true
    }
  })

  const workoutSessionStore = useWorkoutSessionStore();
  const workoutSession = workoutSessionStore.getFullWorkoutSessionById(props.workoutSessionId);

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
    console.log(workoutSession.workoutPerformance.reduce((acc, set) => acc + set.performedReps, 0));
    return workoutSession.workoutPerformance.reduce((acc, set) => acc + parseInt(set.performedReps), 0);
  });

  const totalWeight = computed(() => {
    if (!workoutSession) {
      return 0;
    }
    return workoutSession.workoutPerformance.reduce((acc, set) => acc + parseFloat(set.performedWeight), 0);
  });

  const workoutDuration = computed(() => {
    if (!workoutSession) {
      return 0;
    }
    const hours = Math.abs(new Date(workoutSession.finishedAt).getHours() - new Date(workoutSession.startedAt).getHours());
    const minutes = Math.abs(new Date(workoutSession.finishedAt).getMinutes() - new Date(workoutSession.startedAt).getMinutes());
    const seconds = Math.abs(new Date(workoutSession.finishedAt).getSeconds() - new Date(workoutSession.startedAt).getSeconds());
    const formattedDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedDuration;
  });

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
      <ion-icon src="../../../assets/icons/update.svg" @click="update"/>
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
            icon-source="../../../assets/icons/set.svg"
          ></BaseInfoCard>
        </ion-col>
        <ion-col size="6">
          <BaseInfoCard
            :title="$t('workouts.reps')"
            :subTitle="totalReps"
            icon-source="../../../assets/icons/reps.svg"
          />
        </ion-col>
      </ion-row>
      <ion-row class="ion-padding">
        <ion-col size="6">
          <BaseInfoCard
            :title="$t('workouts.volume')"
            :subTitle="totalWeight + ` ` + $t('weightUnitBig')"
            icon-source="../../../assets/icons/weight.svg"
          />
        </ion-col>
        <ion-col size="6">
          <BaseInfoCard
            :title="$t('duration')"
            :subTitle="workoutDuration"
            icon-source="../../../assets/icons/time.svg"
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
            v-for = "(set, index) in workoutSession.workoutPerformance.filter(set => set.exerciseId === exercise.id)"
            :key="index"
            class="exercise-list-item"
          >
            <ion-item 
              lines="none"
              ref="setRefs"
            >
              <ion-item lines="none" slot="start">
                <ion-label>
                  <ion-icon src="../../../assets/icons/set.svg"></ion-icon>
                  {{ index + 1 }}
                </ion-label>
              </ion-item>
              <ion-item lines="none">
                <ion-icon slot="start" src="../../../assets/icons/reps.svg"></ion-icon>
                <ion-input 
                  :value="set.performedReps"
                  :clear-on-edit="true"
                  v-model="set.performedReps"
                >
                </ion-input>
                <ion-label slot="end">{{ $t('workouts.reps') }}</ion-label>
              </ion-item>
              <ion-item lines="none">
                <ion-icon slot="start" src="../../../assets/icons/weight.svg"></ion-icon>
                <ion-input 
                  :value="set.performedWeight"
                  :clear-on-edit="true"
                  v-model="set.performedWeight"
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
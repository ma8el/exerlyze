<script setup lang="ts">
  import { IonIcon,
           IonRow,
           IonCol,
           modalController } from '@ionic/vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import BaseInfoCard from '../Cards/BaseInfoCard.vue';
  import UpdateIcon from '@/icons/update.svg';
  import SetIcon from '@/icons/set.svg';
  import RepsIcon from '@/icons/reps.svg';
  import WeightIcon from '@/icons/weight.svg';
  import TimeIcon from '@/icons/time.svg';
  import WorkoutExerciseItem from '../WorkoutExerciseItem.vue';
  import { useWorkoutSessionStore } from '@/store/workoutStore';
  import { ref, computed } from 'vue';
  import { FullWorkoutSession, WorkoutSessionPerformance, FullWorkoutSessionSet } from '@/types';

  interface ChangedWorkoutSessionPerformance extends WorkoutSessionPerformance {
    changed?: boolean;
  }

  const props = defineProps({
    workoutSessionId: {
      type: String,
      required: true
    }
  })

  const workoutSessionStore = useWorkoutSessionStore();
  // Copy workout session to prevent changes to workout session store without saving
  const workoutSession = ref<FullWorkoutSession | undefined>(JSON.parse(JSON.stringify(workoutSessionStore.getFullWorkoutSessionById(props.workoutSessionId))));
  const workoutSessionSets = computed((): ChangedWorkoutSessionPerformance[] => {
    if (!workoutSession.value) {
      return [];
    }
   return workoutSession.value.workoutPerformance;
  });

  const totalSets = computed(() => {
    if (!workoutSession.value) {
      return 0;
    }
    return workoutSession.value.workoutPerformance.length;
  });

  const totalReps = computed(() => {
    if (!workoutSession.value) {
      return 0;
    }
    return workoutSession.value.workoutPerformance.reduce((acc: number, set: WorkoutSessionPerformance) => acc + set.performed_reps, 0);
  });

  const totalWeight = computed(() => {
    if (!workoutSession.value) {
      return 0;
    }
    return workoutSession.value.workoutPerformance.reduce((acc: number, set: WorkoutSessionPerformance) => acc + set.performed_reps * set.performed_weight, 0);
  });

  const workoutDuration = computed(() => {
    if (!workoutSession.value) {
      return 0;
    }
    const hours = Math.abs(new Date(workoutSession.value.finished_at).getHours() - new Date(workoutSession.value.started_at).getHours());
    const minutes = Math.abs(new Date(workoutSession.value.finished_at).getMinutes() - new Date(workoutSession.value.started_at).getMinutes());
    const seconds = Math.abs(new Date(workoutSession.value.finished_at).getSeconds() - new Date(workoutSession.value.started_at).getSeconds());
    const formattedDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedDuration;
  });

  const update = async () => {
    if (workoutSession.value) {
      const changedSets = workoutSessionSets.value.filter((set: ChangedWorkoutSessionPerformance) => set.changed)
                          .map(({ changed, ...rest }: ChangedWorkoutSessionPerformance) => rest);
      await workoutSessionStore.updateWorkoutSessionById(props.workoutSessionId, changedSets);
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
      <div
        class="ion-margin"
      >
      <WorkoutExerciseItem
        v-for = "(set, index) in workoutSessionSets"
        :key="index"
        :exerciseId="set.exercise_id"
        :name="set.exercise_name"
        :transitionTrigger="true"
        :show-video="false"
        :currentSet="set.set"
        v-model:reps="workoutSessionSets[index].performed_reps"
        v-model:weight="workoutSessionSets[index].performed_weight"
        v-model:resttime="workoutSessionSets[index].performed_resttime"
        @update:reps="workoutSessionSets[index].changed = true"
        @update:weight="workoutSessionSets[index].changed = true"
        :show-break="false"
      />
      </div>
    </template>
  </BaseFullPageModal>
</template>

<style scoped lang="scss">
.header-title {
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
}
</style>
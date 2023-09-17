<script setup lang="ts">
import { IonItem,
         IonList,
         IonListHeader,
         IonLabel,
         IonInput,
         IonFab,
         IonFabButton,
         IonIcon,
         modalController } from '@ionic/vue';
import { bookmarkOutline, playForwardOutline, checkmarkDoneOutline } from 'ionicons/icons';
import BaseFullPageModal from './BaseFullPageModal.vue';
import ActiveExerciseCard from '../Cards/ActiveExerciseCard.vue';
import { useWorkoutSessionStore, useWorkoutStore } from '@/store/workoutStore';
import { ref, onMounted, computed, watch } from 'vue';

const props = defineProps({
  workoutId: {
    type: Number,
    required: true
  }
});

const workoutStore = useWorkoutStore();
const workoutSessionStore = useWorkoutSessionStore();

const startedAt = ref<Date>(new Date());
const currentSet = ref<number>(0);
const currentReps = ref<number>(0);
const currentWeight = ref<number>(0);

const workout = workoutStore.getWorkoutById(props.workoutId);
const workoutSessionSets = workoutSessionStore.createFullWorkoutSessionSets(props.workoutId);

const currentWorkoutSet = computed(() => {
  if (!workoutSessionSets) {
    return undefined;
  }
  return workoutSessionSets[currentSet.value];
});

const save = () => {
    if (!workoutSessionSets) {
      return;
    }
    const workoutSessionId = workoutSessionStore.getNewWorkoutSessionId
    const userId = 'markus';
    // TODO: Track not fully completed workouts
    workoutSessionStore.addWorkoutSession({
      id: workoutSessionId,
      userId: userId,
      workoutId: props.workoutId,
      createdAt: new Date(),
      updatedAt: new Date(),
      // TODO: scheduledAt should come from workoutSchedule
      scheduledAt: new Date(),
      startedAt: startedAt.value,
      finishedAt: new Date(),
      notes: '',
    })
    workoutSessionStore.addWorkoutSessionPerformances(
      workoutSessionSets.map((set, index) => ({
        id: workoutSessionStore.getNewWorkoutSessionPerformanceId + index,
        userId: userId,
        workoutSessionId: workoutSessionId,
        exerciseId: set.exerciseId,
        set: index,
        plannedReps: set.plannedReps,
        performedReps: set.reps,
        plannedWeight: set.plannedWeight,
        performedWeight: set.weight,
        restTime: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
    return modalController.dismiss(null, 'close');
};

const nextSet = () => {
  if (!currentWorkoutSet.value) {
    return;
  }
  currentWorkoutSet.value.reps = currentReps.value;
  currentWorkoutSet.value.weight = currentWeight.value;
  if (workoutSessionSets && currentSet.value === workoutSessionSets.length - 1) {
    return;
  }
  currentSet.value++;
};

const isFinished = computed(() => {
  if (!workoutSessionSets) {
    return false;
  }
  return currentSet.value === workoutSessionSets.length - 1;
});

watch(currentSet, (newValue) => {
  if(workoutSessionSets && workoutSessionSets[newValue]) {
    currentReps.value = workoutSessionSets[newValue].reps;
    currentWeight.value = workoutSessionSets[newValue].weight;
    console.log(workoutSessionSets[newValue]);
  }
}, { immediate: true });

onMounted(() => {
  currentSet.value = 0;
  startedAt.value = new Date();
  console.log(currentWorkoutSet.value);
});
</script>

<template>
  <BaseFullPageModal v-if="workout" back-color="dark">
    <template #saveButton>
      <ion-icon :icon="bookmarkOutline" @click="save"/>
    </template>
    <template #modalHeader>
      <ActiveExerciseCard v-if="currentWorkoutSet"
        class="active-exercise-card"
        :exerciseId="currentWorkoutSet.exerciseId"
        :name="currentWorkoutSet.name"
      />
    </template>
    <template v-if="workoutSessionSets" #modalContent>
      <ion-list class="exercise-list">
        <div
          v-for = "(set, index) in workoutSessionSets"
          :key="index"
          class="ion-padding"
        >
        <ion-list-header
          v-if="set.currentSet === 1"
        >
          {{ set.name }}
        </ion-list-header>
        <ion-item 
          lines="none"
          :class="{ 'highlighted': currentSet === set.id  }"
        >
          <ion-item lines="none" slot="start">
            <ion-label>
              <ion-icon src="../../../assets/icons/set.svg"></ion-icon>
              {{ set.currentSet }}
            </ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-icon slot="start" src="../../../assets/icons/reps.svg"></ion-icon>
            <ion-input 
              :value="set.plannedReps"
              :clear-on-edit="true"
              v-model="set.reps"
            >
            </ion-input>
            <ion-label slot="end">{{ $t('workouts.reps') }}</ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-icon slot="start" src="../../../assets/icons/weight.svg"></ion-icon>
            <ion-input 
              :value="set.plannedWeight"
              :clear-on-edit="true"
              v-model="set.weight"
            >
            </ion-input>
            <ion-label slot="end">{{ $t('weightUnitBig') }}</ion-label>
          </ion-item>
        </ion-item>
        </div>
      </ion-list>
    </template>
    <template #modalFooter>
      <ion-fab 
        vertical="bottom"
        horizontal="end"
        v-if="!isFinished"
      >
          <ion-fab-button color="primary">
            <ion-icon 
              :icon="playForwardOutline"
              @click="nextSet"
            >
            </ion-icon>
          </ion-fab-button>
      </ion-fab>
      <ion-fab 
        vertical="bottom"
        horizontal="end"
        v-else
      >
          <ion-fab-button color="primary">
            <ion-icon 
              :icon="checkmarkDoneOutline"
              @click="save"
            >
            </ion-icon>
          </ion-fab-button>
      </ion-fab>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
.active-exercise-card {
  margin: 0 0 20px 0;
}

.exercise-list {
  background: none;
  ion-list-header {
    margin-bottom: 15px;
  }
  ion-item {
    border-radius: 10px;
    transition: opacity 0.5s ease, transform 0.5s ease;
    opacity: 0.5;
    transform: scale(1);
    ion-icon {
      margin-right: 5px;
      width: 15px;
      height: 15px;
    }
    ion-input {
      --background: var(--ion-color-step-100);
      border-radius: 10px;
      margin: 0 5px 0 5px;
    }
    ion-item {
      margin: 10px 0 10px 0;
      padding: 0;
    }
  }
}

ion-item.highlighted {
  opacity: 1 !important;
  transform: scale(1.05) !important;
  ion-icon {
    opacity: 1 !important;
  }
  ion-input {
    opacity: 1 !important;
  }
  ion-item {
    opacity: 1 !important;
  }
}
</style>
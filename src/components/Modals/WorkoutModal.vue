<script setup lang="ts">
import { IonButton,
         IonAccordion,
         IonAccordionGroup,
         IonItem,
         IonLabel,
         IonFab,
         IonFabButton,
         IonIcon,
         modalController } from '@ionic/vue';
import { playForwardOutline, checkmarkDoneOutline } from 'ionicons/icons';
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
        exerciseId: set.id,
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
  }
}, { immediate: true });

onMounted(() => {
  currentSet.value = 0;
  startedAt.value = new Date();
});
</script>

<template>
  <BaseFullPageModal v-if="workout" :title="workout.name">
    <template #saveButton>
      <ion-button @click="save">Save</ion-button>
    </template>
    <template v-if="workoutSessionSets" #modalContent>
      <ActiveExerciseCard v-if="currentWorkoutSet"
        :name="currentWorkoutSet.name"
        :currentSet="currentWorkoutSet.currentSet"
        v-model:reps="currentReps"
        v-model:weight="currentWeight"
      />
      <ion-accordion-group 
        v-if="workout"
        :multiple="true"
        :value="['0']"
      >
        <ion-accordion
          v-for="(exercise, index) in workout.exercises"
          :value="index.toString()"
          :key="index"
        >
          <ion-item slot="header">
            <ion-label>
              {{ exercise.name }}
            </ion-label>
          </ion-item>
          <div
            slot="content"
            v-for="(set, index) in exercise.sets"
            :key="index"
          >
            <ion-item>
              <ion-label slot="start">Set: {{ set }}</ion-label>
              <ion-label slot="end">{{ exercise.reps }} Reps</ion-label>
              <ion-label slot="end">{{ exercise.weight }} kg</ion-label>
            </ion-item>
          </div>
        </ion-accordion>
      </ion-accordion-group>
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
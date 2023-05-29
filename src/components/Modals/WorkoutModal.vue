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
import { playForwardOutline } from 'ionicons/icons';
import BaseFullPageModal from './BaseFullPageModal.vue';
import WorkoutStopWatch from '../WorkoutStopWatch.vue';
import ActiveExerciseCard from '../Cards/ActiveExerciseCard.vue';
import { useWorkoutStore } from '@/store/workoutStore';
import { ref } from 'vue';
import { computed } from 'vue';

const workoutStore = useWorkoutStore();

const workout = workoutStore.getWorkoutById(1);
console.log(workout);

const activeExerciseSet = computed(() => {
  const exercise = workout?.exercises[0];
  if(!exercise) {
    return null;
  }
  return {
    id: exercise.id,
    name: exercise.name,
    sets: exercise.sets,
    reps: exercise.reps,
    weight: exercise.weight,
    currentSet: 1
  }
});

const save = () => {
    return modalController.dismiss(null, 'close');
};

const nextExercise = () => {
  console.log('nextExercise');
}
</script>

<template>
  <BaseFullPageModal title="Workout">
    <template #saveButton>
      <ion-button @click="save">Save</ion-button>
    </template>
    <template #modalContent>
      <WorkoutStopWatch />
      <ActiveExerciseCard 
        v-if="activeExerciseSet"
        :exercise="activeExerciseSet"
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
              <ion-label slot="end">Reps: {{ exercise.reps }}</ion-label>
              <ion-label slot="end">Weight: {{ exercise.weight }}</ion-label>
            </ion-item>
          </div>
        </ion-accordion>
      </ion-accordion-group>
    </template>
    <template #modalFooter>
      <ion-fab vertical="bottom" horizontal="end">
          <ion-fab-button color="primary">
            <ion-icon 
              :icon="playForwardOutline"
              @click="nextExercise"
            >
            </ion-icon>
          </ion-fab-button>
      </ion-fab>
    </template>
  </BaseFullPageModal>
</template>
<script setup lang="ts">
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { IonButton,
           IonItem,
           IonLabel,
           IonCheckbox,
           modalController } from '@ionic/vue';
  import { ref, onMounted, onUnmounted } from 'vue';
  import { ExerciseSelection } from '@/types';

  const exercises = [
    {
      id: 1,
      name: 'Deadlift',
      sets: 0,
      reps: 0,
      weight: 0,
      isSelected: false,
    },
    {
      id: 2,
      name: 'Bench Press',
      sets: 0,
      reps: 0,
      weight: 0,
      isSelected: false,
   },
    {
      id: 3,
      name: 'Squat',
      sets: 0,
      reps: 0,
      weight: 0,
      isSelected: false,
   },
    {
      id: 4,
      name: 'Overhead Press',
      sets: 0,
      reps: 0,
      weight: 0,
      isSelected: false,
   },
  ]

  const selected = ref<ExerciseSelection[]>([])

  const save = () => {
    modalController.dismiss(selected.value, 'save');
    resetSelectedBool()
    selected.value = []
  }
 
  const toggleExercise = (exercise: ExerciseSelection) => {
    exercise.isSelected = !exercise.isSelected
    if (exercise.isSelected) {
        selected.value.push(exercise);
      } else {
        const index = selected.value.indexOf(exercise);
        if (index !== -1) {
          selected.value.splice(index, 1);
        }
      }
  }

  const resetSelectedBool = () => {
    exercises.forEach((exercise) => {
      exercise.isSelected = false
    })
  }

  onMounted(() => {
    resetSelectedBool()
    selected.value = []
  })

  onUnmounted(() => {
    resetSelectedBool()
    selected.value = []
  })

</script>

<template>
  <BaseFullPageModal>
    <template #saveButton>
      <ion-button @click="save">Save</ion-button>
    </template>
    <template #modalContent>
      <ion-item v-for="exercise in exercises">
        <ion-label>{{ exercise.name }}</ion-label>
        <ion-checkbox slot="start" :checked="exercise.isSelected" @ionChange="toggleExercise(exercise)"/>
      </ion-item>
    </template>
  </BaseFullPageModal>
</template>
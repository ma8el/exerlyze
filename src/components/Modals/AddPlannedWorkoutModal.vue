<script setup lang="ts">
  import { IonButton, modalController, IonCheckbox, IonItem, IonLabel } from '@ionic/vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { ref, onMounted, onUnmounted } from 'vue';
  import { WorkoutSelection } from '@/types';
  import { useWorkoutStore } from '@/store/workoutStore';

  const selected = ref<WorkoutSelection[]>([])
  const workoutStore = useWorkoutStore()
  const workoutsSelection = workoutStore.getWorkouts.map((workout) => {
    return {
      ...workout,
      isSelected: false
    }
  })

  const save = () => {
    modalController.dismiss(selected.value, 'save');
    resetSelectedBool()
    selected.value = []
  }
 
  const toggleWorkout = (workout: WorkoutSelection) => {
    workout.isSelected = !workout.isSelected
    if (workout.isSelected) {
        selected.value.push(workout);
      } else {
        const index = selected.value.indexOf(workout);
        if (index !== -1) {
          selected.value.splice(index, 1);
        }
      }
  }

  const resetSelectedBool = () => {
    workoutsSelection.forEach((workout) => {
      workout.isSelected = false
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
  <BaseFullPageModal :title="$t('workouts.addWorkout')">
    <template #saveButton>
      <ion-button @click="save">{{ $t('save') }}</ion-button>
    </template>
    <template #modalContent>
      <ion-item v-for="workout in workoutsSelection">
        <ion-label>{{ workout.name }}</ion-label>
        <ion-checkbox slot="start" :checked="workout.isSelected" @ionChange="toggleWorkout(workout)" :aria-label="$t('workouts.workout')"/>
      </ion-item>
    </template>
  </BaseFullPageModal>
</template>
<script setup lang="ts">
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { IonButton,
           IonItem,
           IonCheckbox,
           modalController } from '@ionic/vue';
  import { ref, onMounted, onUnmounted } from 'vue';
  import { ExerciseSelection } from '@/types';
  import { supabase } from '@/supabase';
  import { useUserSettingsStore } from '@/store/userSettingsStore';

  const exercises = ref<ExerciseSelection[]>([])
  const userSettingsStore = useUserSettingsStore()

  const getExercises = () => {
    const setLocale = userSettingsStore.getLocale()
    supabase
      .from('exercises')
      .select(`id, name_${setLocale}`)
      .then((response) => {
        if (response.error) {
          console.log(response.error)
        } else {
          exercises.value = response.data.map((exercise) => {
            return {
              id: exercise.id,
              name: exercise[`name_${setLocale}`],
              sets: 0,
              reps: 0,
              weight: 0,
              isSelected: false,
            }
          })
        }
      })
  }

  const selected = ref<ExerciseSelection[]>([])

  const save = () => {
    modalController.dismiss(selected.value, 'save');
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

  onMounted(() => {
    selected.value = []
    getExercises()
  })

  onUnmounted(() => {
    selected.value = []
  })
</script>

<template>
  <BaseFullPageModal :title="$t('workouts.addExercises')">
    <template #saveButton>
      <ion-button @click="save">{{ $t('save') }}</ion-button>
    </template>
    <template #modalContent>
      <ion-item v-for="exercise in exercises">
        <ion-checkbox slot="start" label-placement="end" :checked="exercise.isSelected" @ionChange="toggleExercise(exercise)">
          {{ exercise.name }}
        </ion-checkbox>
      </ion-item>
    </template>
  </BaseFullPageModal>
</template>
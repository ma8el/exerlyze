<script setup lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { IonItem,
           IonCheckbox,
           modalController } from '@ionic/vue';
  import { ref, onMounted, onUnmounted } from 'vue';
  import { ExerciseSelection } from '@/types';
  import { supabase } from '@/supabase';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import { bookmarkOutline } from 'ionicons/icons';

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
              // @ts-ignore
              id: uuidv4(),
              // @ts-ignore
              exercise_id: exercise.id,
              // @ts-ignore
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
  <BaseFullPageModal>
    <template #saveButton>
      <ion-icon :icon="bookmarkOutline" @click="save"/>
    </template>
    <template #modalHeader>
      <p class="header-title">{{ $t('workouts.addExercises') }}</p>
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

<style scoped>
  .header-title {
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
  }
</style>
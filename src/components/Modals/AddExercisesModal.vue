<script setup lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { IonItem,
           IonCheckbox,
           IonButton,
           IonSearchbar,
           modalController } from '@ionic/vue';
  import ExerciseDetailModal from '@/components/Modals/ExerciseDetailModal.vue';
  import ListSkeleton from '@/components/Skeletons/ListSkeleton.vue';
  import { ref, onMounted, onUnmounted } from 'vue';
  import { ExerciseSelection } from '@/types';
  import { supabase } from '@/supabase';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import { bookmarkOutline } from 'ionicons/icons';
  import { defaultImage, getBucketUrlFromTable, getSignedObjectUrl } from '@/composables/supabase';

  const exercises = ref<ExerciseSelection[]>([])
  const images = ref<string[]>([])
  const userSettingsStore = useUserSettingsStore()
  const loading = ref<boolean>(true)
  const bucketUrl = ref<string>()

  const getExercises = async () => {
    const setLocale = userSettingsStore.getLocale()
    await supabase
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
              set_index: 0,
              isSelected: false,
            }
          })
        }
      })
  }

  const getImages = async () => {
    for (const exercise of exercises.value) {
      await getBucketUrlFromTable('exercises', exercise.exercise_id).then((response) => {
        bucketUrl.value = response.data?.image_url
      })
      if (!bucketUrl.value) return
      const response = await getSignedObjectUrl('exercise_images', bucketUrl.value)
      const signedUrl = response.data?.signedUrl
      if (!signedUrl) {
        images.value.push(defaultImage)
      } else {
        images.value.push(signedUrl)
      }
    }
  }

  const removeExercises = () => {
    exercises.value = []
  }

  const queryExercises = async (e: any) => {
    const searchedExercise: string = e.target.value;
    exercises.value = [];
    const setLocale = userSettingsStore.getLocale()
    await supabase
      .from('exercises')
      .select(`id, name_${setLocale}`)
      .ilike(`name_${setLocale}`, `%${searchedExercise}%`)
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
              set_index: 0,
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

  const openExerciseDetailModal = async (exercise: ExerciseSelection, image: string) => {
    const modal = await modalController.create({
      component: ExerciseDetailModal,
      componentProps: { exerciseId: exercise.exercise_id, exerciseUrl: image },
    });
    modal.present();
  }

  onMounted(async () => {
    selected.value = []
    loading.value = true
    await getExercises()
    await getImages()
    loading.value = false
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
      <ion-item>
        <ion-searchbar 
          :placeholder="$t('exercise')"
          @ionChange="queryExercises"
          @ionInput="queryExercises"
          @ionClear="removeExercises"
        >
        </ion-searchbar>
      </ion-item>
 
      <div v-if="loading">
        <ListSkeleton />
      </div>
      <div v-else>
      <ion-item class="exercise-item" v-for="(exercise, index) in exercises">
        <ion-checkbox slot="start" label-placement="end" :checked="exercise.isSelected" @ionChange="toggleExercise(exercise)">
          <ion-row class="ion-align-items-center" size="auto">
            <img class="exercise-image" :src="images[index]" style="width: 30px; height: 30px; margin-right: 10px;"/>
            <ion-label>{{ exercise.name }}</ion-label>
          </ion-row>
        </ion-checkbox>
        <ion-button 
          slot="end"
          size="small"
          fill="clear"
          @click="openExerciseDetailModal(exercise, images[index])"
        >
          Info
        </ion-button>
      </ion-item>
      </div>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
  .exercise-image {
    border-radius: 50%;
    height: 50px;
    width: 50px;
  }
  .header-title {
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
  }
</style>
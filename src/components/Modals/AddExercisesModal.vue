<script setup lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { IonItem,
           IonList,
           IonCheckbox,
           IonRow,
           IonCol,
           IonAvatar,
           IonIcon,
           IonLabel,
           IonButton,
           IonSearchbar,
           IonInfiniteScroll,
           IonInfiniteScrollContent,
           modalController, 
           InfiniteScrollCustomEvent} from '@ionic/vue';
  import ExerciseDetailModal from '@/components/Modals/ExerciseDetailModal.vue';
  import ListSkeleton from '@/components/Skeletons/ListSkeleton.vue';
  import MuscleFilterModal from './MuscleFilterModal.vue';
  import { ref, onMounted, onUnmounted } from 'vue';
  import { ExerciseSelection } from '@/types';
  import { supabase } from '@/supabase';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import { bookmarkOutline, filter } from 'ionicons/icons';
  import { defaultImage, getBucketUrlFromTable, getSignedObjectUrl } from '@/composables/supabase';

  interface ExerciseSelectionWithImage extends ExerciseSelection {
    image: string
  }

  const exercises = ref<ExerciseSelectionWithImage[]>([])
  const images = ref<string[]>([])
  const userSettingsStore = useUserSettingsStore()
  const loading = ref<boolean>(true)
  const filtered = ref<boolean>(false)
  const ressourceName = ref<string>()
  const selected = ref<ExerciseSelection[]>([])

  const getExercises = async (page: number) => {
    const pageLength = 15
    const lowerBound = page * pageLength
    const upperBound = lowerBound + pageLength - 1
    const setLocale = userSettingsStore.getLocale()
    const response = await supabase
      .from('exercises')
      .select(`id, name_${setLocale}`)
      .order(`name_${setLocale}`, { ascending: true })
      .range(lowerBound, upperBound)
    if (response.error) {
      console.log(response.error)
      return
    } else {
      const newExercisesPromises = response.data.map(async (exercise) => {
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
          // @ts-ignore
          image: await getImage(exercise.id)
        }
      })
      const newExercises = await Promise.all(newExercisesPromises)
      exercises.value = [...exercises.value, ...newExercises]
    }
  }

  const getImage = async (exerciseId: number) => {
    await getBucketUrlFromTable('exercises', exerciseId).then((response) => {
      ressourceName.value = response.data?.ressource_name
    })
    if (!ressourceName.value) return defaultImage
    const response = await getSignedObjectUrl('exercise_thumbnails', `${ressourceName.value}.jpg`)
    const signedUrl = response.data?.signedUrl
    if (!signedUrl) {
      return defaultImage
    } else {
      return signedUrl
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
      .order(`name_${setLocale}`, { ascending: true })
      .then(async (response) => {
        if (response.error) {
          console.log(response.error)
        } else {
          const exercisePromises = response.data.map(async (exercise) => {
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
              // @ts-ignore
              image: await getImage(exercise.id)
            }
          })
          exercises.value = await Promise.all(exercisePromises)
        }
      })
  }

  const queryExerciseByMuscle = (muscleId: number) => {
    exercises.value = []
    const setLocale = userSettingsStore.getLocale()
    supabase
      .from('exercises')
      .select(`id, name_${setLocale}`)
      .contains('muscles', [muscleId])
      .order(`name_${setLocale}`, { ascending: true })
      .then(async (response) => {
        if (response.error) {
          console.log(response.error)
        } else {
          const exercisePromises = response.data.map(async (exercise) => {
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
              // @ts-ignore
              image: await getImage(exercise.id)
            }
          })
          exercises.value = await Promise.all(exercisePromises)
        }
      })
  }

  const loadMoreExercises = async (ev: InfiniteScrollCustomEvent) => {
    const page = Math.floor(exercises.value.length / 15)
    await getExercises(page)
    ev.target.complete();
  }

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

  const openFilter = async () => {
    const modal = await modalController.create({
      component: MuscleFilterModal,
      cssClass: 'full-screen-modal',
      initialBreakpoint: 0.75,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'save') {
      if (data.selected == 'all') {
        filtered.value = false
        loading.value = true
        getExercises(0)
        loading.value = false
      } else {
        filtered.value = true
        loading.value = true
        queryExerciseByMuscle(data.selected)
        loading.value = false
      }
    }
  }

  onMounted(async () => {
    exercises.value = []
    images.value = []
    selected.value = []
    loading.value = true
    await getExercises(0)
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
        <ion-col size="10">
        <ion-searchbar 
          :placeholder="$t('exercise')"
          :debounce="500"
          @ionInput="queryExercises"
          @ionClear="removeExercises"
        >
        </ion-searchbar>
        </ion-col>
        <ion-col size="2">
          <ion-button
            class="filter-button"
            fill="clear"
            @click="openFilter()"
          >
            <ion-icon :icon="filter"/>
          </ion-button>
        </ion-col>
      </ion-item>
 
      <div v-if="loading">
        <ListSkeleton />
      </div>
      <div v-else>
        <ion-list>
          <ion-row 
            class="exercise-item ion-align-items-center ion-justify-content-between" 
            v-for="(exercise, index) in exercises"
          >
              <ion-col class="checkbox-col" size="10">
                <ion-checkbox 
                  label-placement="end"
                  :checked="exercise.isSelected"
                  @ionChange="toggleExercise(exercise)"
                >
                  <ion-row class="ion-align-items-center">
                      <ion-avatar>
                        <img class="exercise-image" :src="exercise.image"/>
                      </ion-avatar>
                      <ion-label class="exercise-name">{{ exercise.name }}</ion-label>
                  </ion-row>
                </ion-checkbox>
              </ion-col>
              <ion-col size="2">
                <ion-button 
                  size="small"
                  fill="clear"
                  @click="openExerciseDetailModal(exercise, images[index])"
                >
                  <p class="info-text">Info</p>
                </ion-button>
              </ion-col>
          </ion-row>
        </ion-list>
        <ion-infinite-scroll v-if="!filtered" threshold="100px" @ionInfinite="loadMoreExercises">
          <ion-infinite-scroll-content>
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </div>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
@media (max-width: 400px) {
  .exercise-name {
    font-size: 12px;
    margin-left: 5px;
    max-width: 50%;
  }
  .exercise-image {
    height: 50px;
    width: 50px;
  }
  .info-text {
    font-size: 12px;
  }
}

@media (min-width: 600px) {
  .exercise-name {
    font-size: 14px;
  }
  .exercise-image {
    height: 50px;
    width: 50px;
  }
  .info-text {
    font-size: 14px;
  }
}

@media (min-width: 601px) {
  .exercise-name {
    font-size: 18px;
  }
  .exercise-image {
    height: 70px;
    width: 70px;
  }
  .info-text {
    font-size: 18px;
  }
}

.header-title {
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
}

.exercise-name {
    max-width: 75%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 10px;
  }
.exercise-image {
  border-radius: 10px;
}

.checkbox-col {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.filter-button {
  --color: white;
  :is(ion-icon) {
    width: 25px;
    height: 25px;
  }
}
</style>
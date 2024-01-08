<script setup lang="ts">
  import { IonCard,
           IonCardTitle,
           IonCardContent,
           IonRow,
           IonCol } from '@ionic/vue';
  import { supabase } from '@/supabase';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import { useMuscleStore } from '@/store/workoutStore';
  import { bodyOutline } from 'ionicons/icons';
  import BaseSegments from '@/components/BaseSegments.vue';
  import BaseInfoCard from '@/components/Cards/BaseInfoCard.vue';
  import BaseFullPageModal from '@/components/Modals/BaseFullPageModal.vue';
  import ExerciseContentSkeleton from '@/components/Skeletons/ExerciseContentSkeleton.vue';
  import ImageSkeleton from '@/components/Skeletons/ImageSkeleton.vue';
  import LevelIcon from '@/icons/level.svg';
  import { ref, onMounted, watch } from 'vue';

  const props = defineProps({
    exerciseId: {
      type: Number,
      required: true
    },
    exerciseUrl: {
      type: String,
      required: true
    }
  })

  const userSettingsStore = useUserSettingsStore()
  const muscleStore = useMuscleStore()

  const exercise = ref()
  const exerciseName = ref<string>()
  const exerciseDescription = ref<string>()
  const exerciseExecution = ref<string>()
  const muscleNames = ref<string[]>([])
  const loading = ref<boolean>(true)

  const descriptionSelected = ref<boolean>(true)
  const executionSelected = ref<boolean>(false)

  const getExerciseData = async (exerciseId: number) => {
    const setLocale = userSettingsStore.getLocale()
      await supabase
      .from('exercises')
      .select(`id, name_${setLocale}, description_${setLocale}, execution_${setLocale}, ressource_name, muscles`)
      .eq('id', exerciseId)
      .single()
      .then((response) => {
          if (response.error) {
          console.log(response.error)
          } else {
          exercise.value = response.data
          }
      })
  }

  const selectDescription = () => {
    descriptionSelected.value = true
    executionSelected.value = false
  }

  const selectExecution = () => {
    descriptionSelected.value = false
    executionSelected.value = true
  }

  const getVideoUrl = async () => {
    const {data, error } = await supabase
      .storage
      .from('exercise_videos')
      .createSignedUrl(`${exercise.value.ressource_name}.mp4`, 60)
    const signedUrl = data?.signedUrl
    return signedUrl
  }

  watch(() => exercise.value, () => {
    loading.value = true
    exerciseName.value = exercise.value[`name_${userSettingsStore.getLocale()}`]
    exerciseDescription.value = exercise.value[`description_${userSettingsStore.getLocale()}`]
    exerciseExecution.value = exercise.value[`execution_${userSettingsStore.getLocale()}`]
    loading.value = false
  })

  const videoUrl = ref<string>()
  onMounted(async () => {
    loading.value = true
    await getExerciseData(props.exerciseId)
    muscleNames.value = await Promise.all(exercise.value.muscles.map(async (muscleId: number) => {
      return await muscleStore.getMuscleNameById(muscleId)
    }))
    videoUrl.value = await getVideoUrl()
    loading.value = false
  })
</script>

<template>
 <BaseFullPageModal 
    :saveButton="false"
    backColor="dark"
  >
    <template #modalHeader>
      <ImageSkeleton v-if="loading" />
      <video
        autoplay
        loop
        v-else-if="!loading"
        :src="videoUrl"
        alt="Exercise Image"
      ></video>
    </template>
    <template #modalContent>
      <div v-if="loading">
        <ExerciseContentSkeleton />
      </div>
      <div v-else>
        <ion-card-title class="ion-margin">
          {{ exerciseName }}
        </ion-card-title>
        <ion-row>
          <ion-col size="6" class="ion-padding">
            <BaseInfoCard
              :title="$t('workouts.type')"
              :subTitle="muscleNames.length > 1 ? $t('workouts.compound') : $t('workouts.isolation')"
              :icon="LevelIcon"
              font-size="0.6rem"
            />
          </ion-col>
          <ion-col size="6" class="ion-padding">
            <BaseInfoCard
              :title="$t('workouts.muscle')"
              :subTitle="muscleNames.join(', ')"
              :iconSource="bodyOutline"
              font-size="0.6rem"
            />
          </ion-col>
        </ion-row>

        <BaseSegments
          :leftSegmentLabel="$t('description')"
          :rightSegmentLabel="$t('execution')"
          @leftSegmentSelected="selectDescription"
          @rightSegmentSelected="selectExecution"
        />
 
        <ion-card v-if="descriptionSelected">
          <ion-card-content>
            <p>{{ exerciseDescription}}</p>
          </ion-card-content>
        </ion-card>
        <ion-card v-if="executionSelected">
          <ion-card-content>
            <p>{{ exerciseExecution }}</p>
          </ion-card-content>
        </ion-card>
 
      </div>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.exercise-description {
    font-size: 0.9rem;
}
.exercise-icon {
  width: 25px;
  height: 25px;
  color: var(--ion-color-primary);
}
</style>
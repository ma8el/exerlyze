<script setup lang="ts">
  import { IonCard,
           IonImg,
           IonCardTitle,
           IonCardHeader,
           IonCardContent,
           IonRow,
           IonCol } from '@ionic/vue';
  import { supabase } from '@/supabase';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
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
  const exercise = ref()
  const exerciseName = ref<string>()
  const exerciseDescription = ref<string>()
  const exerciseExecution = ref<string>()
  const loading = ref<boolean>(true)

  const descriptionSelected = ref<boolean>(true)
  const executionSelected = ref<boolean>(false)

  const getExerciseData = async (exerciseId: number) => {
    const setLocale = userSettingsStore.getLocale()
      await supabase
      .from('exercises')
      .select(`id, name_${setLocale}, description_${setLocale}, execution_${setLocale}, image_url`)
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

  watch(() => exercise.value, () => {
    loading.value = true
    exerciseName.value = exercise.value[`name_${userSettingsStore.getLocale()}`]
    exerciseDescription.value = exercise.value[`description_${userSettingsStore.getLocale()}`]
    exerciseExecution.value = exercise.value[`execution_${userSettingsStore.getLocale()}`]
    loading.value = false
  })

  onMounted(async () => {
    loading.value = true
    await getExerciseData(props.exerciseId)
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
      <ion-img
        v-else
        :src="props.exerciseUrl"
        alt="Exercise Image"
      />
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
              :subTitle="`Compound`"
              :icon="LevelIcon"
            />
          </ion-col>
          <ion-col size="6" class="ion-padding">
            <BaseInfoCard
              :title="$t('workouts.muscle')"
              subTitle="Biceps"
              :iconSource="bodyOutline"
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
.exercise-description {
    font-size: 0.9rem;
}
.exercise-icon {
  width: 25px;
  height: 25px;
  color: var(--ion-color-primary);
}
</style>
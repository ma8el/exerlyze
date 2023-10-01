<script setup lang="ts">
  import { IonCard,
           IonImg,
           IonCardTitle,
           IonCardHeader,
           IonCardContent,
           IonRow,
           IonCol,
           IonList,
           IonSkeletonText } from '@ionic/vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { supabase } from '@/supabase';
  import { ref, onMounted, watch } from 'vue';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import { bodyOutline } from 'ionicons/icons';
  import BaseInfoCard from '../Cards/BaseInfoCard.vue';

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

  onMounted(() => {
    getExerciseData(props.exerciseId)
  })

  watch(() => exercise.value, () => {
    loading.value = false
    exerciseName.value = exercise.value[`name_${userSettingsStore.getLocale()}`]
    exerciseDescription.value = exercise.value[`description_${userSettingsStore.getLocale()}`]
    exerciseExecution.value = exercise.value[`execution_${userSettingsStore.getLocale()}`]
  })
</script>

<template>
  <ion-list v-if="loading">
    <ion-img>
        <ion-skeleton-text :animated="true"></ion-skeleton-text>
    </ion-img>
    <ion-card-title class="ion-margin">
        <ion-skeleton-text :animated="true"></ion-skeleton-text>
    </ion-card-title>
    <ion-card>
        <ion-card-header>
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </ion-card-header>
        <ion-card-content>
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </ion-card-header>
        <ion-card-content>
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </ion-card-content>
    </ion-card>
  </ion-list>
  <BaseFullPageModal 
    v-else
    :saveButton="false"
    backColor="dark"
  >
    <template #modalHeader>
      <ion-img
        :src="props.exerciseUrl"
        alt="Exercise Image"
      ></ion-img>
    </template>
    <template #modalContent>
      <ion-card-title class="ion-margin">
        {{ exerciseName }}
      </ion-card-title>
      <p class="exercise-description ion-padding ion-margin">
        {{ exerciseDescription}}
      </p>
 
      <ion-row>
        <ion-col size="6" class="ion-padding">
          <BaseInfoCard
            :title="$t('workouts.type')"
            :subTitle="`Compound`"
            iconSource="../../../assets/icons/level.svg"
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

      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ $t('execution') }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>{{ exerciseExecution }}</p>
        </ion-card-content>
      </ion-card>
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
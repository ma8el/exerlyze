<script setup lang="ts">
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { IonCard, IonImg, IonCardTitle, IonCardHeader, IonCardContent, IonList, IonSkeletonText } from '@ionic/vue';
  import { supabase } from '@/supabase';
  import { ref, onMounted, watch } from 'vue';
  import { useUserSettingsStore } from '@/store/userSettingsStore';

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
    console.log(setLocale)
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
    console.log(exercise.value)
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
  <BaseFullPageModal v-else :title="exerciseName">
    <template #modalContent>
        <ion-img
          :src="props.exerciseUrl"
          alt="Exercise Image"
        ></ion-img>
        <ion-card-title class="ion-margin">
            {{ exerciseName }}
        </ion-card-title>
        <ion-card>
            <ion-card-header>
                <ion-card-title>{{ $t('description') }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <p>{{ exerciseDescription}}</p>
            </ion-card-content>
        </ion-card>
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
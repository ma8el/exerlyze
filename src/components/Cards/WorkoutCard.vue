<script setup lang="ts">
  import { modalController, IonButton} from '@ionic/vue';
  import AddWorkoutModal from '../Modals/AddWorkoutModal.vue';
  import BaseCard from '@/components/Cards/BaseCard.vue';
  import Slider from '@/components/Slider.vue';
  import ExerciseCard from './ExerciseCard.vue';
  import { Workout } from '@/types';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import { ref, computed } from 'vue';

  const props = defineProps<Workout>()

  const userSettingsStore = useUserSettingsStore()
  const locale = ref<string | undefined>(userSettingsStore.getLocale())

  const titleColSize = computed(() => {
    if (locale.value === 'en') {
      return '9'
    } else if(locale.value === 'de') {
      return '8'
    } else if (locale.value === 'fr') {
      return '9'
    } else {
      return '9'
    }
  })

  const titleEndColSize = computed(() => {
    if (locale.value === 'en') {
      return '3'
    } else if(locale.value === 'de') {
      return '4'
    } else if (locale.value === 'fr') {
      return '3'
    } else {
      return '3'
    }
  })

  const openModal = async () => {
    const modal = await modalController.create({
      id: 'add-workout-modal',
      component: AddWorkoutModal,
      componentProps: { workoutId: props.id },
      cssClass: 'full-screen-modal',
    });
    modal.present();
  }
</script>

<template>
  <BaseCard 
    :title="name"
    :content="true"
    class="workout-card"
    :title-col-size="titleColSize"
    :title-end-col-size="titleEndColSize"
  >
    <template #titleEnd>
      <ion-button fill="clear" size="small" @click="openModal()">
        {{ $t('workouts.viewAll') }}
      </ion-button>
    </template>
    <Slider :items="exercises" minWidth="200px" maxWidth="200px" class="exercise-slider">
      <template v-slot:default="slotProps">
        <ExerciseCard
          :id="slotProps.item.id"
          :created_at="slotProps.item.created_at"
          :updated_at="slotProps.item.updated_at"
          :workout_id="slotProps.item.workout_id"
          :exercise_id="slotProps.item.exercise_id"
          :name="slotProps.item.name"
          :sets="slotProps.item.sets"
          :reps="slotProps.item.reps"
          :weight="slotProps.item.weight"
          :set_index="slotProps.item.set_index"
          :resttime="slotProps.item.resttime"
        />
      </template>
    </Slider>
  </BaseCard>
</template>

<style scoped>
  .workout-card {
    --background: none;
    box-shadow: none;
    margin: 0;
  }
  .exercise-slider { 
    min-width: 200px;
  }
</style>
<script setup lang="ts">
  import { modalController, IonCol, IonButton} from '@ionic/vue';
  import AddWorkoutModal from '../Modals/AddWorkoutModal.vue';
  import BaseCard from '@/components/Cards/BaseCard.vue';
  import Slider from '@/components/Slider.vue';
  import ExerciseCard from './ExerciseCard.vue';
  import { Workout } from '@/types';

  const props = defineProps<Workout>()

  const openModal = async () => {
    const modal = await modalController.create({
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
  >
    <template #titleEnd>
      <ion-col offset="4" offset-md="2" offset-lg="1" size="3">
        <ion-button fill="clear" size="small" class="title-button" @click="openModal()">
          {{ $t('workouts.viewAll') }}
        </ion-button>
      </ion-col>
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
        />
      </template>
    </Slider>
  </BaseCard>
</template>

<style scoped>
  .title-button {
    --color: var(--ion-color-primary);
  }
  .workout-card {
    --background: none;
    margin: 0;
  }
  .exercise-slider { 
    min-width: 200px;
  }
</style>
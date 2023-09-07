<script setup lang="ts">
  import { modalController } from '@ionic/vue';
  import { Workout } from '@/types';
  import AddWorkoutModal from '../Modals/AddWorkoutModal.vue';
  import BaseCard from '@/components/Cards/BaseCard.vue';
  import Slider from '@/components/Slider.vue';
  import { onMounted } from 'vue';

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
    <Slider :items="exercises" minWidth="200px" class="exercise-slider">
      <template v-slot:default="slotProps">
        <BaseCard
          class="exercise-card"
          img_src="https://ionicframework.com/docs/img/demos/card-media.png"
          :title="slotProps.item.name"
          :sub-title="`Sets: ${slotProps.item.sets} Reps: ${slotProps.item.reps} Weight: ${slotProps.item.weight}`"
        >
        </BaseCard>
      </template>
    </Slider>
  </BaseCard>
</template>

<style scoped>
  .workout-card {
    --background: none;
  }
  .exercise-slider { 
    min-width: 200px;
  }
</style>
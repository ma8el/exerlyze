<script setup lang="ts">
  import { IonCol,
           IonButton,
           modalController} from '@ionic/vue';
  import AddWorkoutPlanModal from '../Modals/AddWorkoutPlanModal.vue';
  import Slider from '../Slider.vue';
  import BaseCard from './BaseCard.vue';
  import { useWorkoutPlanStore } from '@/store/workoutStore';

  const props = defineProps({
    workoutPlanId: {
      type: String,
      required: true
    }
  })

  const openModal = async () => {
    const modal = await modalController.create({
      component: AddWorkoutPlanModal,
      componentProps: { workoutPlanId: props.workoutPlanId },
      cssClass: 'full-screen-modal',
    });
    modal.present();
  }

  const workoutPlanStore = useWorkoutPlanStore();

  const workoutPlan = workoutPlanStore.getWorkoutPlanById(props.workoutPlanId)
  const plannedWorkouts = workoutPlanStore.getFullWorkoutPlans.filter(plannedWorkout => plannedWorkout.workout_plan_id === props.workoutPlanId)

</script>

<template>
  <BaseCard 
    v-if="workoutPlan"
    :title="workoutPlan.name"
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
    <Slider :items="plannedWorkouts" minWidth="200px" maxWidth="200px" class="exercise-slider">
      <template v-slot:default="slotProps">
        <BaseCard
          img_src="https://ionicframework.com/docs/img/demos/card-media.png"
          :title="slotProps.item.workout.name"
          :content="true"
        >
          <p>{{ $t('scheduledOn') }} {{ slotProps.item.dayOfWeek }}</p>
        </BaseCard>
      </template>
    </Slider>
 </BaseCard>
</template>

<style scoped>
  .workout-card {
    --background: none;
    margin: 0;
  }
  .exercise-slider { 
    min-width: 200px;
  }
</style>
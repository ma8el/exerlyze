<script setup lang="ts">
  import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, modalController } from '@ionic/vue';
  import WorkoutPlanItem from '@/components/WorkoutPlanItem.vue';
  import AddWorkoutPlanModal from '../Modals/AddWorkoutPlanModal.vue';
  import { useWorkoutPlanStore } from '@/store/workoutStore';

  const props = defineProps({
    workoutPlanId: {
      type: Number,
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
  const plannedWorkouts = workoutPlanStore.getFullWorkoutPlans.filter(plannedWorkout => plannedWorkout.workoutPlanId === props.workoutPlanId)

</script>

<template>
  <ion-card v-if="workoutPlan" :button="true" @click="openModal">
    <ion-card-header>
      <ion-card-title>{{ workoutPlan.name }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <WorkoutPlanItem 
        v-for = "workout in plannedWorkouts"
        :workoutName="workout.workout.name"
        :plannedDay="workout.dayOfWeek"
      />
    </ion-card-content>
  </ion-card>
</template>
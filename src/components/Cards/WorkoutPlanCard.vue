<script setup lang="ts">
  import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';
  import WorkoutPlanItem from '@/components/WorkoutPlanItem.vue';
  import { useWorkoutPlanStore } from '@/store/workoutStore';

  const props = defineProps({
    workoutPlanId: {
      type: Number,
      required: true
    }
  })

  const workoutPlanStore = useWorkoutPlanStore();

  const workoutPlan = workoutPlanStore.getWorkoutPlanById(props.workoutPlanId)
  const plannedWorkouts = workoutPlanStore.getFullWorkoutPlans.filter(plannedWorkout => plannedWorkout.workoutPlanId === props.workoutPlanId)

</script>

<template>
  <ion-card>
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
<script setup lang="ts">
  import { IonCard,
           IonCardHeader,
           IonCardTitle,
           IonCardContent,
           IonList,
           IonItem,
           IonLabel} from '@ionic/vue';
  import { useWorkoutScheduleStore, useWorkoutPlanStore } from '../../store/workoutStore';
  import { computed } from 'vue';

  const props = defineProps({
    workoutScheduleId: {
      type: Number,
      required: true,
    },
  });
  const workoutScheduleStore = useWorkoutScheduleStore();
  const workoutPlanStore = useWorkoutPlanStore();

  const workoutSchedule = computed(() => {
    return workoutScheduleStore.getWorkoutScheduleById(props.workoutScheduleId);
  });

  const startDate = computed(() => {
    return workoutSchedule.value?.startsAt.toISOString().split('T')[0];
  });

  const endDate = computed(() => {
    return workoutSchedule.value?.endsAt.toISOString().split('T')[0];
  });

  const workoutPlanName = computed(() => {
    const workoutPlanId = workoutSchedule.value?.workoutPlanId;
    if (!workoutPlanId) {
      return '';
    }
    const workoutPlan = workoutPlanStore.getWorkoutPlanById(workoutPlanId);
    if (!workoutPlan) {
      return '';
    }
    return workoutPlan.name;
  });
</script>

<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ workoutPlanName }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-list>
        <ion-item>
          <ion-label>{{ startDate }} - {{ endDate }}</ion-label>
        </ion-item>
      </ion-list>
     </ion-card-content>
  </ion-card>
</template>
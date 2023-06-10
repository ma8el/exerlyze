<script setup lang="ts">
  import { IonCard,
           IonCardTitle,
           IonCardHeader,
           IonCardSubtitle,
           IonList,
           IonItem,
           IonLabel,
           IonButton,
           modalController } from '@ionic/vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { useWorkoutSessionStore } from '@/store/workoutStore';

  const props = defineProps({
    selectedDate: {
      type: Date,
      required: true
    }
  })

  const workoutSessionStore = useWorkoutSessionStore();
  const workoutSessions = workoutSessionStore.getFullWorkoutSessionsByDate(props.selectedDate);
  console.log(workoutSessions)

  const closeModal = () => {
      return modalController.dismiss(null, 'close');
  };
</script>

<template>
  <BaseFullPageModal title="Activities">
    <template #saveButton>
      <ion-button @click="closeModal">Save</ion-button>
    </template>
    <template #modalContent>
      <ion-card
        v-for="workoutSession in workoutSessions"
        :key="workoutSession.id"
        class="mb-4"
      >
      <ion-card-header>
        <ion-card-title>{{ workoutSession.workout.name }}</ion-card-title>
        <ion-card-subtitle>{{ selectedDate.toDateString() }}</ion-card-subtitle>
      </ion-card-header>
        <ion-list
          v-for="exercise in workoutSession.workoutPerformance"
        >
          <ion-item 
          >
            <ion-label>{{ exercise.exerciseId }}</ion-label>
            <ion-label>{{ exercise.performedReps }}</ion-label>
            <ion-label>{{ exercise.performedWeight }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-card>
    </template>
  </BaseFullPageModal>
</template>
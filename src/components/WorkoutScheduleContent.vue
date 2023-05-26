<script setup lang="ts">
  import { modalController } from '@ionic/vue';
  import AddWorkoutScheduleModal from './Modals/AddWorkoutScheduleModal.vue';
  import WorkoutScheduleCard from './Cards/WorkoutScheduleCard.vue';
  import AddFloatingActionButton from './Buttons/AddFloatingActionButton.vue';
  import { useWorkoutScheduleStore } from '../store/workoutStore';

  const workoutScheduleStore = useWorkoutScheduleStore();

  const openModal = async (workoutScheduleId: number) => {
    const modal = await modalController.create({
      component: AddWorkoutScheduleModal,
      componentProps: { workoutScheduleId: workoutScheduleId },
      cssClass: 'full-screen-modal',
    });
    modal.present();
  }
</script>

<template>
    <WorkoutScheduleCard 
        v-for="(workoutSchedule, index) in workoutScheduleStore.getWorkoutSchedule"
        :key="index"
        :workoutScheduleId="workoutSchedule.id"
        :button="true"
        @click="openModal(workoutSchedule.id)"
    />
    <AddFloatingActionButton :modalComponent="AddWorkoutScheduleModal" />
</template>
<script setup lang="ts">
  import WorkoutCard from './Cards/WorkoutCard.vue';
  import { useWorkoutStore } from '../store/workoutStore';
  import AddFloatingActionButton from '@/components/Buttons/AddFloatingActionButton.vue'
  import { onMounted } from 'vue';
  import AddWorkoutModal from '@/components/Modals/AddWorkoutModal.vue';

  const workoutStore = useWorkoutStore();

  onMounted(() => {
    console.log(workoutStore.getWorkouts)
  })
</script>

<template>
  <WorkoutCard 
    v-for="(workout, index) in workoutStore.getWorkouts"
    :key="index"
    :id="workout.id"
    :name="workout.name"
    :description="workout.description"
    :exercises="workout.exercises"
  />
  <AddFloatingActionButton :modalComponent="AddWorkoutModal" />

</template>
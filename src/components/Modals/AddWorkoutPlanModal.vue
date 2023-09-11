<script setup lang="ts">
  import { IonIcon,
           IonInput,
           modalController} from '@ionic/vue';
  import { bookmarkOutline } from 'ionicons/icons';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import AddPlannedWorkoutButton from '../Buttons/AddPlannedWorkoutButton.vue';
  import PlannedWorkoutItem from '../PlannedWorkoutItem.vue';
  import { PlannedWorkout, Workout } from '@/types';
  import { useWorkoutPlanStore, usePlannedWorkoutStore } from '@/store/workoutStore';
  import { ref, onMounted } from 'vue'

  const props = defineProps({
      workoutPlanId: {
        type: Number,
      }
  })

  const workoutPlanName = ref('')
  const description = ref('')
  const plannedWorkouts = ref<PlannedWorkout[]>([])

  const workoutPlanStore = useWorkoutPlanStore()
  const plannedWorkoutStore = usePlannedWorkoutStore()

  const resetValues = () => {
    workoutPlanName.value = ''
    description.value = ''
    plannedWorkouts.value = []
  }

  const addWorkouts = (w: Workout[]) => {
    w.forEach((workout) => {
      plannedWorkouts.value.push(
        {
          // TODO: This is not the correct way to get the id
          'id': plannedWorkoutStore.getNewId,
          'workoutPlanId': workoutPlanStore.getNewId,
          'workoutId': workout.id,
          'dayOfWeekId': 1,
          'timeOfDay': '12:00'
        })
    })
  }

  const save = () => {
    workoutPlanStore.addWorkoutPlan(
      {
        'id': workoutPlanStore.getNewId,
        'name': workoutPlanName.value,
        'description': description.value
      }
    );
    plannedWorkouts.value.forEach((plannedWorkout: PlannedWorkout) => {
      plannedWorkoutStore.addPlannedWorkout(
        {
          'id': plannedWorkoutStore.getNewId,
          'workoutPlanId': plannedWorkout.workoutPlanId,
          'workoutId': plannedWorkout.workoutId,
          'dayOfWeekId': plannedWorkout.dayOfWeekId,
          'timeOfDay': plannedWorkout.timeOfDay
        }
      )
    });
    resetValues();
    modalController.dismiss();
  }

  const update = () => {
    if (!props.workoutPlanId) {
      return
    }
    workoutPlanStore.updateWorkoutPlan(
      {
        'id': props.workoutPlanId,
        'name': workoutPlanName.value,
        'description': description.value
      }
    );
    plannedWorkouts.value.forEach((plannedWorkout: PlannedWorkout) => {
      plannedWorkoutStore.updatePlannedWorkout(
        {
          'id': plannedWorkout.id,
          'workoutPlanId': plannedWorkout.workoutPlanId,
          'workoutId': plannedWorkout.workoutId,
          'dayOfWeekId': plannedWorkout.dayOfWeekId,
          'timeOfDay': plannedWorkout.timeOfDay
        }
      )
    });
    resetValues();
    modalController.dismiss();
  }

  onMounted(() => {
    if (props.workoutPlanId) {
      const workoutPlan = workoutPlanStore.getWorkoutPlanById(props.workoutPlanId)
      if (!workoutPlan) {
        return
      }
      workoutPlanName.value = workoutPlan.name
      description.value = workoutPlan.description
      const plannedWorkoutsForWorkoutPlan = plannedWorkoutStore.getPlannedWorkoutsByWorkoutPlanId(props.workoutPlanId)
      plannedWorkouts.value = plannedWorkoutsForWorkoutPlan
    }
  }
  )
</script>

<template>
  <BaseFullPageModal>
    <template #saveButton>
      <ion-icon v-if="!workoutPlanId" :icon="bookmarkOutline" @click="save"/>
      <ion-icon v-else src="../../../assets/icons/update.svg" @click="update"/>
    </template>
    <template #modalHeader>
      <p v-if="!workoutPlanId" class="header-title">{{ $t('workouts.addWorkoutPlan') }}</p>
      <p v-else class="header-title">{{ $t('workouts.updateWorkoutPlan') }}</p>
    </template>
   <template #modalContent>
      <ion-input class="ion-padding" fill="outline" shape="round" label="Workout Plan Name" label-placement="stacked" v-model="workoutPlanName"></ion-input>
      <ion-input class="ion-padding" fill="outline" shape="round" :label="$t('description')" label-placement="stacked" v-model="description"></ion-input>
      <PlannedWorkoutItem 
        v-for="(plannedWorkout, index) in plannedWorkouts"
        :key="index"
        v-model:day-of-week-id="plannedWorkouts[index].dayOfWeekId"
        v-model:time-of-day="plannedWorkouts[index].timeOfDay"
        :workout-id="plannedWorkout.workoutId"
      />
      <AddPlannedWorkoutButton @save-workouts="addWorkouts"/>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
.header-title {
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
}
</style>
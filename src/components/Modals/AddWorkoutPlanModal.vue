<script setup lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import { IonIcon,
           IonInput,
           IonAlert,
           modalController} from '@ionic/vue';
  import { bookmarkOutline, create } from 'ionicons/icons';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import AddPlannedWorkoutButton from '../Buttons/AddPlannedWorkoutButton.vue';
  import PlannedWorkoutItem from '../PlannedWorkoutItem.vue';
  import { PlannedWorkout, Workout } from '@/types';
  import { useWorkoutPlanStore, usePlannedWorkoutStore } from '@/store/workoutStore';
  import { useUserStore } from '@/store/bodyMetricsStore';
  import { ref, onMounted } from 'vue'

  const props = defineProps({
      workoutPlanId: {
        type: String,
      }
  })

  const generatedWorkoutPlanId = ref<string>(uuidv4())
  const workoutPlanName = ref<string>('')
  const description = ref<string>('')
  const createdAt = ref<Date>(new Date())
  const plannedWorkouts = ref<PlannedWorkout[]>([])

  const workoutPlanStore = useWorkoutPlanStore()
  const plannedWorkoutStore = usePlannedWorkoutStore()
  const userStore = useUserStore()

  const isOpen = ref<boolean>(false)
  const alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        setOpen(false)
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        deleteWorkoutPlan()
      },
    },
  ];

  const resetValues = () => {
    workoutPlanName.value = ''
    description.value = ''
    plannedWorkouts.value = []
  }

  const addWorkouts = async (w: Workout[]) => {
    w.forEach(async (workout) => {
      plannedWorkouts.value.push(
        {
          'id': plannedWorkoutStore.getNewId(),
          'workout_plan_id': generatedWorkoutPlanId.value,
          'workout_id': workout.id,
          'day_of_week_id': 1,
          'time_of_day': '12:00',
          'deleted': false,
          'user_id': await userStore.getUserId()
        })
    })
  }

  const save = async () => {
    workoutPlanStore.addWorkoutPlan(
      {
        'id': generatedWorkoutPlanId.value,
        'created_at': new Date(),
        'updated_at': new Date(),
        'user_id': await userStore.getUserId(),
        'name': workoutPlanName.value,
        'description': description.value,
        'deleted': false
      }
    );
    plannedWorkouts.value.forEach(async (plannedWorkout: PlannedWorkout) => {
      plannedWorkoutStore.addPlannedWorkout(
        {
          'id': plannedWorkout.id,
          'workout_plan_id': plannedWorkout.workout_plan_id,
          'workout_id': plannedWorkout.workout_id,
          'day_of_week_id': plannedWorkout.day_of_week_id,
          'time_of_day': plannedWorkout.time_of_day,
          'deleted': false,
          'user_id': await userStore.getUserId()
        }
      )
    });
    resetValues();
    modalController.dismiss();
  }

  const update = async () => {
    if (!props.workoutPlanId) {
      return
    }
    workoutPlanStore.updateWorkoutPlan(
      {
        'id': props.workoutPlanId,
        'created_at': createdAt.value,
        'updated_at': new Date(),
        'user_id': await userStore.getUserId(),
        'name': workoutPlanName.value,
        'description': description.value,
        'deleted': false
      }
    );
    plannedWorkouts.value.forEach(async (plannedWorkout: PlannedWorkout) => {
      plannedWorkoutStore.updatePlannedWorkout(
        {
          'id': plannedWorkout.id,
          'workout_plan_id': plannedWorkout.workout_plan_id,
          'workout_id': plannedWorkout.workout_id,
          'day_of_week_id': plannedWorkout.day_of_week_id,
          'time_of_day': plannedWorkout.time_of_day,
          'deleted': false,
          'user_id': await userStore.getUserId()
        }
      )
    });
    resetValues();
    modalController.dismiss();
  }

  const deleteWorkoutPlan = () => {
    if (!props.workoutPlanId) return
    workoutPlanStore.deleteWorkoutPlan(props.workoutPlanId)
    setOpen(false)
    modalController.dismiss();
  }

  const setOpen = (state: boolean) => {
    isOpen.value = state;
  }

  onMounted(() => {
    if (props.workoutPlanId) {
      const workoutPlan = workoutPlanStore.getWorkoutPlanById(props.workoutPlanId)
      if (!workoutPlan) {
        return
      }
      generatedWorkoutPlanId.value = uuidv4()
      workoutPlanName.value = workoutPlan.name
      description.value = workoutPlan.description
      createdAt.value = workoutPlan.created_at
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
        class="ion-margin"
        v-for="(plannedWorkout, index) in plannedWorkouts"
        :key="index"
        v-model:day-of-week-id="plannedWorkouts[index].day_of_week_id"
        v-model:time-of-day="plannedWorkouts[index].time_of_day"
        :workout-id="plannedWorkout.workout_id"
      />
      <AddPlannedWorkoutButton 
        class="ion-margin"
        @save-workouts="addWorkouts"
      />

      <ion-button
        v-if="workoutPlanId"
        class="ion-margin"
        expand="block"
        size="small"
        color="secondary"
        @click="setOpen(true)"
      >
        {{ $t('workouts.deleteWorkoutPlan') }}
      </ion-button>

      <ion-alert
        :is-open="isOpen"
        :header="$t('workouts.deleteWorkoutPlanAlert')"
        :sub-header="$t('workouts.deleteWorkoutPlanAlertMessage')"
        :buttons="alertButtons"
        @didDismiss="setOpen(false)"
      ></ion-alert>
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
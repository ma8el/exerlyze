<script setup lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import { IonIcon,
           IonInput,
           IonButton,
           IonAlert,
           IonItem,
           IonSelect,
           IonSelectOption,
           IonToggle,
           IonCol,
           IonRow,
           IonLabel,
           IonList,
           IonAccordion,
           IonAccordionGroup,
           modalController } from '@ionic/vue';
  import { ref, onMounted, computed } from 'vue'
  import { useWorkoutStore, useDayOfWeekStore, useWorkoutPlanStore } from '../../store/workoutStore';
  import AddExerciseButton from '../Buttons/AddExerciseButton.vue'
  import ExerciseItem from '../ExerciseItem.vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import NumericInput from '../NumericInput.vue';
  import { Exercise, ExerciseSelection, WorkoutPlan, PlannedWorkout } from '@/types';
  import { bookmarkOutline } from 'ionicons/icons';
  import UpdateIcon from '@/icons/update.svg';

  const props = defineProps({
    workoutId: {
      type: String,
    }
  })

  const workoutStore = useWorkoutStore()
  const dayOfWeekStore = useDayOfWeekStore()
  const daysOfWeek = dayOfWeekStore.getDaysOfWeek
  const workoutPlanStore = useWorkoutPlanStore()
  
  const generatedWorkoutId = ref<string>(uuidv4())
  const generatedWorkoutPlanId = ref<string>(uuidv4())
  const workoutName = ref<string>('Workout')
  const createdAt = ref<Date>(new Date())
  const description = ref<string>('')
  const exercises = ref<Exercise[]>([])

  const isOpen = ref<boolean>(false)
  const alertButtons = ['OK'];

  const restTime = ref<number>(60)
  const rir = ref<number>(2)
  const individualRestTime = ref<boolean>(false)
  const individualRir = ref<boolean>(false)

  const restTimeValid = ref<boolean>(true)
  const rirValid = ref<boolean>(true)

  const workoutPlan = ref<WorkoutPlan>()
  const plannedWorkouts = ref<PlannedWorkout[]>()
  const weekDays = ref<number[]>([])

  const exercisesSelected = computed(() => {
    return exercises.value.length > 0
  })

  const isValid = computed(() => {
    return workoutName.value.length > 0 && exercisesSelected.value && exercises.value.every((exercise) => exercise.valid) &&
           restTimeValid.value && rirValid.value && weekDays.value.length > 0
  })

  const save = async () => {
    await workoutStore.addWorkout({
      id: generatedWorkoutId.value,
      created_at: new Date(),
      updated_at: new Date(),
      name: workoutName.value,
      description: description.value,
      exercises: exercises.value,
      deleted: false
    });
    await workoutPlanStore.addWorkoutPlan({
      id: generatedWorkoutPlanId.value,
      created_at: new Date(),
      updated_at: new Date(),
      name: workoutName.value,
      description: description.value,
      deleted: false
    });
    for (const day of weekDays.value) {
      await workoutPlanStore.addPlannedWorkout({
        id: uuidv4(),
        workout_id: generatedWorkoutId.value,
        workout_plan_id: generatedWorkoutPlanId.value,
        day_of_week_id: day,
        time_of_day: new Date().toISOString().slice(11, 16),
        deleted: false
      })
    }
    modalController.dismiss(null, 'save');
  }

  const update = async () => {
    if (!props.workoutId) return
    await workoutStore.updateWorkout({
      id: props.workoutId,
      created_at: createdAt.value,
      updated_at: new Date(),
      name: workoutName.value,
      description: description.value,
      exercises: exercises.value,
      deleted: false
    });
    if(workoutPlan.value) {
      await workoutPlanStore.updateWorkoutPlan({
        id: workoutPlan.value.id,
        created_at: workoutPlan.value.created_at,
        updated_at: new Date(),
        name: workoutPlan.value.name,
        description: workoutPlan.value.description,
        deleted: false
      });
      const addedWeekDays = weekDays.value.filter((day) => !plannedWorkouts.value?.some((workout) => workout.day_of_week_id === day))
      const removedWeekDays = plannedWorkouts.value?.filter((workout) => !weekDays.value.some((day) => workout.day_of_week_id === day))
      if (addedWeekDays && addedWeekDays.length > 0) {
        for (const day of addedWeekDays) {
          await workoutPlanStore.addPlannedWorkout({
            id: uuidv4(),
            workout_id: props.workoutId,
            workout_plan_id: workoutPlan.value.id,
            day_of_week_id: day,
            time_of_day: new Date().toISOString().slice(11, 16),
            deleted: false
          })
        }
      }
      if (removedWeekDays && removedWeekDays.length > 0) {
        for (const day of removedWeekDays) {
          await workoutPlanStore.deletePlannedWorkout(day.id)
        }
      }
    }
    modalController.dismiss(null, 'save');
  }

  const deleteWorkout = async () => {
    if (!props.workoutId) return
    if (workoutPlan.value) {
      await workoutPlanStore.deleteWorkoutPlan(workoutPlan.value.id)
    }
    const hasDeleted = await workoutStore.deleteWorkout(props.workoutId)
    if (hasDeleted) {
      modalController.dismiss(null, 'save');
    } else {
      isOpen.value = true
    }
  }

  const addExercise = async (e: ExerciseSelection[]) => {
    for (const exercise of e) {
      exercises.value.push({
        id: exercise.id,
        created_at: new Date(),
        updated_at: new Date(),
        workout_id: generatedWorkoutId.value,
        exercise_id: exercise.exercise_id,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        resttime: restTime.value,
        rir: rir.value,
      })
    }
  }

  const getWorkoutData = (workoutId: string) => {
      const workout = workoutStore.getWorkoutById(workoutId)
      if (!workout) return
      workoutName.value = workout.name
      description.value = workout.description
      createdAt.value = workout.created_at
      // Deep copy the exercises array to avoid reactivity issues
      exercises.value = JSON.parse(JSON.stringify(workout.exercises))
  }

  const getWorkoutPlanData = (workoutId: string) => {
    const currentPlannedWorkouts = workoutPlanStore.getPlannedWorkoutsByWorkoutId(workoutId)
    if(currentPlannedWorkouts.length === 0) return
    generatedWorkoutPlanId.value = currentPlannedWorkouts[0].workout_plan_id
    const currentWorkoutPlan = workoutPlanStore.getWorkoutPlanById(generatedWorkoutPlanId.value)
    if (!workoutPlan) return
    weekDays.value = currentPlannedWorkouts.map((workouts) => workouts.day_of_week_id)
    workoutPlan.value = currentWorkoutPlan
    plannedWorkouts.value = currentPlannedWorkouts
  }

  const changeWeekdays = (e: any) => {
    weekDays.value = e.detail.value
  }

  const setOpen = (state: boolean) => {
    isOpen.value = state;
  };

  onMounted(() => {
    if (props.workoutId) {
      getWorkoutData(props.workoutId)
      getWorkoutPlanData(props.workoutId)
    } else {
      generatedWorkoutId.value = uuidv4()
    }
  })
</script>

 <template>
  <BaseFullPageModal
    :disable-button="!isValid"
  >
    <template #saveButton>
      <ion-icon v-if="!workoutId" :icon="bookmarkOutline" @click="save"/>
      <ion-icon v-else :icon="UpdateIcon" @click="update"/>
    </template>
    <template #modalHeader>
      <p v-if="!workoutId" class="header-title">{{ $t('workouts.addWorkout') }}</p>
      <p v-else class="header-title">{{ $t('workouts.updateWorkout') }}</p>
    </template>
    <template #modalContent>
      <ion-input class="ion-padding" fill="outline" shape="round" :label="$t('workouts.workoutName')" label-placement="stacked" v-model="workoutName"></ion-input>

      <ion-item
        class="weekday-selection ion-margin"
        lines="none"
      >
        <ion-select 
          :label="$t('when')"
          :placeholder="$t('weekday', 2)"
          :multiple="true"
          :value="weekDays"
          @ion-change="changeWeekdays($event)"
        >
          <ion-select-option 
            v-for="(day, index) in daysOfWeek"
            :value="day.id"
          >
            {{ day.name }}
          </ion-select-option>
        </ion-select>
      </ion-item>

      <ion-list class="settings-list" lines="none" :inset="true">
      <ion-accordion-group>
        <ion-accordion value="workoutSettings">
          <ion-item slot="header" color="light">
            <ion-label>{{ $t('workoutSettings') }}</ion-label>
          </ion-item>
 
          <ion-item slot="content">
            <ion-label slot="start">{{ $t('workouts.restTime') }}</ion-label>
            <NumericInput
              slot="end"
              label=""
              :min-value="1"
              :max-value="3600"
              :input-value="restTime"
              @update:input-value="restTime = $event"
              @update:valid="restTimeValid = $event"
            />
          </ion-item>

          <ion-item slot="content">
            <ion-label slot="start">{{ $t('workouts.rir') }}</ion-label>
            <NumericInput
              slot="end"
              label=""
              :min-value="0"
              :max-value="10"
              :input-value="rir"
              @update:input-value="rir = $event"
              @update:valid="rirValid = $event"
            />
          </ion-item>
        </ion-accordion>

        <ion-accordion value="advanced">
          <ion-item slot="header" color="light">
            <ion-label>{{ $t('settings.advancedSettings') }}</ion-label>
          </ion-item>
          <ion-item slot="content">
            <ion-toggle
              v-model="individualRestTime"
            >
              {{ $t('settings.individualRestTime') }}
            </ion-toggle>
          </ion-item>

          <ion-item slot="content">
            <ion-toggle
              v-model="individualRir"
            >
              {{ $t('settings.individualRIR') }}
            </ion-toggle>
          </ion-item>
        </ion-accordion>
      </ion-accordion-group>
      </ion-list>

      <ion-row class="ion-justify-items-center ion-margin">
        <ion-col size="6">
          <ion-button
            size="small"
            expand="block"
            :disabled="true"
          >
            Set all Sets
          </ion-button>
        </ion-col>
        <ion-col size="6">
          <ion-button
            size="small"
            expand="block"
            :disabled="true"
          >
            Set all Reps
          </ion-button>
        </ion-col>
      </ion-row>

      <ExerciseItem 
        v-for="(exercise, index) in exercises"
        v-model:sets="exercises[index].sets"
        v-model:reps="exercises[index].reps"
        v-model:weight="exercises[index].weight"
        :key="index" 
        :id="exercise.id"
        :created_at="exercise.created_at"
        :updated_at="exercise.updated_at"
        :workout_id="exercise.workout_id"
        :exercise_id="exercise.exercise_id"
        :name="exercise.name"
        class="exercise-item ion-margin"
        @update:valid="exercises[index].valid = $event"
       />
      <AddExerciseButton class="ion-margin" @save-exercises="addExercise"/>
      <ion-button
        v-if="workoutId"
        class="ion-margin"
        expand="block"
        size="small"
        color="secondary"
        @click="deleteWorkout"
      >
        {{ $t('workouts.deleteWorkout') }}
      </ion-button>

      <ion-alert
        :is-open="isOpen"
        :header="$t('workouts.alreadyPlannedAlert')"
        :sub-header="$t('workouts.alreadyPlannedAlertMessage')"
        :buttons="alertButtons"
        @didDismiss="setOpen(false)"
      ></ion-alert>
    </template>
  </BaseFullPageModal>
</template> 

<style scoped>
  .weekday-selection {
    --padding-start: 0;
    --padding-end: 0;
    border-radius: 10px;
    --background: transparent;
  }
  .header-title {
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
  }

  .exercise-item {
    border-radius: 10px;
  }

  .settings-list {
    background-color: transparent;
    background: transparent;
    --background: transparent;
    --background-color: transparent;
  }
</style>
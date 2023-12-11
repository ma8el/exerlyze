<script setup lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import { IonIcon,
           IonInput,
           IonButton,
           IonAlert,
           modalController } from '@ionic/vue';
  import { ref, onMounted } from 'vue'
  import { useWorkoutStore } from '../../store/workoutStore';
  import AddExerciseButton from '../Buttons/AddExerciseButton.vue'
  import ExerciseItem from '../ExerciseItem.vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { Exercise, ExerciseSelection } from '@/types';
  import { bookmarkOutline } from 'ionicons/icons';
  import UpdateIcon from '@/icons/update.svg';

  const props = defineProps({
    workoutId: {
      type: String,
    }
  })

  const workoutStore = useWorkoutStore()
  
  const generatedWorkoutId = ref<string>(uuidv4())
  const workoutName = ref<string>('Workout')
  const createdAt = ref<Date>(new Date())
  const description = ref<string>('')
  const exercises = ref<Exercise[]>([])

  const isOpen = ref<boolean>(false)
  const alertButtons = ['OK'];

  const save = async () => {
    workoutStore.addWorkout({
      id: generatedWorkoutId.value,
      created_at: new Date(),
      updated_at: new Date(),
      name: workoutName.value,
      description: description.value,
      exercises: exercises.value,
      deleted: false
    })
    modalController.dismiss(null, 'save');
  }

  const update = async () => {
    if (!props.workoutId) return
    workoutStore.updateWorkout({
      id: props.workoutId,
      created_at: createdAt.value,
      updated_at: new Date(),
      name: workoutName.value,
      description: description.value,
      exercises: exercises.value,
      deleted: false
    })
    modalController.dismiss(null, 'save');
  }

  const deleteWorkout = () => {
    if (!props.workoutId) return
    const hasDeleted = workoutStore.deleteWorkout(props.workoutId)
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

  const setOpen = (state: boolean) => {
    isOpen.value = state;
  };

  onMounted(() => {
    if (props.workoutId) {
      getWorkoutData(props.workoutId)
    } else {
      generatedWorkoutId.value = uuidv4()
    }
  })
</script>

 <template>
  <BaseFullPageModal>
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
      <ion-input class="ion-padding" fill="outline" shape="round" :label="$t('description')" label-placement="stacked" v-model="description"></ion-input>
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
  .header-title {
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
  }

  .exercise-item {
    border-radius: 10px;
  }
</style>
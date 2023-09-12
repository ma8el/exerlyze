<script setup lang="ts">
  import { IonIcon,
           IonInput,
           modalController } from '@ionic/vue';
  import { ref, onMounted } from 'vue'
  import { useWorkoutStore } from '../../store/workoutStore';
  import AddExerciseButton from '../Buttons/AddExerciseButton.vue'
  import ExerciseItem from '../ExerciseItem.vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { Exercise } from '@/types';
  import { bookmarkOutline } from 'ionicons/icons';

  const props = defineProps({
    workoutId: {
      type: Number,
    }
  })

  const workoutStore = useWorkoutStore()
  
  const workoutName = ref()
  const description = ref()
  const exercises = ref<Exercise[]>([])

  const save = () => {
    workoutStore.addWorkout({
      id: workoutStore.getNewId,
      name: workoutName.value,
      description: description.value,
      exercises: exercises.value
    })
    modalController.dismiss(null, 'save');
  }

  const update = () => {
    if (!props.workoutId) return
    workoutStore.updateWorkout({
      id: props.workoutId,
      name: workoutName.value,
      description: description.value,
      exercises: exercises.value
    })
    modalController.dismiss(null, 'save');
  }

  const addExercise = (e: Exercise[]) => {
    exercises.value.push(...e)
  }

  const getWorkoutData = (workoutId: number) => {
      const workout = workoutStore.getWorkoutById(workoutId)
      if (!workout) return
      workoutName.value = workout.name
      description.value = workout.description
      // Deep copy the exercises array to avoid reactivity issues
      exercises.value = JSON.parse(JSON.stringify(workout.exercises))
    }

  onMounted(() => {
    if (props.workoutId) {
      getWorkoutData(props.workoutId)
    }
  })
</script>

 <template>
  <BaseFullPageModal>
    <template #saveButton>
      <ion-icon v-if="!workoutId" :icon="bookmarkOutline" @click="save"/>
      <ion-icon v-else src="../../../assets/icons/update.svg" @click="update"/>
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
        :name="exercise.name"
        class="exercise-item ion-margin"
       />
      <AddExerciseButton class="ion-margin" @save-exercises="addExercise"/>
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
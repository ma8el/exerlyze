<script setup lang="ts">
  import { IonButton,
           IonInput,
           modalController } from '@ionic/vue';
  import { ref, onMounted } from 'vue'
  import { useWorkoutStore } from '../../store/workoutStore';
  import AddExerciseButton from '../Buttons/AddExerciseButton.vue'
  import ExerciseItem from '../ExerciseItem.vue';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { Exercise } from '@/types';

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
    console.log(exercises.value)
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

  onMounted(() => {
    if (props.workoutId) {
      const workout = workoutStore.getWorkoutById(props.workoutId)
      if (!workout) return
      workoutName.value = workout.name
      description.value = workout.description
      exercises.value = workout.exercises
    }
  })
</script>

 <template>
  <BaseFullPageModal title="Add Workout">
    <template #saveButton>
      <ion-button v-if="!workoutId" @click="save">Save</ion-button>
      <ion-button v-else @click="update">Update</ion-button>
    </template>
    <template #modalContent>
      <ion-input class="ion-padding" fill="outline" shape="round" label="Workout Name" label-placement="stacked" v-model="workoutName"></ion-input>
      <ion-input class="ion-padding" fill="outline" shape="round" label="Description" label-placement="stacked" v-model="description"></ion-input>
      <ExerciseItem v-for="(exercise, index) in exercises"
        v-model:sets="exercises[index].sets"
        v-model:reps="exercises[index].reps"
        v-model:weight="exercises[index].weight"
        :key="index" 
        :id="exercise.id"
        :name="exercise.name"
       />
      <AddExerciseButton @confirm="addExercise"/>
    </template>
  </BaseFullPageModal>
</template> 
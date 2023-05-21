<script setup lang="ts">
  import { IonButton,
           IonInput,
           modalController } from '@ionic/vue';
  import { ref } from 'vue'
  import { useWorkoutStore } from '../../store/workoutStore';
  import AddExerciseButton from '../Buttons/AddExerciseButton.vue'
  import ExerciseItem from '../ExerciseItem.vue';
  import { Exercise } from '@/types';
  import BaseFullPageModal from './BaseFullPageModal.vue';

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

  const addExercise = (e: Exercise[]) => {
    exercises.value.push(...e)
  }
</script>

 <template>
  <BaseFullPageModal title="Add Workout">
    <template #saveButton>
      <ion-button @click="save">Save</ion-button>
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
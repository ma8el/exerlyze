<script setup lang="ts">
  import { IonButton,
           IonContent,
           IonHeader, 
           IonToolbar,
           IonTitle,
           IonButtons,
           IonInput,
           modalController } from '@ionic/vue';
  import { ref } from 'vue'
  import { useWorkoutStore } from '../../store/workoutStore';
  import AddExerciseButton from '../Buttons/AddExerciseButton.vue'
  import ExerciseItem from '../ExerciseItem.vue';
  import { Exercise } from '@/types';

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

  const closeModal = () => {
      return modalController.dismiss(null, 'close');
  };

  const addExercise = (e: Exercise[]) => {
    exercises.value.push(...e)
  }
</script>

 <template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeModal">Dismiss</ion-button>
        </ion-buttons>
        <ion-title>Add Workout</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="save">Save</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
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
    </ion-content>
  </ion-content>
</template> 
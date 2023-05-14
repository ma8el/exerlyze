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

  const workoutStore = useWorkoutStore()

  const workoutName = ref()
  const description = ref()
  
  const save = () => {
    console.log('Save')
  }

  const closeModal = () => {
      return modalController.dismiss(null, 'close');
  };
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
      <ion-input fill="outline" shape="round" label="Workout Name" label-placement="stacked" v-model="workoutName"></ion-input>
      <ion-input fill="outline" shape="round" label="Description" label-placement="stacked" v-model="description"></ion-input>
      <AddExerciseButton/>
    </ion-content>
  </ion-content>
</template> 
<script setup lang="ts">
  import { IonCard,
           IonCardHeader,
           IonCardTitle,
           IonCardContent,
           IonModal,
           IonHeader,
           IonToolbar,
           IonButton,
           IonButtons,
           IonTitle,
           IonContent,
           IonInput} from '@ionic/vue';
  import ExerciseItem from '@/components/ExerciseItem.vue';
  import { ref } from 'vue';

  const props = defineProps({
    workoutId: Number,
    workoutName: String,
    exercises: Array
  })

  const modal = ref(null)

  const onWillDismiss = () => {
    console.log('will dismiss')
  }

  const cancel = () => {
    if (modal.value) {
      modal.value.$el.dismiss(null, 'cancel')
    }   
    return
  }

  const confirm = () => {
    if (modal.value) {
      modal.value.$el.dismiss(null, 'confirm')
    }
    return
  }

</script>

<template>
  <ion-card :button="true" :id="`open-modal-${workoutId}`">
    <ion-card-header>
      <ion-card-title>{{ workoutName }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      Meta data
    </ion-card-content>
    <ion-modal ref="modal" :trigger="`open-modal-${workoutId}`" @willDismiss="onWillDismiss">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="cancel()">Cancel</ion-button>
            </ion-buttons>
            <ion-title>{{ workoutName }}</ion-title>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ExerciseItem 
            v-for = "exercise in exercises"
            :exercise-name="exercise.name"
            :exercise-sets="exercise.sets"
            :exercise-reps="exercise.reps"
            :exercise-weight="exercise.weight"
          />
        </ion-content>
      </ion-modal>
    </ion-card>
</template>
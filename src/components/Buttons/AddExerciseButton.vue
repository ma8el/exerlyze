<script setup lang="ts">
 import { IonButton,
          IonContent,
          IonHeader,
          IonToolbar,
          IonTitle,
          IonModal,
          IonButtons,
          IonItem,
          IonLabel,
          IonCheckbox } from '@ionic/vue';
  import { ref } from 'vue';

  const exercises = [
    {
    name: 'Deadlift',
    isSelected: false
    },
    {
    name: 'Bench Press',
    isSelected: false
    },
    {
    name: 'Squat',
    isSelected: false
    },
    {
    name: 'Overhead Press',
    isSelected: false
    },
  ]

  const modal = ref(null)
 
  const addExercise = () => {
    console.log('Add Exercise');
  }
 
  const cancel = () => {
    if(modal.value) {
      modal.value.$el.dismiss(null, 'cancel');
    }
  }
 
  const confirm = () => {
    console.log('Confirm');
  }
 
  const onWillDismiss = () => {
    console.log('Will dismiss');
  }

</script>

<template>
  <ion-content class="ion-padding">
    <ion-button
      id="open-modal"
      @click="addExercise"
      expand="block"
      size="small"
    >
      Add Exercise
    </ion-button>
    <ion-modal ref="modal" trigger="open-modal" @willDismiss="onWillDismiss">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="cancel()">Cancel</ion-button>
          </ion-buttons>
          <ion-title>Select Exercises</ion-title>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item v-for="exercise in exercises">
          <ion-label>{{ exercise.name }}</ion-label>
          <ion-checkbox slot="start" v-model="exercise.isSelected" />
        </ion-item>
      </ion-content>
    </ion-modal>
  </ion-content>
</template>
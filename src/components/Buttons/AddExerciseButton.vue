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
  import { ref, onMounted, onUnmounted } from 'vue';

  const exercises = [
    {
    id: 1,
    name: 'Deadlift',
    },
    {
    id: 2,
    name: 'Bench Press',
    },
    {
    id: 3,
    name: 'Squat',
    },
    {
    id: 4,
    name: 'Overhead Press',
    },
  ]

  const modal = ref(null)
  const selected = ref([])

  const emit = defineEmits(['confirm'])
 
  const cancel = () => {
    if(modal.value) {
      resetSelectedBool()
      selected.value = []
      modal.value.$el.dismiss(null, 'cancel');
    }
  }
 
  const confirm = () => {
    if(modal.value) {
      emit('confirm', selected.value)
      resetSelectedBool()
      selected.value = []
      modal.value.$el.dismiss(null, 'cancel');
    }
  }
 
  const onWillDismiss = () => {
    console.log('Will dismiss');
    resetSelectedBool()
    selected.value = []
  }

  const toggleExercise = (exercise) => {
    exercise.isSelected = !exercise.isSelected
    if (exercise.isSelected) {
        selected.value.push(exercise);
      } else {
        const index = selected.value.indexOf(exercise);
        if (index !== -1) {
          selected.value.splice(index, 1);
        }
      }
  }

  const resetSelectedBool = () => {
    exercises.forEach((exercise) => {
      exercise.isSelected = false
    })
  }

  onMounted(() => {
    resetSelectedBool()
    selected.value = []
  })

  onUnmounted(() => {
    resetSelectedBool()
    selected.value = []
  })

</script>

<template>
  <ion-content class="ion-padding">
    <ion-button
      id="open-modal"
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
          <ion-checkbox slot="start" :checked="exercise.isSelected" @ionChange="toggleExercise(exercise)"/>
        </ion-item>
      </ion-content>
    </ion-modal>
  </ion-content>
</template>
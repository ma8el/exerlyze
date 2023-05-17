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
           modalController } from '@ionic/vue';
  import ExerciseItem from '@/components/ExerciseItem.vue';
  import { ref } from 'vue';
  import { Workout } from '@/types';

  const props = defineProps<Workout>()

  const modal = ref(null)

  const onWillDismiss = () => {
    console.log('will dismiss')
  }

  const cancel = () => {
    modalController.dismiss(null, 'cancel')
  }

  const confirm = () => {
    modalController.dismiss(null, 'confirm')
  }

</script>

<template>
  <ion-card :button="true" :id="`open-modal-${id}`">
    <ion-card-header>
      <ion-card-title>{{ name }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      Meta data
    </ion-card-content>
    <ion-modal ref="modal" :trigger="`open-modal-${id}`" @willDismiss="onWillDismiss">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="cancel()">Cancel</ion-button>
            </ion-buttons>
            <ion-title>{{ name }}</ion-title>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ExerciseItem 
            v-for = "exercise in exercises"
            :key="exercise.id"
            :id="exercise.id"
            :name="exercise.name"
            :sets="exercise.sets"
            :reps="exercise.reps"
            :weight="exercise.weight"
          />
        </ion-content>
      </ion-modal>
    </ion-card>
</template>
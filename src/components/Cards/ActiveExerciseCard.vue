<script setup lang="ts">
  import { IonCard,
           IonCardHeader,
           IonCardTitle,
           IonItem,
           IonLabel,
           IonCardContent} from '@ionic/vue';
  import { ActiveExercise } from '@/types/'
  import { PropType } from 'vue';

  const props = defineProps({
    exercise: {
      type: Object as PropType<ActiveExercise>,
      required: true
    }
  })
</script>

<template>
  <ion-card>
    <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
    <ion-card-header>
      <ion-card-title>{{ exercise.name }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-item>
        <ion-label>Set: {{ exercise.currentSet }}</ion-label>
        <ion-label>Reps: {{ exercise.reps }}</ion-label>
        <ion-label slot="end">Weight: {{ exercise.weight }}</ion-label>
      </ion-item>
    </ion-card-content>
  </ion-card>
</template>
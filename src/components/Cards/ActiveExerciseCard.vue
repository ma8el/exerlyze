<script setup lang="ts">
  import { IonCard,
           IonCardHeader,
           IonCardTitle,
           IonItem,
           IonLabel,
           IonInput,
           IonCardContent} from '@ionic/vue';

  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    currentSet: {
      type: Number,
      required: true
    },
    reps: {
      type: Number,
      required: true
    },
    weight: {
      type: Number,
      required: true
    }
  })
</script>

<template>
  <ion-card>
    <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
    <ion-card-header>
      <ion-card-title>{{ name }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-item>
        <ion-label slot="start">Set: {{ currentSet }}</ion-label>
        <ion-input 
          type="number" 
          slot="end"
          label="Reps"
          label-placement="stacked"
          :clear-on-edit="true"
          :value="reps"
          @input="$emit('update:reps', parseInt($event.target.value))"
        >
        </ion-input>
        <ion-input 
          label="Weight"
          slot="end"
          type="number"
          label-placement="stacked"
          :clear-on-edit="true"
          :value="weight"
          @input="$emit('update:weight', parseInt($event.target.value))"
        >
        </ion-input>
      </ion-item>
    </ion-card-content>
  </ion-card>
</template>
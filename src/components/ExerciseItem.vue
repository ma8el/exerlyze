<script setup lang="ts">
  import { IonInput, IonItem, IonLabel, IonThumbnail } from '@ionic/vue';
  import { ref, onMounted } from 'vue'

  const name = ref<string>()
  const sets = ref<number>()
  const reps = ref<number>()
  const weight = ref<number>()

  const props = defineProps({
      exerciseName: String,
      exerciseSets: Number,
      exerciseReps: Number,
      exerciseWeight: Number
  })

  onMounted (() => {
    name.value = props.exerciseName
    sets.value = props.exerciseSets
    reps.value = props.exerciseReps
    weight.value = props.exerciseWeight
  })
</script>

<template>
  <ion-item>
    <ion-thumbnail slot="start">
      <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
    </ion-thumbnail>
    <ion-label>
      <h3>{{ exerciseName }}</h3>
      <div class="single-line">
        <ion-input
          label="Sets"
          label-placement="stacked"
          v-model="sets"
          fill="solid"
        >
        </ion-input>
        <ion-input
          label="Reps"
          label-placement="stacked"
          v-model="reps"
          fill="solid"
        >
        </ion-input>
        <ion-input
          label="Weight"
          label-placement="stacked"
          v-model="weight"
          fill="solid"
        >
        </ion-input>
      </div>
    </ion-label>
  </ion-item>
</template>

<style scoped>
.single-line {
  display: inline-flex;
}
</style>
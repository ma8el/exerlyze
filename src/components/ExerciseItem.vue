<script setup lang="ts">
  import { IonInput, IonItem, IonLabel, IonThumbnail } from '@ionic/vue';
  import { Exercise } from '@/types'

  const props = defineProps<Exercise>()
  const emit = defineEmits(['update:sets', 'update:reps', 'update:weight'])
</script>

<template>
  <ion-item>
    <ion-thumbnail slot="start">
      <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
    </ion-thumbnail>
    <ion-label>
      <h3>{{ name }}</h3>
      <div class="single-line">
        <ion-input
          :label="$t('workouts.sets')"
          label-placement="stacked"
          :value="props.sets"
          @input="emit('update:sets', $event.target.value)"
          fill="solid"
        >
        </ion-input>
        <ion-input
          :label="$t('workouts.reps')"
          label-placement="stacked"
          :value="props.reps"
          @input="emit('update:reps', $event.target.value)"
          fill="solid"
        >
        </ion-input>
        <ion-input
          :label="$t('weight')"
          label-placement="stacked"
          :value="props.weight"
          @input="emit('update:weight', $event.target.value)"
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
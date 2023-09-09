<script setup lang="ts">
  import { IonInput, IonItem, IonLabel, IonThumbnail, IonSpinner, modalController } from '@ionic/vue';
  import ExerciseDetailModal from './Modals/ExerciseDetailModal.vue';
  import { Exercise } from '@/types'
  import { ref, watch, onMounted } from 'vue';
  import { defaultImage, getBucketUrlFromTable, getSignedObjectUrl } from '@/composables/supabase';

  const props = defineProps<Exercise>()
  const emit = defineEmits(['update:sets', 'update:reps', 'update:weight'])
  const bucketUrl = ref<string>()
  const url = ref<string>()
  const loading = ref<boolean>(true)

  onMounted(async () => {
    loading.value = true
    await getBucketUrlFromTable('exercises', props.id).then((response) => {
      bucketUrl.value = response.data?.image_url
    })
    if (!bucketUrl.value) return
    await getSignedObjectUrl('exercise_images', bucketUrl.value).then((response) => {
      url.value = response.data?.signedUrl
    })
  })

  const openExerciseDetailModal = async () => {
    const modal = await modalController.create({
      component: ExerciseDetailModal,
      componentProps: { exerciseId: props.id, exerciseUrl: url.value },
    });
    modal.present();
  }

  watch(() => url.value, () => {
    loading.value = false
  })
</script>

<template>
  <ion-item :button="true" @click="openExerciseDetailModal()">
    <ion-thumbnail slot="start">
      <img v-if="!loading" alt="Exercise Image" :src="url ? url: defaultImage" />
      <ion-spinner v-else/>
    </ion-thumbnail>
    <ion-label>
      <h3>{{ name }}</h3>
      <div class="single-line">
        <ion-input
          :label="$t('workouts.set')"
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
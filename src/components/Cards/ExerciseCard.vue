<script setup lang="ts">
  import { IonSpinner } from '@ionic/vue';
  import { onMounted, ref } from 'vue';
  import BaseCard from './BaseCard.vue';
  import { defaultImage, getBucketUrlFromTable, getSignedObjectUrl } from '@/composables/supabase';
  import { Exercise } from '@/types';

  const props = defineProps<Exercise>()
  const loading = ref<boolean>(true)
  const bucketUrl = ref<string>()
  const url = ref<string>()

  onMounted(async () => {
    loading.value = true
    await getBucketUrlFromTable('exercises', props.id).then((response) => {
      bucketUrl.value = response.data?.image_url
    })
    if (!bucketUrl.value) return
    await getSignedObjectUrl('exercise_images', bucketUrl.value).then((response) => {
      url.value = response.data?.signedUrl
    })
    loading.value = false
  })
</script>

<template>
  <BaseCard
    v-if="!loading"
    class="exercise-card"
    :img_src="url ? url : defaultImage"
    :title="name"
    :sub-title="`Sets: ${sets} Reps: ${reps} Weight: ${weight}`"
    :img_height="'100px'"
  >
  </BaseCard>
  <ion-spinner v-else/>
</template>
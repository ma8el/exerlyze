<script setup lang="ts">
  import { IonSpinner } from '@ionic/vue';
  import BaseCard from './BaseCard.vue';
  import { defaultImage, getBucketUrlFromTable, getSignedObjectUrl } from '@/composables/supabase';
  import { ref, onMounted, watch } from 'vue';

  const loading= ref<boolean>(true)
  const bucketUrl = ref<string>()
  const url = ref<string>()

  const props = defineProps({
    exerciseId: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
  })

  const getImageUrl = async () => {
    loading.value = true
    await getBucketUrlFromTable('exercises', props.exerciseId).then((response) => {
      bucketUrl.value = response.data?.image_url
    })
    if (!bucketUrl.value) return
    await getSignedObjectUrl('exercise_images', bucketUrl.value).then((response) => {
      url.value = response.data?.signedUrl
    })
    loading.value = false
  }

  watch(() => props.exerciseId, () => {
    getImageUrl()
  })

  onMounted(async () => {
    getImageUrl()
  })
</script>

<template>
  <BaseCard
    v-if="!loading"
    :title="name"
    :img_src="url ? url : defaultImage"
    :img_height="'300px'"
    :content="false"
  />
  <ion-spinner v-else/>
</template>
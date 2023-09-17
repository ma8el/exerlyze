<script setup lang="ts">
  import { IonSpinner,
           IonItem,
           IonLabel,
           IonInput } from '@ionic/vue';
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
//    currentSet: {
//      type: Number,
//      required: true
//    },
//    reps: {
//      type: Number,
//      required: true
//    },
//    weight: {
//      type: Number,
//      required: true
//    }
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
  >
<!--    <ion-item>
      <ion-label slot="start">{{ $t('workouts.set') }}: {{ currentSet }}</ion-label>
      <ion-input 
        type="number" 
        slot="end"
        :label="$t('workouts.reps')"
        label-placement="stacked"
        :clear-on-edit="true"
        :value="reps"
        @input="$emit('update:reps', parseInt($event.target.value))"
      >
      </ion-input>
      <ion-input 
        :label="$t('weight')"
        slot="end"
        type="number"
        label-placement="stacked"
        :clear-on-edit="true"
        :value="weight"
        @input="$emit('update:weight', parseInt($event.target.value))"
      >
      </ion-input>
    </ion-item>-->
  </BaseCard>
  <ion-spinner v-else/>
</template>
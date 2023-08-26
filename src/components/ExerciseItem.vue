<script setup lang="ts">
  import { IonInput, IonItem, IonLabel, IonThumbnail, IonSpinner } from '@ionic/vue';
  import { Exercise } from '@/types'
  import { supabase } from '@/supabase';
  import { ref, watch, onMounted } from 'vue';

  const props = defineProps<Exercise>()
  const emit = defineEmits(['update:sets', 'update:reps', 'update:weight'])
  const bucketUrl = ref<string>()
  const url = ref<string>()
  const loading = ref<boolean>(true)

  onMounted(async () => {
    console.log(props.id)
    loading.value = true
    await supabase
      .from('exercises')
      .select('image_url')
      .eq('id', props.id)
      .single()
      .then((response) => {
        if (response.error) {
          console.log(response.error)
        } else {
          bucketUrl.value = response.data.image_url
        }
      })
  })

  watch(() => url.value, () => {
    loading.value = false
  })

  watch(() => bucketUrl.value, () => {
    if (!bucketUrl.value) return
    supabase
      .storage
      .from('exercise_images')
      .createSignedUrl(bucketUrl.value, 60, {
        transform: {
          width: 100,
          height: 100,
        }
    }).then((response) => {
      if (response.error) {
        console.log(response.error)
      } else {
        url.value = response.data.signedUrl
      }
    })
  })
</script>

<template>
  <ion-item>
    <ion-thumbnail slot="start">
      <img v-if="!loading" alt="Exercise Image" :src="url" />
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
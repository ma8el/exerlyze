<script setup lang="ts">
  import { IonSpinner, IonIcon, IonRow, IonCol, IonGrid } from '@ionic/vue';
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
    await getBucketUrlFromTable('exercises', props.exercise_id).then((response) => {
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
    :sub-title="true"
    :img_height="'100px'"
  >
    <template #subtitle>
      <ion-grid>
      <ion-row>
        <ion-col class="no-margin" size="3">
          <div class="icon-description">
            <ion-icon class="small-margin" src="../../../assets/icons/set.svg"/>
            {{sets}}
          </div>
        </ion-col>
        <ion-col class="no-margin" size="3">

          <div class="icon-description">
          <ion-icon class="small-margin" src="../../../assets/icons/reps.svg"/>
          {{reps}}
          </div>
        </ion-col>
        <ion-col class="no-margin" size="6">
          <div class="icon-description">
          <ion-icon class="small-margin" src="../../../assets/icons/weight.svg"/>
          {{weight}} {{ $t('weightUnitBig')  }}
          </div>
        </ion-col>
      </ion-row>
      </ion-grid>
    </template>
  </BaseCard>
  <ion-spinner v-else/>
</template>

<style>

.no-margin {
  margin: 0;
  padding: 0;
}

.small-margin {
  margin-right: 0.2rem;
}

.icon-description {
  display: flex;
  align-items: center;
}

</style>
<script setup lang="ts">
  import { IonInput,
     IonItem,
     IonLabel,
     IonCard,
     IonCardContent,
     IonSpinner,
     IonRow,
     IonCol,
     IonIcon,
     modalController } from '@ionic/vue';
  import ExerciseDetailModal from './Modals/ExerciseDetailModal.vue';
  import SetIcon from '@/icons/set.svg';
  import RepsIcon from '@/icons/reps.svg';
  import WeightIcon from '@/icons/weight.svg';
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
    await getBucketUrlFromTable('exercises', props.exercise_id).then((response) => {
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
      componentProps: { exerciseId: props.exercise_id, exerciseUrl: url.value },
    });
    modal.present();
  }

  watch(() => url.value, () => {
    loading.value = false
  })
</script>

<template>
  <ion-card>
    <ion-card-content>
      <div class="thumbnail-card">
        <img 
          v-if="!loading"
          alt="Exercise Image"
          :src="url ? url: defaultImage"
          class="thumbnail-img"
          @click="openExerciseDetailModal"
        />
        <ion-spinner v-else/>
        <div class="thumbnail-content">
          <h3>{{ name }}</h3>
          <ion-row>
            <ion-col size="6">
              <ion-item>
                <ion-col size="3">
                 <ion-icon :icon="SetIcon"></ion-icon>
                </ion-col>
                <ion-col size="6">
                  <ion-input
                    :value="props.sets"
                    @input="emit('update:sets', $event.target.value)"
                    :clear-on-edit="true"
                  >
                </ion-input>
                </ion-col>
                <ion-col size="3">
                 <ion-label>{{ $t('workouts.set') }}</ion-label>
                </ion-col>
              </ion-item>
            </ion-col>
            <ion-col size="6">
              <ion-item>
                <ion-col size="3">
                  <ion-icon :icon="RepsIcon"></ion-icon>
                </ion-col>
                <ion-col size="5">
                  <ion-input
                    :value="props.reps"
                    @input="emit('update:reps', $event.target.value)"
                    :clear-on-edit="true"
                  >
                  </ion-input>
                </ion-col>
                <ion-col size="4">
                  <ion-label>{{ $t('workouts.reps') }}</ion-label>
                </ion-col>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-icon slot="start" :icon="WeightIcon"></ion-icon>
                <ion-input
                  :value="props.weight"
                  @input="emit('update:weight', $event.target.value)"
                  :clear-on-edit="true"
                >
                </ion-input>
                <ion-label slot="end">{{ $t('weightUnitBig') }}</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<style scoped>
ion-card-content {
  padding: 0;
  padding-inline-start: 10px;
  padding-inline-end: 0px;
}
h3 {
  font-size: 1rem;
  color: white;
  font-weight: bold;
}
ion-row {
  margin: 0;
  padding: 0;
}
ion-col {
  margin: 0;
  padding: 0;
}
ion-item {
  padding: 0;
  margin: 0;
  ion-label {
    font-size: 0.7rem;
  }
  ion-icon {
    width: 15px;
    height: 15px;
  }
}

.thumbnail-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin: 0 8px 0 0;
  border-radius: 10px;
}

.thumbnail-card {
  display: flex;
  align-items: center;
}

.thumbnail-content {
  flex: 1;
  margin: 0;
  padding: 0;
}
</style>
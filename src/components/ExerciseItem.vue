<script setup lang="ts">
  import { 
     IonButton,
     IonItem,
     IonLabel,
     IonCard,
     IonCardContent,
     IonSpinner,
     IonRow,
     IonCol,
     IonIcon,
     IonReorder,
     modalController } from '@ionic/vue';
  import ExerciseDetailModal from './Modals/ExerciseDetailModal.vue';
  import SetIcon from '@/icons/set.svg';
  import RepsIcon from '@/icons/reps.svg';
  import WeightIcon from '@/icons/weight.svg';
  import { closeCircleOutline } from 'ionicons/icons';
  import NumericInput from './NumericInput.vue';
  import { Exercise } from '@/types'
  import { ref, watch, onMounted, computed } from 'vue';
  import { defaultImage, getBucketUrlFromTable, getSignedObjectUrl } from '@/composables/supabase';

  const props = defineProps<Exercise>()
  const emit = defineEmits(['update:sets', 'update:reps', 'update:weight', 'update:valid', 'delete:exercise'])
  const bucketUrl = ref<string>()
  const url = ref<string>()
  const loading = ref<boolean>(true)

  const setsValid = ref<boolean>(true)
  const repsValid = ref<boolean>(true)
  const weightValid = ref<boolean>(true)

  const valid = computed(() => {
    return setsValid.value && repsValid.value && weightValid.value
  })

  const deleteExercise = () => {
    emit('delete:exercise', props.exercise_id)
  }

  const updateImage = async () => {
    loading.value = true
    await getBucketUrlFromTable('exercises', props.exercise_id).then((response) => {
      bucketUrl.value = response.data?.image_url
    })
    if (!bucketUrl.value) return
    await getSignedObjectUrl('exercise_images', bucketUrl.value).then((response) => {
      url.value = response.data?.signedUrl
    })
  }

  onMounted(async () => {
    updateImage()
  })

  const openExerciseDetailModal = async () => {
    const modal = await modalController.create({
      component: ExerciseDetailModal,
      componentProps: { exerciseId: props.exercise_id, exerciseUrl: url.value },
    });
    modal.present();
  }

  watch(() => props.exercise_id, async () => {
    updateImage()
  })

  watch(() => url.value, () => {
    loading.value = false
  })

  watch(valid, (value) => {
    emit('update:valid', value)
  })
</script>

<template>
<div
  class="card-container"
>
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
          <ion-row>
            <ion-col size="10">
              <h3>{{ name }}</h3>
            </ion-col>
            <ion-col size="2">
              <ion-button
                class="delete-button"
                fill="clear"
                color="secondary"
                size="small"
                @click="deleteExercise"
              >
                <ion-icon slot="icon-only" :icon="closeCircleOutline"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">
              <ion-item lines="none">
                <ion-col size="3">
                  <ion-icon :icon="SetIcon"></ion-icon>
                </ion-col>
                <ion-col size="9">
                  <NumericInput
                    :label="$t('workouts.set')"
                    :placeholder="$t('workouts.set')"
                    :minValue="1"
                    :maxValue="20"
                    :inputValue="props.sets"
                    error-text="Invalid"
                    :clear-input="false"
                    @update:inputValue="emit('update:sets', $event)"
                    @update:valid="setsValid = $event"
                  />
                </ion-col>
              </ion-item>
            </ion-col>
            <ion-col size="6">
              <ion-item lines="none">
                <ion-col size="3">
                  <ion-icon :icon="RepsIcon"></ion-icon>
                </ion-col>
                <ion-col size="5">
                 <NumericInput
                    :label="$t('workouts.reps')"
                    :placeholder="$t('workouts.reps')"
                    :minValue="1"
                    :maxValue="20"
                    :inputValue="props.reps"
                    error-text="Invalid"
                    :clear-input="false"
                    @update:inputValue="emit('update:reps', $event)"
                    @update:valid="repsValid = $event"
                  />
                </ion-col>
                <ion-col size="4">
                  <ion-label>{{ $t('workouts.reps') }}</ion-label>
                </ion-col>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item lines="none">
                <ion-col size="1">
                  <ion-icon :icon="WeightIcon"></ion-icon>
                </ion-col>
                <ion-col size="8">
                  <NumericInput
                    :label="$t('weight')"
                    :placeholder="$t('weight')"
                    :minValue="1"
                    :maxValue="500"
                    :inputValue="props.weight"
                    error-text="Invalid"
                    :clear-input="false"
                    @update:inputValue="emit('update:weight', $event)"
                    @update:valid="weightValid = $event"
                  />
                </ion-col>
                <ion-col size="2">
                  <ion-label>{{ $t('weightUnitBig') }}</ion-label>
                </ion-col>
              </ion-item>
            </ion-col>
          </ion-row>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
  <ion-reorder
    class="reorder-button"
  ></ion-reorder>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.reorder-button {
  margin: 0;
  padding: 0;
}
ion-card {
  padding: 0;
  margin: 0;
}
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
  :is(ion-label) {
    font-size: 0.7rem;
  }
  :is(ion-icon) {
    width: 15px;
    height: 15px;
    margin-top: 20px;
  }
}

.delete-button {
  margin: 0;
  padding: 0;
  :is(ion-icon) {
    width: 20px;
    height: 20px;
  }
}

.thumbnail-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin: 0;
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
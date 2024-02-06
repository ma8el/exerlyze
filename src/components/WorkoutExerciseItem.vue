<script setup lang="ts">
  import { IonItem,
           IonCard,
           IonCardContent,
           IonLabel,
           IonIcon,
           IonRow,
           IonCol} from '@ionic/vue';
  import SetIcon from '@/icons/set.svg';
  import WeightIcon from '@/icons/weight.svg';
  import RepsIcon from '@/icons/reps.svg';
  import Timer from './Timer.vue';
  import NumericInput from './NumericInput.vue';
  import { getBucketUrlFromTable, getSignedObjectUrl } from '@/composables/supabase';
  import { ref, onMounted, computed, watch } from 'vue';

  interface Props {
    exerciseId: number;
    name: string;
    currentSet: number;
    reps: number;
    weight: number;
    resttime: number;
    transitionTrigger: boolean;
    showBreak: boolean;
    showVideo?: boolean;
  }

  const props = defineProps<Props>()

  const emit = defineEmits(['update:reps',
                            'update:weight',
                            'update:resttime',
                            'update:valid'])

  const loading= ref<boolean>(true)
  const ressourceName = ref<string>()
  const url = ref<string>()
  const setRef = ref<InstanceType<typeof IonRow>>();
  const startTimer = ref<boolean>(false);

  const repsValid = ref<boolean>(true)
  const weightValid = ref<boolean>(true)

  const isValid = computed(() => {
    return repsValid.value && weightValid.value
  })

  const getImageUrl = async () => {
    loading.value = true
    await getBucketUrlFromTable('exercises', props.exerciseId).then((response) => {
      ressourceName.value = response.data?.ressource_name
    })
    if (!ressourceName.value) return
    await getSignedObjectUrl('exercise_videos', `${ressourceName.value}.mp4`).then((response) => {
      url.value = response.data?.signedUrl
    })
    loading.value = false
  }

  const scrollIntoView = () => {
    if (setRef.value) {
      setRef.value.$el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }

  watch(() => props.transitionTrigger, () => {
    if (props.transitionTrigger) {
      scrollIntoView()
    }
  })

  watch(() => props.exerciseId, () => {
    getImageUrl()
  })

  watch(() => props.showBreak, (newVal) => {
    startTimer.value = newVal
  })

  watch(() => isValid.value, (value) => {
    emit('update:valid', value)
  })

  onMounted(async () => {
    getImageUrl()
  })
</script>

<template>
  <ion-card 
    lines="none"
    :class="{ 'highlighted': transitionTrigger, 'item-expanded': showVideo }"
  >
    <Transition
      name="slide-down"
      :duration="{ enter: 500, leave: 500 }"
    >
      <div v-if="showVideo">
       <video
          autoplay
          loop
          :src="url"
          alt="Exercise Video"
          class="active-exercise-video"
        ></video>
      </div>
    </Transition>

    <ion-card-content>
    <ion-row
      ref="setRef"
      class="scroll-padding"
    >
      <ion-col>
        <ion-label>{{ name }}</ion-label>
      </ion-col>
    </ion-row>

    <ion-row class="ion-align-items-center">
      <ion-col size="2" class="ion-margin-top">
        <ion-label>
          <ion-icon :icon="SetIcon"></ion-icon>
          {{ currentSet }}
        </ion-label>
      </ion-col>
      <ion-col size="5">
        <ion-row class="ion-align-items-center">
          <ion-col size="2" class="ion-margin-top">
            <ion-icon :icon="RepsIcon" class="icons"></ion-icon>
          </ion-col>
          <ion-col size="7">
            <NumericInput
              :label="$t('workouts.reps')"
              :placeholder="$t('workouts.reps')"
              :minValue="1"
              :maxValue="20"
              :clear-input="false"
              error-text="Invalid"
              :input-value="reps"
              @update:input-value="emit('update:reps', $event)"
              @update:valid="repsValid = $event"
            />
          </ion-col>
          <ion-col size="3" class="ion-margin-top ion-margin-left">
            <ion-label>x</ion-label>
          </ion-col>
        </ion-row>
      </ion-col>
      <ion-col size="5">
        <ion-row class="ion-align-items-center">
          <ion-col size="2" class="ion-margin-top">
            <ion-icon :icon="WeightIcon"></ion-icon>
          </ion-col>
          <ion-col size="7">
            <NumericInput
              :label="$t('weight')"
              :placeholder="$t('weight')"
              :minValue="1"
              :maxValue="500"
              :clear-input="false"
              error-text="Invalid"
              :input-value="weight"
              @update:input-value="emit('update:weight', $event)"
              @update:valid="weightValid = $event"
            />
          </ion-col>
          <ion-col size="3" class="ion-margin-top">
            <ion-label>{{ $t('weightUnitBig') }}</ion-label>
          </ion-col>
        </ion-row>
      </ion-col>
    </ion-row>
    </ion-card-content>
  </ion-card>

  <Transition
    name="slide-down"
    :duration="{ enter: 500, leave: 500 }"
  >
    <ion-item 
      lines="none"
      v-if="showBreak"
      class="highlighted item-expanded"
    >
      <Timer
        :initialTime="resttime"
        :startTimer="startTimer"
        @update:resttime="emit('update:resttime', $event)"
      />
    </ion-item>
  </Transition>
</template>

<style scoped>
ion-card {
  --border-radius: 10px !important;
  transition: opacity 0.5s ease, transform 0.5s ease;
  opacity: 0.5;
  transform: scale(1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Ensures content starts from the top */
  transition: all 0.5s ease;
  /* Remove the fixed height to let the content dictate the size */
  height: auto; /* Initially auto, will grow with content */
  /* Additional styles to ensure proper spacing */
  box-sizing: border-box; /* Include padding in the height calculation */

  :is(ion-icon) {
    margin-right: 5px;
    width: 15px;
    height: 15px;
  }
  :is(ion-input) {
    --background: var(--ion-color-step-100);
    border-radius: 10px;
    margin: 0 2px 0 2px;
    padding: 0;
  }
}

ion-card.highlighted {
  opacity: 1 !important;
  transform: scale(1.02) !important;
  :is(ion-icon) {
    opacity: 1 !important;
  }
  :is(ion-input) {
    opacity: 1 !important;
    color: white;
  }
  :is(ion-item) {
    opacity: 1 !important;
  }
  :is(ion-label) {
    opacity: 1 !important;
    color: white;
  }
  :is(ion-icon) {
    opacity: 1 !important;
    color: white;
  }
}

.scroll-padding {
  padding-top: 70px; /* Adjust this value to match your header's height */
  margin-top: -70px; /* Negative margin to offset the added padding */
}

.item-expanded {
  transition: all 0.5s ease;
  max-height: 500px;
}

.active-exercise-video {
  transition: all 0.5s ease;
  max-height: 500px;
  opacity: 1;
  width: 100%;
}

.slide-down-enter-active {
  transition: all 0.5s ease;
  max-height: 500px;
  opacity: 1;
}

.slide-down-leave-active {
  transition: all 0.5s ease;
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
}
</style>
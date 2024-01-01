<script setup lang="ts">
  import { IonItem,
           IonLabel,
           IonInput,
           IonIcon,
           IonRow,
           IonCol} from '@ionic/vue';
  import SetIcon from '@/icons/set.svg';
  import WeightIcon from '@/icons/weight.svg';
  import RepsIcon from '@/icons/reps.svg';
  import Timer from './Timer.vue';
  import { defaultImage, getBucketUrlFromTable, getSignedObjectUrl } from '@/composables/supabase';
  import { ref, onMounted, watch } from 'vue';
import { start } from '@popperjs/core';

  const props = defineProps({
    exerciseId: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    currentSet: {
      type: Number,
      required: true
    },
    plannedReps: {
      type: Number,
      required: true
    },
    plannedWeight: {
      type: Number,
      required: true
    },
    plannedResttime: {
      type: Number,
      required: true
    },
    transitionTrigger: {
      type: Boolean,
      required: true
    },
    showBreak: {
      type: Boolean,
      required: true
    },
 })

  const emit = defineEmits(['update:reps',
                            'update:weight',
                            'update:resttime',
                            'update:valid'])

  const loading= ref<boolean>(true)
  const bucketUrl = ref<string>()
  const url = ref<string>()
  const setRef = ref<InstanceType<typeof IonRow>>();
  const startTimer = ref<boolean>(false);

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

  onMounted(async () => {
    getImageUrl()
  })
</script>

<template>
<ion-item 
    lines="none"
    :class="{ 'highlighted': transitionTrigger, 'item-expanded': transitionTrigger }"
  >
    <Transition
      name="slide-down"
      :duration="{ enter: 1000, leave: 500 }"
    >
      <img 
        :src="url ? url : defaultImage"
        :key="url"
        v-if="transitionTrigger"
        class="active-exercise-img"
      />
    </Transition>
 
    <ion-row
      ref="setRef"
      class="scroll-padding"
    >
      <ion-col>
        <ion-label>{{ name }}</ion-label>
      </ion-col>
    </ion-row>

    <ion-row class="ion-align-items-center">
      <ion-col size="2">
        <ion-label>
          <ion-icon :icon="SetIcon"></ion-icon>
          {{ currentSet }}
        </ion-label>
      </ion-col>
      <ion-col size="5">
        <ion-row class="ion-align-items-center">
          <ion-icon :icon="RepsIcon" class="icons"></ion-icon>
          <ion-input 
            :value="plannedReps"
            :clear-on-edit="true"
            @ion-input="emit('update:reps', $event.detail.value)"
            type="number"
            inputmode="numeric"
          >
          </ion-input>
          <ion-label>x</ion-label>
        </ion-row>
      </ion-col>
      <ion-col size="5">
        <ion-row class="ion-align-items-center">
          <ion-icon :icon="WeightIcon"></ion-icon>
          <ion-input 
            :value="plannedWeight"
            :clear-on-edit="true"
            @ion-input="emit('update:weight', $event.detail.value)"
            type="number"
            inputmode="numeric"
          >
          </ion-input>
          <ion-label>{{ $t('weightUnitBig') }}</ion-label>
        </ion-row>
      </ion-col>
    </ion-row>
  </ion-item>

  <Transition
    name="slide-down"
    :duration="{ enter: 1000, leave: 500 }"
  >
    <ion-item 
      lines="none"
      v-if="showBreak"
      class="highlighted item-expanded"
    >
      <Timer
        :initialTime="plannedResttime"
        :startTimer="startTimer"
        @update:resttime="emit('update:resttime', $event)"
      />
    </ion-item>
  </Transition>
</template>

<style scoped>
ion-item {
  padding-right: 16px;
  padding-left: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
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

  ion-icon {
    margin-right: 5px;
    width: 15px;
    height: 15px;
  }
  ion-input {
    --background: var(--ion-color-step-100);
    border-radius: 10px;
    margin: 0 2px 0 2px;
    padding: 0;
  }
}

ion-item.highlighted {
  --padding-start: 0;
  --padding-end: 0;
  --padding-inline-start: 0;
  --padding-inline-end: 0;
  --inner-padding-end: 0;
  padding-top: 16px;
  padding-bottom: 16px;
  opacity: 1 !important;
  transform: scale(1.05) !important;
  :is(ion-icon) {
    opacity: 1 !important;
  }
  :is(ion-input) {
    opacity: 1 !important;
  }
  :is(ion-item) {
    opacity: 1 !important;
  }
}

.scroll-padding {
  padding-top: 70px; /* Adjust this value to match your header's height */
  margin-top: -70px; /* Negative margin to offset the added padding */
}

.item-expanded {
  transition: all 1s ease;
  max-height: 500px;
}

.active-exercise-img {
  transition: all 0.5s ease;
  max-height: 500px;
  opacity: 1;
  width: 100%;
}

.slide-down-enter-active {
  transition: all 1s;
  max-height: 500px;
  opacity: 1;
}

.slide-down-leave-active {
  transition: all 0.5s;
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
}
</style>
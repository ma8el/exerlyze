<script setup lang="ts">
import { IonItem,
         IonList,
         IonListHeader,
         IonLabel,
         IonCol,
         IonFab,
         IonFabButton,
         IonIcon,
         modalController } from '@ionic/vue';
import { bookmarkOutline, playForwardOutline, checkmarkDoneOutline } from 'ionicons/icons';
import BaseFullPageModal from './BaseFullPageModal.vue';
import NumericInput from '../NumericInput.vue';
import ActiveExerciseCard from '../Cards/ActiveExerciseCard.vue';
import WeightIcon from '@/icons/weight.svg';
import RepsIcon from '@/icons/reps.svg';
import SetIcon from '@/icons/set.svg';
import { useWorkoutSessionStore, useWorkoutStore } from '@/store/workoutStore';
import { ref, reactive, onMounted, computed, watch } from 'vue';

interface ListRef {
  $el: {
    scrollIntoView: (options?: boolean | ScrollIntoViewOptions) => void;
  };
}

const props = defineProps({
  workoutId: {
    type: String,
    required: true
  }
});

const workoutStore = useWorkoutStore();
const workoutSessionStore = useWorkoutSessionStore();

const setRefs = ref<InstanceType<typeof IonList>[]>([]);

const startedAt = ref<Date>(new Date());
const currentSet = ref<number>(0);
const currentReps = ref<number>(0);
const currentWeight = ref<number>(0);

const repsValid = ref<boolean>(true);
const weightValid = ref<boolean>(true);

const workout = workoutStore.getWorkoutById(props.workoutId);
const workoutSessionSets = reactive(workoutSessionStore.createFullWorkoutSessionSets(props.workoutId));

watch(() => workoutSessionSets, (newValue) => {
  console.log(workoutSessionSets)
}, { immediate: true });

const currentWorkoutSet = computed(() => {
  if (!workoutSessionSets) {
    return undefined;
  }
  return workoutSessionSets[currentSet.value];
});

const save = async () => {
    if (!workoutSessionSets) {
      return;
    }
    const workoutSessionId = workoutSessionStore.getNewWorkoutSessionId();
    // TODO: Track not fully completed workouts
    await workoutSessionStore.addWorkoutSession({
      id: workoutSessionId,
      workout_id: props.workoutId,
      created_at: new Date(),
      updated_at: new Date(),
      // TODO: scheduledAt should come from workoutSchedule
      scheduled_at: new Date(),
      started_at: startedAt.value,
      finished_at: new Date(),
      // TODO: Add note text field
      notes: '',
    })
    await workoutSessionStore.addWorkoutSessionPerformances(
      workoutSessionSets.map((set: any, index: number) => ({
        id: set.id,
        workout_session_id: workoutSessionId,
        exercise_id: set.exerciseId,
        set: index,
        planned_reps: parseInt(set.plannedReps),
        performed_reps: parseInt(set.reps),
        planned_weight: parseFloat(set.plannedWeight),
        performed_weight: parseFloat(set.weight),
        resttime: 0,
        created_at: new Date(),
        updated_at: new Date(),
      }))
    );
    return modalController.dismiss(null, 'close');
};

const nextSet = () => {
  if (!currentWorkoutSet.value) {
    return;
  }
  console.log(workoutSessionSets[currentSet.value])
  currentWorkoutSet.value.reps = currentReps.value;
  currentWorkoutSet.value.weight = currentWeight.value;
  if (workoutSessionSets && currentSet.value === workoutSessionSets.length - 1) {
    return;
  }
  currentSet.value++;
};

const isFinished = computed(() => {
  if (!workoutSessionSets) {
    return false;
  }
  return currentSet.value === workoutSessionSets.length - 1;
});

watch(currentSet, (newValue) => {
  if(workoutSessionSets && workoutSessionSets[newValue]) {
    currentReps.value = workoutSessionSets[newValue].reps;
    currentWeight.value = workoutSessionSets[newValue].weight;
    if (setRefs.value.length > 0) {
      setRefs.value[newValue].$el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }
}, { immediate: true });

const updatePerformedWeight = (index: number, value: string) => {
  if (!workoutSessionSets) {
    return;
  }
  workoutSessionSets[index].weight = parseFloat(value);
//  workoutSessionSets = workoutSessionSets.map((set: any, i: number) => {
//    if (i === index) {
//      return {
//        ...set,
//        weight: parseFloat(value),
//      };
//    }
//    return set;
//  });
};

const updatePerformedReps = (index: number, value: string) => {
  if (!workoutSessionSets) {
    return;
  }
  workoutSessionSets[index].reps = parseInt(value);
//  console.log(workoutSessionSets.value[index])
//  workoutSessionSets.value = workoutSessionSets.value.map((set: any, i: number) => {
//    if (i === index) {
//      return {
//        ...set,
//        reps: parseInt(value),
//      };
//    }
//    return set;
//  });
};

onMounted(() => {
  currentSet.value = 0;
  startedAt.value = new Date();
});
</script>

<template>
  <BaseFullPageModal v-if="workout" back-color="dark">
    <template #saveButton>
      <ion-icon :icon="bookmarkOutline" @click="save"/>
    </template>
    <template #modalHeader>
      <ActiveExerciseCard v-if="currentWorkoutSet"
        class="active-exercise-card"
        :exerciseId="currentWorkoutSet.exerciseId"
        :name="currentWorkoutSet.name"
      />
    </template>
    <template v-if="workoutSessionSets" #modalContent>
      <ion-list class="exercise-list">
        <div
          v-for = "(set, index) in workoutSessionSets"
          :key="index"
          class="ion-padding"
        >
        <ion-list-header
          v-if="set.currentSet === 1"
        >
          {{ set.name }}
        </ion-list-header>
        <ion-item 
          lines="none"
          :class="{ 'highlighted': currentSet === index  }"
          ref="setRefs"
        >
          <ion-col size="2">
            <ion-label>
              <ion-icon :icon="SetIcon"></ion-icon>
              {{ set.currentSet }}
            </ion-label>
          </ion-col>
          <ion-col size="4">
            <ion-item lines="none">
              <ion-icon slot="start" :icon="RepsIcon" class="input-icons "></ion-icon>
              <NumericInput
                :label="$t('workouts.reps')"
                :placeholder="$t('workouts.reps')"
                :minValue="1"
                :maxValue="20"
                error-text="Invalid"
                :clear-input="false"
                :inputValue="set.reps"
                @update:input-value="value =>updatePerformedReps(index, value ? value : '0')"
                @update:valid="repsValid = $event"
 
              />
            </ion-item>
          </ion-col>
          <ion-col size="1">
            <ion-label class="annotation-label">x</ion-label>
          </ion-col>
          <ion-col size="4">
            <ion-item lines="none">
              <ion-icon slot="start" :icon="WeightIcon" class="input-icons"></ion-icon>
              <NumericInput
                :label="$t('weight')"
                :placeholder="$t('workouts.weight')"
                :minValue="1"
                :maxValue="999"
                error-text="Invalid"
                :clear-input="false"
                :inputValue="set.weight"
                @update:input-value="updatePerformedWeight(index, $event ? $event : '0')"
                @update:valid="weightValid = $event"
 
              />
            </ion-item>
          </ion-col>
          <ion-col size="1">
            <ion-label class="annotation-label">
              {{ $t('weightUnitBig') }} 
            </ion-label>
          </ion-col>
        </ion-item>
        </div>
      </ion-list>
    </template>
    <template #modalFooter>
      <ion-fab 
        vertical="bottom"
        horizontal="end"
        v-if="!isFinished"
      >
          <ion-fab-button color="primary">
            <ion-icon 
              :icon="playForwardOutline"
              @click="nextSet"
            >
            </ion-icon>
          </ion-fab-button>
      </ion-fab>
      <ion-fab 
        vertical="bottom"
        horizontal="end"
        v-else
      >
          <ion-fab-button color="primary">
            <ion-icon 
              :icon="checkmarkDoneOutline"
              @click="save"
            >
            </ion-icon>
          </ion-fab-button>
      </ion-fab>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
.annotation-label {
  font-size: 0.8rem;
  color: var(--ion-color-step-600);
}
.active-exercise-card {
  margin: 0 0 20px 0;
}

.input-icons {
  margin-right: 5px;
  width: 300px;
  height: 300px;
}

.exercise-list {
  background: none;
  padding: 0;
  :is(ion-list-header) {
    margin-bottom: 15px;
  }
  :is(ion-item) {
    border-radius: 10px;
    transition: opacity 0.5s ease, transform 0.5s ease;
    opacity: 0.5;
    transform: scale(1);
    :is(ion-icon) {
      margin-right: 5px;
      width: 15px;
      height: 15px;
    }
    :is(ion-input) {
      --background: var(--ion-color-step-100);
    }
    :is(ion-item) {
      padding: 0;
    }
  }
}

ion-item.highlighted {
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
</style>
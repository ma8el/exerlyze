<script setup lang="ts">
import { IonItem,
         IonList,
         IonListHeader,
         IonLabel,
         IonInput,
         IonFab,
         IonFabButton,
         IonIcon,
         modalController } from '@ionic/vue';
import { bookmarkOutline, playForwardOutline, checkmarkDoneOutline } from 'ionicons/icons';
import BaseFullPageModal from './BaseFullPageModal.vue';
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

const workout = workoutStore.getWorkoutById(props.workoutId);
let workoutSessionSets = reactive(workoutSessionStore.createFullWorkoutSessionSets(props.workoutId));

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
    workoutSessionStore.addWorkoutSession({
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
    workoutSessionStore.addWorkoutSessionPerformances(
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

const updatePerformedWeight = (index: number, value: any) => {
  if (!workoutSessionSets) {
    return;
  }
  workoutSessionSets = workoutSessionSets.map((set: any, i: number) => {
    if (i === index) {
      return {
        ...set,
        weight: parseFloat(value.detail.value),
      };
    }
    return set;
  });
};

const updatePerformedReps = (index: number, value: any) => {
  if (!workoutSessionSets) {
    return;
  }
  workoutSessionSets = workoutSessionSets.map((set: any, i: number) => {
    if (i === index) {
      return {
        ...set,
        reps: parseInt(value.detail.value),
      };
    }
    return set;
  });
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
          <ion-item lines="none" slot="start">
            <ion-label>
              <ion-icon :icon="SetIcon"></ion-icon>
              {{ set.currentSet }}
            </ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-icon slot="start" :icon="RepsIcon" class="icons"></ion-icon>
            <ion-input 
              :value="set.plannedReps"
              :clear-on-edit="true"
              @ion-input="value => updatePerformedReps(index, value)"
              type="number"
              inputmode="numeric"
            >
            </ion-input>
            <ion-label slot="end">{{ $t('workouts.reps') }}</ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-icon slot="start" :icon="WeightIcon"></ion-icon>
            <ion-input 
              :value="set.plannedWeight"
              :clear-on-edit="true"
              @ion-input="value => updatePerformedWeight(index, value)"
              type="number"
              inputmode="numeric"
            >
            </ion-input>
            <ion-label slot="end">{{ $t('weightUnitBig') }}</ion-label>
          </ion-item>
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
.active-exercise-card {
  margin: 0 0 20px 0;
}

.exercise-list {
  background: none;
  ion-list-header {
    margin-bottom: 15px;
  }
  ion-item {
    border-radius: 10px;
    transition: opacity 0.5s ease, transform 0.5s ease;
    opacity: 0.5;
    transform: scale(1);
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
    ion-item {
      margin: 10px 0 10px 0;
      padding: 0;
    }
  }
}

ion-item.highlighted {
  opacity: 1 !important;
  transform: scale(1.05) !important;
  ion-icon {
    opacity: 1 !important;
  }
  ion-input {
    opacity: 1 !important;
  }
  ion-item {
    opacity: 1 !important;
  }
}
</style>
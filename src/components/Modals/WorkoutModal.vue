<script setup lang="ts">
import { IonLabel,
         IonRow,
         IonCol,
         IonButton,
         IonIcon,
         modalController } from '@ionic/vue';
import { bookmarkOutline, playForwardOutline, checkmarkDoneOutline } from 'ionicons/icons';
import BaseFullPageModal from '@/components/Modals/BaseFullPageModal.vue';
import WorkoutExerciseItem from '@/components/WorkoutExerciseItem.vue';
import StopWatch from '../StopWatch.vue';
import { useWorkoutSessionStore, useWorkoutStore } from '@/store/workoutStore';
import { ref, reactive, onMounted, computed, watch } from 'vue';

const props = defineProps({
  workoutId: {
    type: String,
    required: true
  }
});

const workoutStore = useWorkoutStore();
const workoutSessionStore = useWorkoutSessionStore();

const startedAt = ref<Date>(new Date());
const currentSet = ref<number>(0);
const currentReps = ref<number>(0);
const currentWeight = ref<number>(0);

const workout = workoutStore.getWorkoutById(props.workoutId);
const workoutName = workout !== undefined ? workout.name: '';
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
  }
});

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
  startedAt.value = new Date();
  console.log(workoutName)
  console.log(workoutSessionSets);
});
</script>

<template>
  <BaseFullPageModal 
    v-if="workout" 
    back-color="dark"
  >
    <template #saveButton>
      <ion-icon :icon="bookmarkOutline" @click="save"/>
    </template>
    <template #modalHeader>
      <p class="header-title">{{ workoutName }}</p>
    </template>
    <template v-if="workoutSessionSets" #modalContent>
      <WorkoutExerciseItem
        v-for = "(set, index) in workoutSessionSets"
        :key="index"
        :exerciseId="set.exerciseId"
        :name="set.name"
        :transitionTrigger="index === currentSet"
        :currentSet="set.currentSet"
        :plannedReps="set.plannedReps"
        :plannedWeight="set.plannedWeight"
        @update:reps="updatePerformedReps(index, $event)"
        @update:weight="updatePerformedWeight(index, $event)"
      />
      <div class="bottom-margin"></div>
    </template>
    <template #modalFooter>
      <ion-row
       class="ion-align-items-center"
      >
        <ion-col size="7">
          <StopWatch/>
        </ion-col>
        <ion-col size="5">
          <ion-button 
           v-if="!isFinished"
           @click="nextSet()"
           color="primary"
           shape="round"
           >
            <ion-label>
              {{ $t('next')  }}
            </ion-label>
             <ion-icon 
               :icon="playForwardOutline"
               @click="nextSet()"
             >
             </ion-icon>
           </ion-button>
           <ion-button 
             v-else 
             @click="save()"
             shape="round"
             color="primary"
           >
             <ion-label>
               {{ $t('finish')  }}
             </ion-label>
             <ion-icon 
               class="button-icon"
               :icon="checkmarkDoneOutline"
               @click="save"
             >
             </ion-icon>
           </ion-button>
        </ion-col>
      </ion-row>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
.bottom-margin {
  height: 5rem;
}
ion-button {
  --border-radius: 1rem;
  height: 2.5rem;
  :is(ion-label) {
    margin-right: 2px;
  }
}
.header-title {
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
}
</style>
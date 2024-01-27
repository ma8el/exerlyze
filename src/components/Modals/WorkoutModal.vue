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
import ActivityDetailModal from './ActivityDetailModal.vue';
import { useWorkoutSessionStore, useWorkoutStore } from '@/store/workoutStore';
import { ref, onMounted, computed, PropType } from 'vue';
import { FullWorkoutSessionSet } from '@/types';

const props = defineProps({
  workoutId: {
    type: String,
    required: true
  },
  workoutName: {
    type: String,
    required: true
  },
  fullWorkoutSessionSets: {
    type: Array as PropType<FullWorkoutSessionSet[]>,
    required: true
  }
});

const workoutSessionStore = useWorkoutSessionStore();

const workoutSessionId = ref<string>('');

const startedAt = ref<Date>(new Date());
const currentSet = ref<number>(0);

const showBreak = ref<boolean>(false);

const workoutName = props.workoutName;
const workoutSessionSets = ref(props.fullWorkoutSessionSets);

const valid = ref<boolean>(true);

const currentWorkoutSet = computed(() => {
  if (!workoutSessionSets) {
    return undefined;
  }
  return workoutSessionSets.value[currentSet.value];
});

const save = async () => {
    if (!workoutSessionSets.value) {
      return;
    }
    // TODO: Track not fully completed workouts
    await workoutSessionStore.addWorkoutSession({
      id: workoutSessionId.value,
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
      workoutSessionSets.value.map((set: any) => ({
        id: set.id,
        workout_session_id: workoutSessionId.value,
        exercise_id: set.exerciseId,
        exercise_name: set.name,
        set: set.currentSet,
        planned_reps: parseInt(set.plannedReps),
        performed_reps: parseInt(set.reps),
        planned_weight: parseFloat(set.plannedWeight),
        performed_weight: parseFloat(set.weight),
        planned_resttime: parseInt(set.plannedResttime),
        performed_resttime: parseInt(set.resttime),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    );
    return modalController.dismiss(null, 'close');
};

const nextSet = () => {
  showBreak.value = false;
  if (!currentWorkoutSet.value) {
    return;
  }
  if (workoutSessionSets.value && currentSet.value === workoutSessionSets.value.length - 1) {
    return;
  }

  currentSet.value++;
};

const isFinished = computed(() => {
  if (!workoutSessionSets.value) {
    return false;
  }
  return currentSet.value === workoutSessionSets.value.length - 1;
});

const finishWorkout = async () => {
  await save();
  console.log(workoutSessionSets.value)
  const modal = await modalController.create({
    component: ActivityDetailModal,
    componentProps: {
      workoutSessionId: workoutSessionId.value,
    },
  });
  await modal.present();
};

onMounted(() => {
  startedAt.value = new Date();
  workoutSessionId.value = workoutSessionStore.getNewWorkoutSessionId();
});
</script>

<template>
  <BaseFullPageModal 
    :disable-button="!valid"
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
        :transitionTrigger="index === currentSet && !showBreak"
        :show-video="index === currentSet && !showBreak"
        :currentSet="set.currentSet"
        v-model:reps="workoutSessionSets[index].reps"
        v-model:weight="workoutSessionSets[index].weight"
        v-model:resttime="workoutSessionSets[index].resttime"
        :show-break="index === currentSet && showBreak"
        @update:valid="valid = $event"
      />
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
             v-if="!isFinished && !showBreak"
             @click="showBreak = true"
             color="primary"
             shape="round"
             :disabled="!valid"
           >
            <ion-label>
              {{ $t('next')  }}
            </ion-label>
             <ion-icon 
               :icon="playForwardOutline"
             >
             </ion-icon>
           </ion-button>
           <ion-button 
             v-else-if="!isFinished && showBreak"
             @click="nextSet()"
             color="primary"
             shape="round"
             :disabled="!valid"
           >
            <ion-label>
              {{ $t('next')  }}
            </ion-label>
             <ion-icon 
               :icon="playForwardOutline"
             >
             </ion-icon>
           </ion-button>
 
           <ion-button 
             v-else 
             @click="finishWorkout()"
             shape="round"
             color="primary"
             :disabled="!valid"
           >
             <ion-label>
               {{ $t('finish')  }}
             </ion-label>
             <ion-icon 
               class="button-icon"
               :icon="checkmarkDoneOutline"
             >
             </ion-icon>
           </ion-button>
        </ion-col>
      </ion-row>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
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
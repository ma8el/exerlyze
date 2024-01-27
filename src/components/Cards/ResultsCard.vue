<script setup lang="ts">
import { IonRow, IonCol, IonLabel } from '@ionic/vue';
import TimeIcon from '@/icons/time.svg';
import BaseCard from '@/components/Cards/BaseCard.vue';
import SetIcon from '@/icons/set.svg';
import BaseHorizontalBarChart from '@/components/Charts/BaseHorizontalBarChart.vue';
import BaseInfoCard from '@/components/Cards/BaseInfoCard.vue';
import { FullWorkoutSession } from '@/types';
import { useI18n } from 'vue-i18n';
import { PropType, computed } from 'vue';

interface Exercise {
  id: number;
  name: string;
}

const props = defineProps({
    workoutSession: {
      type: Object as PropType<FullWorkoutSession>,
      required: true
    }
})

const getTitle = computed(() => {
  const { t } = useI18n();
  const workoutName = props.workoutSession.workout.name;
  const results = t('home.results')
  return `${results} - ${workoutName}`
})

const duration = computed(() => {
  const hours = Math.abs(new Date(props.workoutSession.finished_at).getHours() - new Date(props.workoutSession.started_at).getHours());
  const minutes = Math.abs(new Date(props.workoutSession.finished_at).getMinutes() - new Date(props.workoutSession.started_at).getMinutes());
  const seconds = Math.abs(new Date(props.workoutSession.finished_at).getSeconds() - new Date(props.workoutSession.started_at).getSeconds());
  const formattedDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return formattedDuration;
})

const getAggregatedExercises = computed(() => {
  const workoutPerformance = props.workoutSession.workoutPerformance;
  const exercises = workoutPerformance.reduce((acc: Exercise[], performance) => {
      if (!acc.some((exercise) => exercise.id == performance.exercise_id))
        acc.push({
          id: performance.exercise_id,
          name: performance.exercise_name,
        });
      return acc;
    }, []);
  return exercises;
});

const totalSets = computed(() => {
  return props.workoutSession.workoutPerformance.length;
});

const getAggregatedPerformancePerExercise = (exerciseId: string) => {
  const exercise = props.workoutSession.workoutPerformance.filter((exercise) => Number(exercise.exercise_id) == Number(exerciseId));
  if (exercise) {
    const performance = exercise.reduce((acc, exercise) => {
      return acc + Number(exercise.performed_weight) * Number(exercise.performed_reps);
    }, 0);
    const targetPerformance = exercise.reduce((acc, exercise) => {
      return acc + Number(exercise.planned_weight) * Number(exercise.planned_reps);
    }, 0);
    return {'performance': performance, 'targetPerformance': targetPerformance};
 } else {
    return {'performance': 0, 'targetPerformance': 0};
  }
}
</script>


<template>
  <BaseCard
    :title="getTitle"
    :content="true"
  >
    <ion-row>
      <ion-col size="6">
        <BaseInfoCard
          :title="$t('duration')"
          :subTitle="duration"
          :icon="TimeIcon"
          :font-size="'0.75rem'"
        />
      </ion-col>
      <ion-col size="6">
        <BaseInfoCard
          :title="$t('workouts.set', 2)"
          :subTitle="totalSets"
          :icon="SetIcon"
        ></BaseInfoCard>
      </ion-col>
    </ion-row>
    <div class="scrollable-card">
    <div
        v-for="exercise in getAggregatedExercises"
    >
      <ion-row>
        <ion-col>
        <BaseHorizontalBarChart
          :data="getAggregatedPerformancePerExercise(exercise.id.toString()).performance"
          :max-value="getAggregatedPerformancePerExercise(exercise.id.toString()).targetPerformance"
          color="#3F63C8"
        />
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="6">
          <ion-label>{{ exercise.name }}</ion-label>
        </ion-col >
        <ion-col size="6" v-if="getAggregatedPerformancePerExercise(exercise.id.toString()).performance > 0">
          <p style="text-align: right;">{{ getAggregatedPerformancePerExercise(exercise.id.toString()).performance }} / {{ getAggregatedPerformancePerExercise(exercise.id.toString()).targetPerformance }} {{ $t('weightUnitBig') }}</p>
        </ion-col>
      </ion-row>
    </div>
    </div>
  </BaseCard>
</template>

<style scoped>
  ion-label {
    font-size: 0.9rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    font-size: 0.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .scrollable-card {
    overflow-y: scroll;
    max-height: 200px;
  }
</style>
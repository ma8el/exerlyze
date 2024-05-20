<script setup lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import { IonReorderGroup,
           IonButton,
           IonItem,
           IonLabel,
           IonToggle,
           IonIcon,
           modalController } from '@ionic/vue';
  import { flameOutline } from 'ionicons/icons';
  import { ref, onMounted, computed } from 'vue'
  import { useWorkoutStore } from '@/store/workoutStore';
  import AddExerciseButton from '@/components//Buttons/AddExerciseButton.vue'
  import ExerciseItem from '@/components/ExerciseItem.vue';
  import BaseFullPageModal from '@/components/Modals/BaseFullPageModal.vue';
  import WorkoutModal from '@/components/Modals/WorkoutModal.vue';
  import { Exercise, ExerciseSelection, FullWorkoutSessionSet } from '@/types';
  import { useI18n } from 'vue-i18n';

  const props = defineProps({
    workoutId: {
      type: String,
      required: true
    }
  })

  const { t } = useI18n()

  const workoutStore = useWorkoutStore()
  
  const generatedWorkoutId = ref<string>(uuidv4())
  const workoutName = ref<string>()
  const createdAt = ref<Date>(new Date())
  const description = ref<string>('')
  const exercises = ref<Exercise[]>([])

  const restTime = ref<number>(60)
  const addWarmup = ref<boolean>(true)

  const exercisesSelected = computed(() => {
    return exercises.value.length > 0
  })

  const isValid = computed(() => {
    return exercisesSelected.value && exercises.value.every((exercise) => exercise.valid)
  })

  const openModal = async () => {
    const modal = await modalController.create({
      component: WorkoutModal,
      componentProps: {
        workoutId: props.workoutId,
        workoutName: workoutName.value,
        fullWorkoutSessionSets: createFullWorkoutSessionSets(exercises.value),
        addWarmup: addWarmup.value
      },
      cssClass: 'full-screen-modal',
    });
    modal.present();
    modalController.dismiss();
  }

  const addExercise = async (e: ExerciseSelection[]) => {
    for (const [index, exercise] of e.entries()) {
      exercises.value.push({
        id: exercise.id,
        created_at: new Date(),
        updated_at: new Date(),
        workout_id: generatedWorkoutId.value,
        exercise_id: exercise.exercise_id,
        name: exercise.name,
        set_index: index,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        resttime: restTime.value,
      })
    }
  }

  const getWorkoutData = (workoutId: string) => {
      const workout = workoutStore.getWorkoutById(workoutId)
      if (!workout) return
      workoutName.value = workout.name
      description.value = workout.description
      createdAt.value = workout.created_at
      // Deep copy the exercises array to avoid reactivity issues
      exercises.value = JSON.parse(JSON.stringify(workout.exercises))
  }

  const updateSetIndex = () => {
    exercises.value.forEach((exercise, index) => {
      exercise.set_index = index
    })
  }

  const handleDeleteExercise = (index: number) => {
    exercises.value.splice(index, 1)
    updateSetIndex()
  }

  const handleReorder = (event: any) => {
    const movedExercise = exercises.value.splice(event.detail.from, 1)[0];
    exercises.value.splice(event.detail.to, 0, movedExercise);
    updateSetIndex()
    event.detail.complete();
  }

  const createFullWorkoutSessionSets = (exercises: Exercise[]): FullWorkoutSessionSet[] => {
    const fullWorkoutSessionSets: FullWorkoutSessionSet[] = []
    exercises.forEach((exercise) => {
      for (let i = 0; i < exercise.sets; i++) {
        fullWorkoutSessionSets.push({
          id: uuidv4(),
          exerciseId: exercise.exercise_id,
          name: exercise.name,
          sets: exercise.sets,
          currentSet: i + 1,
          plannedReps: exercise.reps,
          reps: exercise.reps,
          plannedWeight: exercise.weight,
          weight: exercise.weight,
          plannedResttime: exercise.resttime,
          resttime: exercise.resttime,
        })
      }
    })
    if (addWarmup.value) {
      const newSets: FullWorkoutSessionSet[] = [];
      let lastExerciseId: number | null = null;
  
      fullWorkoutSessionSets.forEach((set, index) => {
        // Check if it's the first set of a new exercise to add a warmup set
        if (set.exerciseId !== lastExerciseId) {
          const warmupSet = {
            ...set,
            id: `warmup-${set.exerciseId}-${index}`,
            isWarmup: true,
            plannedReps: 10,
            plannedWeight: 10,
            reps: 10,
            weight: 10,
            name: `${t('workouts.warmup')} - ${set.name}`,
          };
          newSets.push(warmupSet);
          lastExerciseId = set.exerciseId;
        }
        newSets.push(set);
      })
      return newSets
    }
    return fullWorkoutSessionSets
  }

  onMounted(() => {
    getWorkoutData(props.workoutId)
  })
</script>

 <template>
  <BaseFullPageModal
    :disable-button="!isValid"
    :save-button="false"
  >
    <template #modalHeader>
      <p class="header-title"> {{ workoutName }}</p>
    </template>
    <template #modalContent>
      <ion-item lines="none">
        <ion-icon :icon="flameOutline" color="primary" style="margin-right: 10px;"></ion-icon>
        <ion-label>{{ $t('workouts.addWarmup') }}</ion-label>
        <ion-toggle 
          mode="ios"
          color="primary"
          checked
          v-model="addWarmup"
        ></ion-toggle>
      </ion-item>
      <ion-reorder-group :disabled="false" @ionItemReorder="handleReorder($event)">
        <div v-for="(exercise, index) in exercises" :key="exercise.id">
         <ExerciseItem 
           v-model:sets="exercises[index].sets"
           v-model:reps="exercises[index].reps"
           v-model:weight="exercises[index].weight"
           v-model:resttime="exercises[index].resttime"
           :key="index" 
           :id="exercise.id"
           :created_at="exercise.created_at"
           :updated_at="exercise.updated_at"
           :workout_id="exercise.workout_id"
           :exercise_id="exercise.exercise_id"
           :name="exercise.name"
           :set_index="exercise.set_index"
           class="exercise-item ion-margin"
           @update:valid="exercises[index].valid = $event"
           @delete:exercise="handleDeleteExercise(index)"
         />
        </div>
       </ion-reorder-group>
      <AddExerciseButton class="ion-margin" @save-exercises="addExercise"/>
      <ion-button 
        id="start-workout-button"
        @click="openModal"
        expand="block"
        class="ion-margin"
        :disabled="!isValid"
      >
        {{ $t('workouts.startWorkout') }}
      </ion-button>
    </template>
  </BaseFullPageModal>
</template> 

<style scoped>
 .header-title {
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
  }

  .exercise-item {
    border-radius: 10px;
  }
</style>
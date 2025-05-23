import { supabase } from '@/supabase';
import { modalController } from '@ionic/vue';
import LoadingModal from '@/components/Modals/LoadingModal.vue';
import { useUserStore, useWeightStore } from '@/store/bodyMetricsStore';
import { useFoodDiaryStore } from '@/store/foodDiary';
import { useWorkoutStore, useMuscleStore, useWorkoutPlanStore, useWorkoutSessionStore } from '@/store/workoutStore';
import { useUserFitnessLevelStore } from '@/store/userSettingsStore';

export const defaultImage = 'https://ionicframework.com/docs/img/demos/card-media.png';

export const getSignedObjectUrl = async (bucket: string, bucketUrl: string) => {
    return await supabase
      .storage
      .from(bucket)
      .createSignedUrl(bucketUrl, 60)
};

export const downloadObject = async (bucket: string, bucketUrl: string) => {
    return await supabase
      .storage
      .from(bucket)
      .download(bucketUrl)
}

export const getBucketUrlFromTable = async (table: string, id: number) => {
    return await supabase
      .from(table)
      .select('ressource_name')
      .eq('id', id)
      .single()
}

export const syncWithBackend = async () => {
  const modal = await modalController.create({
    component: LoadingModal,
    componentProps: {
      showLoadingMessage: true,
      loadingMessage: 'sync',
    },
  });
  await modal.present();

  const userStore = useUserStore();
  const weightStore = useWeightStore();
  const workoutStore = useWorkoutStore();
  const workoutPlanStore = useWorkoutPlanStore();
  const workoutSessionStore = useWorkoutSessionStore();
  const foodDiaryStore = useFoodDiaryStore();
  const userFitnessLevelStore = useUserFitnessLevelStore();
  const muscleStore = useMuscleStore();
//  await userStore.fetchUser();
  await userStore.syncUser();
  await weightStore.syncWeights();
  await workoutStore.syncWorkouts();
  await muscleStore.fetchMuscles();
  await workoutPlanStore.syncWorkoutPlans();
  await workoutSessionStore.syncWorkoutSessions();
  await workoutPlanStore.syncPlannedWorkouts();
  await foodDiaryStore.syncFoodDiary();
  await foodDiaryStore.syncDailyNutritionGoals();
  await userFitnessLevelStore.syncUserFitnessLevel();
  await modal.dismiss();
};


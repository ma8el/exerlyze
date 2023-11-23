<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';
import { useUserStore, useWeightStore } from '@/store/bodyMetricsStore';
import { useWorkoutStore, useWorkoutPlanStore, usePlannedWorkoutStore, useWorkoutSessionStore } from '@/store/workoutStore';
import { useFoodDiaryStore } from '@/store/foodDiary';
import AppLayout from '@/layouts/AppLayout.vue';
import UserMetricsInput from '@/components/UserMetricsInput.vue';
import { IonButton, useIonRouter } from '@ionic/vue';

const session = ref();
const router = useIonRouter();
const loading = ref(true);

const redirect = () => {
  router.push('/login');
};

const sync = async () => {
  const userStore = useUserStore();
  const weightStore = useWeightStore();
  const workoutStore = useWorkoutStore();
  const workoutPlanStore = useWorkoutPlanStore();
  const plannedWorkoutStore = usePlannedWorkoutStore();
  const workoutSessionStore = useWorkoutSessionStore();
  const foodDiaryStore = useFoodDiaryStore();
  userStore.syncUser();
  weightStore.syncWeights;
  workoutStore.syncWorkouts();
  workoutPlanStore.syncWorkoutPlans();
  plannedWorkoutStore.syncPlannedWorkouts();
  workoutSessionStore.syncWorkoutSessions();
  foodDiaryStore.syncFoodDiary();
};

onMounted(async () => {
  session.value = await supabase.auth.getSession();
  loading.value = false;
});
</script>

<template>
  <AppLayout
    :title="$t('profile.title')"
    :saveButton="false"
    :backButton="true"
    :settingsButton="false"
  >
    <div class="ion-padding">
      <div v-if="!loading">
        <UserMetricsInput
          :buttonLabel="$t('save')"
          saveRedirectPath="/tabs/profile"
        />
        <IonButton
          v-if="session.data.session !== null"
          expand="block"
          color="danger"
          :style="`margin-top: 20px;`"
          @click="() => supabase.auth.signOut()"
        >
          Sign Out
        </IonButton>
        <IonButton
          v-if="session.data.session === null"
          expand="block"
          color="primary"
          :style="`margin-top: 20px;`"
          @click="() => redirect()"
        >
          Login
        </IonButton>
        <IonButton
          expand="block"
          color="primary"
          :style="`margin-top: 20px;`"
          @click="() => sync()"
        >
          Sync Data
        </IonButton>
      </div>
    </div>
  </AppLayout>
</template>
<script setup lang="ts">
  import { supabase } from '@/supabase';
  import { IonHeader,
           IonPage,
           IonContent,
           IonToolbar,
           IonTitle,
           IonFab,
           IonFabButton,
           IonButtons, 
           IonIcon,
           loadingController, 
  } from '@ionic/vue';
  import { arrowBackOutline } from 'ionicons/icons';
  import { useRouter } from 'vue-router';
  import { useUserStore, useWeightStore } from '@/store/bodyMetricsStore';
  import { useWorkoutStore, useWorkoutPlanStore, usePlannedWorkoutStore, useWorkoutSessionStore } from '@/store/workoutStore';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import { ref, onMounted } from 'vue';

  const router = useRouter();
  const session = ref();

  const props = defineProps({
      title: {
        type: String,
        required: true
      },
      actionButton: {
        type: Boolean,
        default: true 
      },
      backButton: {
        type: Boolean,
        default: false
      },
      titleSize: {
        type: String,
        default: '2rem'
      }
 });

  const navigateBack = () => {
    router.back();
  };

  const sync = async () => {
    const loading = await loadingController.create({
      message: 'Syncing...',
    });
    loading.present()
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
    loading.dismiss();
  };

  onMounted(async () => {
    session.value = await supabase.auth.getSession();
  });
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <slot name="toolbarContent">
         <ion-title 
            size="large"
            :class="{'ion-text-center': backButton}"
            :style="`font-size: ${titleSize};`"
          >
            {{ title }}
          </ion-title>
        </slot>
        <ion-buttons 
          slot="end"
          v-if="actionButton"
        >
          <ion-fab v-if="session !== null" horizontal="end">
            <ion-fab-button color="dark" size="small" @click="sync">
              <ion-icon src="../../assets/icons/update_black.svg"></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </ion-buttons>
        <ion-buttons 
          slot="start"
          v-if="backButton"
        >
          <ion-fab>
            <ion-fab-button color="dark" size="small" @click="navigateBack">
              <ion-icon :icon="arrowBackOutline"></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </ion-buttons>
        <slot name="header"></slot>
      </ion-toolbar>
    </ion-header>
      <slot name="avatar"></slot>
    <ion-content :fullscreen="true">
      <slot></slot>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
* { 
  box-sizing: unset;
ion-header {
  ion-toolbar {
    --background: none;
    background-image: url('../../assets/header_background.jpg');
    background-position: center center;
    background-size: cover;
    padding: 10px 0 10px 0;
  }
  ion-buttons {
    padding-top: 5px;
  }
  ion-title {
    align-items: center;
  }
}
ion-content {
  border-radius: 20px 20px 0 0;
	overflow: hidden;
  --background: none;
  background-image: url('../../assets/app_background.jpg');
  background-size: cover;
}
}
</style>
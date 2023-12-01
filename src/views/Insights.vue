<script setup lang="ts">
  import { IonFab,
           IonFabButton,
           IonButtons, 
           IonIcon,
           modalController } from '@ionic/vue';
  import AppLayout from '@/layouts/AppLayout.vue';
  import BaseSegments from '@/components/BaseSegments.vue';
  import WorkoutInsightContent from '@/components/WorkoutInsightContent.vue';
  import DietInsightContent from '@/components/DietInsightContent.vue';
  import FilterModal from '@/components/Modals/FilterModal.vue';
  import { ref } from 'vue';
  import { filter } from 'ionicons/icons';

  const today = new Date();

  const isWorkoutSelected = ref(true);
  const isDietSelected = ref(false);

  const startDate = ref<Date>(new Date(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)));
  const endDate = ref<Date>(new Date(today.getDate() - today.getDay() + (today.getDay() === 0 ? 0 : 7)));

  const workoutSelected = () => {
    isWorkoutSelected.value = true;
    isDietSelected.value = false;
  };

  const dietSelected = () => {
    isWorkoutSelected.value = false;
    isDietSelected.value = true;
  };

  const openFilter = async () => {
    const modal = await modalController.create({
      component: FilterModal,
      cssClass: 'full-screen-modal',
      initialBreakpoint: 0.35,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'save') {
      startDate.value = data.startDate;
      endDate.value = data.endDate;
    }
  }
</script>

<template>
  <AppLayout 
   :title="$t('insights')"
   :back-button="true"
   :action-button="false"
   :title-size="'1.5rem'"
  >
  <BaseSegments
    class="ion-padding-top"
    :leftSegmentLabel="$t('workouts.workout')"
    :rightSegmentLabel="$t('nutrition.diet')"
    @leftSegmentSelected="workoutSelected()"
    @rightSegmentSelected="dietSelected()"
  />
  <template #header>
    <ion-buttons 
      slot="end"
    >
      <ion-fab horizontal="end">
        <ion-fab-button color="dark" size="small" @click="openFilter">
          <ion-icon :icon="filter"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-buttons>
  </template>
  <WorkoutInsightContent 
    v-if="isWorkoutSelected"
    :start-date="startDate"
    :end-date="endDate"
  />
  <DietInsightContent 
    v-if="isDietSelected"
    :start-date="startDate"
    :end-date="endDate"
  />
  </AppLayout>
</template>

<style scoped>
ion-buttons {
  padding-top: 15px;
}
</style>
<script setup lang="ts">
  import { IonList,
           modalController } from '@ionic/vue';
  import BaseCard from '@/components/Cards/BaseCard.vue';
  import ActivityDetailModal from '@/components/Modals/ActivityDetailModal.vue';
  import { useWorkoutSessionStore } from '@/store/workoutStore';
  import { defaultImage } from '@/composables/supabase';

  const props = defineProps({
    selectedDate: {
      type: Date,
      required: true
    }
  })

  const workoutSessionStore = useWorkoutSessionStore();
  const workoutSessions = workoutSessionStore.getFullWorkoutSessionsByDate(props.selectedDate);

  const openModal = async (workoutSessionId: String) => {
    if ( !workoutSessionId ) {
      return
    }
    const modal = await modalController.create({
      component: ActivityDetailModal,
      componentProps: {
        workoutSessionId: workoutSessionId
      },
    });
    await modal.present();
  }
</script>

<template>
 <ion-list 
    v-if="workoutSessions"
    class="workout-list"
  >
    <div
      v-for="(workoutSession, index) in workoutSessions"
      :key="index"
    >
      <BaseCard
        :img_src="defaultImage"
        :title="workoutSession.workout.name"
        :subTitle="true"
        :button="true"
        @click="openModal(workoutSession.id)"
      >
        <template #subtitle>
          {{  workoutSession.workout.exercises.length + ' exercises'  }}
        </template>
      </BaseCard>
    </div>
  </ion-list>
</template>

<style scoped>
.workout-list {
  background: none;
  ion-list-header {
    margin-bottom: 15px;
  }
  ion-item {
    border-radius: 10px;
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
      margin: 5px 0 5px 0;
      padding: 0;
    }
  }
}
</style>
<script setup lang="ts">
  import { IonButton,
           IonItem,
           IonSelect,
           IonSelectOption,
           IonText,
           modalController } from '@ionic/vue';
  import { ref, computed, onMounted } from 'vue'
  import { useWorkoutScheduleStore, useWorkoutPlanStore } from '../../store/workoutStore';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { useDark } from '@vueuse/core'

  const props = defineProps({
    workoutScheduleId: {
      type: Number,
    },
  });

  const isDark = useDark()
  const workoutPlanStore = useWorkoutPlanStore();
  const workoutScheduleStore = useWorkoutScheduleStore();
  const selectedWorkoutPlan = ref();

  const range = ref({
    start: new Date(),
    end: new Date(),
  });

  const save = () => {
    workoutScheduleStore.addWorkoutSchedule({
      id: workoutScheduleStore.getNewId,
      createdAt: new Date(),
      workoutPlanId: selectedWorkoutPlan.value,
      startsAt: range.value.start,
      endsAt: range.value.end,
    })
    modalController.dismiss(null, 'save');
  }

  const update = () => {
    if (!props.workoutScheduleId) {
      return;
    }
    workoutScheduleStore.updateWorkoutSchedule({
      id: props.workoutScheduleId,
      createdAt: new Date(),
      workoutPlanId: selectedWorkoutPlan.value,
      startsAt: range.value.start,
      endsAt: range.value.end,
    })
    modalController.dismiss(null, 'update');
  }

  const startDate = computed(() => {
    return range.value.start.toISOString().split('T')[0];
  });

  const endDate = computed(() => {
    return range.value.end.toISOString().split('T')[0];
  });

  onMounted(() => {
    if (props.workoutScheduleId) {
      const workoutSchedule = workoutScheduleStore.getWorkoutScheduleById(props.workoutScheduleId);
      if (!workoutSchedule) {
        return;
      }
      selectedWorkoutPlan.value = workoutSchedule.workoutPlanId;
      range.value.start = workoutSchedule.startsAt;
      range.value.end = workoutSchedule.endsAt;
    }
  });
</script>

<template>
  <BaseFullPageModal title="Add Workout">
    <template #saveButton>
      <ion-button v-if="workoutScheduleId" @click="update">Update</ion-button>
      <ion-button v-else @click="save">Save</ion-button>
    </template>
    <template #modalContent>
      <ion-item>
        <ion-select
          label="Workout Plan"
          label-placement="floating"
          fill="solid"
          v-model="selectedWorkoutPlan"
        >
            <ion-select-option
              v-for="(workoutPlan, index) in workoutPlanStore.workoutPlans"
              :key="index"
              :value="workoutPlan.id"
            >
              {{ workoutPlan.name }}
            </ion-select-option>
        </ion-select>
        <ion-text slot="end">{{ startDate }} - {{ endDate }} </ion-text>
      </ion-item>

      <VDatePicker v-model.range="range" mode="date" :is-dark="isDark">
        <template #default="{ togglePopover }">
          <ion-button
            expand="block"
            size="small"
            @click="togglePopover"
          >
            Select schedule duration
          </ion-button>
        </template>
      </VDatePicker>
    </template>
  </BaseFullPageModal>
</template> 
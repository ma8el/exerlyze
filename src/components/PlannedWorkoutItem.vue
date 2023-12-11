<script setup lang="ts">
  import { IonSelect,
           IonSelectOption,
           IonRow,
           IonCol,
           IonLabel,
           IonDatetimeButton,
           IonDatetime,
           IonModal } from '@ionic/vue';
  import { useWorkoutStore, useDayOfWeekStore } from '../store/workoutStore';

  const props = defineProps({
    workoutId: {
      type: String,
      required: true
    },
    dayOfWeekId: {
      type: Number,
    },
    timeOfDay: {
      type: String,
    }
  })
  const emit = defineEmits(['update:dayOfWeekId', 'update:timeOfDay'])

  const workoutStore = useWorkoutStore();
  const dayOfWeekStore = useDayOfWeekStore();
  const workoutName = workoutStore.getWorkoutById(props.workoutId)?.name
</script>

<template>
  <div class="ion-margin">
    <ion-row v-if="workoutId" class="ion-align-items-center planned-workout-item">
      <ion-col>
        <ion-label>{{ workoutName }}</ion-label>
      </ion-col>
      <ion-col>
        <ion-select 
          :label="$t('weekday')"
          label-placement="floating"
          fill="solid"
          :value="props.dayOfWeekId"
          @ion-change="emit('update:dayOfWeekId', $event.target.value)"
        >
            <ion-select-option
              v-for="(dayOfWeek, index) in dayOfWeekStore.getDaysOfWeek"
              :key="index"
              :value="dayOfWeek.id"
            >
              {{ dayOfWeek.name }}
            </ion-select-option>
        </ion-select>
      </ion-col>
      <ion-col>
        <ion-datetime-button datetime="time"></ion-datetime-button>
      </ion-col>
        <ion-modal :keep-contents-mounted="true">
            <ion-datetime
              id="time"
              presentation="time"
              :value="props.timeOfDay"
              @ion-change="emit('update:timeOfDay', $event.target.value)"
            ></ion-datetime>
        </ion-modal>
    </ion-row>
  </div>
</template>

<style scoped>
.planned-workout-item {
  background-color: var(--ion-card-background);
  border-radius: 10px;
}
</style>
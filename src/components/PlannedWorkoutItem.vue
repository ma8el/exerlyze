<script setup lang="ts">
  import { IonSelect,
           IonSelectOption,
           IonItem,
           IonLabel,
           IonDatetimeButton,
           IonDatetime,
           IonModal } from '@ionic/vue';
  import { useWorkoutStore, useDayOfWeekStore } from '../store/workoutStore';

  const props = defineProps({
    workoutId: {
      type: Number,
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
    <ion-item v-if="workoutId">
        <ion-label slot="start">{{ workoutName }}</ion-label>
       <ion-select 
         label="Weekday"
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
        <ion-datetime-button slot="end" datetime="time"></ion-datetime-button>
        <ion-modal :keep-contents-mounted="true">
            <ion-datetime
              id="time"
              presentation="time"
              :value="props.timeOfDay"
              @ion-change="emit('update:timeOfDay', $event.target.value)"
            ></ion-datetime>
        </ion-modal>
 
    </ion-item>
</template>
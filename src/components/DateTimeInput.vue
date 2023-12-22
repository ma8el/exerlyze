<script setup lang="ts">
import { IonItem,
         IonDatetime,
         IonDatetimeButton,
         IonModal,
         IonIcon } from '@ionic/vue';
import { calendarOutline } from 'ionicons/icons';
import { useUserSettingsStore } from '@/store/userSettingsStore';

const props = defineProps({
  inputDate: {
    type: String,
    required: true,
  },
  iconSize: {
    type: String,
    default: "20px",
  },
  paddingStart: {
    type: String,
    default: "0",
  },
})
const emits = defineEmits(['update:inputDate'])

const userSettingsStore = useUserSettingsStore();
const locale = userSettingsStore.getLocale();

const isInFuture = (dateString: string) => {
  const date = new Date(dateString);
  const inputDate = new Date(props.inputDate);
  return inputDate > date;
}
</script>

<template>
   <ion-item class="weight-item" lines="none" :style="{'--padding-start': paddingStart}">
    <ion-icon :icon="calendarOutline" slot="start" :style="{'width': iconSize, 'height': iconSize}"></ion-icon>
    <ion-datetime-button 
      datetime="datetime"
      slot="end"
    />
    <ion-modal :keep-contents-mounted="true">
      <ion-datetime
        id="datetime"
        :value="inputDate"
        :locale="locale"
        @ion-change="emits('update:inputDate', $event.detail.value)"
        :is-date-enabled="isInFuture"
      />
    </ion-modal>
  </ion-item>
</template>

<style scoped>
  .weight-item {
    --background: none;
    --padding-start: 0;
    --padding-end: 0;
  }
</style>
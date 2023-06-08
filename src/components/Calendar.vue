<script setup lang="ts">
  import { IonGrid, IonRow } from '@ionic/vue';
  import { useDark } from '@vueuse/core'
  import { ref, PropType } from 'vue'

  const props = defineProps({
    workoutEventDates: {
      type: Array as PropType<Date[]>,
      required: false,
      default: () => []
    },
    nutitionDiaryEventDates: {
      type: Array as PropType<Date[]>,
      required: false,
      default: () => []
    },
  })
  const isDark = useDark()

  const attributes = ref([{
      key: 'today',
      highlight: {
        color: '#3F63C8',
        fillMode: 'solid',
      },
      dates: new Date(),
  },
  {
      key: 'workoutEvent',
      dot: {
        style: {
          backgroundColor: '#3F63C8',
        },
      },
      dates: props.workoutEventDates,
  }
  ])
</script>

<template>
  <ion-grid>
    <ion-row class="ion-justify-content-center">
        <VCalendar 
          expanded 
          transparent 
          borderless 
          :is-dark="isDark" 
          view="weekly"
          :attributes="attributes"
        />
    </ion-row>
  </ion-grid>
</template>
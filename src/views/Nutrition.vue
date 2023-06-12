<script setup lang="ts">
  import { IonGrid, IonRow } from '@ionic/vue';
  import NutritionSegments from '@/components/NutritionSegments.vue';
  import AppLayout from '@/layouts/AppLayout.vue';
  import { ref, provide, readonly } from 'vue';
  import { useDark } from '@vueuse/core'
  import { selectedDateKey } from '@/keys';

  const isDark = useDark()

  const attributes = ref([{
    key: 'today',
    highlight: {
      color: '#3F63C8',
      fillMode: 'light',
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
    dates: [],
  }
  ])

  const selectedDate = ref<Date>(new Date())
  provide(selectedDateKey, readonly(selectedDate))
</script>

<template>
  <AppLayout title="Nutrition">
    <ion-grid>
      <ion-row class="ion-justify-content-center">
          <VDatePicker 
            expanded 
            transparent 
            borderless 
            :is-dark="isDark" 
            view="weekly"
            v-model="selectedDate"
            :attributes="attributes"
          />
      </ion-row>
    </ion-grid>
    <NutritionSegments />
  </AppLayout>
</template>
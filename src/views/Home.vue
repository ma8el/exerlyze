<script setup lang="ts">
  import { IonItem, IonThumbnail, IonTitle, IonCard } from '@ionic/vue';
  import UpcomingEventsSlide from '@/components/UpcomingEventsSlide.vue';
  import PageWithCalendar from '@/layouts/PageWithCalendar.vue';
  import WorkoutVolumeBarChart from '@/components/Charts/WorkoutVolumeBarChart.vue';
  import NutritionLineChart from '@/components/Charts/NutritionLineChart.vue';
  import NutritionParallelChart from '@/components/Charts/NutritionParallelChart.vue';
  import { useUserStore } from '@/store/bodyMetricsStore';

  const userStore = useUserStore();
  const userName = userStore.getUserName() ? userStore.getUserName() : 'Anonymous';
</script>

<template>
  <PageWithCalendar 
    title=""
  >
    <template #toolbarContent>
      <ion-item lines="none">
        <ion-thumbnail slot="start">
          <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </ion-thumbnail>
        <ion-title 
          size="large"
          :style="`font-size: 1.3rem;`"
        >
          {{ $t('home.hello') + `, ` + userName + `!` }}
        </ion-title>
      </ion-item>
    </template> 
    <UpcomingEventsSlide />
    <ion-card>
      <div 
        class="chart-container ion-padding"
      >
        <WorkoutVolumeBarChart />
      </div>
    </ion-card>
    <ion-card>
      <div 
        class="chart-container ion-padding"
      >
        <NutritionLineChart />
      </div>
    </ion-card>
    <ion-card class="last-component">
      <div 
        class="chart-container ion-padding"
      >
        <NutritionParallelChart />
      </div>
    </ion-card>
  </PageWithCalendar>
</template>

<style scoped>
.last-component {
    margin-bottom: 100px;
}
.chart-container {
  width: 100%;
  height: 300px;
}
ion-item {
  --background: none;
}
ion-title {
  align-items: center;
  margin: 0;
  padding: 0;
}
ion-thumbnail {
  --border-radius: 50%;
  border: 1px solid white !important;
  width: 40px;
  height: 40px;
}
</style>
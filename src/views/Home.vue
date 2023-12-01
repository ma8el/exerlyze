<script setup lang="ts">
  import { IonItem, IonThumbnail, IonTitle, IonCard } from '@ionic/vue';
  import UpcomingEventsSlide from '@/components/UpcomingEventsSlide.vue';
  import PageWithCalendar from '@/layouts/PageWithCalendar.vue';
  import WorkoutVolumeBarChart from '@/components/Charts/WorkoutVolumeBarChart.vue';
  import NutritionParallelChart from '@/components/Charts/NutritionParallelChart.vue';
  import NutritionBarChart from '@/components/Charts/NutritionBarChart.vue';
  import OverviewCard from '@/components/Cards/OverviewCard.vue';
  import ChartContainerCard from '@/components/Cards/ChartContainerCard.vue';
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

    <h2 class="ion-margin">Your day</h2>
    <OverviewCard />
    <UpcomingEventsSlide />
 
    <h2 class="ion-margin">Your week</h2>
    <ChartContainerCard>
      <WorkoutVolumeBarChart />
    </ChartContainerCard>

    <ChartContainerCard>
      <NutritionBarChart />
    </ChartContainerCard>

    <ChartContainerCard>
      <NutritionParallelChart />
    </ChartContainerCard>
  </PageWithCalendar>
</template>

<style scoped>
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
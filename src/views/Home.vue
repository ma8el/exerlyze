<script setup lang="ts">
  import { IonItem, IonThumbnail, IonTitle, IonCard } from '@ionic/vue';
  import TodaysEventSlide from '@/components/TodaysEventSlide.vue';
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
        <ion-thumbnail class="avatar-wrapper" slot="start">
          <img alt="Logo white" src="../../assets/logo_transparent_white_no_text.png" />
        </ion-thumbnail>
        <ion-title 
          size="large"
          :style="`font-size: 1.3rem;`"
        >
          {{ $t('home.hello') + `, ` + userName + `!` }}
        </ion-title>
      </ion-item>
    </template> 

    <h2 class="ion-margin">{{ $t('yourDay') }}</h2>
    <OverviewCard :date="new Date()" />
    <TodaysEventSlide />
 
    <h2 class="ion-margin">{{ $t('yourWeek') }}</h2>
    <UpcomingEventsSlide />
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
.avatar-wrapper {
  display: flex;
  justify-content: center;
  background-color: black;
  :is(img) {
    width: 30px;
    height: 30px;
    transform: translateY(1px);
    border-radius: 0%;
  }
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
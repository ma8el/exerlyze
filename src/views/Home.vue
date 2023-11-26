<script setup lang="ts">
  import { IonItem, IonThumbnail, IonTitle, IonCard } from '@ionic/vue';
  import UpcomingEventsSlide from '@/components/UpcomingEventsSlide.vue';
  import PageWithCalendar from '@/layouts/PageWithCalendar.vue';
  import WorkoutVolumeBarChart from '@/components/Charts/WorkoutVolumeBarChart.vue';
  import NutritionLineChart from '@/components/Charts/NutritionLineChart.vue';
  import NutritionParallelChart from '@/components/Charts/NutritionParallelChart.vue';
  import BaseInfoCard from '@/components/Cards/BaseInfoCard.vue';
  import { useUserStore } from '@/store/bodyMetricsStore';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import { useWorkoutSessionStore } from '@/store/workoutStore'
  import { barChartOutline, barbellOutline, fishOutline } from 'ionicons/icons';

  const userStore = useUserStore();
  const userName = userStore.getUserName() ? userStore.getUserName() : 'Anonymous';
  const foodDiaryStore = useFoodDiaryStore();
  const workoutSessionStore = useWorkoutSessionStore();
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
    <h2 class="ion-margin">Your day</h2>
    <ion-row class="ion-margin">
      <ion-col size="6">
      <BaseInfoCard
        class="info-card"
        :title="$t('nutrition.calories')"
        :subTitle="foodDiaryStore.getCaloriesOfDate(new Date()) + ' kcal'"
        iconSource="../../assets/icons/burn.svg"
      />
      </ion-col>
      <ion-col size="6">
      <BaseInfoCard
        :title="$t('home.missingProtein')"
        :subTitle="foodDiaryStore.getMissingProteinsOfToday() + ' g'"
        :icon="fishOutline"
      />
      </ion-col>
    </ion-row>
 
    <h2 class="ion-margin">Your week</h2>
    <ion-row class="ion-margin">
      <ion-col size="6">
      <BaseInfoCard
        class="info-card"
        :title="$t('home.performedWorkouts')"
        :subTitle="workoutSessionStore.getPerformedWorkoutsThisWeek()"
        :icon="barbellOutline"
      />
      </ion-col>
      <ion-col size="6">
      <BaseInfoCard
        :title="$t('home.performedVolume')"
        :subTitle="workoutSessionStore.getPerformedWorkoutVolumeThisWeek() + ' kg'"
        :icon="barChartOutline"
      />
      </ion-col>
    </ion-row>
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
    <ion-card>
      <div 
        class="chart-container ion-padding"
      >
        <NutritionParallelChart />
      </div>
    </ion-card>
  </PageWithCalendar>
</template>

<style scoped>
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
.info-card {
  --background: none;
  background-color: none;
  color: none
}
</style>
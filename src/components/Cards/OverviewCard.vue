<script setup lang="ts">
  import { IonCard, IonLabel, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/vue';
  import BurnIcon from '@/icons/burn.svg';
  import CarbsIcon from '@/icons/carbs.svg';
  import ProteinIcon from '@/icons/protein.svg';
  import FatIcon from '@/icons/fat.svg';
  import WeightIcon from '@/icons/weight.svg';
  import NutritionKPIDoughnut from '@/components/Charts/NutritionKPIDoughnut.vue';
  import BaseHorizontalBarChart from '@/components/Charts/BaseHorizontalBarChart.vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import { useWorkoutSessionStore } from '@/store/workoutStore';
  import { useI18n } from 'vue-i18n';
  import { computed } from 'vue';

  const props = defineProps({
    date: {
      type: Date,
      required: true
    },
  });

  const { t } = useI18n();

  const foodDiaryStore = useFoodDiaryStore();
  const workoutSessionStore = useWorkoutSessionStore();

  const workoutBarColors = ['#3F63C8'];
  const nutritionBarColors = ['#3F63C8', '#86A0E7', '#FFFFFF'];

  const caloriesOfToday = computed(() => {
    return foodDiaryStore.getCaloriesOfDate(props.date);
  });

  const caloriesTarget = computed(() => {
    return foodDiaryStore.dailyCalories;
  });

  const nutritionOverviewData = computed(() =>{
    return [
      {
        icon: CarbsIcon,
        value: foodDiaryStore.getCarbohydratesOfDate(props.date),
        target: foodDiaryStore.dailyCarbs
      },
      {
        icon: ProteinIcon,
        value: foodDiaryStore.getProteinOfDate(props.date),
        target: foodDiaryStore.dailyProtein
      },
      {
        icon: FatIcon,
        value: foodDiaryStore.getFatOfDate(props.date),
        target: foodDiaryStore.dailyFat
      }
    ]
});

const workoutOverviewData = computed(() => {
  const workoutVolume = workoutSessionStore.getPerformedWorkoutVolumeOfDate(props.date);
  const plannedWorkoutVolume = workoutSessionStore.getPlannedWorkoutVolumeOfDate(props.date);
  return {
      icon: WeightIcon,
      name: `${t('home.workoutVolume')}`,
      value: workoutVolume,
      maxValue: plannedWorkoutVolume,
      unit: t('weightUnitBig')
    }
});
</script>

<template>
  <ion-card>
    <ion-grid>
        <ion-row>
          <h4>{{ $t('fitness') }}</h4>
        </ion-row>
        <ion-row>
          <ion-col>
          <BaseHorizontalBarChart
            :data="workoutOverviewData.value"
            :max-value="workoutOverviewData.maxValue"
            :color="workoutBarColors[0]"
          />
          </ion-col>
        </ion-row>
        <ion-row class="volume-kpi-row">
          <ion-col size="6">
            <ion-icon class="icon-margin" :icon="workoutOverviewData.icon"/>
            <ion-label>{{ workoutOverviewData.name }}</ion-label>
          </ion-col >
          <ion-col size="6" v-if="workoutOverviewData.value > 0">
            <p style="text-align: right;">{{ workoutOverviewData.value }} / {{ workoutOverviewData.maxValue }} {{ workoutOverviewData.unit }}</p>
          </ion-col>
        </ion-row>

        <ion-row>
            <h4>{{ $t('nutrition.title') }}</h4>
        </ion-row>
        <ion-row>
          <div class="calories-polarchart-container">
            <NutritionKPIDoughnut
              :data="caloriesOfToday"
              :max-value="caloriesTarget"
              :radius="120"
              :name="$t('nutrition.calories')"
              color="#3F63C8"
              :icon="BurnIcon"
              unit="kcal"
              :show-max-value="true"
            />
          </div>
        </ion-row>

        <ion-row>
          <ion-col
            v-for="(item, index) in nutritionOverviewData"
            :key="index"
          >
            <BaseHorizontalBarChart
              :data="item.value"
              :max-value="item.target"
              :color="nutritionBarColors[index]"
            />
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col
            v-for="(item, index) in nutritionOverviewData"
            :key="index"
          >
            <div class="icon-description">
              <ion-icon :icon="item.icon"/>
              <p>{{ item.value }} {{ $t('weightUnitSmall') }} / {{ item.target }} {{ $t('weightUnitSmall') }}</p>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card>
</template>

<style scoped>
ion-item{
    --background: none;
}
.volume-kpi-row {
  :is(p) {
    margin: 0 0 0 16px;
    padding: 0;
  }
}
.icon-margin {
  margin-right: 0.3rem;
}
.icon-description {
  display: flex;
  align-items: center;
  :is(ion-icon) {
    margin-right: 0.3rem;
  }
  :is(p) {
    margin: 0;
    padding: 0;
    font-size: 0.8rem;

  }
}
.calories-polarchart-container {
  width: 100%;
  height: 150px;
  margin: 0;
}
</style>
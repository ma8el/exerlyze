<script setup lang="ts">
  import { IonCard, IonLabel, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/vue';
  import BurnIcon from '@/icons/burn.svg';
  import CarbsIcon from '@/icons/carbs.svg';
  import ProteinIcon from '@/icons/protein.svg';
  import FatIcon from '@/icons/fat.svg';
  import WeightIcon from '@/icons/weight.svg';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import { useWorkoutSessionStore } from '@/store/workoutStore';
  import { useI18n } from 'vue-i18n';
  import { computed } from 'vue';

  const { t } = useI18n();

  const foodDiaryStore = useFoodDiaryStore();
  const workoutSessionStore = useWorkoutSessionStore();

  const date = new Date();

  const caloriesOfToday = computed(() => {
    return foodDiaryStore.getCaloriesOfDate(date);
  });

  const caloriesTarget = computed(() => {
    return foodDiaryStore.dailyCalories;
  });

  const nutritionOverviewData = computed(() =>{
    return [
      {
        icon: CarbsIcon,
        value: foodDiaryStore.getCarbohydratesOfDate(date),
        target: foodDiaryStore.dailyCarbs
      },
      {
        icon: ProteinIcon,
        value: foodDiaryStore.getProteinOfDate(date),
        target: foodDiaryStore.dailyProtein
      },
      {
        icon: FatIcon,
        value: foodDiaryStore.getFatOfDate(date),
        target: foodDiaryStore.dailyFat
      }
    ]
});

const workoutOverviewData = computed(() => {
  const workoutVolume = workoutSessionStore.getPerformedWorkoutVolumeOfDate(date);
  return [
   {
      icon: WeightIcon,
      name: `${t('home.workoutVolume')}`,
      value: `${workoutVolume} ${t('weightUnitBig')}`,
    }
  ]
});
</script>

<template>
  <ion-card>
    <ion-grid>
        <ion-row>
          <h4>Fitness</h4>
        </ion-row>
        <ion-row
          v-for="(item, index) in workoutOverviewData"
          :key="index"
          class="fitness-row"
        >
          <ion-col size="8">
            <ion-icon class="icon-margin" :icon="item.icon"/>
            <ion-label>{{ item.name }}</ion-label>
          </ion-col>
          <ion-col size="4">
            <p>{{ item.value }}</p>
          </ion-col>
        </ion-row>

        <ion-row>
            <h4>Nutrition</h4>
        </ion-row>
        <ion-row>
          <ion-col size="6">
            <div class="icon-description">
              <ion-icon class="small-margin" :icon="BurnIcon"/>
              <p>{{ caloriesOfToday }} {{ $t('calUnit') }} / {{ caloriesTarget }} {{ $t('calUnit') }}</p>
            </div>
          </ion-col>
        </ion-row>
 
        <ion-row>
          <ion-col
            v-for="(item, index) in nutritionOverviewData"
            :key="index"
          >
            <div class="icon-description">
              <ion-icon class="small-margin" :icon="item.icon"/>
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
.fitness-row {
  display: flex;
  align-items: center;
  p {
    margin: 0;
    padding: 0;
  }
}
.icon-margin {
  margin-right: 0.3rem;
}
.icon-description {
  display: flex;
  align-items: center;
  ion-icon {
    margin-right: 0.3rem;
  }
  p {
    margin: 0;
    padding: 0;
    font-size: 0.8rem;

  }
}
</style>
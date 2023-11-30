<script setup lang="ts">
  import { IonCard, IonLabel, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import { useI18n } from 'vue-i18n';
  import { computed } from 'vue';

  const { t } = useI18n();

  const foodDiaryStore = useFoodDiaryStore();

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
        icon: 'carbs.svg',
        value: foodDiaryStore.getCarbohydratesOfDate(date),
        target: foodDiaryStore.dailyCarbs
      },
      {
        icon: 'protein.svg',
        value: foodDiaryStore.getProteinOfDate(date),
        target: foodDiaryStore.dailyProtein
      },
      {
        icon: 'fat.svg',
        value: foodDiaryStore.getFatOfDate(date),
        target: foodDiaryStore.dailyFat
      }
    ]
});

const workoutOverviewData = computed(() => {
  return [
   {
      icon: 'weight.svg',
      name: `${t('home.workoutVolume')}`,
      value: `0 ${t('weightUnitBig')}`,
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
            <ion-icon class="icon-margin" :src="`../../../assets/icons/${item.icon}`"/>
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
              <ion-icon class="small-margin" src="../../../assets/icons/burn_white.svg"/>
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
              <ion-icon class="small-margin" :src="`../../../assets/icons/${item.icon}`"/>
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
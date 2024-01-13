<script setup lang="ts">
  import { IonCard, IonCardContent, IonRow, IonCol } from '@ionic/vue';
  import BurnIcon from '@/icons/burn.svg';
  import { onMounted, computed, ref, inject, watch, Ref } from 'vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import { selectedDateKey } from '@/keys';
  import NutritionKPIDoughnut from '@/components/Charts/NutritionKPIDoughnut.vue';

  const selectedDate = inject<Ref<Date>>(selectedDateKey, ref(new Date(new Date().setHours(0, 0, 0, 0))))
  const foodDiaryStore = useFoodDiaryStore();

  const loading = ref(true);
  const calories = ref(0);
  const result = ref(0);

  const activity = ref(0);

  const intake = computed(() => {
    if (!selectedDate) {
      return 0;
    }
    return foodDiaryStore.getCaloriesOfDate(selectedDate.value);
  })

  const update = async () => {
    if (!selectedDate) {
      return;
    }
    loading.value = true;
    calories.value = (await foodDiaryStore.getNutritionGoalOfDate(selectedDate.value)).daily_calories;
    result.value = calories.value - intake.value + activity.value;
    loading.value = false;
  }

  watch(selectedDate, () => {
    update();
  })

  onMounted(async () => {
    await update();
  })
</script>

<template>
  <ion-card class="card">
    <ion-card-content>
      <ion-row>
        <ion-col>
          <div class="top-polar-chart-container">
            <NutritionKPIDoughnut
              v-if="!loading"
              :data="calories"
              :name="$t('nutrition.calories')"
              :max-value="calories"
              :radius="120"
              color="#3F63C8"
              :icon="BurnIcon"
            />
          </div>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="4">
          <div class="bottom-polar-chart-container">
            <NutritionKPIDoughnut
              :data="intake"
              :name="$t('nutrition.intake')"
              :max-value="calories + activity"
              :radius="90"
              color="#FFFFFF"
            />
          </div>
        </ion-col>
        <ion-col size="4">
          <div class="bottom-polar-chart-container">
            <NutritionKPIDoughnut
              :data="activity"
              :name="$t('nutrition.activity')"
              :max-value="activity"
              :radius="80"
              color="#FC4D55"
            />
          </div>
        </ion-col>
        <ion-col size="4">
          <div class="bottom-polar-chart-container">
            <NutritionKPIDoughnut
              v-if="!loading"
              :data="result"
              :name="$t('nutrition.left')"
              :max-value="calories + activity"
              :radius="90"
              color="#86A0E7"
            />
          </div>
        </ion-col>
      </ion-row>
    </ion-card-content>
  </ion-card>
</template>

<style scoped lang="scss">
  .top-polar-chart-container {
    width: 100%;
    height: 150px;
    margin: 0;
  }
  .bottom-polar-chart-container {
    width: 100%;
    height: 120px;
    margin: 0;
  }
 
  .card {
    margin-top: 10px;
    border-radius: 10px;
    ion-card-content {
      padding: 0;
      margin: 0;
     }
    }
  </style>
<script setup lang="ts">
  import { supabase } from '@/supabase';
  import { IonRow, IonCol } from '@ionic/vue';
  import ChartContainerCard from '@/components/Cards/ChartContainerCard.vue';
  import NutritionBarChart from '@/components/Charts/NutritionBarChart.vue';
  import NutritionParallelChart from '@/components/Charts/NutritionParallelChart.vue';
  import NutritionParallelInsightChart from './Charts/NutritionParallelInsightChart.vue';
  import NutritionBarInsightChart from './Charts/NutritionBarInsightChart.vue';
  import InsightsInfoCard from './Cards/InsightsInfoCard.vue';
  import NotLoggedInCard from './Cards/NotLoggedInCard.vue';
  import { ref, computed, watch, onMounted } from 'vue';

  interface NutritionIntake {
    calories: number;
    carbohydrates: number;
    proteins: number;
    fat: number;
  }

  const props = defineProps({
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  });

  const loading = ref(false);

  const startDate = computed(() => {
      return props.startDate;
  });
  
  const endDate = computed(() => {
      return props.endDate;
  });

  const authenticated = ref(false);

  const averageCalories = ref(0);
  const averageCarbs = ref(0);
  const averageProtein = ref(0);
  const averageFat = ref(0);

  const averageNutritionIntake = computed(async (): Promise<NutritionIntake> => { 
    loading.value = true;
    const { data, error } = await supabase
      .rpc('avg_daily_calories', {
          start_date: startDate.value.toDateString(),
          end_date: endDate.value.toISOString()
        }
      ).returns<NutritionIntake>()
      .single();
    loading.value = false;
    if (error) {
      console.error(error);
      return {} as NutritionIntake;
    }
    return data;
  })

  const value = computed(() => {
    return 0;
  })

  const refreshData = async () => {
    const data = await averageNutritionIntake.value;
    if (!data) {
      return;
    }
    averageCalories.value = data.calories;
    averageCarbs.value = data.carbohydrates;
    averageProtein.value = data.proteins;
    averageFat.value = data.fat;
  }

  watch ([startDate, endDate], async () => {
    await refreshData();
  })

  onMounted(async () => {
    await refreshData();
    const { data } = await supabase.auth.getSession();
    authenticated.value = data.session != null;
  })
</script>


<template>
  <div v-if="!authenticated">
    <ion-row>
      <ion-col size="6">
        <NotLoggedInCard
          :title="$t('nutrition.calories')"
        />
      </ion-col>
      <ion-col size="6">
        <NotLoggedInCard
          :title="$t('nutrition.protein')"
        />
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col size="6">
        <NotLoggedInCard
          :title="$t('nutrition.carbs')"
        />
      </ion-col>
      <ion-col size="6">
        <NotLoggedInCard
          :title="$t('nutrition.fat')"
        />
      </ion-col>
    </ion-row>

    <ChartContainerCard>
      <NutritionBarChart />
    </ChartContainerCard>

    <ChartContainerCard>
      <NutritionParallelChart />
    </ChartContainerCard>
  </div>

  <div v-else>
    <ion-row class="top-row">
      <ion-col size="6">
        <InsightsInfoCard
          :title="$t('nutrition.calories')"
          :value="averageCalories"
          :average="true"
          unit="kcal"
          :loading="loading"
          :is-left="true"

        />
      </ion-col>
      <ion-col size="6">
        <InsightsInfoCard
          :title="$t('nutrition.protein')"
          :value="averageProtein"
          :average="true"
          unit="g"
          :loading="loading"
          :is-left="false"
        />
      </ion-col>
    </ion-row>

    <ion-row
      class="bottom-row"
    >
      <ion-col size="6">
        <InsightsInfoCard
          :title="$t('nutrition.carbs')"
          :value="averageCarbs"
          :average="true"
          unit="g"
          :loading="loading"
          :is-left="true"
        />
      </ion-col>
      <ion-col size="6">
        <InsightsInfoCard
          :title="$t('nutrition.fat')"
          :value="averageFat"
          :average="true"
          unit="g"
          :loading="loading"
          :is-left="false"
        />
      </ion-col>
    </ion-row>

    <ChartContainerCard>
      <NutritionBarInsightChart
        :startDate="startDate"
        :endDate="endDate"
      />
    </ChartContainerCard>

    <ChartContainerCard>
      <NutritionParallelInsightChart
        :startDate="startDate"
        :endDate="endDate"
      />
    </ChartContainerCard>
  </div>
</template>

<style scoped>
ion-row {
    margin: 0;
    padding: 0;
  :is(ion-col) {
    margin: 0;
    padding: 0;
  }
}
.top-row {
  margin: 16px;
}
.bottom-row {
  margin: 0 16px 16px 16px;
}
</style>
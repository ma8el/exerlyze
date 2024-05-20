<script setup lang="ts">
  import { supabase } from '@/supabase';
  import { IonRow, IonCol } from '@ionic/vue';
  import ChartContainerCard from '@/components/Cards/ChartContainerCard.vue';
  import InsightsInfoCard from '@/components/Cards/InsightsInfoCard.vue';
  import NotLoggedInCard from '@/components/Cards/NotLoggedInCard.vue';
  import WorkoutVolumeBarChart from '@/components/Charts/WorkoutVolumeBarChart.vue';
  import WorkoutVolumeBarInsightChart from '@/components/Charts/WorkoutVolumeBarInsightChart.vue';
  import WeightLineInsightChart from '@/components/Charts/WeightLineInsightChart.vue';
  import { ref, onMounted, computed, watch } from 'vue';

  interface WeightChangePercentage {
    p_date: string;
    weight_change_percentage: number;
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

 const authenticated = ref(false);
 const loading = ref(false);
 const value = ref(undefined);
 const weightPercentage = ref(0);

 const selectedExercise = ref<number | undefined>(undefined);

 const startDate = computed(() => {
   return props.startDate;
 });

 const endDate = computed(() => {
   return props.endDate;
 });

 const weightChangePercentage = computed(async (): Promise<WeightChangePercentage> => { 
    let lowerBound = new Date();
    if (endDate.value < new Date()) {
      lowerBound = endDate.value;
    }
    loading.value = true;
    const { data, error } = await supabase
      .rpc('get_weight_change_percentage', {
          start_date: startDate.value.toISOString(),
          end_date: lowerBound.toISOString()
        }
      )
      .returns<WeightChangePercentage>()
      .single();
    loading.value = false;
    if (error) {
      console.error(error);
      return {p_date: new Date().toISOString(), weight_change_percentage: 0};
    }
    return data;
 })

 const refreshData = async () => {
  const weightData = await weightChangePercentage.value;
  weightPercentage.value = weightData.weight_change_percentage;
 }

 const updateFilter = (exercise: number) => {
   selectedExercise.value = exercise;
 };

 watch([startDate, endDate], async () => {
   await refreshData();
 });

 onMounted(async () => {
   const { data } = await supabase.auth.getSession();
   authenticated.value = data.session != null;
   await refreshData();
 });
</script>

<template>
  <div v-if="!authenticated">
    <ion-row 
      class="insights-info-card"
    >
      <ion-col size="6">
       <NotLoggedInCard
          :title="$t('performanceIncrease')"
        />
      </ion-col>
      <ion-col size="6">
      <NotLoggedInCard
          :title="$t('weightChange')"
        />
      </ion-col>
    </ion-row>

    <ChartContainerCard>
      <WorkoutVolumeBarChart />
    </ChartContainerCard>

    <NotLoggedInCard
      :title="$t('weight')"
    />
  </div>
  <div v-else>
    <ion-row 
      class="insights-info-card"
    >
      <ion-col size="6">
        <InsightsInfoCard
          :title="$t('performanceIncrease')"
          :value="value"
          :percentage="true"
          unit="%"
          :is-left="false"
        />
      </ion-col>
      <ion-col size="6">
        <InsightsInfoCard
          :title="$t('weightChange')"
          :value="weightPercentage"
          :percentage="true"
          unit="%"
          :is-left="false"
        />
      </ion-col>
    </ion-row>
    <ChartContainerCard 
      :has-filter="true"
      @update-filter="updateFilter($event)"
    >
      <WorkoutVolumeBarInsightChart
        :startDate="startDate"
        :endDate="endDate"
        :selected-exercise="selectedExercise"
      />
    </ChartContainerCard>

    <ChartContainerCard>
      <WeightLineInsightChart
        :startDate="startDate"
        :endDate="endDate"
      />
    </ChartContainerCard>
  </div>
</template>

<style scoped>
  .insights-info-card {
    margin: 11px 11px 11px 3px;
    display: flex;
    align-items: stretch;
  }
</style>
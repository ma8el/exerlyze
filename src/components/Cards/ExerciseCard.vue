<script setup lang="ts">
  import { IonSpinner, IonIcon, IonRow, IonCol, IonGrid } from '@ionic/vue';
  import { onMounted, ref } from 'vue';
  import BaseCard from './BaseCard.vue';
  import { useWorkoutStore } from '@/store/workoutStore';
  import WeightIcon from '@/icons/weight.svg';
  import RepsIcon from '@/icons/reps.svg';
  import SetIcon from '@/icons/set.svg';
  import { Exercise } from '@/types';

  const props = defineProps<Exercise>()
  const loading = ref<boolean>(true)
  const url = ref<string>()

  const workoutStore = useWorkoutStore()

  onMounted(async () => {
    loading.value = true
    url.value = await workoutStore.getWorkoutImageUrl(props.exercise_id)
    loading.value = false
  })
</script>

<template>
  <BaseCard
    v-if="!loading"
    class="exercise-card"
    :img_src="url"
    :title="name"
    :sub-title="true"
    :img_height="'100px'"
  >
    <template #subtitle>
      <ion-grid>
      <ion-row>
        <ion-col class="no-margin" size="3">
          <div class="icon-description">
            <ion-icon class="small-margin" :icon="SetIcon"/>
            {{sets}}
          </div>
        </ion-col>
        <ion-col class="no-margin" size="3">

          <div class="icon-description">
          <ion-icon class="small-margin" :icon="RepsIcon"/>
          {{reps}}
          </div>
        </ion-col>
        <ion-col class="no-margin" size="6">
          <div class="icon-description">
          <ion-icon class="small-margin" :icon="WeightIcon"/>
          {{weight}} {{ $t('weightUnitBig')  }}
          </div>
        </ion-col>
      </ion-row>
      </ion-grid>
    </template>
  </BaseCard>
  <ion-spinner v-else/>
</template>

<style scoped>

.no-margin {
  margin: 0;
  padding: 0;
}

.small-margin {
  margin-right: 0.2rem;
}

.icon-description {
  display: flex;
  align-items: center;
}

</style>
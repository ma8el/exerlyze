<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { IonButton,
         IonIcon,
         IonSelect,
         IonSelectOption,
         IonItem,
       } from '@ionic/vue'
import { chevronForward, trendingUp } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import WelcomeSettingsLayout from '@/layouts/WelcomeSettingsLayout.vue';
import NumericInput from '@/components/NumericInput.vue';
import { ref } from 'vue';
import Line from '@/components/Line.vue';
import { computed, onMounted } from 'vue';
import { useUserFitnessLevelStore } from '@/store/userSettingsStore';
import { useWeightStore } from '@/store/bodyMetricsStore';
import { FitnessLevel } from '@/types/workout.enums';

const router = useRouter();

const userFitnessLevelStore = useUserFitnessLevelStore();
const weightStore = useWeightStore();
const userWeight = Number(weightStore.getCurrentWeight.weight);

const deadlift = ref<number>(0)
const squat = ref<number>(0)
const benchPress = ref<number>(0)

const selectedFitnessLevel = computed<FitnessLevel>({
  get: () => {
    const total = Number(deadlift.value) + Number(squat.value) + Number(benchPress.value)
    if (total < 3.5 * userWeight) {
      return FitnessLevel.Beginner
    } else if (total >= 3.5 * userWeight && total < 4.75 * userWeight) {
      return FitnessLevel.Novice
    } else if (total >= 4.75 * userWeight && total < 6.5 * userWeight) {
      return FitnessLevel.Intermediate
    } else if (total >= 6.5 * userWeight && total < 7.75 * userWeight) {
      return FitnessLevel.Advanced
    } else if (total >= 7.75 * userWeight) {
      return FitnessLevel.Elite
    } else {
      return FitnessLevel.Beginner
    }
  },
  set: (value: FitnessLevel) => {
    if (value === FitnessLevel.Beginner) {
      deadlift.value = 0
      squat.value = 0
      benchPress.value = 0
    } else if (value === FitnessLevel.Novice) {
      deadlift.value = 1.5 * userWeight
      squat.value = 1.25 * userWeight
      benchPress.value = 0.75 * userWeight
    } else if (value === FitnessLevel.Intermediate) {
      deadlift.value = 2 * userWeight
      squat.value = 1.5 * userWeight
      benchPress.value = 1.25 * userWeight
    } else if (value === FitnessLevel.Advanced) {
      deadlift.value = 2.5 * userWeight
      squat.value = 2.25 * userWeight
      benchPress.value = 1.75 * userWeight
    } else if (value === FitnessLevel.Elite) {
      deadlift.value = 3 * userWeight
      squat.value = 2.75 * userWeight
      benchPress.value = 2 * userWeight
    }
  }
})

const deadliftValid = ref<boolean>(true)
const squatValid = ref<boolean>(true)
const benchPressValid = ref<boolean>(true)

const deactivateButton = computed(() => {
  return !deadliftValid.value || !squatValid.value || !benchPressValid.value
})

const setFitnessLevel = (level: FitnessLevel) => {
  selectedFitnessLevel.value = level;
}

const next = () => {
  userFitnessLevelStore.setUserFitnessLevel({
    id: uuidv4(),
    created_at: new Date(),
    fitness_level: selectedFitnessLevel.value,
    deadlift_max: deadlift.value,
    squat_max: squat.value,
    bench_max: benchPress.value,
    overhead_press_max: undefined,
    other: undefined,
  })
  router.push('/complete-diet-profile');
}

onMounted(() => {
  const latestFitnessLevel = userFitnessLevelStore.getLatestFitnessLevel();
  if (latestFitnessLevel) {
    selectedFitnessLevel.value = latestFitnessLevel.fitness_level;
    deadlift.value = latestFitnessLevel.deadlift_max;
    squat.value = latestFitnessLevel.squat_max;
    benchPress.value = latestFitnessLevel.bench_max;
    router.push('/complete-diet-profile');
  }
})
</script>

<template>
    <WelcomeSettingsLayout
      image="../../assets/illustrations/fill_workout_goals.svg"
      :title="$t('settings.fitnessLevelTitle')"
      :subtitle="$t('settings.fitnessLevelDescription')"
      :settingComplete="false"
      redirectPath="/complete-diet-profile"
      :backButton="true"
    >
    <ion-item lines="none">
      <ion-icon :icon="trendingUp" color="primary" style="margin-right: 10px"></ion-icon>
      <ion-select 
        :label="$t('settings.fitnessLevel')"
        :placeholder="$t('settings.fitnessLevel')"
        v-model="selectedFitnessLevel"
        @ionChange="setFitnessLevel($event.detail.value)"
      >
        <ion-select-option :value="FitnessLevel.Beginner">{{ $t('settings.beginner') }}</ion-select-option>
        <ion-select-option :value="FitnessLevel.Novice">{{ $t('settings.novice') }}</ion-select-option>
        <ion-select-option :value="FitnessLevel.Intermediate">{{ $t('settings.intermediate') }}</ion-select-option>
        <ion-select-option :value="FitnessLevel.Advanced">{{ $t('settings.advanced') }}</ion-select-option>
        <ion-select-option :value="FitnessLevel.Elite">{{ $t('settings.elite') }}</ion-select-option>
      </ion-select>
    </ion-item>
    <Line
      :label="$t('or')"
    />
    <div class="strength-values">
      <ion-item>
        <NumericInput
          :label="$t('settings.deadliftMax')"
          v-model:input-value="deadlift"
          @update:valid="deadliftValid = $event"
        />
        <ion-button expand="block" slot="end" shape="round" color="primary">
          {{ $t('weightUnitBig') }} 
        </ion-button>
      </ion-item>
      <ion-item>
        <NumericInput
          :label="$t('settings.squatMax')"
          v-model:input-value="squat"
          @update:valid="squatValid = $event"
        />
        <ion-button expand="block" slot="end" shape="round" color="primary">
          {{ $t('weightUnitBig') }} 
        </ion-button>
      </ion-item>
      <ion-item>
        <NumericInput
          :label="$t('settings.benchMax')"
          v-model:input-value="benchPress"
          @update:valid="benchPressValid = $event"
        />
         <ion-button expand="block" slot="end" shape="round" color="primary">
            {{ $t('weightUnitBig') }} 
          </ion-button>
      </ion-item>
   </div>
    <ion-button
      expand="block"
      color="primary"
      @click="next()"
      :disabled="deactivateButton"
    >
      {{ $t('next')  }}
      <ion-icon :src="chevronForward" style="margin-left: 10px;"></ion-icon>
    </ion-button>
   </WelcomeSettingsLayout>
</template>

<style scoped lang="scss">
.strength-values {
  margin-bottom: 16px;
}
.strength-values ion-button {
    margin: 20px 0 0 10px;
    --padding-start: 10px;
    --padding-end: 10px;
}
</style>
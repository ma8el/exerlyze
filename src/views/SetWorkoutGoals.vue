<script setup lang="ts">
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
import { computed } from 'vue';
import { useUserFitnessLevelStore } from '@/store/userSettingsStore';
import { FitnessLevel } from '@/types/workout.enums';

const router = useRouter();

const userFitnessLevelStore = useUserFitnessLevelStore();

const deadlift = ref<number>(0)
const squat = ref<number>(0)
const benchPress = ref<number>(0)

const selectedFitnessLevel = computed<FitnessLevel>({
  get: () => {
    const total = Number(deadlift.value) + Number(squat.value) + Number(benchPress.value)
    if (total < 100) {
      return FitnessLevel.Beginner
    } else if (total >= 100 && total < 200) {
      return FitnessLevel.Novice
    } else if (total >= 200 && total < 300) {
      return FitnessLevel.Intermediate
    } else if (total >= 300 && total < 400) {
      return FitnessLevel.Advanced
    } else if (total >= 400) {
      return FitnessLevel.Elite
    } else {
      return FitnessLevel.Beginner
    }
  },
  set: () => {
      deadlift.value = 0
      squat.value = 0
      benchPress.value = 0
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
  userFitnessLevelStore.setFitnessLevel(selectedFitnessLevel.value)
  userFitnessLevelStore.setDeadliftMax(deadlift.value)
  userFitnessLevelStore.setSquatMax(squat.value)
  userFitnessLevelStore.setBenchMax(benchPress.value)
  router.push('/complete-diet-profile');
}
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
      label="or"
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
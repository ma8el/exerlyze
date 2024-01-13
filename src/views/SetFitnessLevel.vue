<script setup lang="ts">
import illustration from '../../assets/illustrations/fill_workout_goals.png';
import WelcomeSettingsLayout from '@/layouts/WelcomeSettingsLayout.vue';
import FitnessLevelInput from '@/components/FitnessLevelInput.vue';

const redirectPath = '/complete-diet-profile';
</script>

<template>
  <WelcomeSettingsLayout
    :image="illustration"
    :title="$t('settings.fitnessLevelTitle')"
    :subtitle="$t('settings.fitnessLevelDescription')"
    :settingComplete="false"
    :redirectPath="redirectPath"
    :backButton="true"
  >
    <FitnessLevelInput 
      buttonLabel="Next"
      :saveRedirectPath="redirectPath"
    />
  </WelcomeSettingsLayout>
</template>
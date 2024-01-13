<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import FitnessLevelInput from '@/components/FitnessLevelInput.vue';
</script>

<template>
  <AppLayout
    :title="$t('settings.fitnessLevel')"
    :saveButton="false"
    :backButton="true"
    :settingsButton="false"
    :title-size="'1.5rem'"
  >
    <div class="ion-padding">
      <FitnessLevelInput
        :buttonLabel="$t('save')"
        saveRedirectPath="/tabs/profile"
      />
    </div>
  </AppLayout>
</template>
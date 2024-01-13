<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import DietGoalInput from '@/components/DietGoalInput.vue';
</script>

<template>
  <AppLayout
    :title="$t('settings.dietGoals')"
    :saveButton="false"
    :backButton="true"
    :settingsButton="false"
    :title-size="'1.5rem'"
  >
    <div class="ion-padding">
      <DietGoalInput
        :buttonLabel="$t('save')"
        saveRedirectPath="/tabs/profile"
      />
    </div>
  </AppLayout>
</template>
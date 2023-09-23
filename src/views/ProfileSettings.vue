<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import UserMetricsInput from '@/components/UserMetricsInput.vue';
</script>

<template>
  <AppLayout
    :title="$t('profile.title')"
    :saveButton="false"
    :backButton="true"
    :settingsButton="false"
  >
    <div class="ion-padding">
      <UserMetricsInput
        :buttonLabel="$t('save')"
        saveRedirectPath="/tabs/profile"
      />
    </div>
  </AppLayout>
</template>
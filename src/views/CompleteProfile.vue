<script setup lang="ts">
import WelcomeSettingsLayout from '@/layouts/WelcomeSettingsLayout.vue';
import UserMetricsInput from '@/components/UserMetricsInput.vue';
import { useUserStore } from '@/store/bodyMetricsStore';

const userStore = useUserStore();
const complete = userStore.isComplete;
</script>

<template>
    <WelcomeSettingsLayout
      image="../../assets/illustrations/fill_form.svg"
      :title="$t('completeProfile')"
      :subtitle="$t('completeProfileMessage')"
      :settingComplete="complete"
      redirectPath="/complete-fitness-level"
    >
      <UserMetricsInput
        :buttonLabel="$t('next')"
        :saveRedirectPath="'/complete-fitness-level'"
      />
    </WelcomeSettingsLayout>
</template>
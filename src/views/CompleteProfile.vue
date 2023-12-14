<script setup lang="ts">
import WelcomeSettingsLayout from '@/layouts/WelcomeSettingsLayout.vue';
import UserMetricsInput from '@/components/UserMetricsInput.vue';
</script>

<template>
    <WelcomeSettingsLayout
      image="../../assets/illustrations/fill_form.svg"
      :title="$t('completeProfile')"
      :subtitle="$t('completeProfileMessage')"
    >
      <UserMetricsInput
        :buttonLabel="$t('next')"
      />
    </WelcomeSettingsLayout>
</template>
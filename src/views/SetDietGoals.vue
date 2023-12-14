<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue'
import { chevronForward } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import WelcomeSettingsLayout from '@/layouts/WelcomeSettingsLayout.vue';
import UserMetricsInput from '@/components/UserMetricsInput.vue';
import { useUserStore } from '@/store/bodyMetricsStore';
import { onMounted } from 'vue';

const router = useRouter();

const next = () => {
    router.push('/tabs/home');
}
</script>

<template>
    <WelcomeSettingsLayout
      image="../../assets/illustrations/fill_diet_goals.svg"
      title="What are your diet goals?"
      subtitle="Fill out your diet goals to get started."
      :settingComplete="false"
      redirectPath="/tabs/home"
      :backButton="true"
    >
    <ion-button
      expand="block"
      color="primary"
      @click="next()"
    >
      {{ $t('next')  }}
      <ion-icon :src="chevronForward" style="margin-left: 10px;"></ion-icon>
    </ion-button>
   </WelcomeSettingsLayout>
</template>
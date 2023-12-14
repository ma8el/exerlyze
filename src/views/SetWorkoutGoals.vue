<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue'
import { chevronForward } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import WelcomeSettingsLayout from '@/layouts/WelcomeSettingsLayout.vue';

const router = useRouter();

const next = () => {
    router.push('/complete-diet-profile');
}
</script>

<template>
    <WelcomeSettingsLayout
      image="../../assets/illustrations/fill_workout_goals.svg"
      title="What is your fitness level?"
      subtitle="How often do you workout?"
      :settingComplete="false"
      redirectPath="/complete-diet-profile"
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
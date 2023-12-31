<script setup lang="ts">
import { IonButton } from '@ionic/vue';
import { useRouter } from 'vue-router';
import complete from '../../../assets/illustrations/complete.png';
import BaseCard from './BaseCard.vue';

const router = useRouter();

const redirect = () => {
  router.push('/insights');
}
</script>

<template>
  <BaseCard
    :title="$t('home.wellDone')"
    :img_src="complete"
    :img_height="'135px'"
    :sub-title="true"
    :content="true"
  >
  <template #subtitle>
    {{ $t('home.youAreDone') }} 
  </template>
  <ion-button
    @click="redirect()"
    expand="block" 
  >
    {{ $t('home.reviewYourPerformance') }}
  </ion-button>
  </BaseCard>
</template>
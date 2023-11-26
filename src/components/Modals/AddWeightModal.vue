<script setup lang="ts">
  import { IonButton,
           IonInput,
           IonCardHeader,
           IonCardTitle,
           IonCard,
           modalController } from '@ionic/vue';
  import { useWeightStore, useUserStore } from '@/store/bodyMetricsStore';
  import { ref } from 'vue';

  const weight = ref<number>();

  const closeModal = () => {
      return modalController.dismiss(null, 'close');
  };

  const saveWeight = async () => {
    if (!weight.value) {
      return
    }
    const weightStore = useWeightStore();
    const userStore = useUserStore();
    weightStore.addWeight({
      'id': weightStore.getNewId,
      'weight': weight.value,
      'created_at': new Date(),
      'updated_at': new Date(),
      'unit': 'kg',
      'user_id': await userStore.getUserId(),
    });
    closeModal();
    weight.value = undefined;
  };
</script>

<template>
  <ion-card fill="outline" class="weight-card">
    <ion-card-header>
      <ion-card-title>
        {{ $t('addWeight') }}
      </ion-card-title>
    </ion-card-header>
    <ion-input
      class="ion-padding"
      fill="outline"
      shape="round"
      :label="$t('weight')"
      :placeholder="$t('enterWeight')"
      label-placement="stacked"
      v-model="weight"
    ></ion-input>
    <ion-button fill="clear" @click="saveWeight">
      {{ $t('save') }}
    </ion-button>
    <ion-button fill="clear" @click="closeModal">
      {{ $t('dismiss') }}
    </ion-button>
  </ion-card>
</template>

<style scoped>
ion-modal#add-weight-modal {
  --width: fit-content;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

.weight-card {
  --background: rgba(255, 255, 255, 0);
  --color: #fff;
}
</style>
<script setup lang="ts">
  import { IonButton,
           IonModal,
           IonInput,
           IonCardHeader,
           IonCardTitle,
           IonCard,
           modalController } from '@ionic/vue';
  import { useWeightStore } from '@/store/bodyMetricsStore';
  import { ref } from 'vue';

  const weight = ref<number>();

  const closeModal = () => {
      return modalController.dismiss(null, 'close');
  };

  const saveWeight = () => {
    if (!weight.value) {
      return
    }
    const weightStore = useWeightStore();
    weightStore.addWeight({
      'id': weightStore.getNewId,
      'weight': weight.value,
      'createdAt': new Date(),
      'unit': 'kg'
    });
    closeModal();
    weight.value = undefined;
  };
</script>

<template>
  <ion-button
    id="add-weight-modal-button"
    color="primary"
    expand="block"
    fill="outline"
    shape="round"
    >
    {{ $t('addWeight') }}
  </ion-button>
  <ion-modal
    id="add-weight-modal"
    trigger="add-weight-modal-button"
    >
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
  </ion-modal>
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
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

  const weight = ref();

  const closeModal = () => {
      return modalController.dismiss(null, 'close');
  };

  const saveWeight = () => {
    const weightStore = useWeightStore();
    weightStore.addWeight(weight.value);
    closeModal();
    weight.value = null;
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
    Add Weight
  </ion-button>
  <ion-modal
    id="add-weight-modal"
    trigger="add-weight-modal-button"
    >
    <ion-card fill="outline" class="weight-card">
      <ion-card-header>
        <ion-card-title>
          Add Weight
        </ion-card-title>
      </ion-card-header>
      <ion-input
        class="ion-padding"
        fill="outline"
        shape="round"
        label="Weight"
        placeholder="Enter your weight"
        label-placement="stacked"
        v-model="weight"
      ></ion-input>
      <ion-button fill="clear" @click="saveWeight">
        Save
      </ion-button>
      <ion-button fill="clear" @click="closeModal">
        Cancel
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
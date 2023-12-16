<script setup lang="ts">
  import { IonModal,
           IonDatetime,
           IonDatetimeButton,
           IonCol,
           IonLabel,
           IonIcon,
           IonList,
           IonItem,
           IonButton,
           modalController } from '@ionic/vue';
  import { bookmarkOutline, scaleOutline } from 'ionicons/icons';
  import { useWeightStore } from '@/store/bodyMetricsStore';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import NumericInput from '../NumericInput.vue';
  import { ref, onMounted, watch } from 'vue';

  const weightStore = useWeightStore();
  const userSettingsStore = useUserSettingsStore();
  const locale = userSettingsStore.getLocale();
  const inputDate = ref<string>(new Date().toISOString());

  const weight = ref<number>();
  const weightValid = ref<boolean>(true);

  const closeModal = () => {
      return modalController.dismiss(null, 'close');
  };

  const saveWeight = async () => {
    if (!weight.value) {
      return
    }
    weightStore.addWeight({
      'id': weightStore.getNewId(),
      'weight': weight.value,
      'created_at': new Date(inputDate.value),
      'updated_at': new Date(inputDate.value),
      'unit': 'kg',
    });
    closeModal();
    weight.value = undefined;
  };

  onMounted(() => {
    weight.value = weightStore.currentWeight.weight;
  });
</script>

<template>
  <BaseFullPageModal
    :disable-button="!weightValid"
  >
    <template #saveButton>
      <ion-icon :icon="bookmarkOutline" @click="saveWeight()"/>
    </template>
    <template #modalHeader>
      <p class="header-title">{{ $t('addWeight') }}</p>
    </template>
    <template #modalContent>
      <ion-list>
        <ion-item lines="none">
          <ion-icon :src="scaleOutline" color="medium" style="margin-right: 10px;"></ion-icon>
          <NumericInput
            class="ion-padding"
            :label="$t('enterWeight')"
            :placeholder="$t('weight')"
            :minValue="0"
            :maxValue="500"
            :inputValue="weight === undefined ? 0 : weight"
            @update:inputValue="weight = $event"
            @update:valid="weightValid = $event"
          />
          <ion-button expand="block" slot="end" shape="round" color="primary">
            {{ $t('weightUnitBig') }} 
          </ion-button>
 
        </ion-item>
        <ion-item lines="none">
          <ion-col size="2">
            <ion-label>{{ $t('date') }}</ion-label>
          </ion-col>
          <ion-col size="10">
            <ion-datetime-button 
              datetime="datetime"
            />
            <ion-modal :keep-contents-mounted="true">
              <ion-datetime
                id="datetime"
                v-model="inputDate"
                :locale="locale"
              />
            </ion-modal>
          </ion-col>
        </ion-item>
      </ion-list>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
ion-list {
  margin-top: 1rem;
  --ion-item-background: transparent;
}
ion-item {
  --padding-start: 2rem;
  :is(ion-input) {
      --padding-start: 10px;
  }
  :is(ion-button) {
      margin: 0 0 0 16px;
      --padding-start: 10px;
      --padding-end: 10px;
  }
}
.header-title {
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
}
</style>